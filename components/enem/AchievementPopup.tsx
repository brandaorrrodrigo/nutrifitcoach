'use client';

import React, { useEffect, useState } from 'react';

interface AchievementPopupProps {
  achievement: {
    title: string;
    description: string;
    code?: string;
  } | null;
  onClose: () => void;
  fpBonus?: number;
}

export default function AchievementPopup({ achievement, onClose, fpBonus }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-fechar após 5 segundos
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible || !achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl overflow-hidden
          max-w-md w-full transform transition-all duration-300
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
        `}
      >
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 text-white relative overflow-hidden">
          {/* Efeitos de fundo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          {/* Conteúdo do header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-6xl" role="img" aria-label="trophy">
                🏆
              </span>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-1">
              Conquista Desbloqueada!
            </h2>
            <p className="text-white/90 text-sm">
              Você alcançou um novo marco
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {achievement.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {achievement.description}
          </p>

          {/* FP Bonus */}
          {fpBonus && fpBonus > 0 && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl" role="img" aria-label="star">
                  ⭐
                </span>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    +{fpBonus} FP
                  </div>
                  <div className="text-xs text-gray-600">
                    Bônus por conquista
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de fechar */}
          <button
            onClick={handleClose}
            className="
              mt-4 w-full py-3 px-4
              bg-gradient-to-r from-purple-500 to-pink-500
              text-white font-semibold rounded-lg
              hover:from-purple-600 hover:to-pink-600
              transition-all duration-200
              shadow-md hover:shadow-lg
            "
          >
            Continuar
          </button>
        </div>

        {/* Animação de confete (opcional) */}
        <div className="absolute inset-0 pointer-events-none">
          <Confetti />
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de confete animado
 */
function Confetti() {
  const confettiPieces = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {confettiPieces.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: getRandomColor(),
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
