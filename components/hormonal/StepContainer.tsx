'use client';

import React from 'react';

interface StepContainerProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  isValid: boolean;
  isLoading?: boolean;
}

export function StepContainer({
  stepNumber,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onBack,
  isValid,
  isLoading = false,
}: StepContainerProps) {
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-peach-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Etapa {stepNumber} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-pink-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{title}</h2>
            {description && <p className="text-gray-600 text-base md:text-lg">{description}</p>}
          </div>

          {/* Form Content */}
          <div className="mb-10">{children}</div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {onBack && (
              <button
                onClick={onBack}
                disabled={isLoading}
                className="flex-1 py-3 px-6 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Voltar
              </button>
            )}
            <button
              onClick={onNext}
              disabled={!isValid || isLoading}
              className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-pink-500 disabled:hover:to-purple-500 shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
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
                  Salvando...
                </span>
              ) : (
                'Continuar →'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
