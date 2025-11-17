'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
  { icon: '📸', label: 'Fotos', href: '/minhas-fotos' },
  { icon: '📈', label: 'Progresso', href: '/progresso' },
  { icon: '🏥', label: 'Anamnese', href: '/minha-anamnese' },
  { icon: '👤', label: 'Perfil', href: '/perfil' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Espaçador para evitar que o conteúdo fique atrás da nav */}
      <div className="h-20 md:hidden" />

      {/* Navegação fixa no bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
        <div className="flex justify-around items-center h-20 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center
                  flex-1 h-full
                  transition-all duration-200
                  ${
                    isActive
                      ? 'text-nutrifit-purple-600'
                      : 'text-gray-500 hover:text-nutrifit-purple-400'
                  }
                `}
              >
                <div
                  className={`
                    text-2xl mb-1 transition-transform
                    ${isActive ? 'scale-125' : 'scale-100'}
                  `}
                >
                  {item.icon}
                </div>
                <span
                  className={`
                    text-xs font-semibold
                    ${isActive ? 'opacity-100' : 'opacity-60'}
                  `}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nutrifit-pink-500 via-nutrifit-green-500 to-nutrifit-purple-600" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
