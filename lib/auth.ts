import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.appUser.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      display_name: true,
      avatar_url: true,
      is_premium: true,
      is_founder: true,
      created_at: true
    }
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Não autorizado');
  }

  return user;
}

export async function requirePremium() {
  const user = await requireAuth();

  if (!user.is_premium && !user.is_founder) {
    throw new Error('Esta funcionalidade requer assinatura Premium');
  }

  return user;
}
