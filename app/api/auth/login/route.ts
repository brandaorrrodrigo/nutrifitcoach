import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

const USERS_FILE = join(process.cwd(), 'users.json');

function getUsers() {
  if (!existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    const users = getUsers();
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = users.find((u: any) => u.email === email && u.password === passwordHash);

    if (!user) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64');

    console.log('✅ Login realizado:', email);

    return NextResponse.json({ 
      success: true,
      token,
      user: { nome: user.nome, email: user.email }
    });

  } catch (error: any) {
    console.error('❌ Erro no login:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
