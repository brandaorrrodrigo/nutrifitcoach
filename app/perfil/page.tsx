'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [planos, setPlanos] = useState<any[]>([]);

  useEffect(() => {
    const token = document.cookie.split('token=')[1]?.split(';')[0];
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const userDataStr = Buffer.from(token, 'base64').toString('utf-8');
      const data = JSON.parse(userDataStr);
      setUserData(data);
    } catch (error) {
      router.push('/login');
    }

    // Buscar planos salvos
    const planosSalvos = localStorage.getItem('historico_planos');
    if (planosSalvos) {
      setPlanos(JSON.parse(planosSalvos));
    }

    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.clear();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            NUTRIFITCOACH
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          Meu Perfil
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* INFORMAÇÕES PESSOAIS */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Informações Pessoais</h2>
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700">Email</label>
                <p className="text-xl text-gray-900">{userData?.email}</p>
              </div>
              <div className="pt-4 border-t">
                <Link href="/anamnese" className="block w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-center rounded-xl font-bold">
                  Atualizar Dados
                </Link>
              </div>
            </div>
          </div>

          {/* ASSINATURA */}
          <div className="bg-gradient-to-br from-purple-600 to-cyan-600 rounded-3xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Minha Assinatura</h2>
            <div className="space-y-4">
              <div>
                <p className="text-lg opacity-90">Plano Ativo</p>
                <p className="text-2xl font-bold">Premium Mensal</p>
              </div>
              <div>
                <p className="text-lg opacity-90">Status</p>
                <p className="text-2xl font-bold">✅ Ativa</p>
              </div>
              <div className="pt-4 border-t border-white/20">
                <a 
                  href="https://billing.stripe.com/p/login/test_..."
                  target="_blank"
                  className="block w-full py-3 bg-white text-purple-600 text-center rounded-xl font-bold"
                >
                  Gerenciar Assinatura
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* HISTÓRICO DE PLANOS */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Histórico de Planos</h2>
          {planos.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {planos.map((plano, idx) => (
                <div key={idx} className="p-6 bg-gradient-to-br from-cyan-50 to-purple-50 rounded-2xl border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plano.objetivo}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {plano.calorias} kcal • {plano.proteina}g prot
                  </p>
                  <p className="text-sm text-gray-600">
                    Criado em {new Date(plano.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">Nenhum plano no histórico</p>
              <Link href="/anamnese" className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold">
                Criar Primeiro Plano
              </Link>
            </div>
          )}
        </div>

        {/* INDICAÇÕES */}
        <div className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">🎁 Ganhe Dias Grátis!</h2>
          <p className="text-xl mb-6">Indique amigos e ganhe 7 dias grátis para cada indicação que assinar</p>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mb-4">
            <p className="text-sm mb-2">Seu link de indicação:</p>
            <p className="text-lg font-bold break-all">
              https://nutrifitcoach.com.br?ref={userData?.id}
            </p>
          </div>
          <button className="w-full py-3 bg-white text-orange-500 rounded-xl font-bold">
            Copiar Link
          </button>
        </div>
      </div>
    </div>
  );
}
