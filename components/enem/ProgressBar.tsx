'use client';

import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  max?: number;
  color?: 'purple' | 'green' | 'blue' | 'orange' | 'red' | 'yellow';
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  icon?: string;
}

export default function ProgressBar({
  label,
  value,
  max = 100,
  color = 'purple',
  showPercentage = true,
  height = 'md',
  icon
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const bgColorClasses = {
    purple: 'bg-purple-100',
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100'
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        {showPercentage && (
          <span className="text-sm font-semibold text-gray-900">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
      <div className={`w-full ${bgColorClasses[color]} rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className={`${colorClasses[color]} ${heightClasses[height]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
