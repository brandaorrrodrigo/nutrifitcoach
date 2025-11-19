'use client';

import React from 'react';
import { StepContainer } from '../StepContainer';
import type { HormoneTherapy } from '@/lib/hormonal/types';
import { HormoneTherapyLabels } from '@/lib/hormonal/types';

interface Step5HormoneTherapyProps {
  therapy: HormoneTherapy | null;
  onChange: (therapy: HormoneTherapy) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step5HormoneTherapy({ therapy, onChange, onNext, onBack }: Step5HormoneTherapyProps) {
  const isValid = therapy !== null;

  const options: HormoneTherapy[] = [
    'none',
    'estrogen',
    'progesterone',
    'testosterone',
    'complete_hrt',
    'phytotherapy',
  ];

  return (
    <StepContainer
      stepNumber={5}
      totalSteps={8}
      title="Você usa reposição hormonal prescrita?"
      description="Terapia hormonal ou fitoterápicos para equilíbrio hormonal."
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
              therapy === option
                ? 'border-pink-500 bg-pink-50 shadow-md'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{HormoneTherapyLabels[option]}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  therapy === option ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                }`}
              >
                {therapy === option && (
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
    </StepContainer>
  );
}
