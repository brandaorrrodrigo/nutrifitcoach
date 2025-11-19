'use client';

import React from 'react';
import { StepContainer } from '../StepContainer';
import type { MenopauseStatus, MenopauseSymptom } from '@/lib/hormonal/types';
import { MenopauseStatusLabels, MenopauseSymptomLabels } from '@/lib/hormonal/types';

interface Step6MenopauseProps {
  age: number;
  status: MenopauseStatus | null;
  symptoms: MenopauseSymptom[];
  onChangeStatus: (status: MenopauseStatus) => void;
  onChangeSymptoms: (symptoms: MenopauseSymptom[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step6Menopause({
  age,
  status,
  symptoms,
  onChangeStatus,
  onChangeSymptoms,
  onNext,
  onBack,
}: Step6MenopauseProps) {
  const isValid = status !== null;
  const showMenopauseQuestions = age >= 40 || status !== 'none';

  const statusOptions: MenopauseStatus[] = ['none', 'climacteric', 'confirmed_menopause'];

  const symptomOptions: MenopauseSymptom[] = [
    'hot_flashes',
    'insomnia',
    'anxiety',
    'vaginal_dryness',
    'abdominal_weight',
    'muscle_loss',
    'fatigue',
    'none',
  ];

  const toggleSymptom = (symptom: MenopauseSymptom) => {
    if (symptom === 'none') {
      onChangeSymptoms(['none']);
    } else {
      const newSymptoms = symptoms.includes(symptom)
        ? symptoms.filter((s) => s !== symptom && s !== 'none')
        : [...symptoms.filter((s) => s !== 'none'), symptom];
      onChangeSymptoms(newSymptoms.length === 0 ? ['none'] : newSymptoms);
    }
  };

  if (!showMenopauseQuestions) {
    // Auto-skip for younger women
    React.useEffect(() => {
      if (status === null) {
        onChangeStatus('none');
      }
    }, [status, onChangeStatus]);

    return (
      <StepContainer
        stepNumber={6}
        totalSteps={8}
        title="Menopausa / Climatério"
        description="Esta seção não se aplica à sua faixa etária."
        onNext={onNext}
        onBack={onBack}
        isValid={true}
      >
        <div className="text-center py-10">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-gray-600">
            Como você tem menos de 40 anos, vamos pular esta seção.
          </p>
        </div>
      </StepContainer>
    );
  }

  const showSymptoms = status && status !== 'none';

  return (
    <StepContainer
      stepNumber={6}
      totalSteps={8}
      title="Sobre sua fase atual"
      description="Menopausa e climatério podem afetar significativamente seu metabolismo."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="space-y-6">
        {/* Status Selection */}
        <div className="space-y-3">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => onChangeStatus(option)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                status === option
                  ? 'border-pink-500 bg-pink-50 shadow-md'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{MenopauseStatusLabels[option]}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    status === option ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                  }`}
                >
                  {status === option && (
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

        {/* Symptoms Selection */}
        {showSymptoms && (
          <div className="pt-6 border-t-2 border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Sente algum desses sintomas?</h3>
            <p className="text-sm text-gray-600 mb-4">Selecione todos que se aplicam</p>
            <div className="space-y-2">
              {symptomOptions.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    symptoms.includes(symptom)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      {MenopauseSymptomLabels[symptom]}
                    </span>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        symptoms.includes(symptom)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {symptoms.includes(symptom) && (
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
          </div>
        )}
      </div>
    </StepContainer>
  );
}
