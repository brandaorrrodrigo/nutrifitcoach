// ============================================
// NFC HORMONAL ENGINE - Types & Interfaces
// ============================================

export type CycleStatus =
  | 'regular_28_32'
  | 'irregular'
  | 'no_period_surgery'
  | 'no_period_iud_hormonal'
  | 'no_period_contraceptive'
  | 'no_period_menopause';

export type ContraceptiveType =
  | 'combined_pill'
  | 'progesterone_only_pill'
  | 'mirena_iud'
  | 'copper_iud'
  | 'vaginal_ring'
  | 'hormonal_patch'
  | 'implant'
  | 'none';

export type HormonalCondition =
  | 'pcos'
  | 'endometriosis'
  | 'hypothyroidism'
  | 'hashimoto'
  | 'insulin_resistance'
  | 'intense_pms'
  | 'none';

export type HormoneTherapy =
  | 'none'
  | 'estrogen'
  | 'progesterone'
  | 'testosterone'
  | 'complete_hrt'
  | 'phytotherapy';

export type MenopauseStatus =
  | 'none'
  | 'climacteric'
  | 'confirmed_menopause';

export type GeneralSymptomFrequency =
  | 'never'
  | 'sometimes'
  | 'frequently'
  | 'always';

export type FemaleObjective =
  | 'weight_loss'
  | 'muscle_gain'
  | 'body_recomposition'
  | 'reduce_hormonal_symptoms'
  | 'improve_energy'
  | 'control_insulin_resistance';

export type ContraceptiveEffect =
  | 'weight_gain'
  | 'libido_loss'
  | 'mood_changes'
  | 'retention'
  | 'appetite_increase'
  | 'none';

export type MenopauseSymptom =
  | 'hot_flashes'
  | 'insomnia'
  | 'anxiety'
  | 'vaginal_dryness'
  | 'abdominal_weight'
  | 'muscle_loss'
  | 'fatigue'
  | 'none';

export interface GeneralSymptoms {
  bloating: GeneralSymptomFrequency;
  mood_changes: GeneralSymptomFrequency;
  appetite_increase: GeneralSymptomFrequency;
  pms_cravings: GeneralSymptomFrequency;
  extreme_fatigue: GeneralSymptomFrequency;
  headaches: GeneralSymptomFrequency;
  libido_loss: GeneralSymptomFrequency;
}

export interface FemaleHormonalProfileData {
  age: number;
  cycle_status: CycleStatus;
  contraceptive_type: ContraceptiveType;
  contraceptive_effects: ContraceptiveEffect[];
  hormonal_conditions: HormonalCondition[];
  hormone_therapy: HormoneTherapy;
  menopause_status: MenopauseStatus;
  menopause_symptoms: MenopauseSymptom[];
  general_symptoms: GeneralSymptoms;
  objective: FemaleObjective;
}

export interface HormonalProfileClassification {
  perfil_hormonal:
    | 'SOP'
    | 'anticoncepcional'
    | 'ciclo_regular'
    | 'ciclo_irregular'
    | 'climaterio'
    | 'menopausa'
    | 'THM'
    | 'endometriose'
    | 'resistencia_insulina'
    | 'hipotireoidismo';
  subperfil:
    | 'fase_folicular'
    | 'fase_ovulatoria'
    | 'fase_lutea'
    | 'estavel'
    | 'termico_alto'
    | 'termico_baixo'
    | 'energetico_baixo'
    | 'energetico_alto'
    | 'pms_intenso'
    | null;
  objetivo: FemaleObjective;
  ajustes_nutricionais: string[];
  sensibilidades: string[];
  alertas: string[];
  pontos_criticos: string[];
}

// Labels amigáveis para UI
export const CycleStatusLabels: Record<CycleStatus, string> = {
  regular_28_32: 'Regular (28 a 32 dias)',
  irregular: 'Irregular',
  no_period_surgery: 'Não menstruo (cirurgia)',
  no_period_iud_hormonal: 'Não menstruo (DIU hormonal)',
  no_period_contraceptive: 'Não menstruo (anticoncepcional contínuo)',
  no_period_menopause: 'Não menstruo (menopausa)',
};

export const ContraceptiveTypeLabels: Record<ContraceptiveType, string> = {
  combined_pill: 'Pílula combinada',
  progesterone_only_pill: 'Pílula somente progesterona',
  mirena_iud: 'DIU Mirena',
  copper_iud: 'DIU de cobre',
  vaginal_ring: 'Anel vaginal',
  hormonal_patch: 'Adesivo hormonal',
  implant: 'Implante',
  none: 'Não uso',
};

export const HormonalConditionLabels: Record<HormonalCondition, string> = {
  pcos: 'SOP (Ovário Policístico)',
  endometriosis: 'Endometriose',
  hypothyroidism: 'Hipotireoidismo',
  hashimoto: 'Tireoidite de Hashimoto',
  insulin_resistance: 'Resistência à insulina',
  intense_pms: 'TPM intensa',
  none: 'Nenhuma dessas',
};

export const HormoneTherapyLabels: Record<HormoneTherapy, string> = {
  none: 'Não uso',
  estrogen: 'Estrogênio',
  progesterone: 'Progesterona',
  testosterone: 'Testosterona',
  complete_hrt: 'THM completa (médica)',
  phytotherapy: 'Fitoterápicos (prímula, isoflavonas, etc.)',
};

export const MenopauseStatusLabels: Record<MenopauseStatus, string> = {
  none: 'Não se aplica',
  climacteric: 'Climatério (perimenopausa)',
  confirmed_menopause: 'Menopausa confirmada',
};

export const FemaleObjectiveLabels: Record<FemaleObjective, string> = {
  weight_loss: 'Emagrecer (hipocalórica)',
  muscle_gain: 'Ganhar massa magra (hipercalórica leve)',
  body_recomposition: 'Recomposição corporal',
  reduce_hormonal_symptoms: 'Reduzir sintomas hormonais',
  improve_energy: 'Melhorar energia e disposição',
  control_insulin_resistance: 'Controlar resistência à insulina / SOP',
};

export const ContraceptiveEffectLabels: Record<ContraceptiveEffect, string> = {
  weight_gain: 'Ganho de peso',
  libido_loss: 'Queda de libido',
  mood_changes: 'Alteração de humor',
  retention: 'Retenção',
  appetite_increase: 'Aumento de apetite',
  none: 'Nada disso',
};

export const MenopauseSymptomLabels: Record<MenopauseSymptom, string> = {
  hot_flashes: 'Ondas de calor',
  insomnia: 'Insônia',
  anxiety: 'Ansiedade',
  vaginal_dryness: 'Secura vaginal',
  abdominal_weight: 'Ganho de peso abdominal',
  muscle_loss: 'Perda de massa magra',
  fatigue: 'Fadiga',
  none: 'Nenhum desses',
};

export const GeneralSymptomFrequencyLabels: Record<GeneralSymptomFrequency, string> = {
  never: 'Nunca',
  sometimes: 'Às vezes',
  frequently: 'Frequentemente',
  always: 'Sempre',
};
