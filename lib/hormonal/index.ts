// ============================================
// NFC HORMONAL ENGINE - Public API
// ============================================

// Engine
export { classifyHormonalProfile, determineCyclePhase } from './engine';

// Types
export type {
  CycleStatus,
  ContraceptiveType,
  HormonalCondition,
  HormoneTherapy,
  MenopauseStatus,
  GeneralSymptomFrequency,
  FemaleObjective,
  ContraceptiveEffect,
  MenopauseSymptom,
  GeneralSymptoms,
  FemaleHormonalProfileData,
  HormonalProfileClassification,
} from './types';

export {
  CycleStatusLabels,
  ContraceptiveTypeLabels,
  HormonalConditionLabels,
  HormoneTherapyLabels,
  MenopauseStatusLabels,
  FemaleObjectiveLabels,
  ContraceptiveEffectLabels,
  MenopauseSymptomLabels,
  GeneralSymptomFrequencyLabels,
} from './types';

// Validation
export {
  CycleStatusSchema,
  ContraceptiveTypeSchema,
  HormonalConditionSchema,
  HormoneTherapySchema,
  MenopauseStatusSchema,
  GeneralSymptomFrequencySchema,
  FemaleObjectiveSchema,
  ContraceptiveEffectSchema,
  MenopauseSymptomSchema,
  GeneralSymptomsSchema,
  FemaleHormonalProfileSchema,
} from './validation';

export type { FemaleHormonalProfileInput } from './validation';
