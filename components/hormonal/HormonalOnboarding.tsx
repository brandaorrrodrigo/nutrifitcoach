'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IntroductionScreen } from './IntroductionScreen';
import { CompletionScreen } from './CompletionScreen';
import { Step1Age } from './steps/Step1Age';
import { Step2CycleStatus } from './steps/Step2CycleStatus';
import { Step3Contraceptive } from './steps/Step3Contraceptive';
import { Step4Conditions } from './steps/Step4Conditions';
import { Step5HormoneTherapy } from './steps/Step5HormoneTherapy';
import { Step6Menopause } from './steps/Step6Menopause';
import { Step7GeneralSymptoms } from './steps/Step7GeneralSymptoms';
import { Step8Objective } from './steps/Step8Objective';
import type {
  CycleStatus,
  ContraceptiveType,
  ContraceptiveEffect,
  HormonalCondition,
  HormoneTherapy,
  MenopauseStatus,
  MenopauseSymptom,
  GeneralSymptoms,
  FemaleObjective,
  FemaleHormonalProfileData,
  HormonalProfileClassification,
} from '@/lib/hormonal/types';
import { classifyHormonalProfile } from '@/lib/hormonal/engine';

export function HormonalOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = intro, 1-8 = steps, 9 = completion

  // Form state
  const [age, setAge] = useState<number | null>(null);
  const [cycleStatus, setCycleStatus] = useState<CycleStatus | null>(null);
  const [contraceptiveType, setContraceptiveType] = useState<ContraceptiveType | null>(null);
  const [contraceptiveEffects, setContraceptiveEffects] = useState<ContraceptiveEffect[]>([]);
  const [hormonalConditions, setHormonalConditions] = useState<HormonalCondition[]>([]);
  const [hormoneTherapy, setHormoneTherapy] = useState<HormoneTherapy | null>(null);
  const [menopauseStatus, setMenopauseStatus] = useState<MenopauseStatus | null>(null);
  const [menopauseSymptoms, setMenopauseSymptoms] = useState<MenopauseSymptom[]>([]);
  const [generalSymptoms, setGeneralSymptoms] = useState<GeneralSymptoms>({
    bloating: 'never',
    mood_changes: 'never',
    appetite_increase: 'never',
    pms_cravings: 'never',
    extreme_fatigue: 'never',
    headaches: 'never',
    libido_loss: 'never',
  });
  const [objective, setObjective] = useState<FemaleObjective | null>(null);

  const [classification, setClassification] = useState<HormonalProfileClassification | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    // Auto-save at each step
    if (currentStep >= 1 && currentStep <= 8) {
      await saveProgress();
    }

    // If finishing step 8, classify and save
    if (currentStep === 8) {
      await completeProfile();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveProgress = async () => {
    try {
      const profileData = {
        age: age || 0,
        cycle_status: cycleStatus,
        contraceptive_type: contraceptiveType,
        contraceptive_effects: contraceptiveEffects,
        hormonal_conditions: hormonalConditions,
        hormone_therapy: hormoneTherapy,
        menopause_status: menopauseStatus,
        menopause_symptoms: menopauseSymptoms,
        general_symptoms: generalSymptoms,
        objective: objective,
      };

      // Save to API (partial save)
      await fetch('/api/hormonal-profile/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const completeProfile = async () => {
    if (!age || !cycleStatus || !contraceptiveType || !hormoneTherapy || !menopauseStatus || !objective) {
      alert('Por favor, complete todas as informações obrigatórias.');
      return;
    }

    setIsSaving(true);

    try {
      const profileData: FemaleHormonalProfileData = {
        age,
        cycle_status: cycleStatus,
        contraceptive_type: contraceptiveType,
        contraceptive_effects: contraceptiveEffects,
        hormonal_conditions: hormonalConditions,
        hormone_therapy: hormoneTherapy,
        menopause_status: menopauseStatus,
        menopause_symptoms: menopauseSymptoms,
        general_symptoms: generalSymptoms,
        objective: objective,
      };

      // Classify profile using NFC Hormonal Engine
      const profileClassification = classifyHormonalProfile(profileData);
      setClassification(profileClassification);

      // Save complete profile to database
      const response = await fetch('/api/hormonal-profile/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          classification: profileClassification,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Move to completion screen
      setCurrentStep(9);
    } catch (error) {
      console.error('Error completing profile:', error);
      alert('Erro ao salvar perfil. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueFromCompletion = () => {
    // Redirect to next step in onboarding flow
    router.push('/selecionar-dieta');
  };

  // Render current screen
  if (currentStep === 0) {
    return <IntroductionScreen onStart={() => setCurrentStep(1)} />;
  }

  if (currentStep === 9 && classification) {
    return (
      <CompletionScreen
        profile={classification}
        onContinue={handleContinueFromCompletion}
        isLoading={false}
      />
    );
  }

  return (
    <>
      {currentStep === 1 && (
        <Step1Age age={age} onChange={setAge} onNext={handleNext} />
      )}
      {currentStep === 2 && (
        <Step2CycleStatus
          cycleStatus={cycleStatus}
          onChange={setCycleStatus}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <Step3Contraceptive
          contraceptiveType={contraceptiveType}
          contraceptiveEffects={contraceptiveEffects}
          onChangeType={setContraceptiveType}
          onChangeEffects={setContraceptiveEffects}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 4 && (
        <Step4Conditions
          conditions={hormonalConditions}
          onChange={setHormonalConditions}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 5 && (
        <Step5HormoneTherapy
          therapy={hormoneTherapy}
          onChange={setHormoneTherapy}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 6 && age && (
        <Step6Menopause
          age={age}
          status={menopauseStatus}
          symptoms={menopauseSymptoms}
          onChangeStatus={setMenopauseStatus}
          onChangeSymptoms={setMenopauseSymptoms}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 7 && (
        <Step7GeneralSymptoms
          symptoms={generalSymptoms}
          onChange={setGeneralSymptoms}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 8 && (
        <Step8Objective
          objective={objective}
          onChange={setObjective}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
    </>
  );
}
