'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro no dashboard:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Algo deu errado
        </h2>
        <p className="text-gray-600 mb-6">
          Não conseguimos carregar seu dashboard. Por favor, tente novamente.
        </p>
        <button
          onClick={reset}
          className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          Tentar Novamente
        </button>
        <a
          href="/"
          className="block mt-4 text-teal-600 hover:underline text-sm"
        >
          Voltar para a home
        </a>
      </div>
    </div>
  );
}
