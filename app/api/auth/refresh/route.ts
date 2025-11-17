import { NextRequest, NextResponse } from 'next/server';
import { validateRefreshToken, rotateRefreshToken } from '@/lib/security/refresh-token';
import { prisma } from '@/lib/prisma';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error('🚨 NEXTAUTH_SECRET não está definido!');
}

/**
 * POST /api/auth/refresh
 * Renova access token usando refresh token
 *
 * Body: { refreshToken: string }
 * Returns: { accessToken: string, refreshToken: string } ou erro
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token não fornecido' },
        { status: 400 }
      );
    }

    // Valida refresh token
    const validation = await validateRefreshToken(refreshToken);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Token inválido' },
        { status: 401 }
      );
    }

    // Busca dados do usuário
    const user = await prisma.appUser.findUnique({
      where: { id: validation.userId },
      select: {
        id: true,
        email: true,
        name: true,
        display_name: true,
        avatar_url: true,
        is_premium: true,
        is_founder: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Rotaciona refresh token (cria novo e revoga antigo)
    const rotation = await rotateRefreshToken(refreshToken);

    if (rotation.error) {
      return NextResponse.json(
        { error: rotation.error },
        { status: 401 }
      );
    }

    // Gera novo access token (JWT de curta duração)
    const accessToken = sign(
      {
        id: user.id,
        email: user.email,
        isPremium: user.is_premium,
        isFounder: user.is_founder,
      },
      JWT_SECRET,
      {
        expiresIn: '15m', // 15 minutos
      }
    );

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken: rotation.newToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.display_name,
        isPremium: user.is_premium,
        isFounder: user.is_founder,
      },
    });
  } catch (error: any) {
    console.error('❌ Erro ao renovar token:', error);
    return NextResponse.json(
      { error: 'Erro ao renovar token' },
      { status: 500 }
    );
  }
}
