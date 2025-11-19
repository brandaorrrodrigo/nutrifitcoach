'use client';

import React from 'react';
import { StepContainer } from '../StepContainer';
import type { GeneralSymptoms, GeneralSymptomFrequency } from '@/lib/hormonal/types';
import { GeneralSymptomFrequencyLabels } from '@/lib/hormonal/types';

interface Step7GeneralSymptomsProps {
  symptoms: GeneralSymptoms;
  onChange: (symptoms: GeneralSymptoms) => void;
  onNext: () => void;
  onBack: () => void;
}

type SymptomKey = keyof GeneralSymptoms;

const symptomLabels: Record<SymptomKey, string> = {
  bloating: 'Inchaço / Retenção',
  mood_changes: 'Alterações de humor',
  appetite_increase: 'Aumento de apetite',
  pms_cravings: 'Compulsão antes da menstruação',
  extreme_fatigue: 'Cansaço extremo',
  headaches: 'Dores de cabeça',
  libido_loss: 'Queda de libido',
};

export function Step7GeneralSymptoms({ symptoms, onChange, onNext, onBack }: Step7GeneralSymptomsProps) {
  const isValid = true; // All fields have default values

  const frequencies: GeneralSymptomFrequency[] = ['never', 'sometimes', 'frequently', 'always'];

  const updateSymptom = (key: SymptomKey, frequency: GeneralSymptomFrequency) => {
    onChange({
      ...symptoms,
      [key]: frequency,
    });
  };

  return (
    <StepContainer
      stepNumber={7}
      totalSteps={8}
      title="Nos últimos 3 meses, com que frequência você sentiu..."
      description="Esses sintomas nos ajudam a entender melhor seu corpo."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-6">
        {(Object.keys(symptomLabels) as SymptomKey[]).map((symptomKey) => (
          <div key={symptomKey} className="space-y-3">
            <h3 className="font-semibold text-gray-800">{symptomLabels[symptomKey]}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {frequencies.map((freq) => (
                <button
                  key={freq}
                  onClick={() => updateSymptom(symptomKey, freq)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    symptoms[symptomKey] === freq
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300 text-gray-600 hover:bg-pink-50/30'
                  }`}
                >
                  {GeneralSymptomFrequencyLabels[freq]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-xl text-sm text-gray-600">
        <p className="font-medium text-purple-700 mb-1">💡 Lembre-se</p>
        <p className="text-xs">
          Não existe resposta certa ou errada. Seja honesta consigo mesma para que possamos
          criar o melhor plano para você.
        </p>
      </div>
    </StepContainer>
  );
}
