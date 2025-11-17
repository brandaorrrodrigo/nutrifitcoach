# Exemplos Práticos de Uso do Sistema de Autenticação

## 1. Exemplo: Página de Dashboard Protegida (Client Component)

```tsx
// app/dashboard/page.tsx
'use client';

import ProtectedPage from '@/components/auth/ProtectedPage';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <ProtectedPage>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          Bem-vindo, {user?.name}!
        </h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Seu Plano</h2>
            <p className="text-2xl">
              {user?.isPremium ? '⭐ Premium' : '🆓 Gratuito'}
            </p>
          </div>

          {/* Mais cards aqui */}
        </div>
      </div>
    </ProtectedPage>
  );
}
```

## 2. Exemplo: Página Premium (Server Component)

```tsx
// app/treinos-personalizados/page.tsx
import { requirePremium } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function TreinosPage() {
  try {
    const user = await requirePremium();
  } catch (error) {
    redirect('/planos?error=premium_required');
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Treinos Personalizados
      </h1>
      {/* Conteúdo premium aqui */}
    </div>
  );
}
```

## 3. Exemplo: Navbar com Botão de Usuário

```tsx
// components/Navbar.tsx
'use client';

import Link from 'next/link';
import UserButton from '@/components/auth/UserButton';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          NutriFitCoach
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/sobre" className="hover:text-purple-600">
            Sobre
          </Link>

          {session && (
            <>
              <Link href="/dashboard" className="hover:text-purple-600">
                Dashboard
              </Link>
              <Link href="/simulados" className="hover:text-purple-600">
                Simulados ENEM
              </Link>
            </>
          )}

          <UserButton />
        </div>
      </div>
    </nav>
  );
}
```

## 4. Exemplo: API Route Protegida

```tsx
// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.is_premium,
      createdAt: user.created_at
    }
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }

  const { name, display_name } = await request.json();

  // Atualizar usuário no banco
  const updatedUser = await prisma.appUser.update({
    where: { id: user.id },
    data: { name, display_name }
  });

  return NextResponse.json({ user: updatedUser });
}
```

## 5. Exemplo: Componente de Upgrade Premium

```tsx
// components/UpgradeButton.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UpgradeButton() {
  const { data: session } = useSession();
  const user = session?.user as any;

  if (user?.isPremium || user?.isFounder) {
    return null; // Não mostrar se já é premium
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-xl">
      <h3 className="text-2xl font-bold mb-2">
        Desbloqueie Todo o Potencial
      </h3>
      <p className="mb-4">
        Tenha acesso a simulados ilimitados, análises detalhadas e muito mais!
      </p>
      <Link
        href="/planos"
        className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
      >
        Assinar Premium
      </Link>
    </div>
  );
}
```

## 6. Exemplo: Hook Customizado para Verificar Permissões

```tsx
// hooks/useRequirePremium.ts
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequirePremium() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    const user = session.user as any;
    if (!user?.isPremium && !user?.isFounder) {
      router.push('/planos?error=premium_required');
    }
  }, [session, status, router]);

  const user = session?.user as any;
  const isPremium = user?.isPremium || user?.isFounder;

  return { session, isPremium, loading: status === 'loading' };
}

// USO:
// const { isPremium, loading } = useRequirePremium();
```

## 7. Exemplo: Página de Configurações com Update de Perfil

```tsx
// app/configuracoes/page.tsx
'use client';

import ProtectedPage from '@/components/auth/ProtectedPage';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function ConfiguracoesPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error('Erro ao atualizar');

      // Atualizar session
      await update({ name });
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      setMessage('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage>
      <div className="container mx-auto p-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </ProtectedPage>
  );
}
```

## 8. Exemplo: Condicional de Recursos Premium na UI

```tsx
// components/FeatureCard.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  title: string;
  description: string;
  isPremiumFeature?: boolean;
  children: React.ReactNode;
}

export default function FeatureCard({
  title,
  description,
  isPremiumFeature = false,
  children
}: Props) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const canAccess = !isPremiumFeature || user?.isPremium || user?.isFounder;

  if (!canAccess) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg relative">
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          ⭐ Premium
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        <div className="mt-4">
          <Link
            href="/planos"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Desbloquear
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {isPremiumFeature && (
        <div className="mb-2 text-purple-600 font-semibold text-sm">
          ⭐ Feature Premium Desbloqueada
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
}
```

## Próximos Passos

Agora você tem um sistema completo de autenticação! Aqui estão algumas melhorias que você pode implementar:

1. **Recuperação de Senha**: Criar fluxo de reset de senha por email
2. **Verificação de Email**: Confirmar email após cadastro
3. **OAuth Providers**: Adicionar login com Google/GitHub
4. **Two-Factor Auth**: Implementar 2FA para segurança extra
5. **Rate Limiting**: Proteger rotas contra abuso
6. **Audit Log**: Registrar ações importantes dos usuários
