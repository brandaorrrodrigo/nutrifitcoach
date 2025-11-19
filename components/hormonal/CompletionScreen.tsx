'use client';

import React from 'react';
import type { HormonalProfileClassification } from '@/lib/hormonal/types';

interface CompletionScreenProps {
  profile: HormonalProfileClassification;
  onContinue: () => void;
  isLoading?: boolean;
}

export function CompletionScreen({ profile, onContinue, isLoading = false }: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-peach-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
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
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Perfil Hormonal Completo!
        </h1>

        {/* Gratitude Message */}
        <div className="mb-8 text-center">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Obrigada por compartilhar essas informações.
          </p>
        </div>

        {/* Profile Summary */}
        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <span>📊</span>
            <span>Seu Perfil Hormonal:</span>
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-pink-600 font-semibold">•</span>
              <div>
                <span className="font-medium text-gray-700">Classificação: </span>
                <span className="text-pink-700 font-semibold">
                  {profile.perfil_hormonal.toUpperCase()}
                </span>
              </div>
            </div>
            {profile.subperfil && (
              <div className="flex items-start gap-3">
                <span className="text-pink-600 font-semibold">•</span>
                <div>
                  <span className="font-medium text-gray-700">Subperfil: </span>
                  <span className="text-purple-700 font-semibold">
                    {profile.subperfil.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className="text-pink-600 font-semibold">•</span>
              <div>
                <span className="font-medium text-gray-700">Objetivo: </span>
                <span className="text-gray-800 font-semibold">
                  {profile.objetivo.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Adjustments Preview */}
        {profile.ajustes_nutricionais.length > 0 && (
          <div className="mb-8 p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>✨</span>
              <span>Ajustes Nutricionais Personalizados:</span>
            </h3>
            <ul className="space-y-2">
              {profile.ajustes_nutricionais.slice(0, 3).map((ajuste, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-500">→</span>
                  <span>{ajuste}</span>
                </li>
              ))}
              {profile.ajustes_nutricionais.length > 3 && (
                <li className="text-sm text-purple-600 font-medium ml-4">
                  + {profile.ajustes_nutricionais.length - 3} outros ajustes personalizados
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Closing Message */}
        <div className="mb-8 p-6 bg-white rounded-2xl border-2 border-pink-200">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
            Agora o <span className="font-semibold text-pink-600">NutriFitCoach</span> vai montar
            um plano totalmente alinhado ao seu momento hormonal, à sua idade, ao seu ciclo, às
            suas sensações e ao que você deseja transformar.
          </p>
          <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed text-center font-medium">
            <span className="text-purple-600">Seu corpo fala.</span> A partir de agora,{' '}
            <span className="text-pink-600">nós vamos ouvir</span>.
          </p>
        </div>

        {/* Continue Button */}
        <div className="space-y-4">
          <button
            onClick={onContinue}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processando...
              </span>
            ) : (
              'Continuar para meu plano personalizado →'
            )}
          </button>
        </div>

        {/* Privacy Note */}
        <p className="mt-6 text-xs text-center text-gray-400">
          🔒 Todas as suas informações estão seguras e protegidas
        </p>
      </div>
    </div>
  );
}
