import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revokeAllUserRefreshTokens } from '@/lib/security/refresh-token';

export async function POST(request: Request) {
  try {
    // 🔒 REVOGA TODOS OS REFRESH TOKENS DO USUÁRIO
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      // Busca ID do usuário e revoga todos os refresh tokens
      const { prisma } = await import('@/lib/prisma');
      const user = await prisma.appUser.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (user) {
        await revokeAllUserRefreshTokens(user.id);
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('token');
    return response;
  } catch (error) {
    console.error('Erro no logout:', error);
    // Mesmo com erro, permite logout
    const response = NextResponse.json({ success: true });
    response.cookies.delete('token');
    return response;
  }
}
