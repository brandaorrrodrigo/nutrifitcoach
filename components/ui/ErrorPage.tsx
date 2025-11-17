import React from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  title?: string;
  message?: string;
  icon?: string;
  actionLabel?: string;
  actionHref?: string;
  onRetry?: () => void;
}

export default function ErrorPage({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  icon = '⚠️',
  actionLabel = 'Voltar para o Dashboard',
  actionHref = '/dashboard',
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl w-full border-2 border-red-100">
        {/* Ícone de erro com animação */}
        <div className="text-8xl mb-6 animate-bounceIn">{icon}</div>

        {/* Título */}
        <h1 className="text-h2 font-bold text-gray-900 mb-4">{title}</h1>

        {/* Mensagem */}
        <p className="text-body-lg text-gray-600 mb-8 max-w-lg mx-auto">{message}</p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-8 py-4 bg-gradient-to-r from-nutrifit-pink-500 to-nutrifit-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              🔄 Tentar Novamente
            </button>
          )}

          <Link
            href={actionHref}
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-nutrifit-purple-500 hover:text-nutrifit-purple-600 transition-all"
          >
            {actionLabel}
          </Link>
        </div>

        {/* Informação adicional */}
        <p className="text-body-sm text-gray-500 mt-8">
          Se o problema persistir, entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
}
