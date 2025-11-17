# Sistema de Autenticação - NextAuth + Prisma

Sistema completo de autenticação implementado com NextAuth.js e Prisma.

## Arquivos Criados/Modificados

### 1. Schema Prisma (`prisma/schema.prisma`)
**Adicionado:**
- Campos de autenticação no modelo `AppUser` (password, name, is_premium)
- Modelo `Account` - Para OAuth providers (futuro)
- Modelo `Session` - Para sessões do NextAuth
- Modelo `VerificationToken` - Para tokens de verificação

### 2. Configuração NextAuth
**Arquivo:** `app/api/auth/[...nextauth]/route.ts`
- Provider de credenciais (email/senha)
- Callbacks personalizados para JWT e session
- Integração com Prisma
- Página de login customizada

### 3. Helpers de Autenticação
**Arquivo:** `lib/auth.ts`
- `getCurrentUser()` - Obtém usuário da sessão
- `requireAuth()` - Requer autenticação (throw error se não autenticado)
- `requirePremium()` - Requer plano premium

### 4. Middleware
**Arquivo:** `middleware.ts`
- Proteção de rotas automática
- Verificação de plano premium
- Redirecionamento para login se não autenticado

### 5. Páginas de Autenticação

#### Login (`app/login/page.tsx`)
- Formulário de login com NextAuth
- Redirecionamento após login
- Mensagens de erro

#### Registro (`app/registro/page.tsx`)
- Criação de conta com hash bcrypt
- Login automático após registro
- Validação de campos

#### API de Registro (`app/api/auth/register/route.ts`)
- Criação de usuário no banco
- Hash de senha com bcrypt
- Validações

### 6. Componentes de Autenticação

#### `components/auth/SessionProvider.tsx`
- Wrapper do NextAuth SessionProvider
- Usado no layout raiz

#### `components/auth/ProtectedPage.tsx`
- Componente para proteger páginas client-side
- Suporte a verificação de plano premium
- Loading state

#### `components/auth/UserButton.tsx`
- Botão de usuário com menu dropdown
- Exibe nome, email, avatar
- Badge de plano Premium
- Opção de logout

### 7. Layout Raiz
**Arquivo:** `app/layout.tsx`
- SessionProvider envolvendo toda aplicação

## Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-super-segura-aqui"
```

## Como Usar

### 1. Migrar o Banco de Dados

```bash
cd nutrifitcoach-ai
npx prisma migrate dev --name add-auth-models
npx prisma generate
```

### 2. Proteger uma Página (Client Component)

```tsx
'use client';
import ProtectedPage from '@/components/auth/ProtectedPage';

export default function MinhaPage() {
  return (
    <ProtectedPage>
      <div>Conteúdo protegido aqui</div>
    </ProtectedPage>
  );
}
```

### 3. Proteger com Verificação Premium

```tsx
'use client';
import ProtectedPage from '@/components/auth/ProtectedPage';

export default function PaginaPremium() {
  return (
    <ProtectedPage requirePremium={true}>
      <div>Conteúdo Premium</div>
    </ProtectedPage>
  );
}
```

### 4. Usar Dados do Usuário (Client)

```tsx
'use client';
import { useSession } from 'next-auth/react';

export default function MeuComponente() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Carregando...</div>;
  if (!session) return <div>Não autenticado</div>;

  const user = session.user as any;

  return (
    <div>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Premium: {user.isPremium ? 'Sim' : 'Não'}</p>
    </div>
  );
}
```

### 5. Usar Dados do Usuário (Server Component)

```tsx
import { getCurrentUser } from '@/lib/auth';

export default async function MinhaPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <h1>Olá, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### 6. Adicionar Botão de Login/Logout

```tsx
import UserButton from '@/components/auth/UserButton';

export default function Navbar() {
  return (
    <nav>
      {/* Seu conteúdo */}
      <UserButton />
    </nav>
  );
}
```

### 7. Fazer Logout

```tsx
'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })}>
      Sair
    </button>
  );
}
```

## Rotas Protegidas Automaticamente

O middleware protege automaticamente estas rotas:
- `/dashboard/*`
- `/anamnese/*`
- `/enem/simulados/*`
- `/perfil/*`
- `/configuracoes/*`

Para adicionar mais rotas, edite `middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/anamnese/:path*',
    '/enem/simulados/:path*',
    '/perfil/:path*',
    '/configuracoes/:path*',
    '/sua-rota/:path*', // Adicione aqui
  ]
};
```

## Planos Premium

### Marcar Usuário como Premium

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.appUser.update({
  where: { email: 'usuario@email.com' },
  data: { is_premium: true }
});
```

### Verificar se é Premium (Server)

```typescript
import { requirePremium } from '@/lib/auth';

export default async function PaginaPremium() {
  try {
    const user = await requirePremium();
    // Usuário é premium, continuar
  } catch (error) {
    // Redirecionar para página de planos
    redirect('/planos');
  }
}
```

## Integração com Stripe (Futuro)

O sistema já está preparado para integração com Stripe:
1. O campo `is_premium` indica se o usuário tem plano ativo
2. O middleware verifica automaticamente o status premium
3. Adicione webhooks do Stripe para atualizar `is_premium` quando houver:
   - Nova assinatura
   - Cancelamento
   - Falha de pagamento

## Segurança

- Senhas são hash com bcrypt (10 rounds)
- Sessions são JWT (não em banco)
- Tokens expiram em 30 dias
- Middleware protege rotas sensíveis
- NEXTAUTH_SECRET deve ser aleatório e seguro

## Próximos Passos

1. Configurar envio de email (recuperação de senha)
2. Adicionar OAuth (Google, GitHub, etc)
3. Implementar 2FA
4. Integrar pagamentos com Stripe
5. Sistema de recuperação de senha
6. Email de verificação

## Troubleshooting

### Erro: "Invalid session"
- Verifique se NEXTAUTH_SECRET está definido
- Limpe cookies do navegador
- Reinicie o servidor

### Erro: "Database connection failed"
- Verifique DATABASE_URL no .env
- Execute `npx prisma generate`
- Execute a migration

### Usuário não redireciona após login
- Verifique se SessionProvider está no layout raiz
- Verifique console do navegador por erros
- Confirme que middleware está configurado

## Suporte

Para problemas ou dúvidas sobre autenticação:
- NextAuth Docs: https://next-auth.js.org
- Prisma Docs: https://www.prisma.io/docs
