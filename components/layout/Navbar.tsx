'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
              NutriFitCoach
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Início
            </Link>
            <Link href="/planos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Planos
            </Link>
            <Link href="https://nutrifitcoach.com.br" target="_blank" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Blog
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Entrar
            </Link>
            <Link href="/registro" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
              Começar Grátis
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-purple-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Início
            </Link>
            <Link href="/planos" className="block text-gray-700 hover:text-purple-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Planos
            </Link>
            <Link href="https://nutrifitcoach.com.br" target="_blank" className="block text-gray-700 hover:text-purple-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Blog
            </Link>
            <Link href="/login" className="block text-gray-700 hover:text-purple-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Entrar
            </Link>
            <Link href="/registro" className="block bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold text-center" onClick={() => setIsOpen(false)}>
              Começar Grátis
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
