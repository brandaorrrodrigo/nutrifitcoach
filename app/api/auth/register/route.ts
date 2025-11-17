import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePasswordStrength, getPasswordErrorMessage } from '@/lib/security/password';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { nome, email, password } = await request.json();

    if (!nome || !email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    // 🔒 VALIDAÇÃO DE SENHA FORTE
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({
        error: getPasswordErrorMessage(passwordValidation)
      }, { status: 400 });
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.appUser.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const newUser = await prisma.appUser.create({
      data: {
        email,
        password: hashedPassword,
        name: nome,
        display_name: nome
      }
    });

    console.log('✅ Usuário criado:', email);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        nome: newUser.name,
        email: newUser.email
      }
    });

  } catch (error: any) {
    console.error('❌ Erro no registro:', error);
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }
}
