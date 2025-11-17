'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function UserButton() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!session) {
    return (
      <div className="flex gap-3">
        <Link
          href="/login"
          className="px-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-lg transition-colors"
        >
          Entrar
        </Link>
        <Link
          href="/registro"
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Criar Conta
        </Link>
      </div>
    );
  }

  const user = session.user as any;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.image ? (
          <div className="relative w-10 h-10">
            <Image
              src={user.image}
              alt={user.name || 'Usuário'}
              fill
              className="rounded-full object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="text-left hidden md:block">
          <p className="font-semibold text-gray-900">{user.name || 'Usuário'}</p>
          <p className="text-sm text-gray-500">
            {user.isPremium || user.isFounder ? '⭐ Premium' : 'Gratuito'}
          </p>
        </div>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
            <Link
              href="/perfil"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              Meu Perfil
            </Link>
            <Link
              href="/configuracoes"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              Configurações
            </Link>
            {!user.isPremium && !user.isFounder && (
              <Link
                href="/planos"
                className="block px-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                ⭐ Assinar Premium
              </Link>
            )}
            <hr className="my-2" />
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
}
