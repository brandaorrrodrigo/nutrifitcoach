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
      // ✅ Validação básica no frontend
      if (!nome.trim() || nome.trim().length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }

      if (!email.trim() || !email.includes('@')) {
        throw new Error('Email inválido');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres');
      }

      // 1️⃣ Criar conta na API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      console.log('✅ Conta criada:', data);

      // 2️⃣ Fazer login automaticamente após registro bem-sucedido
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false
      });

      if (result?.error) {
        console.error('Erro ao fazer login automático:', result.error);
        // ⚠️ Conta foi criada, mas login falhou - redirecionar para login manual
        setError('Conta criada com sucesso! Redirecionando para login...');
        setTimeout(() => {
          router.push('/login?success=registered');
        }, 2000);
        return;
      }

      if (result?.ok) {
        console.log('✅ Login automático bem-sucedido');
        // 3️⃣ Redirecionar para dashboard
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
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
              <label htmlFor="nome" className="block font-semibold mb-2">
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                ⚠️ Recomendado: use letras, números e caracteres especiais
              </p>
            </div>

            {error && (
              <div className={`border-2 px-4 py-3 rounded-xl ${
                error.includes('sucesso')
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
