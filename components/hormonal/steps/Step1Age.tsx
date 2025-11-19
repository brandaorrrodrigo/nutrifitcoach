'use client';

import React from 'react';
import { StepContainer } from '../StepContainer';

interface Step1AgeProps {
  age: number | null;
  onChange: (age: number) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function Step1Age({ age, onChange, onNext, onBack }: Step1AgeProps) {
  const isValid = age !== null && age >= 12 && age <= 120;

  return (
    <StepContainer
      stepNumber={1}
      totalSteps={8}
      title="Qual a sua idade?"
      description="Sua idade nos ajuda a entender sua fase hormonal e necessidades nutricionais."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="number"
            min="12"
            max="120"
            value={age || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                onChange(value);
              }
            }}
            placeholder="Digite sua idade"
            className="w-full text-3xl md:text-4xl font-semibold text-center py-6 px-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
            anos
          </div>
        </div>

        {/* Age ranges hints */}
        <div className="mt-8 space-y-3">
          <div className="p-4 bg-pink-50 rounded-xl text-sm text-gray-600">
            <p className="font-medium text-pink-700 mb-1">💡 Por que perguntamos?</p>
            <ul className="space-y-1 text-xs">
              <li>• 12-39 anos: Ciclo menstrual natural</li>
              <li>• 40-51 anos: Climatério / Perimenopausa</li>
              <li>• 51+ anos: Menopausa consolidada</li>
            </ul>
          </div>
        </div>
      </div>
    </StepContainer>
  );
}
