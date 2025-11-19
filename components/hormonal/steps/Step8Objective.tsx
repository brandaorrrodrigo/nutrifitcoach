'use client';

import React from 'react';
import { StepContainer } from '../StepContainer';
import type { FemaleObjective } from '@/lib/hormonal/types';
import { FemaleObjectiveLabels } from '@/lib/hormonal/types';

interface Step8ObjectiveProps {
  objective: FemaleObjective | null;
  onChange: (objective: FemaleObjective) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step8Objective({ objective, onChange, onNext, onBack }: Step8ObjectiveProps) {
  const isValid = objective !== null;

  const options: FemaleObjective[] = [
    'weight_loss',
    'muscle_gain',
    'body_recomposition',
    'reduce_hormonal_symptoms',
    'improve_energy',
    'control_insulin_resistance',
  ];

  const objectiveIcons: Record<FemaleObjective, string> = {
    weight_loss: '🎯',
    muscle_gain: '💪',
    body_recomposition: '⚖️',
    reduce_hormonal_symptoms: '🌸',
    improve_energy: '⚡',
    control_insulin_resistance: '🩺',
  };

  return (
    <StepContainer
      stepNumber={8}
      totalSteps={8}
      title="Qual seu principal objetivo no momento?"
      description="Vamos alinhar sua dieta com o que você deseja transformar."
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
              objective === option
                ? 'border-pink-500 bg-pink-50 shadow-md'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{objectiveIcons[option]}</span>
                <span className="font-medium text-gray-800">{FemaleObjectiveLabels[option]}</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  objective === option ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                }`}
              >
                {objective === option && (
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

      <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl text-sm text-gray-600 border border-pink-100">
        <p className="font-medium text-pink-700 mb-1">✨ Estamos quase lá!</p>
        <p className="text-xs">
          Esta é a última pergunta. Após finalizar, vamos processar todas as suas informações e
          criar um plano hormonal personalizado para você.
        </p>
      </div>
    </StepContainer>
  );
}
