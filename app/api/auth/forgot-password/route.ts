import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password
 *
 * Gera token de reset de senha e envia por email
 * Por enquanto, retorna o link (você pode integrar com serviço de email depois)
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Criar cliente Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
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

    // Verificar se usuário existe
    const { data: user } = await supabase
      .from('AppUser')
      .select('id, email, name')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    // Por segurança, sempre retornamos sucesso mesmo se o email não existir
    // Isso evita que hackers descubram quais emails estão cadastrados
    if (!user) {
      console.log('⚠️ Tentativa de reset para email não cadastrado:', email);
      return NextResponse.json({
        success: true,
        message: 'Se este email estiver cadastrado, você receberá um link de recuperação.'
      });
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    const tokenId = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Salvar token no banco
    const { error: tokenError } = await supabase
      .from('PasswordResetToken')
      .insert({
        id: tokenId,
        user_id: user.id,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false,
        created_at: new Date().toISOString()
      });

    if (tokenError) {
      console.error('❌ Erro ao criar token:', tokenError);
      return NextResponse.json({
        error: 'Erro ao processar solicitação. Tente novamente.'
      }, { status: 500 });
    }

    // Construir link de reset
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    console.log('✅ Token de reset criado para:', email);
    console.log('🔗 Link de reset:', resetLink);

    // TODO: Integrar com serviço de email (SendGrid, Resend, etc.)
    // Por enquanto, vamos retornar o link direto (APENAS PARA DESENVOLVIMENTO!)

    const isDevelopment = process.env.NODE_ENV === 'development';

    return NextResponse.json({
      success: true,
      message: 'Se este email estiver cadastrado, você receberá um link de recuperação.',
      // ⚠️ REMOVER EM PRODUÇÃO! Apenas para desenvolvimento/teste
      ...(isDevelopment && { resetLink, token })
    });

  } catch (error: any) {
    console.error('❌ Erro ao processar reset de senha:', error);
    return NextResponse.json({
      error: 'Erro ao processar solicitação. Tente novamente.'
    }, { status: 500 });
  }
}
