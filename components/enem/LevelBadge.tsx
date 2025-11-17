'use client';

import React from 'react';

interface LevelInfo {
  name: string;
  color: string;
  icon: string;
  min_fp: number;
  max_fp: number | null;
}

interface LevelBadgeProps {
  level: LevelInfo;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showRange?: boolean;
}

export default function LevelBadge({
  level,
  size = 'md',
  showName = true,
  showRange = false
}: LevelBadgeProps) {
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      icon: 'text-sm',
      text: 'text-xs',
      badge: 'text-[10px]'
    },
    md: {
      container: 'px-3 py-1.5',
      icon: 'text-base',
      text: 'text-sm',
      badge: 'text-xs'
    },
    lg: {
      container: 'px-4 py-2',
      icon: 'text-xl',
      text: 'text-base',
      badge: 'text-sm'
    }
  };

  const colorClasses = {
    cyan: {
      bg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      text: 'text-white',
      border: 'border-cyan-400',
      glow: 'shadow-lg shadow-cyan-500/50'
    },
    gray: {
      bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
      text: 'text-white',
      border: 'border-gray-300',
      glow: 'shadow-lg shadow-gray-500/50'
    },
    yellow: {
      bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      text: 'text-gray-900',
      border: 'border-yellow-300',
      glow: 'shadow-lg shadow-yellow-500/50'
    },
    orange: {
      bg: 'bg-gradient-to-r from-orange-400 to-orange-500',
      text: 'text-white',
      border: 'border-orange-300',
      glow: 'shadow-lg shadow-orange-500/50'
    }
  };

  const colors = colorClasses[level.color as keyof typeof colorClasses] || colorClasses.orange;
  const sizes = sizeClasses[size];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${colors.bg} ${colors.text} ${colors.glow}
        border-2 ${colors.border}
        ${sizes.container}
        font-bold
      `}
    >
      <span className={sizes.icon}>{level.icon}</span>
      {showName && (
        <span className={sizes.text}>{level.name}</span>
      )}
      {showRange && (
        <span className={`${sizes.badge} opacity-90 font-normal`}>
          ({level.min_fp}{level.max_fp ? `-${level.max_fp}` : '+'} FP)
        </span>
      )}
    </div>
  );
}

/**
 * Helper para obter informações de nível baseado no FP
 */
export function getLevelByFP(totalFP: number): LevelInfo {
  if (totalFP >= 10000) {
    return {
      name: 'Diamond',
      color: 'cyan',
      icon: '💎',
      min_fp: 10000,
      max_fp: null
    };
  } else if (totalFP >= 5000) {
    return {
      name: 'Platinum',
      color: 'gray',
      icon: '🏆',
      min_fp: 5000,
      max_fp: 9999
    };
  } else if (totalFP >= 2000) {
    return {
      name: 'Gold',
      color: 'yellow',
      icon: '🥇',
      min_fp: 2000,
      max_fp: 4999
    };
  } else if (totalFP >= 500) {
    return {
      name: 'Silver',
      color: 'gray',
      icon: '🥈',
      min_fp: 500,
      max_fp: 1999
    };
  } else {
    return {
      name: 'Bronze',
      color: 'orange',
      icon: '🥉',
      min_fp: 0,
      max_fp: 499
    };
  }
}
