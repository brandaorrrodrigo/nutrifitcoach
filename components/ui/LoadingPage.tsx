import React from 'react';

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message = 'Carregando...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrifit-pink-50 via-nutrifit-green-50 to-nutrifit-purple-50 flex items-center justify-center p-6">
      <div className="text-center">
        {/* Spinner Premium */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Círculo externo girando */}
          <div className="absolute inset-0 border-4 border-nutrifit-pink-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-nutrifit-pink-500 rounded-full animate-spin"></div>

          {/* Círculo do meio */}
          <div className="absolute inset-2 border-4 border-nutrifit-green-200 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-nutrifit-green-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>

          {/* Círculo interno */}
          <div className="absolute inset-4 border-4 border-nutrifit-purple-200 rounded-full"></div>
          <div className="absolute inset-4 border-4 border-transparent border-t-nutrifit-purple-500 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>

          {/* Centro */}
          <div className="absolute inset-8 bg-gradient-to-br from-nutrifit-pink-500 via-nutrifit-green-500 to-nutrifit-purple-500 rounded-full animate-pulse"></div>
        </div>

        {/* Mensagem */}
        <h2 className="text-h3 font-bold bg-gradient-to-r from-nutrifit-pink-500 via-nutrifit-green-500 to-nutrifit-purple-600 bg-clip-text text-transparent mb-2">
          {message}
        </h2>

        {/* Pontos animados */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-3 h-3 bg-nutrifit-pink-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-nutrifit-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-nutrifit-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
