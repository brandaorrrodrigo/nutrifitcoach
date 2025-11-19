'use client';

import React from 'react';

interface IntroductionScreenProps {
  onStart: () => void;
}

export function IntroductionScreen({ onStart }: IntroductionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-peach-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
        {/* Ícone decorativo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          NFC Hormonal Engine
        </h1>

        {/* Mensagem acolhedora */}
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg md:text-xl text-center">
            Antes de montar o seu plano personalizado, queremos entender melhor o seu corpo.
          </p>

          <p className="text-base md:text-lg">
            O metabolismo feminino é único — e as oscilações hormonais, o ciclo menstrual, o uso
            de anticoncepcionais, a menopausa e até pequenas sensações do dia a dia{' '}
            <span className="font-semibold text-pink-600">
              influenciam diretamente seus resultados
            </span>
            .
          </p>

          <p className="text-base md:text-lg">
            O <span className="font-semibold">NutriFitCoach</span> respeita tudo isso.
          </p>

          <p className="text-base md:text-lg">
            Vamos te conhecer um pouco mais para ajustar sua alimentação à sua biologia —{' '}
            <span className="font-semibold text-purple-600">
              com cuidado, ciência e foco no que você sente
            </span>
            .
          </p>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 p-6 bg-pink-50/50 rounded-2xl border border-pink-100">
          <h2 className="font-semibold text-lg mb-3 text-pink-900">O que vamos entender:</h2>
          <ul className="space-y-2 text-sm md:text-base text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">✨</span>
              <span>Seu ciclo menstrual e fase hormonal</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✨</span>
              <span>Uso de anticoncepcionais ou reposição hormonal</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✨</span>
              <span>Condições como SOP, endometriose, hipotireoidismo</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✨</span>
              <span>Sintomas que você sente no dia a dia</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✨</span>
              <span>Seus objetivos e o que deseja transformar</span>
            </li>
          </ul>
        </div>

        {/* Tempo estimado */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>⏱️ Tempo estimado: 3-5 minutos</p>
        </div>

        {/* Botão de início */}
        <div className="mt-10">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Vamos começar ✨
          </button>
        </div>

        {/* Nota de privacidade */}
        <p className="mt-6 text-xs text-center text-gray-400">
          🔒 Suas informações são confidenciais e protegidas
        </p>
      </div>
    </div>
  );
}
