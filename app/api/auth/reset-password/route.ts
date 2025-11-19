import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/reset-password
 *
 * Confirma nova senha usando token de reset
 */
export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({
        error: 'Token e nova senha são obrigatórios'
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({
        error: 'A senha deve ter no mínimo 6 caracteres'
      }, { status: 400 });
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

    // Buscar token no banco
    const { data: resetToken, error: tokenError } = await supabase
      .from('PasswordResetToken')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .maybeSingle();

    if (tokenError || !resetToken) {
      return NextResponse.json({
        error: 'Token inválido ou expirado'
      }, { status: 400 });
    }

    // Verificar se token já foi usado
    if (resetToken.used) {
      return NextResponse.json({
        error: 'Este token já foi utilizado'
      }, { status: 400 });
    }

    // Verificar se token expirou
    const now = new Date();
    const expiresAt = new Date(resetToken.expires_at);

    if (now > expiresAt) {
      return NextResponse.json({
        error: 'Token expirado. Solicite um novo link de recuperação.'
      }, { status: 400 });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar senha do usuário
    const { error: updateError } = await supabase
      .from('AppUser')
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', resetToken.user_id);

    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', updateError);
      return NextResponse.json({
        error: 'Erro ao atualizar senha. Tente novamente.'
      }, { status: 500 });
    }

    // Marcar token como usado
    await supabase
      .from('PasswordResetToken')
      .update({ used: true })
      .eq('id', resetToken.id);

    console.log('✅ Senha redefinida com sucesso para user_id:', resetToken.user_id);

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso! Você já pode fazer login.'
    });

  } catch (error: any) {
    console.error('❌ Erro ao redefinir senha:', error);
    return NextResponse.json({
      error: 'Erro ao processar solicitação. Tente novamente.'
    }, { status: 500 });
  }
}
