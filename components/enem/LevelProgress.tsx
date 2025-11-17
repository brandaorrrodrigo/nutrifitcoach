'use client';

import React from 'react';
import { getLevelInfo, getFPToNextLevel, getLevelNamePtBR } from '@/lib/enem/levels';
import LevelBadge from './LevelBadge';

interface LevelProgressProps {
  totalFP: number;
  variant?: 'compact' | 'detailed';
}

export default function LevelProgress({ totalFP, variant = 'compact' }: LevelProgressProps) {
  const levelInfo = getLevelInfo(totalFP);
  const fpToNext = getFPToNextLevel(totalFP);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <LevelBadge level={levelInfo.level} size="sm" />
        {levelInfo.nextLevel && (
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>{totalFP} FP</span>
              <span>{levelInfo.nextLevelFP} FP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-${levelInfo.color} to-${levelInfo.color}`}
                style={{ width: `${levelInfo.progressToNext}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Faltam {fpToNext} FP para {getLevelNamePtBR(levelInfo.nextLevel)}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Detailed variant
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Nível Atual</h3>
          <LevelBadge level={levelInfo.level} size="lg" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{totalFP}</p>
          <p className="text-xs text-gray-500">Focus Points</p>
        </div>
      </div>

      {levelInfo.nextLevel ? (
        <div className="space-y-3">
          {/* Barra de progresso */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className={levelInfo.textColor + ' font-semibold'}>
                {levelInfo.level}
              </span>
              <span className="text-gray-700 font-semibold">
                {getLevelNamePtBR(levelInfo.nextLevel)}
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${levelInfo.bgColor} border ${levelInfo.borderColor}`}
                style={{ width: `${levelInfo.progressToNext}%` }}
              >
                <div className={`h-full rounded-full bg-gradient-to-r from-${levelInfo.color} to-${levelInfo.color} opacity-50`} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {levelInfo.progressToNext.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <p className="text-xs text-gray-500">Próximo nível</p>
              <p className="text-sm font-semibold text-gray-900">
                {getLevelNamePtBR(levelInfo.nextLevel)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">FP necessários</p>
              <p className="text-sm font-semibold text-gray-900">
                {fpToNext}
              </p>
            </div>
          </div>

          {/* Mensagem motivacional */}
          <div className={`${levelInfo.bgColor} ${levelInfo.borderColor} border rounded-lg p-3`}>
            <p className={`text-sm ${levelInfo.textColor} text-center`}>
              {getMotivationalMessage(levelInfo.progressToNext, levelInfo.nextLevel)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-lg font-bold text-violet-600 mb-2">
            🎉 Nível Máximo Atingido! 🎉
          </p>
          <p className="text-sm text-gray-600">
            Você alcançou o nível Diamante!
          </p>
        </div>
      )}
    </div>
  );
}

function getMotivationalMessage(progress: number, nextLevel: string): string {
  const nextLevelPtBR = getLevelNamePtBR(nextLevel as any);

  if (progress < 25) {
    return `Você está começando sua jornada para ${nextLevelPtBR}. Continue estudando!`;
  }

  if (progress < 50) {
    return `Você já completou ${progress.toFixed(0)}% do caminho para ${nextLevelPtBR}!`;
  }

  if (progress < 75) {
    return `Mais da metade concluída! ${nextLevelPtBR} está próximo!`;
  }

  if (progress < 95) {
    return `Quase lá! Falta pouco para alcançar ${nextLevelPtBR}!`;
  }

  return `Você está a um passo de ${nextLevelPtBR}! Continue firme!`;
}
