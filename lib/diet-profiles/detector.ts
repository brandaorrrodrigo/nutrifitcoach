// Tipos de perfis alimentares disponíveis
export const DIET_PROFILES = {
  FLEXITARIANA: {
    id: 'flexitariana',
    nome: 'Flexitariana',
    descricao: 'Alimentação balanceada com todas as opções',
    emoji: '🥗',
    permite: ['carnes', 'peixes', 'ovos', 'laticinios', 'vegetais', 'graos', 'leguminosas'],
    restricoes: [],
    macros_padrao: { proteina: 30, carboidrato: 40, gordura: 30 }
  },
  
  VEGETARIANA: {
    id: 'vegetariana',
    nome: 'Vegetariana',
    descricao: 'Sem carnes, mas com ovos e laticínios',
    emoji: '🥚',
    permite: ['ovos', 'laticinios', 'vegetais', 'graos', 'leguminosas', 'tofu', 'tempeh'],
    restricoes: ['carnes', 'peixes', 'frutos-do-mar'],
    macros_padrao: { proteina: 25, carboidrato: 45, gordura: 30 },
    suplementos_sugeridos: ['B12', 'Ferro', 'Omega-3 (algas)']
  },
  
  VEGANA: {
    id: 'vegana',
    nome: 'Vegana',
    descricao: 'Apenas alimentos de origem vegetal',
    emoji: '🌱',
    permite: ['vegetais', 'graos', 'leguminosas', 'tofu', 'tempeh', 'seitan', 'leites-vegetais'],
    restricoes: ['carnes', 'peixes', 'ovos', 'laticinios', 'mel', 'gelatina'],
    macros_padrao: { proteina: 20, carboidrato: 50, gordura: 30 },
    suplementos_obrigatorios: ['B12'],
    suplementos_sugeridos: ['Ferro', 'Omega-3 (algas)', 'Vitamina D', 'Zinco', 'Calcio']
  },
  
  CETOGENICA: {
    id: 'cetogenica',
    nome: 'Cetogênica',
    descricao: 'Muito baixo carboidrato, alta gordura',
    emoji: '🥑',
    permite: ['carnes', 'peixes', 'ovos', 'laticinios-gordos', 'vegetais-baixo-carb', 'gorduras-boas'],
    restricoes: ['graos', 'acucares', 'frutas-alto-carb', 'leguminosas', 'tuberculos'],
    macros_padrao: { proteina: 25, carboidrato: 5, gordura: 70 },
    carbs_max_dia: 50,
    monitoramento: ['cetonas', 'glicemia'],
    suplementos_sugeridos: ['Eletrolitos', 'Magnesio']
  },
  
  LOW_CARB: {
    id: 'low-carb',
    nome: 'Low Carb',
    descricao: 'Moderado em carboidratos',
    emoji: '🥩',
    permite: ['carnes', 'peixes', 'ovos', 'laticinios', 'vegetais', 'algumas-frutas'],
    restricoes: ['graos-refinados', 'acucares', 'massas'],
    macros_padrao: { proteina: 30, carboidrato: 20, gordura: 50 },
    carbs_max_dia: 100
  },
  
  PALEO: {
    id: 'paleo',
    nome: 'Paleo',
    descricao: 'Alimentos não processados, ancestrais',
    emoji: '🦴',
    permite: ['carnes', 'peixes', 'ovos', 'vegetais', 'frutas', 'oleaginosas', 'batata-doce'],
    restricoes: ['graos', 'laticinios', 'leguminosas', 'processados'],
    macros_padrao: { proteina: 30, carboidrato: 40, gordura: 30 }
  },
  
  MEDITERRANEA: {
    id: 'mediterranea',
    nome: 'Mediterrânea',
    descricao: 'Rica em azeite, peixes e vegetais',
    emoji: '🫒',
    permite: ['peixes', 'vegetais', 'frutas', 'azeite', 'graos-integrais', 'oleaginosas'],
    restricoes: ['carnes-vermelhas-excesso', 'processados', 'acucares'],
    macros_padrao: { proteina: 20, carboidrato: 45, gordura: 35 },
    enfase: ['azeite-extra-virgem', 'peixes-gordos', 'vegetais-coloridos']
  },
  
  DASH: {
    id: 'dash',
    nome: 'DASH (Hipertensão)',
    descricao: 'Focada em controle de pressão arterial',
    emoji: '❤️',
    permite: ['carnes-magras', 'peixes', 'vegetais', 'frutas', 'graos-integrais', 'laticinios-desnatados'],
    restricoes: ['sodio-alto', 'gorduras-saturadas', 'acucares'],
    macros_padrao: { proteina: 25, carboidrato: 50, gordura: 25 },
    sodio_max_dia: 1500, // mg
    enfase: ['potassio', 'magnesio', 'calcio']
  },
  
  PARA_DIABETES: {
    id: 'para-diabetes',
    nome: 'Para Diabetes',
    descricao: 'Controle glicêmico rigoroso',
    emoji: '📉',
    permite: ['carnes-magras', 'peixes', 'vegetais-baixo-ig', 'graos-integrais-moderado'],
    restricoes: ['acucares', 'carboidratos-refinados', 'frutas-alto-ig'],
    macros_padrao: { proteina: 30, carboidrato: 35, gordura: 35 },
    enfase: ['indice-glicemico-baixo', 'fibras', 'fracionamento-refeicoes']
  },
  
  GANHO_MASSA: {
    id: 'ganho-massa',
    nome: 'Ganho de Massa',
    descricao: 'Superávit calórico para hipertrofia',
    emoji: '💪',
    permite: ['todas-fontes-proteicas', 'carboidratos-complexos', 'gorduras-boas'],
    restricoes: [],
    macros_padrao: { proteina: 30, carboidrato: 45, gordura: 25 },
    calorias_extra: 300-500,
    enfase: ['proteina-alta', 'timing-nutricional', 'pos-treino']
  },
  
  EMAGRECIMENTO: {
    id: 'emagrecimento',
    nome: 'Emagrecimento',
    descricao: 'Déficit calórico sustentável',
    emoji: '📉',
    permite: ['proteinas-magras', 'vegetais', 'frutas-moderado', 'graos-integrais'],
    restricoes: ['acucares', 'gorduras-excessivas', 'processados'],
    macros_padrao: { proteina: 35, carboidrato: 35, gordura: 30 },
    deficit_calorico: 300-500,
    enfase: ['saciedade', 'densidade-nutricional', 'volume-refeicoes']
  }
};

// Função para detectar perfil baseado na anamnese
export function detectarPerfilAlimentar(anamnese: any) {
  const perfis_detectados: string[] = [];
  const score: Record<string, number> = {};
  
  // Inicializar scores
  Object.keys(DIET_PROFILES).forEach(key => {
    score[key] = 0;
  });
  
  // DETECÇÃO 1: Dietas específicas marcadas
  if (anamnese.dietasEspecificas) {
    if (anamnese.dietasEspecificas.includes('Vegana')) {
      score['VEGANA'] += 100;
      perfis_detectados.push('vegana');
    }
    if (anamnese.dietasEspecificas.includes('Vegetariana')) {
      score['VEGETARIANA'] += 100;
      perfis_detectados.push('vegetariana');
    }
    if (anamnese.dietasEspecificas.includes('Low Carb')) {
      score['LOW_CARB'] += 100;
      perfis_detectados.push('low-carb');
    }
    if (anamnese.dietasEspecificas.includes('Cetogênica')) {
      score['CETOGENICA'] += 100;
      perfis_detectados.push('cetogenica');
    }
    if (anamnese.dietasEspecificas.includes('Paleo')) {
      score['PALEO'] += 100;
      perfis_detectados.push('paleo');
    }
  }
  
  // DETECÇÃO 2: Restrições religiosas/culturais
  if (anamnese.restricoesReligiosas) {
    const restricoes = anamnese.restricoesReligiosas.toLowerCase();
    if (restricoes.includes('vegetarian') || restricoes.includes('não come carne')) {
      score['VEGETARIANA'] += 80;
    }
    if (restricoes.includes('vegan') || restricoes.includes('nada de origem animal')) {
      score['VEGANA'] += 80;
    }
  }
  
  // DETECÇÃO 3: Objetivo
  if (anamnese.objetivo) {
    if (anamnese.objetivo.includes('perda de peso') || anamnese.objetivo.includes('emagrecimento')) {
      score['EMAGRECIMENTO'] += 50;
    }
    if (anamnese.objetivo.includes('ganho de massa') || anamnese.objetivo.includes('hipertrofia')) {
      score['GANHO_MASSA'] += 50;
    }
  }
  
  // DETECÇÃO 4: Doenças pré-existentes
  if (anamnese.doencasPreExistentes) {
    if (anamnese.doencasPreExistentes.includes('Diabetes')) {
      score['PARA_DIABETES'] += 80;
      score['CETOGENICA'] += 40;
      score['LOW_CARB'] += 40;
    }
    if (anamnese.doencasPreExistentes.includes('Hipertensão')) {
      score['DASH'] += 80;
      score['MEDITERRANEA'] += 40;
    }
    if (anamnese.doencasPreExistentes.includes('Colesterol Alto')) {
      score['MEDITERRANEA'] += 60;
    }
  }
  
  // DETECÇÃO 5: Alimentos que não gosta
  if (anamnese.alimentosQueNaoGosta) {
    const naoGosta = anamnese.alimentosQueNaoGosta.toLowerCase();
    if (naoGosta.includes('carne') || naoGosta.includes('frango') || naoGosta.includes('peixe')) {
      score['VEGETARIANA'] += 60;
      score['VEGANA'] += 40;
    }
  }
  
  // DETECÇÃO 6: Alimentos que gosta (padrões)
  if (anamnese.alimentosQueGosta) {
    const gosta = anamnese.alimentosQueGosta.toLowerCase();
    if (gosta.includes('abacate') || gosta.includes('oleaginosas') || gosta.includes('azeite')) {
      score['CETOGENICA'] += 30;
      score['LOW_CARB'] += 20;
    }
    if (gosta.includes('legumes') || gosta.includes('verduras') || gosta.includes('salada')) {
      score['MEDITERRANEA'] += 20;
      score['DASH'] += 20;
    }
  }
  
  // DETECÇÃO 7: Intolerâncias
  if (anamnese.intolerancias) {
    const intolerancias = anamnese.intolerancias.toLowerCase();
    if (intolerancias.includes('lactose')) {
      score['VEGANA'] += 30;
      score['PALEO'] += 20;
    }
    if (intolerancias.includes('glúten') || intolerancias.includes('gluten')) {
      score['PALEO'] += 40;
    }
  }
  
  // Se nenhum perfil foi detectado explicitamente, usar FLEXITARIANA
  if (perfis_detectados.length === 0) {
    score['FLEXITARIANA'] = 100;
  }
  
  // Ordenar por score
  const perfisPorScore = Object.entries(score)
    .sort(([,a], [,b]) => b - a)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({ 
      perfil: key, 
      score: value,
      detalhes: DIET_PROFILES[key as keyof typeof DIET_PROFILES]
    }));
  
  return {
    perfil_principal: perfisPorScore[0],
    perfis_sugeridos: perfisPorScore.slice(0, 3),
    todos_scores: perfisPorScore
  };
}

// Função para validar compatibilidade entre perfis
export function validarCompatibilidade(perfil1: string, perfil2: string): boolean {
  const incompatibilidades = {
    'VEGANA': ['CETOGENICA', 'PALEO'],
    'VEGETARIANA': ['PALEO'],
    'CETOGENICA': ['VEGANA', 'MEDITERRANEA'],
    'PARA_DIABETES': ['GANHO_MASSA'] // Em alguns casos
  };
  
  return !incompatibilidades[perfil1]?.includes(perfil2);
}
