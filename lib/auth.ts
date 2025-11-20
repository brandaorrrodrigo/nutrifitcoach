import { getServerSession } from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

/**
 * Configuração principal do NextAuth para o NutriFitCoach.
 * - Autenticação via Credentials (e-mail + senha)
 * - Sessão via JWT
 * - Sem PrismaAdapter (incompatível com Credentials)
 */
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'E-mail',
          type: 'email',
          placeholder: 'seuemail@exemplo.com',
        },
        password: {
          label: 'Senha',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('E-mail e senha são obrigatórios');
        }

        // Criar cliente Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Configuração do servidor incorreta');
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });

        // Buscar usuário no Supabase
        const { data: user } = await supabase
          .from('AppUser')
          .select('*')
          .eq('email', credentials.email.toLowerCase().trim())
          .single();

        if (!user || !user.password) {
          throw new Error('Credenciais inválidas');
        }

        // Verificar senha
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Credenciais inválidas');
        }

        // Dados que vão para o token JWT
        return {
          id: user.id,
          name: user.name ?? user.display_name ?? user.email,
          email: user.email,
          is_admin: user.is_admin || false,
          is_premium: user.is_premium || false,
          is_founder: user.is_founder || false,
        } as any;
      },
    }),
  ],

  /**
   * Sessão baseada em JWT funciona melhor com CredentialsProvider.
   */
  session: {
    strategy: 'jwt',
  },

  /**
   * Página de login personalizada.
   */
  pages: {
    signIn: '/login',
  },

  /**
   * Callbacks para sincronizar JWT <-> Session e carregar dados extras do usuário.
   */
  callbacks: {
    async jwt({ token, user }) {
      // Quando o usuário faz login, "user" vem preenchido
      if (user) {
        token.id = (user as any).id;
        token.is_admin = (user as any).is_admin;
        token.is_premium = (user as any).is_premium;
        token.is_founder = (user as any).is_founder;
      } else {
        // Em requisições subsequentes, garantimos que o token está atualizado com o banco
        if (token.email) {
          const supabaseUrl = process.env.SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey, {
              auth: { autoRefreshToken: false, persistSession: false }
            });

            const { data: dbUser } = await supabase
              .from('AppUser')
              .select('*')
              .eq('email', token.email as string)
              .single();

            if (dbUser) {
              token.id = dbUser.id;
              token.is_admin = dbUser.is_admin || false;
              token.is_premium = dbUser.is_premium || false;
              token.is_founder = dbUser.is_founder || false;
            }
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).is_admin = token.is_admin;
        (session.user as any).is_premium = token.is_premium;
        (session.user as any).is_founder = token.is_founder;
      }

      return session;
    },
  },

  /**
   * Segredo usado para assinar tokens JWT.
   * CERTIFIQUE-SE de definir NEXTAUTH_SECRET na Vercel.
   */
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Atalho simples para pegar a sessão no server.
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Retorna o usuário completo do banco com base na sessão atual.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: user } = await supabase
    .from('AppUser')
    .select('*')
    .eq('email', session.user.email)
    .single();

  return user;
}

/**
 * Garante que o usuário está autenticado.
 * - Retorna o usuário do banco
 * - Lança erro se não estiver logado
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Não autenticado');
  }

  return user;
}

/**
 * Garante que o usuário é administrador.
 */
export async function requireAdmin() {
  const user = await requireAuth();

  if (!user.is_admin) {
    throw new Error('Não autorizado');
  }

  return user;
}

/**
 * Garante que o usuário é Premium ou Founder.
 */
export async function requirePremium() {
  const user = await requireAuth();

  if (!user.is_premium && !user.is_founder) {
    throw new Error('Esta funcionalidade requer assinatura Premium');
  }

  return user;
}
