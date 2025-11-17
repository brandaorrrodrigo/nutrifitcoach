'use client';

import React, { useEffect, useState } from 'react';

interface StreakIndicatorProps {
  userId: string;
  variant?: 'compact' | 'detailed';
}

interface GamificationData {
  current_streak: number;
  best_streak: number;
  last_activity: string | null;
}

export default function StreakIndicator({ userId, variant = 'compact' }: StreakIndicatorProps) {
  const [streakData, setStreakData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      const response = await fetch(`/api/enem/gamificacao/status?user_id=${userId}`);
      const data = await response.json();

      if (data.success) {
        setStreakData(data.gamification);
      }
    } catch (error) {
      console.error('Erro ao buscar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg p-3 w-40 h-16"></div>
    );
  }

  if (!streakData) return null;

  const isActiveToday = streakData.last_activity
    ? isToday(new Date(streakData.last_activity))
    : false;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2 border border-orange-200">
        <span className="text-2xl" role="img" aria-label="fire">
          {isActiveToday ? '🔥' : '⚪'}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-orange-600">
            {streakData.current_streak} dias
          </span>
          <span className="text-xs text-gray-500">
            Sequência
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Sequência de Estudo</h3>
        <span className="text-3xl" role="img" aria-label="fire">
          {isActiveToday ? '🔥' : '⚪'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Sequência Atual */}
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            {streakData.current_streak}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Dias Seguidos
          </div>
        </div>

        {/* Melhor Sequência */}
        <div className="text-center border-l border-orange-200 pl-4">
          <div className="text-2xl font-bold text-gray-700">
            {streakData.best_streak}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Recorde
          </div>
        </div>
      </div>

      {/* Mensagem motivacional */}
      <div className="mt-3 pt-3 border-t border-orange-100">
        <p className="text-xs text-gray-600 text-center">
          {getMotivationalMessage(streakData.current_streak, isActiveToday)}
        </p>
      </div>
    </div>
  );
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getMotivationalMessage(streak: number, isActive: boolean): string {
  if (!isActive) {
    return 'Estude hoje para manter sua sequência!';
  }

  if (streak === 0) {
    return 'Comece sua jornada hoje!';
  }

  if (streak === 1) {
    return 'Ótimo começo! Continue amanhã!';
  }

  if (streak < 7) {
    return `${7 - streak} dias para completar uma semana!`;
  }

  if (streak === 7) {
    return 'Uma semana completa! Incrível!';
  }

  if (streak < 30) {
    return `${30 - streak} dias para completar um mês!`;
  }

  if (streak === 30) {
    return 'Um mês de dedicação! Parabéns!';
  }

  return 'Continue firme na sua jornada!';
}
