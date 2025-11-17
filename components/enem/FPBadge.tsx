'use client';

import React, { useEffect, useState } from 'react';

interface FPBadgeProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

interface GamificationData {
  total_fp: number;
  current_streak: number;
  best_streak: number;
}

export default function FPBadge({ userId, size = 'md', showLabel = true }: FPBadgeProps) {
  const [fpData, setFpData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFPData();
  }, [userId]);

  const fetchFPData = async () => {
    try {
      const response = await fetch(`/api/enem/gamificacao/status?user_id=${userId}`);
      const data = await response.json();

      if (data.success) {
        setFpData(data.gamification);
      }
    } catch (error) {
      console.error('Erro ao buscar FP:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${getSizeClasses(size)}`}>
        <div className="animate-pulse bg-gray-200 rounded-full w-10 h-10"></div>
        {showLabel && <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>}
      </div>
    );
  }

  if (!fpData) return null;

  return (
    <div className={`flex items-center gap-2 ${getSizeClasses(size)}`}>
      <div className="relative">
        {/* Badge circular com FP */}
        <div className={`
          rounded-full bg-gradient-to-br from-purple-500 to-pink-500
          flex items-center justify-center font-bold text-white
          shadow-lg hover:shadow-xl transition-all duration-200
          ${getBadgeSizeClasses(size)}
        `}>
          <span className="relative z-10">
            {formatFP(fpData.total_fp)}
          </span>
        </div>

        {/* Efeito de brilho */}
        <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-sm"></div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-semibold text-gray-800 ${getLabelSizeClasses(size)}`}>
            {fpData.total_fp.toLocaleString()} FP
          </span>
          <span className="text-xs text-gray-500">
            Focus Points
          </span>
        </div>
      )}
    </div>
  );
}

function getSizeClasses(size: string): string {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
}

function getBadgeSizeClasses(size: string): string {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
}

function getLabelSizeClasses(size: string): string {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
}

function formatFP(fp: number): string {
  if (fp >= 1000000) {
    return `${(fp / 1000000).toFixed(1)}M`;
  }
  if (fp >= 1000) {
    return `${(fp / 1000).toFixed(1)}K`;
  }
  return fp.toString();
}
