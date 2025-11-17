import { getServerSession } from 'next-auth/next';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const user = await prisma.appUser.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.display_name,
          image: user.avatar_url,
          isPremium: user.is_premium,
          isFounder: user.is_founder
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isPremium = (user as any).isPremium;
        token.isFounder = (user as any).isFounder;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isPremium = token.isPremium;
        (session.user as any).isFounder = token.isFounder;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Validação: avisar se NEXTAUTH_SECRET não estiver definido (apenas em runtime, não em build)
if (!process.env.NEXTAUTH_SECRET && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️ NEXTAUTH_SECRET não está definido! Configure a variável de ambiente no arquivo .env.local'
  );
}

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
