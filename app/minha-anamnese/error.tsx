'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Erro ao carregar anamnese
        </h2>
        <p className="text-gray-600 mb-6">
          Não conseguimos carregar sua anamnese. Tente novamente.
        </p>
        <button
          onClick={reset}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all font-semibold"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
