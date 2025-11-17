/**
 * Refresh Token Management - Gerenciamento de tokens de renovação JWT
 *
 * Implementa:
 * - Access tokens de curta duração (15 min)
 * - Refresh tokens de longa duração (7 dias)
 * - Revogação de tokens
 */

import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// Configurações de tempo
const ACCESS_TOKEN_EXPIRES_IN = 15 * 60; // 15 minutos em segundos
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 dias em segundos

/**
 * Gera um refresh token único
 */
export function generateRefreshToken(): string {
  return randomBytes(64).toString('hex');
}

/**
 * Cria um refresh token no database
 */
export async function createRefreshToken(userId: string): Promise<string> {
  const token = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000);

  await prisma.userRefreshToken.create({
    data: {
      user_id: userId,
      token,
      expires_at: expiresAt,
    },
  });

  return token;
}

/**
 * Valida um refresh token
 */
export async function validateRefreshToken(
  token: string
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const refreshToken = await prisma.userRefreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken) {
      return { valid: false, error: 'Token inválido' };
    }

    if (refreshToken.revoked) {
      return { valid: false, error: 'Token revogado' };
    }

    if (new Date() > refreshToken.expires_at) {
      // Token expirado - revoga automaticamente
      await revokeRefreshToken(token);
      return { valid: false, error: 'Token expirado' };
    }

    return { valid: true, userId: refreshToken.user_id };
  } catch (error) {
    console.error('Erro ao validar refresh token:', error);
    return { valid: false, error: 'Erro ao validar token' };
  }
}

/**
 * Revoga um refresh token
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.userRefreshToken.update({
    where: { token },
    data: {
      revoked: true,
      revoked_at: new Date(),
    },
  });
}

/**
 * Revoga todos os refresh tokens de um usuário
 * Útil em logout, troca de senha, etc
 */
export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await prisma.userRefreshToken.updateMany({
    where: {
      user_id: userId,
      revoked: false,
    },
    data: {
      revoked: true,
      revoked_at: new Date(),
    },
  });
}

/**
 * Remove tokens expirados do database (limpeza)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.userRefreshToken.deleteMany({
    where: {
      expires_at: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}

/**
 * Rotaciona refresh token (cria novo e revoga antigo)
 */
export async function rotateRefreshToken(
  oldToken: string
): Promise<{ newToken?: string; error?: string }> {
  const validation = await validateRefreshToken(oldToken);

  if (!validation.valid) {
    return { error: validation.error };
  }

  // Revoga token antigo
  await revokeRefreshToken(oldToken);

  // Cria novo token
  const newToken = await createRefreshToken(validation.userId!);

  return { newToken };
}

/**
 * Retorna configurações de tempo
 */
export function getTokenExpirationConfig() {
  return {
    accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
  };
}
