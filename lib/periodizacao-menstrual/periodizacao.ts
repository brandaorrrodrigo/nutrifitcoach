// Sistema de Periodização baseado no Ciclo Menstrual

export interface FaseMenstrual {
  nome: string;
  dias: [number, number]; // [inicio, fim]
  caracteristicas: string[];
  ajustes_nutricionais: {
    calorias: number; // % de ajuste
    carboidratos: number; // % de ajuste
    proteina: number; // % de ajuste
    gordura: number; // % de ajuste
  };
  ajustes_treino: {
    intensidade: 'baixa' | 'moderada' | 'alta' | 'muito-alta';
    volume: 'baixo' | 'moderado' | 'alto';
    foco: string;
  };
  suplementos_recomendados: string[];
  sintomas_comuns: string[];
  dicas: string[];
}

export const FASES_CICLO_MENSTRUAL: Record<string, FaseMenstrual> = {
  
  MENSTRUACAO: {
    nome: 'Menstruação',
    dias: [1, 5],
    caracteristicas: [
      'Sangramento',
      'Hormônios em baixa',
      'Energia reduzida',
      'Sensibilidade à insulina moderada'
    ],
    ajustes_nutricionais: {
      calorias: 0, // Manter
      carboidratos: 0, // Manter
      proteina: +5, // Aumentar 5%
      gordura: 0 // Manter
    },
    ajustes_treino: {
      intensidade: 'baixa',
      volume: 'baixo',
      foco: 'Mobilidade e treinos leves'
    },
    suplementos_recomendados: [
      'Ferro',
      'Vitamina C (absorção ferro)',
      'Magnésio',
      'Ômega-3'
    ],
    sintomas_comuns: [
      'Fadiga',
      'Cólicas',
      'Dores nas costas',
      'Inchaço'
    ],
    dicas: [
      '🩸 Ferro: Carnes vermelhas, feijão, espinafre',
      '💧 Hidrate-se bem (3L+ água)',
      '☕ Reduza cafeína se tiver cólicas',
      '🌶️ Gengibre e cúrcuma anti-inflamatórios',
      '🚫 Evite sal em excesso (inchaço)'
    ]
  },

  FOLICULAR: {
    nome: 'Fase Folicular',
    dias: [6, 13],
    caracteristicas: [
      'Estrogênio subindo',
      'Energia crescente',
      'Humor positivo',
      'MELHOR sensibilidade à insulina',
      'Janela anabólica ótima'
    ],
    ajustes_nutricionais: {
      calorias: +5, // Aumentar 5%
      carboidratos: +10, // Aumentar 10%
      proteina: +10, // Aumentar 10%
      gordura: -5 // Reduzir 5%
    },
    ajustes_treino: {
      intensidade: 'muito-alta',
      volume: 'alto',
      foco: 'FASE IDEAL PARA TREINOS PESADOS - Maximize hipertrofia!'
    },
    suplementos_recomendados: [
      'Creatina',
      'BCAA/EAA',
      'Beta-alanina',
      'Citrulina'
    ],
    sintomas_comuns: [
      'Alta energia',
      'Fome aumentada',
      'Libido alta',
      'Confiança'
    ],
    dicas: [
      '💪 MELHOR FASE! Treine PESADO!',
      '🍚 Carboidratos são seus amigos',
      '🥩 Alta proteína para hipertrofia',
      '⚡ Use pré-treinos aqui',
      '📈 É aqui que você evolui!',
      '🏋️ Aumente cargas e volume'
    ]
  },

  OVULATORIA: {
    nome: 'Fase Ovulatória',
    dias: [14, 16],
    caracteristicas: [
      'Estrogênio no PICO',
      'Testosterona também alta',
      'MÁXIMA energia e força',
      'Ótima sensibilidade à insulina',
      'Pico de performance'
    ],
    ajustes_nutricionais: {
      calorias: +10, // Aumentar 10%
      carboidratos: +15, // Aumentar 15%
      proteina: +10, // Aumentar 10%
      gordura: 0 // Manter
    },
    ajustes_treino: {
      intensidade: 'muito-alta',
      volume: 'muito-alto',
      foco: 'DIA DE QUEBRAR RECORDES! Máxima intensidade!'
    },
    suplementos_recomendados: [
      'Creatina (dose de ataque)',
      'Cafeína',
      'Beta-alanina',
      'BCAA'
    ],
    sintomas_comuns: [
      'Energia explosiva',
      'Fome intensa',
      'Alta confiança',
      'Libido máxima'
    ],
    dicas: [
      '🔥 PICO MÁXIMO! Bata seus PRs!',
      '🍽️ Coma BASTANTE - seu corpo precisa',
      '💥 Aproveite para treinos épicos',
      '⚡ Tente máximas de carga',
      '🎯 Foque em exercícios compostos',
      '📸 Tire fotos - você está no auge!'
    ]
  },

  LUTEA_INICIAL: {
    nome: 'Fase Lútea Inicial',
    dias: [17, 23],
    caracteristicas: [
      'Progesterona subindo',
      'Estrogênio caindo',
      'Energia ainda boa',
      'Sensibilidade à insulina começando a cair',
      'Metabolismo acelerado'
    ],
    ajustes_nutricionais: {
      calorias: +5, // Aumentar 5%
      carboidratos: 0, // Manter
      proteina: +5, // Aumentar 5%
      gordura: +10 // Aumentar 10% (termogênese)
    },
    ajustes_treino: {
      intensidade: 'alta',
      volume: 'moderado',
      foco: 'Manter intensidade mas reduzir volume'
    },
    suplementos_recomendados: [
      'Magnésio',
      'Vitamina B6',
      'Ômega-3',
      'L-teanina'
    ],
    sintomas_comuns: [
      'Leve queda de energia',
      'Fome aumentada',
      'Começando TPM'
    ],
    dicas: [
      '🔥 Metabolismo 5-10% mais rápido',
      '🥑 Gorduras boas são importantes',
      '💊 Comece magnésio agora',
      '😴 Priorize sono de qualidade',
      '🧘 Adicione yoga/alongamento'
    ]
  },

  LUTEA_TARDIA: {
    nome: 'Fase Lútea Tardia (TPM)',
    dias: [24, 28],
    caracteristicas: [
      'Progesterona caindo',
      'TPM intensifica',
      'Energia baixa',
      'PIOR sensibilidade à insulina',
      'Retenção de líquidos',
      'Compulsão alimentar'
    ],
    ajustes_nutricionais: {
      calorias: 0, // Manter (resistir compulsão)
      carboidratos: -10, // Reduzir 10% (insulina ruim)
      proteina: +10, // Aumentar 10% (saciedade)
      gordura: +5 // Aumentar 5%
    },
    ajustes_treino: {
      intensidade: 'moderada',
      volume: 'baixo',
      foco: 'Treinos de manutenção, não force'
    },
    suplementos_recomendados: [
      'Magnésio (400mg)',
      'Vitamina B6',
      'Vitex Agnus-castus',
      'Ômega-3',
      '5-HTP (humor)',
      'Chá de camomila'
    ],
    sintomas_comuns: [
      'Irritabilidade',
      'Ansiedade',
      'Fadiga',
      'Inchaço',
      'Compulsão por doces',
      'Insônia',
      'Acne'
    ],
    dicas: [
      '🚫 NÃO faça dieta restritiva agora',
      '🍫 Permita chocolates (70%+ cacau)',
      '💧 Beba MUITA água (3.5L+)',
      '🧘 Yoga, caminhada, pilates',
      '😴 Durma 8-9h',
      '🚫 Reduza cafeína',
      '🧂 Evite sódio (inchaço)',
      '🌿 Chás calmantes à noite',
      '💆 Relaxe - é temporário!'
    ]
  }
};

// Calcular em que fase a usuária está
export function calcularFaseAtual(
  dataUltimaMenstruacao: Date,
  duracaoCiclo: number = 28
): { fase: string; diaAtual: number; diasRestantes: number } {
  
  const hoje = new Date();
  const diffTime = hoje.getTime() - dataUltimaMenstruacao.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diaAtual = (diffDays % duracaoCiclo) + 1;

  let faseAtual = 'MENSTRUACAO';

  for (const [key, fase] of Object.entries(FASES_CICLO_MENSTRUAL)) {
    if (diaAtual >= fase.dias[0] && diaAtual <= fase.dias[1]) {
      faseAtual = key;
      break;
    }
  }

  const fase = FASES_CICLO_MENSTRUAL[faseAtual];
  const diasRestantes = fase.dias[1] - diaAtual + 1;

  return {
    fase: faseAtual,
    diaAtual,
    diasRestantes
  };
}

// Ajustar cardápio baseado na fase menstrual
export function ajustarCardapioPorFase(
  cardapioBase: any,
  fase: FaseMenstrual
): any {
  
  const ajustes = fase.ajustes_nutricionais;
  
  // Calcular fatores de ajuste
  const fatorCalorias = 1 + (ajustes.calorias / 100);
  const fatorCarbs = 1 + (ajustes.carboidratos / 100);
  const fatorProteina = 1 + (ajustes.proteina / 100);
  const fatorGordura = 1 + (ajustes.gordura / 100);
  
  // Ajustar refeições
  const refeicoesAjustadas = cardapioBase.refeicoes.map((refeicao: any) => {
    const alimentosAjustados = refeicao.alimentos.map((alimento: any) => {
      
      let novasCalorias = alimento.calorias * fatorCalorias;
      let novosCarbs = alimento.carboidrato * fatorCarbs;
      let novaProteina = alimento.proteina * fatorProteina;
      let novaGordura = alimento.gordura * fatorGordura;
      
      return {
        ...alimento,
        calorias: Math.round(novasCalorias),
        carboidrato: Math.round(novosCarbs * 10) / 10,
        proteina: Math.round(novaProteina * 10) / 10,
        gordura: Math.round(novaGordura * 10) / 10
      };
    });
    
    const macros = alimentosAjustados.reduce((acc: any, alimento: any) => ({
      calorias: acc.calorias + alimento.calorias,
      proteina: acc.proteina + alimento.proteina,
      carboidrato: acc.carboidrato + alimento.carboidrato,
      gordura: acc.gordura + alimento.gordura
    }), { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 });
    
    return {
      ...refeicao,
      alimentos: alimentosAjustados,
      macros
    };
  });
  
  return {
    ...cardapioBase,
    refeicoes: refeicoesAjustadas,
    fase_menstrual: {
      nome: fase.nome,
      ajustes: ajustes,
      dicas: fase.dicas,
      treino: fase.ajustes_treino,
      suplementos: fase.suplementos_recomendados
    }
  };
}
