import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { nome, email, password } = await request.json();

    // ✅ Validação básica de campos
    if (!nome || !email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    // ✅ Validação de nome
    if (nome.trim().length < 2) {
      return NextResponse.json({ error: 'Nome deve ter pelo menos 2 caracteres' }, { status: 400 });
    }

    // ✅ Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // ✅ Validação de senha (mínimo 6 caracteres para UX, mas recomenda-se 8+)
    if (password.length < 6) {
      return NextResponse.json({
        error: 'A senha deve ter no mínimo 6 caracteres'
      }, { status: 400 });
    }

    // ⚠️ Recomendação de senha forte (não bloqueia, apenas avisa)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasLetter || !hasNumber) {
      console.warn('⚠️ Senha fraca detectada para:', email);
    }

    // ✅ Verificar se o usuário já existe
    const existingUser = await prisma.appUser.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return NextResponse.json({
        error: 'Este email já está cadastrado. Tente fazer login.'
      }, { status: 400 });
    }

    // ✅ Hash da senha com bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Criar usuário no banco com TODOS os campos obrigatórios
    const newUser = await prisma.appUser.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: nome.trim(),
        display_name: nome.trim(),
        // ✅ Valores padrão explícitos (mesmo com @default no schema)
        is_founder: false,
        is_premium: false,
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        display_name: true,
        is_premium: true,
        is_founder: true,
        created_at: true
      }
    });

    console.log('✅ Usuário criado com sucesso:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    });

    // ✅ Retornar resposta de sucesso (status 201 = Created)
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
    console.error('❌ Erro ao criar usuário:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });

    // ✅ Tratamento específico de erros do Prisma
    if (error.code === 'P2002') {
      // Unique constraint violation (email duplicado)
      return NextResponse.json({
        error: 'Este email já está cadastrado'
      }, { status: 400 });
    }

    if (error.code === 'P2003') {
      // Foreign key constraint violation
      return NextResponse.json({
        error: 'Erro de integridade no banco de dados'
      }, { status: 500 });
    }

    // ✅ Erro genérico com mais informações em dev
    const errorMessage = process.env.NODE_ENV === 'development'
      ? `Erro ao criar conta: ${error.message}`
      : 'Erro ao criar conta. Tente novamente.';

    return NextResponse.json({
      error: errorMessage
    }, { status: 500 });
  }
}
