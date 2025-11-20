'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PagamentoSucessoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Verificar se tem o parâmetro success
    const success = searchParams.get('success');

    if (success === 'true') {
      // Countdown de 3 segundos
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirecionar para anamnese
            router.push('/anamnese-nutricional');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // Se não tem success=true, redireciona imediatamente
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Ícone de Sucesso */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
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

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Pagamento Confirmado! 🎉
          </h1>

          {/* Mensagem */}
          <p className="text-gray-600 mb-6">
            Obrigado por assinar o NutriFitCoach!
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium mb-2">
              ✅ Assinatura ativada com sucesso
            </p>
            <p className="text-green-700 text-sm">
              Você já tem acesso a todos os recursos premium!
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm mb-2">
              Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-2">📋 Próximos passos:</p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Complete sua anamnese nutricional</li>
              <li>Gere seu cardápio personalizado</li>
              <li>Comece sua jornada de saúde!</li>
            </ol>
          </div>

          {/* Botão manual (caso o redirect falhe) */}
          <button
            onClick={() => router.push('/anamnese-nutricional')}
            className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all"
          >
            Ir para Anamnese Agora →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PagamentoSucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <PagamentoSucessoContent />
    </Suspense>
  );
}
