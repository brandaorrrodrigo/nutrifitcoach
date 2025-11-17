'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function RegistroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Criar conta
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // 2. Fazer login automaticamente
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        throw new Error('Conta criada, mas erro ao fazer login automático');
      }

      if (result?.ok) {
        // Redirecionar para dashboard
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Criar Conta
          </h1>
          <p className="text-gray-600 text-lg">Comece sua transformação!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem conta?{' '}
              <Link href="/login" className="text-purple-600 font-bold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Acesso aos cardápios personalizados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Período de teste grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
