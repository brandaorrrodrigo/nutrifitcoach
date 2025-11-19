// ============================================
// NFC HORMONAL ENGINE - Zod Validation Schemas
// ============================================

import { z } from 'zod';

export const CycleStatusSchema = z.enum([
  'regular_28_32',
  'irregular',
  'no_period_surgery',
  'no_period_iud_hormonal',
  'no_period_contraceptive',
  'no_period_menopause',
]);

export const ContraceptiveTypeSchema = z.enum([
  'combined_pill',
  'progesterone_only_pill',
  'mirena_iud',
  'copper_iud',
  'vaginal_ring',
  'hormonal_patch',
  'implant',
  'none',
]);

export const HormonalConditionSchema = z.enum([
  'pcos',
  'endometriosis',
  'hypothyroidism',
  'hashimoto',
  'insulin_resistance',
  'intense_pms',
  'none',
]);

export const HormoneTherapySchema = z.enum([
  'none',
  'estrogen',
  'progesterone',
  'testosterone',
  'complete_hrt',
  'phytotherapy',
]);

export const MenopauseStatusSchema = z.enum([
  'none',
  'climacteric',
  'confirmed_menopause',
]);

export const GeneralSymptomFrequencySchema = z.enum([
  'never',
  'sometimes',
  'frequently',
  'always',
]);

export const FemaleObjectiveSchema = z.enum([
  'weight_loss',
  'muscle_gain',
  'body_recomposition',
  'reduce_hormonal_symptoms',
  'improve_energy',
  'control_insulin_resistance',
]);

export const ContraceptiveEffectSchema = z.enum([
  'weight_gain',
  'libido_loss',
  'mood_changes',
  'retention',
  'appetite_increase',
  'none',
]);

export const MenopauseSymptomSchema = z.enum([
  'hot_flashes',
  'insomnia',
  'anxiety',
  'vaginal_dryness',
  'abdominal_weight',
  'muscle_loss',
  'fatigue',
  'none',
]);

export const GeneralSymptomsSchema = z.object({
  bloating: GeneralSymptomFrequencySchema,
  mood_changes: GeneralSymptomFrequencySchema,
  appetite_increase: GeneralSymptomFrequencySchema,
  pms_cravings: GeneralSymptomFrequencySchema,
  extreme_fatigue: GeneralSymptomFrequencySchema,
  headaches: GeneralSymptomFrequencySchema,
  libido_loss: GeneralSymptomFrequencySchema,
});

// Schema para Step 1 - Idade
export const Step1Schema = z.object({
  age: z.number().min(12).max(120),
});

// Schema para Step 2 - Estado Menstrual
export const Step2Schema = z.object({
  cycle_status: CycleStatusSchema,
});

// Schema para Step 3 - Anticoncepcional
export const Step3Schema = z.object({
  contraceptive_type: ContraceptiveTypeSchema,
  contraceptive_effects: z.array(ContraceptiveEffectSchema).optional().default([]),
});

// Schema para Step 4 - Condições Hormonais
export const Step4Schema = z.object({
  hormonal_conditions: z.array(HormonalConditionSchema).min(1),
});

// Schema para Step 5 - Reposição Hormonal
export const Step5Schema = z.object({
  hormone_therapy: HormoneTherapySchema,
});

// Schema para Step 6 - Menopausa/Climatério
export const Step6Schema = z.object({
  menopause_status: MenopauseStatusSchema,
  menopause_symptoms: z.array(MenopauseSymptomSchema).optional().default([]),
});

// Schema para Step 7 - Sintomas Gerais
export const Step7Schema = z.object({
  general_symptoms: GeneralSymptomsSchema,
});

// Schema para Step 8 - Objetivo
export const Step8Schema = z.object({
  objective: FemaleObjectiveSchema,
});

// Schema completo do perfil hormonal feminino
export const FemaleHormonalProfileSchema = z.object({
  age: z.number().min(12).max(120),
  cycle_status: CycleStatusSchema,
  contraceptive_type: ContraceptiveTypeSchema,
  contraceptive_effects: z.array(ContraceptiveEffectSchema),
  hormonal_conditions: z.array(HormonalConditionSchema),
  hormone_therapy: HormoneTherapySchema,
  menopause_status: MenopauseStatusSchema,
  menopause_symptoms: z.array(MenopauseSymptomSchema),
  general_symptoms: GeneralSymptomsSchema,
  objective: FemaleObjectiveSchema,
});

export type FemaleHormonalProfileInput = z.infer<typeof FemaleHormonalProfileSchema>;
