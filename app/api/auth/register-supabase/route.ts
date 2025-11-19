import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/auth/register-supabase
 *
 * Cria novo usuário usando Supabase Client (alternativa ao Prisma)
 */
export async function POST(request: Request) {
  try {
    const { nome, email, password } = await request.json();

    // ✅ Validação básica
    if (!nome || !email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    if (nome.trim().length < 2) {
      return NextResponse.json({ error: 'Nome deve ter pelo menos 2 caracteres' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({
        error: 'A senha deve ter no mínimo 6 caracteres'
      }, { status: 400 });
    }

    // ✅ Criar cliente Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase credentials missing');
      return NextResponse.json({
        error: 'Configuração do servidor incorreta'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // ✅ Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('AppUser')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingUser) {
      return NextResponse.json({
        error: 'Este email já está cadastrado. Tente fazer login.'
      }, { status: 400 });
    }

    // ✅ Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Gerar UUID para o id
    const userId = uuidv4();

    // ✅ Criar usuário
    const { data: newUser, error: createError } = await supabase
      .from('AppUser')
      .insert({
        id: userId,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: nome.trim(),
        display_name: nome.trim(),
        is_founder: false,
        is_premium: false,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, name, display_name, is_premium, is_founder, created_at')
      .single();

    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError);
      return NextResponse.json({
        error: 'Erro ao criar conta. Tente novamente.'
      }, { status: 500 });
    }

    console.log('✅ Usuário criado com sucesso:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    });

    // ✅ Retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso!',
      user: {
        id: newUser.id,
        nome: newUser.name,
        email: newUser.email,
        isPremium: newUser.is_premium,
        isFounder: newUser.is_founder
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Erro ao criar usuário:', error);

    return NextResponse.json({
      error: 'Erro ao criar conta. Tente novamente.'
    }, { status: 500 });
  }
}
