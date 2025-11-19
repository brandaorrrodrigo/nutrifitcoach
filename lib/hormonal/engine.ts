// ============================================
// NFC HORMONAL ENGINE - Classificação Automática
// Sistema de classificação hormonal baseado em respostas
// ============================================

import type {
  FemaleHormonalProfileData,
  HormonalProfileClassification,
  GeneralSymptomFrequency,
} from './types';

/**
 * Classifica automaticamente o perfil hormonal da usuária
 * com base nas respostas da anamnese feminina
 */
export function classifyHormonalProfile(
  data: FemaleHormonalProfileData
): HormonalProfileClassification {
  const {
    age,
    cycle_status,
    contraceptive_type,
    contraceptive_effects,
    hormonal_conditions,
    hormone_therapy,
    menopause_status,
    menopause_symptoms,
    general_symptoms,
    objective,
  } = data;

  // Inicializa o resultado
  let perfil_hormonal: HormonalProfileClassification['perfil_hormonal'] = 'ciclo_regular';
  let subperfil: HormonalProfileClassification['subperfil'] = null;
  const ajustes_nutricionais: string[] = [];
  const sensibilidades: string[] = [];
  const alertas: string[] = [];
  const pontos_criticos: string[] = [];

  // ==========================================
  // 1. CLASSIFICAÇÃO PRIMÁRIA
  // ==========================================

  // SOP tem prioridade máxima
  if (hormonal_conditions.includes('pcos')) {
    perfil_hormonal = 'SOP';
    ajustes_nutricionais.push(
      'Dieta low-carb com foco em controle glicêmico',
      'Aumentar fibras solúveis (aveia, linhaça, chia)',
      'Reduzir carboidratos de alto IG',
      'Incluir alimentos anti-inflamatórios',
      'Aumentar ômega-3 (peixes gordos, linhaça)'
    );
    sensibilidades.push(
      'Alta sensibilidade a carboidratos refinados',
      'Tendência a resistência à insulina',
      'Ganho de peso abdominal facilitado'
    );
    pontos_criticos.push(
      'Controlar carboidratos em todas as refeições',
      'Evitar jejuns prolongados sem acompanhamento',
      'Monitorar sinais de hipoglicemia reativa'
    );
  }
  // Resistência à insulina
  else if (hormonal_conditions.includes('insulin_resistance')) {
    perfil_hormonal = 'resistencia_insulina';
    ajustes_nutricionais.push(
      'Dieta low-carb moderada',
      'Priorizar carboidratos de baixo IG',
      'Aumentar proteínas e gorduras boas',
      'Incluir canela, vinagre de maçã antes das refeições'
    );
    sensibilidades.push(
      'Sensibilidade aumentada a carboidratos',
      'Tendência a ganho de peso',
      'Oscilações de energia pós-refeição'
    );
  }
  // Endometriose
  else if (hormonal_conditions.includes('endometriosis')) {
    perfil_hormonal = 'endometriose';
    ajustes_nutricionais.push(
      'Dieta anti-inflamatória intensa',
      'Reduzir alimentos pró-inflamatórios (glúten, laticínios, carne vermelha)',
      'Aumentar vegetais crucíferos (brócolis, couve)',
      'Incluir cúrcuma, gengibre, chá verde'
    );
    sensibilidades.push(
      'Alta sensibilidade a alimentos inflamatórios',
      'Possível intolerância a glúten e laticínios'
    );
    pontos_criticos.push(
      'Evitar alimentos que aumentam estrogênio',
      'Monitorar dor e inflamação sistêmica'
    );
  }
  // Hipotireoidismo
  else if (
    hormonal_conditions.includes('hypothyroidism') ||
    hormonal_conditions.includes('hashimoto')
  ) {
    perfil_hormonal = 'hipotireoidismo';
    ajustes_nutricionais.push(
      'Garantir selênio (castanhas do Pará)',
      'Incluir iodo (algas, peixes)',
      'Aumentar zinco e vitamina D',
      'Evitar excesso de crucíferas cruas',
      'Priorizar proteínas em todas as refeições'
    );
    sensibilidades.push(
      'Metabolismo mais lento',
      'Tendência a ganho de peso',
      'Sensibilidade ao frio'
    );
    pontos_criticos.push(
      'Não consumir crucíferas cruas em excesso',
      'Evitar jejuns muito longos',
      'Manter regularidade nas refeições'
    );
  }
  // Menopausa
  else if (menopause_status === 'confirmed_menopause') {
    perfil_hormonal = 'menopausa';

    // Subperfil térmico
    if (menopause_symptoms.includes('hot_flashes')) {
      subperfil = 'termico_alto';
      ajustes_nutricionais.push(
        'Reduzir alimentos termogênicos (café, pimenta)',
        'Aumentar hidratação',
        'Incluir isoflavonas (soja orgânica, grão-de-bico)'
      );
    }

    // Subperfil energético
    if (menopause_symptoms.includes('fatigue')) {
      subperfil = 'energetico_baixo';
      ajustes_nutricionais.push(
        'Aumentar vitaminas do complexo B',
        'Incluir magnésio (folhas verdes, cacau)',
        'Priorizar carboidratos de liberação lenta'
      );
    }

    ajustes_nutricionais.push(
      'Aumentar cálcio e vitamina D (saúde óssea)',
      'Incluir fitoestrogênios naturais',
      'Reduzir sal para controlar retenção',
      'Aumentar fibras para controle de peso'
    );

    sensibilidades.push(
      'Ganho de peso abdominal facilitado',
      'Perda de massa muscular acelerada',
      'Oscilações de humor relacionadas a alimentos'
    );

    pontos_criticos.push(
      'Manter proteína adequada (1.2-1.5g/kg)',
      'Evitar restrições calóricas muito agressivas',
      'Treino de força é essencial'
    );
  }
  // Climatério
  else if (menopause_status === 'climacteric') {
    perfil_hormonal = 'climaterio';
    ajustes_nutricionais.push(
      'Dieta equilibrada com foco em estabilidade hormonal',
      'Incluir fitoestrogênios (linhaça, soja)',
      'Aumentar cálcio e vitamina D',
      'Manter carboidratos moderados'
    );
    sensibilidades.push(
      'Oscilações hormonais podem afetar apetite',
      'Possível sensibilidade a carboidratos'
    );
  }
  // Anticoncepcional
  else if (contraceptive_type !== 'none' && contraceptive_type !== 'copper_iud') {
    perfil_hormonal = 'anticoncepcional';
    subperfil = 'estavel'; // Hormônios estáveis pelo AC

    ajustes_nutricionais.push(
      'Aumentar vitaminas do complexo B (depletadas pelo AC)',
      'Garantir magnésio e zinco',
      'Controlar retenção com redução de sódio',
      'Aumentar alimentos ricos em triptofano se houver alteração de humor'
    );

    if (contraceptive_effects.includes('retention')) {
      ajustes_nutricionais.push(
        'Reduzir sal e alimentos processados',
        'Aumentar potássio (banana, abacate, folhas verdes)',
        'Incluir diuréticos naturais (chá verde, hibisco)'
      );
    }

    if (contraceptive_effects.includes('appetite_increase')) {
      ajustes_nutricionais.push(
        'Aumentar fibras para saciedade',
        'Priorizar proteínas em todas as refeições',
        'Incluir gorduras boas (abacate, azeite)'
      );
    }

    sensibilidades.push('Retenção de líquidos aumentada', 'Possível aumento de apetite');
  }
  // Ciclo regular
  else if (cycle_status === 'regular_28_32') {
    perfil_hormonal = 'ciclo_regular';
    subperfil = 'fase_folicular'; // Padrão inicial, deve ser atualizado conforme o ciclo

    ajustes_nutricionais.push(
      'Adaptar carboidratos conforme fase do ciclo',
      'Fase folicular: carboidratos moderados',
      'Fase lútea: aumentar carboidratos complexos',
      'Pré-menstrual: aumentar magnésio e triptofano'
    );

    // Se tem TPM intensa
    if (hormonal_conditions.includes('intense_pms')) {
      subperfil = 'pms_intenso';
      ajustes_nutricionais.push(
        'Aumentar magnésio 7-10 dias antes da menstruação',
        'Incluir cálcio e vitamina B6',
        'Reduzir cafeína e sal na fase lútea',
        'Aumentar carboidratos complexos para controlar compulsão'
      );
      pontos_criticos.push(
        'Monitorar compulsão alimentar na fase lútea',
        'Não restringir carboidratos drasticamente no pré-menstrual'
      );
    }
  }
  // Ciclo irregular
  else if (cycle_status === 'irregular') {
    perfil_hormonal = 'ciclo_irregular';
    ajustes_nutricionais.push(
      'Dieta equilibrada para regulação hormonal',
      'Incluir gorduras boas (abacate, azeite, nuts)',
      'Garantir ingestão adequada de carboidratos (não restringir demais)',
      'Aumentar alimentos ricos em zinco e selênio'
    );
    sensibilidades.push('Oscilações hormonais imprevisíveis', 'Possível sensibilidade ao estresse');
    pontos_criticos.push('Não fazer dietas muito restritivas', 'Manter regularidade alimentar');
  }

  // ==========================================
  // 2. REPOSIÇÃO HORMONAL (TH/THM)
  // ==========================================
  if (hormone_therapy !== 'none') {
    perfil_hormonal = 'THM';
    ajustes_nutricionais.push(
      'Dieta de suporte à terapia hormonal',
      'Aumentar alimentos detoxificadores de estrogênio (crucíferas)',
      'Garantir fibras para eliminação hormonal',
      'Incluir antioxidantes (frutas vermelhas, cacau)'
    );
  }

  // ==========================================
  // 3. SINTOMAS GERAIS - ALERTAS E SENSIBILIDADES
  // ==========================================

  // Retenção frequente
  if (
    general_symptoms.bloating === 'frequently' ||
    general_symptoms.bloating === 'always'
  ) {
    alertas.push('Retenção líquida frequente - reduzir sódio e aumentar potássio');
    ajustes_nutricionais.push(
      'Reduzir drasticamente sal e processados',
      'Aumentar água e chás diuréticos'
    );
  }

  // Alterações de humor
  if (
    general_symptoms.mood_changes === 'frequently' ||
    general_symptoms.mood_changes === 'always'
  ) {
    alertas.push('Oscilações de humor frequentes - estabilizar glicemia');
    ajustes_nutricionais.push(
      'Evitar picos glicêmicos',
      'Aumentar triptofano (banana, aveia, cacau)',
      'Incluir magnésio e vitaminas B'
    );
    sensibilidades.push('Sensibilidade emocional a oscilações glicêmicas');
  }

  // Compulsão pré-menstrual
  if (
    general_symptoms.pms_cravings === 'frequently' ||
    general_symptoms.pms_cravings === 'always'
  ) {
    alertas.push('Compulsão pré-menstrual - aumentar carboidratos complexos na fase lútea');
    pontos_criticos.push('Não restringir carboidratos na TPM', 'Permitir chocolate amargo 70%');
  }

  // Fadiga extrema
  if (
    general_symptoms.extreme_fatigue === 'frequently' ||
    general_symptoms.extreme_fatigue === 'always'
  ) {
    alertas.push('Fadiga intensa - avaliar ferro, vitamina B12 e tireoide');
    ajustes_nutricionais.push(
      'Aumentar ferro heme (carnes magras)',
      'Incluir vitamina C para absorção de ferro',
      'Garantir vitaminas do complexo B'
    );
    pontos_criticos.push('Solicitar exames: hemograma, ferritina, B12, tireoide');
  }

  // Queda de libido
  if (
    general_symptoms.libido_loss === 'frequently' ||
    general_symptoms.libido_loss === 'always'
  ) {
    alertas.push('Queda de libido - pode estar relacionada a AC, estresse ou deficiências');
    ajustes_nutricionais.push(
      'Aumentar zinco (ostras, carne, sementes de abóbora)',
      'Incluir maca peruana (se aprovado pelo médico)',
      'Garantir gorduras boas (abacate, castanhas)'
    );
  }

  // ==========================================
  // 4. AJUSTES POR OBJETIVO
  // ==========================================

  if (objective === 'weight_loss') {
    ajustes_nutricionais.push(
      'Déficit calórico moderado (10-20%)',
      'Manter proteína alta (1.6-2g/kg)',
      'Priorizar alimentos de alta saciedade'
    );
  }

  if (objective === 'muscle_gain') {
    ajustes_nutricionais.push(
      'Superávit calórico leve (5-10%)',
      'Proteína elevada (1.8-2.2g/kg)',
      'Carboidratos pós-treino'
    );
  }

  if (objective === 'body_recomposition') {
    ajustes_nutricionais.push(
      'Calorias de manutenção',
      'Proteína muito alta (2-2.2g/kg)',
      'Ciclagem de carboidratos conforme treino'
    );
  }

  if (objective === 'reduce_hormonal_symptoms') {
    ajustes_nutricionais.push(
      'Dieta anti-inflamatória',
      'Eliminar alimentos processados',
      'Aumentar alimentos orgânicos',
      'Reduzir disruptores endócrinos (plásticos, panelas antiaderentes)'
    );
  }

  if (objective === 'improve_energy') {
    ajustes_nutricionais.push(
      'Carboidratos de liberação lenta',
      'Refeições regulares a cada 3-4h',
      'Aumentar magnésio, ferro e B12'
    );
  }

  if (objective === 'control_insulin_resistance') {
    ajustes_nutricionais.push(
      'Low-carb ou cetogênica (avaliar tolerância)',
      'Jejum intermitente 16:8 (se tolerado)',
      'Aumentar atividade física pós-refeições'
    );
  }

  // ==========================================
  // 5. RETORNO DO PERFIL CLASSIFICADO
  // ==========================================

  return {
    perfil_hormonal,
    subperfil,
    objetivo: objective,
    ajustes_nutricionais: [...new Set(ajustes_nutricionais)], // Remove duplicatas
    sensibilidades: [...new Set(sensibilidades)],
    alertas: [...new Set(alertas)],
    pontos_criticos: [...new Set(pontos_criticos)],
  };
}

/**
 * Determina a fase do ciclo menstrual baseada na data da última menstruação
 * (Esta função pode ser expandida futuramente para tracking contínuo)
 */
export function determineCyclePhase(lastPeriodDate: Date): string {
  const today = new Date();
  const daysSinceLastPeriod = Math.floor(
    (today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastPeriod <= 7) {
    return 'fase_menstrual';
  } else if (daysSinceLastPeriod <= 14) {
    return 'fase_folicular';
  } else if (daysSinceLastPeriod <= 16) {
    return 'fase_ovulatoria';
  } else if (daysSinceLastPeriod <= 28) {
    return 'fase_lutea';
  } else {
    return 'ciclo_atrasado'; // Ciclo pode estar atrasado
  }
}
