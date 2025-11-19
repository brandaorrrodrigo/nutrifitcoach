'use client';

import React from 'react';
import { StepContainer } from '../StepContainer';
import type { HormonalCondition } from '@/lib/hormonal/types';
import { HormonalConditionLabels } from '@/lib/hormonal/types';

interface Step4ConditionsProps {
  conditions: HormonalCondition[];
  onChange: (conditions: HormonalCondition[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4Conditions({ conditions, onChange, onNext, onBack }: Step4ConditionsProps) {
  const isValid = conditions.length > 0;

  const options: HormonalCondition[] = [
    'pcos',
    'endometriosis',
    'hypothyroidism',
    'hashimoto',
    'insulin_resistance',
    'intense_pms',
    'none',
  ];

  const toggleCondition = (condition: HormonalCondition) => {
    if (condition === 'none') {
      onChange(['none']);
    } else {
      const newConditions = conditions.includes(condition)
        ? conditions.filter((c) => c !== condition && c !== 'none')
        : [...conditions.filter((c) => c !== 'none'), condition];
      onChange(newConditions.length === 0 ? ['none'] : newConditions);
    }
  };

  return (
    <StepContainer
      stepNumber={4}
      totalSteps={8}
      title="Você possui alguma dessas condições diagnosticadas?"
      description="Selecione todas as que se aplicam. Isso nos ajuda a personalizar ainda mais sua dieta."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleCondition(option)}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
              conditions.includes(option)
                ? 'border-pink-500 bg-pink-50 shadow-md'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{HormonalConditionLabels[option]}</span>
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  conditions.includes(option) ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                }`}
              >
                {conditions.includes(option) && (
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

      <div className="mt-6 p-4 bg-pink-50 rounded-xl text-sm text-gray-600">
        <p className="font-medium text-pink-700 mb-1">💡 Importante</p>
        <p className="text-xs">
          Essas informações são essenciais para adaptar sua dieta às suas necessidades hormonais
          específicas.
        </p>
      </div>
    </StepContainer>
  );
}
