// Cetogênica Cíclica (CKD) - Protocolo Dan Duchaine

export interface ProtocoloCKD {
  nome: string;
  descricao: string;
  criador: string;
  objetivo: string;
  fase_cetogenica: {
    duracao_dias: number;
    macros: {
      proteina_g_kg: number;
      carboidratos_g_dia: number;
      gordura_percentual: number;
    };
    calorias_ajuste: number;
    refeicoes_sugeridas: number;
    suplementos: string[];
    dicas: string[];
  };
  fase_depleção: {
    quando: string;
    tipo_treino: string;
    series_rep: string;
    objetivo_treino: string;
    duracao_minutos: number;
    intensidade: string;
  };
  fase_recarga: {
    duracao_horas: number;
    inicio: string;
    macros: {
      proteina_g_kg: number;
      carboidratos_g_kg: number;
      gordura_minima: boolean;
    };
    tipo_carboidratos: string[];
    timing: {
      primeiras_24h: string;
      ultimas_12h: string;
    };
    suplementos: string[];
    cuidados: string[];
  };
  fase_transicao: {
    duracao_horas: number;
    macros: {
      proteina_g_kg: number;
      carboidratos_g_kg: number;
      gordura_percentual: number;
    };
    objetivo: string;
  };
}

export const PROTOCOLO_CKD_DUCHAINE: ProtocoloCKD = {
  nome: 'Cetogênica Cíclica (CKD)',
  descricao: 'Protocolo avançado de 5 dias keto + 2 dias carb-up para máxima definição mantendo massa muscular',
  criador: 'Dan Duchaine (Underground Steroid Handbook)',
  objetivo: 'Perda máxima de gordura + Preservação/Ganho de massa magra',
  
  fase_cetogenica: {
    duracao_dias: 5, // Segunda a Sexta
    macros: {
      proteina_g_kg: 2.2, // Alta para preservar músculo
      carboidratos_g_dia: 30, // MUITO baixo
      gordura_percentual: 60-65 // Resto das calorias
    },
    calorias_ajuste: -300, // Déficit moderado
    refeicoes_sugeridas: 4-5,
    suplementos: [
      'Eletrólitos (sódio, potássio, magnésio)',
      'MCT Oil',
      'Creatina',
      'Cafeína',
      'BCAA (treinos)',
      'Multivitamínico',
      'Ômega-3'
    ],
    dicas: [
      '🥑 Gorduras boas: Azeite, abacate, oleaginosas',
      '🥩 Proteínas: Carne, frango, peixe, ovos',
      '🥦 Vegetais baixo carb: Brócolis, espinafre, couve',
      '💧 4L+ água/dia',
      '🧂 NÃO tenha medo do sal',
      '☕ Café e chá verde à vontade',
      '⏰ Timing de proteína importante',
      '💪 Treinos mais leves nesta fase'
    ]
  },
  
  fase_depleção: {
    quando: 'Sexta-feira à noite (antes da recarga)',
    tipo_treino: 'DEPLEÇÃO DE GLICOGÊNIO - Full Body',
    series_rep: '3-4 séries x 12-15 reps',
    objetivo_treino: 'Esvaziar completamente estoques de glicogênio muscular',
    duracao_minutos: 60-90,
    intensidade: 'Moderada a Alta (não até a falha)',
    
    protocolo_treino: [
      {
        grupo: 'PERNAS',
        exercicios: [
          'Agachamento - 4x15',
          'Leg Press - 3x15',
          'Cadeira Extensora - 3x15',
          'Mesa Flexora - 3x15',
          'Panturrilha - 4x20'
        ]
      },
      {
        grupo: 'PEITO',
        exercicios: [
          'Supino Reto - 3x15',
          'Supino Inclinado - 3x12',
          'Crucifixo - 3x15'
        ]
      },
      {
        grupo: 'COSTAS',
        exercicios: [
          'Barra Fixa - 3x12',
          'Remada Curvada - 3x15',
          'Pulldown - 3x15'
        ]
      },
      {
        grupo: 'OMBROS',
        exercicios: [
          'Desenvolvimento - 3x12',
          'Elevação Lateral - 3x15'
        ]
      },
      {
        grupo: 'BRAÇOS',
        exercicios: [
          'Rosca Direta - 3x15',
          'Tríceps Testa - 3x15'
        ]
      }
    ],
    
    observacoes: [
      '⚠️ NÃO vá até a falha',
      '⏱️ Descanso curto (30-45s)',
      '🎯 Objetivo: VOLUME, não intensidade',
      '💪 Você vai sentir os músculos "vazios"',
      '🔥 Última refeição antes: 2-3h antes',
      '💧 Hidrate MUITO durante'
    ]
  },
  
  fase_recarga: {
    duracao_horas: 36, // Sábado 18h até Segunda 6h
    inicio: 'Sexta após treino de depleção',
    
    macros: {
      proteina_g_kg: 1.5, // REDUZIR proteína
      carboidratos_g_kg: 10-12, // MUITO ALTO
      gordura_minima: true // < 50g nas primeiras 24h
    },
    
    tipo_carboidratos: [
      '✅ PRIMEIRAS 24H (Sáb 18h - Dom 18h):',
      '- Arroz branco',
      '- Batata',
      '- Pão branco',
      '- Massas',
      '- Cereais',
      '- Frutas (banana, manga)',
      '- Mel',
      '- Maltodextrina',
      '',
      '✅ ÚLTIMAS 12H (Dom 18h - Seg 6h):',
      '- Carboidratos complexos',
      '- Aveia',
      '- Arroz integral',
      '- Batata doce',
      '- Frutas com fibra'
    ],
    
    timing: {
      primeiras_24h: 'CARBOIDRATOS SIMPLES + ALTA GLICÊMICO',
      ultimas_12h: 'CARBOIDRATOS COMPLEXOS + BAIXO GLICÊMICO'
    },
    
    calendario_detalhado: [
      {
        periodo: 'Sexta 21h - Primeira Refeição',
        macros: 'Alta carb + Proteína moderada + Gordura ZERO',
        exemplos: 'Arroz branco 200g + Peito frango 150g + Mel 2 colheres',
        objetivo: 'Spike de insulina inicial'
      },
      {
        periodo: 'Sexta 23h30 - Segunda Refeição',
        macros: 'Alta carb + Proteína + Mínima gordura',
        exemplos: 'Macarrão 200g + Frango 100g + Molho tomate',
        objetivo: 'Continuar reposição'
      },
      {
        periodo: 'Sábado Manhã (8h)',
        macros: 'Carb alto IG',
        exemplos: 'Panquecas + Mel + Banana + Whey',
        objetivo: 'Manter insulina alta'
      },
      {
        periodo: 'Sábado Almoço (12h)',
        macros: 'Carb moderado + Proteína',
        exemplos: 'Arroz 250g + Carne magra 150g + Feijão',
        objetivo: 'Refeição completa'
      },
      {
        periodo: 'Sábado Lanche (16h)',
        macros: 'Carb + Proteína',
        exemplos: 'Pão branco + Geleia + Whey',
        objetivo: 'Manter fluxo'
      },
      {
        periodo: 'Sábado Jantar (20h)',
        macros: 'Carb + Proteína',
        exemplos: 'Batata 300g + Frango 150g',
        objetivo: 'Última grande refeição'
      },
      {
        periodo: 'Domingo Manhã (8h)',
        macros: 'Começar carbs complexos',
        exemplos: 'Aveia 100g + Banana + Mel',
        objetivo: 'Transição para complexos'
      },
      {
        periodo: 'Domingo Almoço (12h)',
        macros: 'Carb complexo + Proteína',
        exemplos: 'Arroz integral + Carne + Batata doce',
        objetivo: 'Finalizar recarga'
      },
      {
        periodo: 'Domingo Tarde (18h)',
        macros: 'Última carb - Complexo',
        exemplos: 'Batata doce 200g + Frango',
        objetivo: 'Preparar volta keto'
      }
    ],
    
    suplementos: [
      'Creatina (5g com primeira refeição)',
      'Multivitamínico',
      'Whey Protein',
      'Maltodextrina (opcional - primeiras refeições)',
      'BCAA (entre refeições)',
      'Cafeína (manhã)'
    ],
    
    cuidados: [
      '⚠️ NÃO coma gordura nas primeiras 24h',
      '⚠️ Gordura BLOQUEIA absorção de carbs',
      '💧 Beba muita água',
      '🚫 ZERO álcool',
      '🚫 ZERO frituras',
      '⏰ Coma a cada 2-3 horas',
      '📊 Você vai INCHAR - é normal',
      '💪 Músculos vão ficar CHEIOS',
      '⚖️ Vai ganhar 2-4kg - é água e glicogênio',
      '😴 Durma bem no sábado'
    ]
  },
  
  fase_transicao: {
    duracao_horas: 12, // Domingo noite até Segunda manhã
    macros: {
      proteina_g_kg: 2.0,
      carboidratos_g_kg: 2-3, // Reduzindo
      gordura_percentual: 30
    },
    objetivo: 'Transição suave de volta para cetose',
    dicas: [
      '🔄 Voltar gradualmente para keto',
      '🥑 Reintroduzir gorduras boas',
      '📉 Reduzir carboidratos progressivamente',
      '⏰ Segunda de manhã: voltar para < 30g carbs'
    ]
  }
};

// Semana completa CKD
export const SEMANA_CKD_COMPLETA = [
  {
    dia: 'Segunda-feira',
    fase: 'CETOGÊNICA ESTRITA',
    treino: 'Peito + Tríceps (moderado)',
    macros: 'P: 2.2g/kg | C: <30g | G: 60-65%',
    calorias: 'Déficit -300 kcal',
    foco: 'Entrar/manter cetose'
  },
  {
    dia: 'Terça-feira',
    fase: 'CETOGÊNICA ESTRITA',
    treino: 'Costas + Bíceps (moderado)',
    macros: 'P: 2.2g/kg | C: <30g | G: 60-65%',
    calorias: 'Déficit -300 kcal',
    foco: 'Cetose profunda'
  },
  {
    dia: 'Quarta-feira',
    fase: 'CETOGÊNICA ESTRITA',
    treino: 'Pernas (moderado)',
    macros: 'P: 2.2g/kg | C: <30g | G: 60-65%',
    calorias: 'Déficit -300 kcal',
    foco: 'Cetose'
  },
  {
    dia: 'Quinta-feira',
    fase: 'CETOGÊNICA ESTRITA',
    treino: 'Ombros + Abs (leve)',
    macros: 'P: 2.2g/kg | C: <30g | G: 60-65%',
    calorias: 'Déficit -300 kcal',
    foco: 'Cetose'
  },
  {
    dia: 'Sexta-feira',
    fase: 'CETOGÊNICA + DEPLEÇÃO',
    treino: 'FULL BODY DEPLEÇÃO (21h)',
    macros: 'P: 2.2g/kg | C: <30g | G: 60-65%',
    calorias: 'Manutenção',
    foco: 'Esvaziar glicogênio muscular'
  },
  {
    dia: 'Sábado',
    fase: 'RECARGA - FASE 1',
    treino: 'OFF ou Cardio Leve',
    macros: 'P: 1.5g/kg | C: 10-12g/kg | G: <50g',
    calorias: 'ALTA (+500-800)',
    foco: 'CARBOIDRATOS SIMPLES - Encher músculos'
  },
  {
    dia: 'Domingo',
    fase: 'RECARGA - FASE 2',
    treino: 'OFF',
    macros: 'P: 1.5g/kg | C: 8-10g/kg | G: <50g',
    calorias: 'ALTA (+500-800)',
    foco: 'CARBOIDRATOS COMPLEXOS - Finalizar recarga'
  }
];

// Cardápio exemplo Segunda (Cetogênica)
export const CARDAPIO_SEGUNDA_CKD = {
  dia: 'Segunda-feira - Cetogênica Estrita',
  calorias_totais: 2000,
  macros: {
    proteina: 180, // 2.2g x 80kg
    carboidratos: 25,
    gordura: 145
  },
  
  refeicoes: [
    {
      horario: '07:00',
      nome: 'Café da Manhã',
      alimentos: [
        { nome: 'Ovos inteiros', qtd: '4 unidades', calorias: 280, p: 24, c: 2, g: 20 },
        { nome: 'Abacate', qtd: '1/2 unidade', calorias: 120, p: 1.5, c: 6, g: 11 },
        { nome: 'Queijo', qtd: '30g', calorias: 110, p: 7, c: 1, g: 9 },
        { nome: 'Café com manteiga', qtd: '1 xícara', calorias: 100, p: 0, c: 0, g: 11 }
      ]
    },
    {
      horario: '10:30',
      nome: 'Lanche Manhã',
      alimentos: [
        { nome: 'Castanhas', qtd: '30g', calorias: 195, p: 6, c: 4.5, g: 18 },
        { nome: 'Whey Protein', qtd: '30g', calorias: 120, p: 24, c: 3, g: 1.5 }
      ]
    },
    {
      horario: '13:00',
      nome: 'Almoço',
      alimentos: [
        { nome: 'Frango grelhado', qtd: '200g', calorias: 330, p: 62, c: 0, g: 7 },
        { nome: 'Brócolis', qtd: '150g', calorias: 50, p: 4, c: 10, g: 0.6 },
        { nome: 'Azeite extra virgem', qtd: '2 colheres', calorias: 240, p: 0, c: 0, g: 28 },
        { nome: 'Salada verde', qtd: '100g', calorias: 25, p: 1.5, c: 5, g: 0.2 }
      ]
    },
    {
      horario: '16:30',
      nome: 'Lanche Tarde',
      alimentos: [
        { nome: 'Whey com MCT', qtd: '30g + 1 colher', calorias: 230, p: 24, c: 3, g: 14 }
      ]
    },
    {
      horario: '20:00',
      nome: 'Jantar',
      alimentos: [
        { nome: 'Salmão', qtd: '200g', calorias: 360, p: 40, c: 0, g: 22 },
        { nome: 'Aspargos', qtd: '150g', calorias: 30, p: 3, c: 6, g: 0.2 },
        { nome: 'Manteiga', qtd: '1 colher', calorias: 100, p: 0, c: 0, g: 11 }
      ]
    }
  ]
};

// Cardápio exemplo Sábado (Recarga Fase 1)
export const CARDAPIO_SABADO_RECARGA = {
  dia: 'Sábado - RECARGA (Primeiras 24h)',
  calorias_totais: 3500,
  macros: {
    proteina: 150,
    carboidratos: 700, // 10g x 70kg = 700g
    gordura: 40
  },
  
  observacao: '⚠️ GORDURA MÍNIMA NAS PRIMEIRAS 24H!',
  
  refeicoes: [
    {
      horario: '08:00',
      nome: 'Café da Manhã',
      alimentos: [
        { nome: 'Panquecas (farinha branca)', qtd: '4 unidades', calorias: 400, p: 12, c: 80, g: 4 },
        { nome: 'Mel', qtd: '4 colheres', calorias: 256, p: 0, c: 68, g: 0 },
        { nome: 'Banana', qtd: '2 unidades', calorias: 210, p: 2, c: 54, g: 0.8 },
        { nome: 'Whey Protein', qtd: '30g', calorias: 120, p: 24, c: 3, g: 1.5 }
      ]
    },
    {
      horario: '11:00',
      nome: 'Lanche Manhã',
      alimentos: [
        { nome: 'Pão branco', qtd: '4 fatias', calorias: 280, p: 12, c: 52, g: 4 },
        { nome: 'Geleia', qtd: '4 colheres', calorias: 200, p: 0, c: 52, g: 0 },
        { nome: 'Peito peru', qtd: '100g', calorias: 110, p: 24, c: 2, g: 1 }
      ]
    },
    {
      horario: '13:30',
      nome: 'Almoço',
      alimentos: [
        { nome: 'Arroz branco', qtd: '300g cozido', calorias: 390, p: 8, c: 86, g: 0.6 },
        { nome: 'Frango grelhado', qtd: '200g', calorias: 330, p: 62, c: 0, g: 7 },
        { nome: 'Feijão', qtd: '100g', calorias: 130, p: 9, c: 24, g: 0.5 }
      ]
    },
    {
      horario: '16:00',
      nome: 'Lanche Tarde',
      alimentos: [
        { nome: 'Batata inglesa', qtd: '300g', calorias: 240, p: 6, c: 54, g: 0.3 },
        { nome: 'Frango desfiado', qtd: '100g', calorias: 165, p: 31, c: 0, g: 3.6 }
      ]
    },
    {
      horario: '19:00',
      nome: 'Jantar',
      alimentos: [
        { nome: 'Macarrão', qtd: '200g', calorias: 310, p: 11, c: 62, g: 1.8 },
        { nome: 'Molho tomate (light)', qtd: '150g', calorias: 60, p: 2, c: 12, g: 0.5 },
        { nome: 'Carne moída magra', qtd: '150g', calorias: 240, p: 36, c: 0, g: 10 }
      ]
    },
    {
      horario: '21:30',
      nome: 'Ceia',
      alimentos: [
        { nome: 'Cereais', qtd: '100g', calorias: 380, p: 8, c: 84, g: 2 },
        { nome: 'Leite desnatado', qtd: '300ml', calorias: 102, p: 10, c: 15, g: 0.3 },
        { nome: 'Banana', qtd: '1 unidade', calorias: 105, p: 1, c: 27, g: 0.4 }
      ]
    }
  ]
};

// Função para gerar cardápio CKD completo da semana
export function gerarCardapioCKDSemana(peso: number, objetivo: string) {
  // Implementar lógica de geração
  return {
    segunda_a_sexta: CARDAPIO_SEGUNDA_CKD,
    sabado: CARDAPIO_SABADO_RECARGA,
    domingo: CARDAPIO_SABADO_RECARGA // Similar mas carbs complexos
  };
}
