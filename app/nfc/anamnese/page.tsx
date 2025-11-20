'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NFCAnamnesePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/nfc/anamnese');
      return;
    }

    // Obter session_id do Stripe da URL
    const stripeSessionId = searchParams?.get('session_id');
    if (stripeSessionId) {
      setSessionId(stripeSessionId);
      console.log('✅ Pagamento confirmado! Session ID:', stripeSessionId);
    }

    setLoading(false);
  }, [status, searchParams, router]);

  const handleStartAnamnese = () => {
    // Redirecionar para a anamnese nutricional
    router.push('/anamnese-nutricional');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">

        {/* Animação de confete (opcional - pode adicionar biblioteca) */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-6 animate-bounce">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            🎉 Pagamento Confirmado!
          </h1>

          <p className="text-xl text-slate-300 mb-2">
            Bem-vindo ao NutriFitCoach!
          </p>

          <p className="text-slate-400">
            Sua assinatura foi ativada com sucesso.
          </p>
        </div>

        {/* Card de informações */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Próximos Passos
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Complete sua Anamnese Nutricional
                </h3>
                <p className="text-slate-400 text-sm">
                  Responda algumas perguntas sobre seus objetivos, preferências alimentares e estilo de vida. Isso nos ajuda a criar um plano personalizado para você.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Receba seu Cardápio Personalizado
                </h3>
                <p className="text-slate-400 text-sm">
                  Com base nas suas respostas, nossa IA criará um plano alimentar sob medida para seus objetivos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Acompanhe sua Evolução
                </h3>
                <p className="text-slate-400 text-sm">
                  Registre suas fotos, peso e medidas para acompanhar seu progresso ao longo do tempo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações da assinatura */}
        {sessionId && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">✅</div>
              <h3 className="text-emerald-400 font-semibold">
                Detalhes da Assinatura
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-400">Período de teste:</span>{' '}
                <span className="text-white font-semibold">15 dias grátis</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Renovação:</span>{' '}
                <span className="text-white">Mensal automática</span>
              </p>
              <p className="text-slate-400 text-xs mt-3">
                ID da sessão: {sessionId}
              </p>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleStartAnamnese}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">📋</span>
            Começar Anamnese
          </button>

          <button
            onClick={handleGoToDashboard}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-slate-700 transition-all hover:border-slate-600 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🏠</span>
            Ir para Dashboard
          </button>
        </div>

        {/* Mensagem de suporte */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm mb-2">
            Precisa de ajuda? Entre em contato com nosso suporte
          </p>
          <a
            href="mailto:suporte@nutrifitcoach.com.br"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            suporte@nutrifitcoach.com.br
          </a>
        </div>
      </div>
    </div>
  );
}
