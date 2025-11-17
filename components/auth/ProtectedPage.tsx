'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  requirePremium?: boolean;
}

export default function ProtectedPage({ children, requirePremium = false }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requirePremium) {
      const user = session.user as any;
      if (!user?.isPremium && !user?.isFounder) {
        router.push('/planos?error=premium_required');
      }
    }
  }, [session, status, router, requirePremium]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (requirePremium) {
    const user = session.user as any;
    if (!user?.isPremium && !user?.isFounder) {
      return null;
    }
  }

  return <>{children}</>;
}
