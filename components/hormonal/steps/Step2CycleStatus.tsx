'use client';

import React from 'react';
import { StepContainer } from '../StepContainer';
import type { CycleStatus } from '@/lib/hormonal/types';
import { CycleStatusLabels } from '@/lib/hormonal/types';

interface Step2CycleStatusProps {
  cycleStatus: CycleStatus | null;
  onChange: (status: CycleStatus) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2CycleStatus({
  cycleStatus,
  onChange,
  onNext,
  onBack,
}: Step2CycleStatusProps) {
  const isValid = cycleStatus !== null;

  const options: CycleStatus[] = [
    'regular_28_32',
    'irregular',
    'no_period_surgery',
    'no_period_iud_hormonal',
    'no_period_contraceptive',
    'no_period_menopause',
  ];

  return (
    <StepContainer
      stepNumber={2}
      totalSteps={8}
      title="Sobre seu ciclo menstrual"
      description="Como está seu ciclo atualmente?"
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
              cycleStatus === option
                ? 'border-pink-500 bg-pink-50 shadow-md'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{CycleStatusLabels[option]}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  cycleStatus === option ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                }`}
              >
                {cycleStatus === option && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-xl text-sm text-gray-600">
        <p className="font-medium text-purple-700 mb-1">💡 Importante</p>
        <p className="text-xs">
          Esta informação nos ajuda a adaptar sua dieta às oscilações hormonais naturais do seu
          corpo.
        </p>
      </div>
    </StepContainer>
  );
}
