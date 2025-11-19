'use client';

import React, { useState } from 'react';
import { StepContainer } from '../StepContainer';
import type { ContraceptiveType, ContraceptiveEffect } from '@/lib/hormonal/types';
import { ContraceptiveTypeLabels, ContraceptiveEffectLabels } from '@/lib/hormonal/types';

interface Step3ContraceptiveProps {
  contraceptiveType: ContraceptiveType | null;
  contraceptiveEffects: ContraceptiveEffect[];
  onChangeType: (type: ContraceptiveType) => void;
  onChangeEffects: (effects: ContraceptiveEffect[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Contraceptive({
  contraceptiveType,
  contraceptiveEffects,
  onChangeType,
  onChangeEffects,
  onNext,
  onBack,
}: Step3ContraceptiveProps) {
  const isValid = contraceptiveType !== null;

  const contraceptiveOptions: ContraceptiveType[] = [
    'combined_pill',
    'progesterone_only_pill',
    'mirena_iud',
    'copper_iud',
    'vaginal_ring',
    'hormonal_patch',
    'implant',
    'none',
  ];

  const effectOptions: ContraceptiveEffect[] = [
    'weight_gain',
    'libido_loss',
    'mood_changes',
    'retention',
    'appetite_increase',
    'none',
  ];

  const isHormonal =
    contraceptiveType &&
    contraceptiveType !== 'none' &&
    contraceptiveType !== 'copper_iud';

  const toggleEffect = (effect: ContraceptiveEffect) => {
    if (effect === 'none') {
      onChangeEffects(['none']);
    } else {
      const newEffects = contraceptiveEffects.includes(effect)
        ? contraceptiveEffects.filter((e) => e !== effect && e !== 'none')
        : [...contraceptiveEffects.filter((e) => e !== 'none'), effect];
      onChangeEffects(newEffects.length === 0 ? ['none'] : newEffects);
    }
  };

  return (
    <StepContainer
      stepNumber={3}
      totalSteps={8}
      title="Você usa anticoncepcional?"
      description="Anticoncepcionais hormonais podem afetar seu metabolismo e sintomas."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Contraceptive Type Selection */}
        <div className="space-y-3">
          {contraceptiveOptions.map((option) => (
            <button
              key={option}
              onClick={() => onChangeType(option)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                contraceptiveType === option
                  ? 'border-pink-500 bg-pink-50 shadow-md'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  {ContraceptiveTypeLabels[option]}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    contraceptiveType === option ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                  }`}
                >
                  {contraceptiveType === option && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Effects Selection (only if hormonal contraceptive) */}
        {isHormonal && (
          <div className="pt-6 border-t-2 border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">
              Após começar o anticoncepcional, você notou:
            </h3>
            <p className="text-sm text-gray-600 mb-4">Selecione todas as opções que se aplicam</p>
            <div className="space-y-2">
              {effectOptions.map((effect) => (
                <button
                  key={effect}
                  onClick={() => toggleEffect(effect)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    contraceptiveEffects.includes(effect)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      {ContraceptiveEffectLabels[effect]}
                    </span>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        contraceptiveEffects.includes(effect)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {contraceptiveEffects.includes(effect) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
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
          </div>
        )}
      </div>
    </StepContainer>
  );
}
