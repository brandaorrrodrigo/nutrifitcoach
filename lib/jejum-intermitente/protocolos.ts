// Sistema Completo de Jejum Intermitente

export interface ProtocoloJejum {
  id: string;
  nome: string;
  descricao: string;
  nivel_dificuldade: 'iniciante' | 'intermediario' | 'avancado' | 'extremo';
  horas_jejum: number;
  horas_alimentacao: number;
  horario_sugerido_inicio: string;
  horario_sugerido_fim: string;
  refeicoes_sugeridas: number;
  para_quem: string[];
  beneficios: string[];
  cuidados: string[];
  contraindicacoes: string[];
  dicas_sucesso: string[];
  fases_jejum: {
    horas: string;
    nome: string;
    o_que_acontece: string;
    beneficio: string;
  }[];
}

export const PROTOCOLOS_JEJUM: Record<string, ProtocoloJejum> = {
  
  INICIANTE_12_12: {
    id: 'iniciante_12_12',
    nome: '12/12 - Iniciante',
    descricao: '12 horas de jejum, 12 horas de alimentação',
    nivel_dificuldade: 'iniciante',
    horas_jejum: 12,
    horas_alimentacao: 12,
    horario_sugerido_inicio: '20:00',
    horario_sugerido_fim: '08:00',
    refeicoes_sugeridas: 3,
    para_quem: [
      'Nunca fez jejum antes',
      'Quer começar devagar',
      'Tem medo de passar fome',
      'Mulheres iniciantes'
    ],
    beneficios: [
      '✅ Transição suave',
      '✅ Sem fome extrema',
      '✅ Adaptação do corpo',
      '✅ Melhora digestão',
      '✅ Regula sono'
    ],
    cuidados: [
      'Não pule café da manhã bruscamente',
      'Hidrate-se bem',
      'Ouça seu corpo'
    ],
    contraindicacoes: [
      'Gravidez',
      'Amamentação',
      'Diabetes tipo 1 (sem acompanhamento)',
      'Histórico de transtornos alimentares'
    ],
    dicas_sucesso: [
      '🌙 Jante às 20h, café às 8h',
      '💧 Água, chá e café sem açúcar permitidos',
      '😴 Use o sono a seu favor (8h dormindo)',
      '📅 Faça por 2 semanas antes de avançar'
    ],
    fases_jejum: [
      {
        horas: '0-4h',
        nome: 'Digestão',
        o_que_acontece: 'Corpo ainda digerindo última refeição',
        beneficio: 'Sistema digestivo descansa'
      },
      {
        horas: '4-8h',
        nome: 'Glicogênio',
        o_que_acontece: 'Corpo usando glicogênio do fígado',
        beneficio: 'Açúcar no sangue estabiliza'
      },
      {
        horas: '8-12h',
        nome: 'Cetose Leve',
        o_que_acontece: 'Começa a queimar gordura',
        beneficio: 'Início da queima de gordura'
      }
    ]
  },

  PADRAO_16_8: {
    id: 'padrao_16_8',
    nome: '16/8 - Padrão (Leangains)',
    descricao: '16 horas de jejum, 8 horas de alimentação',
    nivel_dificuldade: 'intermediario',
    horas_jejum: 16,
    horas_alimentacao: 8,
    horario_sugerido_inicio: '20:00',
    horario_sugerido_fim: '12:00',
    refeicoes_sugeridas: 2-3,
    para_quem: [
      'Já fez 12/12 por 2+ semanas',
      'Busca perda de gordura',
      'Quer ganhar massa magra',
      'Pratica musculação',
      'Protocolo mais popular'
    ],
    beneficios: [
      '✅ MUITO eficaz para emagrecimento',
      '✅ Preserva massa muscular',
      '✅ Aumenta HGH (hormônio do crescimento)',
      '✅ Melhora sensibilidade à insulina',
      '✅ Autofagia celular',
      '✅ Clareza mental',
      '✅ Praticável no dia a dia'
    ],
    cuidados: [
      'Primeira refeição equilibrada',
      'Não exagerar na janela alimentar',
      'Manter ingestão calórica adequada',
      'Treinar perto da janela alimentar'
    ],
    contraindicacoes: [
      'Gravidez e amamentação',
      'Menores de 18 anos',
      'Diabetes tipo 1',
      'Histórico de anorexia/bulimia',
      'Baixo peso (IMC < 18.5)'
    ],
    dicas_sucesso: [
      '☕ Café preto pela manhã OK',
      '💪 Treine em jejum ou pré-quebra',
      '🍽️ 1ª refeição: 12h | 2ª: 16h | 3ª: 19h30',
      '⏰ Consistência > Perfeição',
      '📊 Combine com treino de força',
      '🥗 Priorize proteína na 1ª refeição'
    ],
    fases_jejum: [
      {
        horas: '0-4h',
        nome: 'Digestão',
        o_que_acontece: 'Digestão da última refeição',
        beneficio: 'Descanso digestivo'
      },
      {
        horas: '4-8h',
        nome: 'Glicogênio',
        o_que_acontece: 'Queimando glicogênio',
        beneficio: 'Estabilização glicêmica'
      },
      {
        horas: '8-12h',
        nome: 'Cetose',
        o_que_acontece: 'Entrando em cetose',
        beneficio: 'Queima de gordura acelera'
      },
      {
        horas: '12-16h',
        nome: 'Autofagia',
        o_que_acontece: 'Limpeza celular',
        beneficio: 'Reciclagem de células danificadas'
      }
    ]
  },

  AVANCADO_18_6: {
    id: 'avancado_18_6',
    nome: '18/6 - Avançado',
    descricao: '18 horas de jejum, 6 horas de alimentação',
    nivel_dificuldade: 'avancado',
    horas_jejum: 18,
    horas_alimentacao: 6,
    horario_sugerido_inicio: '20:00',
    horario_sugerido_fim: '14:00',
    refeicoes_sugeridas: 2,
    para_quem: [
      'Dominou o 16/8',
      'Busca emagrecimento acelerado',
      'Quer máxima autofagia',
      'Objetivos estéticos agressivos'
    ],
    beneficios: [
      '✅ Perda de gordura MUITO acelerada',
      '✅ Autofagia intensa',
      '✅ HGH ainda mais elevado',
      '✅ Clareza mental máxima',
      '✅ Produtividade aumentada',
      '✅ Inflamação reduzida'
    ],
    cuidados: [
      'NÃO fazer todos os dias (4-5x/semana)',
      'Garantir calorias suficientes',
      'Não combinar com déficit extremo',
      'Suplementar se necessário'
    ],
    contraindicacoes: [
      'Todas as anteriores +',
      'Primeira vez com jejum',
      'Mulheres com ciclo irregular',
      'Atletas de alta performance'
    ],
    dicas_sucesso: [
      '⚡ Intercale com 16/8',
      '🏋️ Treine em jejum (adaptados)',
      '🍽️ 2 refeições grandes e nutritivas',
      '💊 BCAA antes do treino pode ajudar',
      '📅 Faça 4-5x/semana, não 7 dias'
    ],
    fases_jejum: [
      {
        horas: '0-8h',
        nome: 'Digestão e Glicogênio',
        o_que_acontece: 'Digestão e queima de glicogênio',
        beneficio: 'Preparação metabólica'
      },
      {
        horas: '8-16h',
        nome: 'Cetose Profunda',
        o_que_acontece: 'Cetose estabelecida',
        beneficio: 'Máxima queima de gordura'
      },
      {
        horas: '16-18h',
        nome: 'Autofagia Intensa',
        o_que_acontece: 'Limpeza celular profunda',
        beneficio: 'Renovação celular otimizada'
      }
    ]
  },

  GUERREIRO_20_4: {
    id: 'guerreiro_20_4',
    nome: '20/4 - Dieta do Guerreiro',
    descricao: '20 horas de jejum, 4 horas de alimentação',
    nivel_dificuldade: 'extremo',
    horas_jejum: 20,
    horas_alimentacao: 4,
    horario_sugerido_inicio: '20:00',
    horario_sugerido_fim: '16:00',
    refeicoes_sugeridas: 1-2,
    para_quem: [
      'Muito experiente com jejum',
      'Cutting extremo',
      'Preparação para competição',
      'Busca desafio mental'
    ],
    beneficios: [
      '✅ Perda de gordura EXTREMA',
      '✅ Autofagia máxima',
      '✅ HGH 5x mais alto',
      '✅ Foco mental intenso',
      '✅ Economia de tempo',
      '✅ Desintoxicação profunda'
    ],
    cuidados: [
      '⚠️ APENAS 2-3x por semana',
      '⚠️ NÃO para iniciantes',
      '⚠️ Monitorar energia',
      '⚠️ Garantir calorias na janela',
      '⚠️ Pode afetar hormônios femininos'
    ],
    contraindicacoes: [
      'Todas as anteriores +',
      'Primeira vez com jejum (NUNCA)',
      'Mulheres (muito cuidado)',
      'Trabalho físico pesado',
      'Menos de 6 meses de experiência'
    ],
    dicas_sucesso: [
      '⚠️ NÃO faça diariamente',
      '🍽️ Refeição gigante e completa',
      '💊 Suplementos essenciais',
      '🏋️ Treino mais leve nos dias de 20/4',
      '📅 Alterne com protocolos mais suaves',
      '🧘 Mindfulness e meditação ajudam'
    ],
    fases_jejum: [
      {
        horas: '0-12h',
        nome: 'Cetose Estabelecida',
        o_que_acontece: 'Corpo 100% em cetose',
        beneficio: 'Queima máxima de gordura'
      },
      {
        horas: '12-18h',
        nome: 'Autofagia Profunda',
        o_que_acontece: 'Limpeza celular intensa',
        beneficio: 'Renovação celular máxima'
      },
      {
        horas: '18-20h',
        nome: 'Pico Metabólico',
        o_que_acontece: 'HGH no máximo',
        beneficio: 'Preservação muscular + gordura'
      }
    ]
  },

  OMAD: {
    id: 'omad',
    nome: 'OMAD - One Meal A Day',
    descricao: '23 horas de jejum, 1 hora de alimentação',
    nivel_dificuldade: 'extremo',
    horas_jejum: 23,
    horas_alimentacao: 1,
    horario_sugerido_inicio: '19:00',
    horario_sugerido_fim: '18:00',
    refeicoes_sugeridas: 1,
    para_quem: [
      'Veteranos do jejum',
      'Objetivo estético extremo',
      'Minimalistas alimentares',
      'Quer economia máxima de tempo'
    ],
    beneficios: [
      '✅ Máxima eficiência de tempo',
      '✅ Autofagia otimizada',
      '✅ Clareza mental extrema',
      '✅ Simplificação total',
      '✅ Economia financeira'
    ],
    cuidados: [
      '🚨 RISCO: Deficiências nutricionais',
      '🚨 Difícil atingir calorias',
      '🚨 Pode afetar metabolismo',
      '🚨 Impacto social',
      '🚨 Refeição DEVE ser completa'
    ],
    contraindicacoes: [
      'Todas as anteriores +',
      'Qualquer iniciante',
      'Mulheres (alto risco hormonal)',
      'Atletas de alto rendimento',
      'Trabalho físico intenso',
      'Menos de 1 ano de experiência'
    ],
    dicas_sucesso: [
      '⚠️ APENAS 1-2x por semana',
      '🍽️ Refeição ÉPICA e completa',
      '💊 Multivitamínico obrigatório',
      '📊 Conte macros e calorias',
      '🏋️ Treino muito leve ou OFF',
      '🧘 Prepare-se mentalmente'
    ],
    fases_jejum: [
      {
        horas: '0-16h',
        nome: 'Cetose e Autofagia',
        o_que_acontece: 'Todos processos anteriores',
        beneficio: 'Benefícios acumulados'
      },
      {
        horas: '16-23h',
        nome: 'Estado Metabólico Avançado',
        o_que_acontece: 'Máxima eficiência metabólica',
        beneficio: 'Pico de todos benefícios'
      }
    ]
  },

  CINCO_DOIS: {
    id: 'cinco_dois',
    nome: '5:2 - Jejum Semanal',
    descricao: '5 dias normais, 2 dias com 500-600 calorias',
    nivel_dificuldade: 'intermediario',
    horas_jejum: 0, // Não é por horas
    horas_alimentacao: 24,
    horario_sugerido_inicio: 'Livre',
    horario_sugerido_fim: 'Livre',
    refeicoes_sugeridas: 2,
    para_quem: [
      'Não gosta de jejum diário',
      'Quer flexibilidade',
      'Prefere restrição calórica pontual',
      'Vida social ativa'
    ],
    beneficios: [
      '✅ Muita flexibilidade',
      '✅ Mantém vida social',
      '✅ Resultados comprovados',
      '✅ Mais fácil de manter',
      '✅ Menos estresse'
    ],
    cuidados: [
      'Não compensar em excesso nos 5 dias',
      'Distribuir bem os 2 dias de restrição',
      'Garantir nutrientes nos dias baixos'
    ],
    contraindicacoes: [
      'Gravidez e amamentação',
      'Diabetes tipo 1',
      'Transtornos alimentares'
    ],
    dicas_sucesso: [
      '📅 Escolha dias fixos (ex: Ter e Qui)',
      '🥗 500 kcal: 2 refeições pequenas',
      '💧 MUITA água nos dias de restrição',
      '🥦 Vegetais à vontade',
      '🍽️ Dias normais: coma saudável',
      '⚖️ Não faça "cheat days"'
    ],
    fases_jejum: []
  },

  EAT_STOP_EAT: {
    id: 'eat_stop_eat',
    nome: 'Eat-Stop-Eat - 24h',
    descricao: 'Jejum completo de 24h, 1-2x por semana',
    nivel_dificuldade: 'avancado',
    horas_jejum: 24,
    horas_alimentacao: 0, // Jejum completo
    horario_sugerido_inicio: 'Jantar às 19h',
    horario_sugerido_fim: 'Jantar às 19h (dia seguinte)',
    refeicoes_sugeridas: 0,
    para_quem: [
      'Experiente com jejum',
      'Quer reset metabólico',
      'Quebrar platô de emagrecimento',
      'Desintoxicação periódica'
    ],
    beneficios: [
      '✅ Autofagia intensa',
      '✅ Reset metabólico',
      '✅ HGH muito elevado',
      '✅ Quebra platôs',
      '✅ Limpeza profunda'
    ],
    cuidados: [
      'APENAS 1-2x por semana',
      'Não fazer jejum 24h consecutivos',
      'Quebre com refeição leve',
      'Hidratação crucial'
    ],
    contraindicacoes: [
      'Todas as anteriores +',
      'Primeira vez com jejum',
      'Trabalho físico pesado no dia',
      'Compromissos sociais importantes'
    ],
    dicas_sucesso: [
      '🍽️ Jante normal às 19h',
      '😴 Durma bem à noite',
      '💧 Água, chá, café OK',
      '🏠 Dia tranquilo em casa',
      '🍲 Quebre com sopa/caldo',
      '📅 Não ultrapasse 24h'
    ],
    fases_jejum: [
      {
        horas: '0-12h',
        nome: 'Adaptação',
        o_que_acontece: 'Corpo entrando em cetose',
        beneficio: 'Transição metabólica'
      },
      {
        horas: '12-20h',
        nome: 'Autofagia Ativa',
        o_que_acontece: 'Limpeza celular intensa',
        beneficio: 'Renovação celular'
      },
      {
        horas: '20-24h',
        nome: 'Pico de HGH',
        o_que_acontece: 'Hormônio do crescimento no máximo',
        beneficio: 'Preservação muscular'
      }
    ]
  }
};

// Função para recomendar protocolo
export function recomendarProtocoloJejum(
  experiencia: 'nenhuma' | 'iniciante' | 'intermediario' | 'avancado',
  objetivo: string,
  sexo: string,
  restricoes?: string[]
): string {
  
  // Nunca fez jejum
  if (experiencia === 'nenhuma') {
    return 'INICIANTE_12_12';
  }
  
  // Iniciante
  if (experiencia === 'iniciante') {
    return 'PADRAO_16_8';
  }
  
  // Intermediário
  if (experiencia === 'intermediario') {
    if (objetivo.includes('perda de peso') || objetivo.includes('emagrecimento')) {
      return 'AVANCADO_18_6';
    }
    if (objetivo.includes('flexibilidade')) {
      return 'CINCO_DOIS';
    }
    return 'PADRAO_16_8';
  }
  
  // Avançado
  if (experiencia === 'avancado') {
    // Mulheres: cuidado com protocolos extremos
    if (sexo === 'feminino') {
      return 'AVANCADO_18_6'; // No máximo
    }
    
    if (objetivo.includes('cutting') || objetivo.includes('competição')) {
      return 'GUERREIRO_20_4';
    }
    
    return 'AVANCADO_18_6';
  }
  
  return 'PADRAO_16_8'; // Default
}

// Calcular horários da janela alimentar
export function calcularJanelaAlimentar(
  protocolo: ProtocoloJejum,
  horarioPreferencia?: string
): {
  inicio_jejum: string;
  fim_jejum: string;
  inicio_alimentacao: string;
  fim_alimentacao: string;
  duracao_jejum: string;
  duracao_alimentacao: string;
} {
  
  const inicioJejum = horarioPreferencia || protocolo.horario_sugerido_inicio;
  
  // Calcular fim do jejum
  const [horaInicio, minInicio] = inicioJejum.split(':').map(Number);
  let horaFim = (horaInicio + protocolo.horas_jejum) % 24;
  
  const fimJejum = `${String(horaFim).padStart(2, '0')}:${String(minInicio).padStart(2, '0')}`;
  
  // Janela alimentar
  const inicioAlimentacao = fimJejum;
  let horaFimAlimentacao = (horaFim + protocolo.horas_alimentacao) % 24;
  const fimAlimentacao = `${String(horaFimAlimentacao).padStart(2, '0')}:${String(minInicio).padStart(2, '0')}`;
  
  return {
    inicio_jejum: inicioJejum,
    fim_jejum: fimJejum,
    inicio_alimentacao: inicioAlimentacao,
    fim_alimentacao: fimAlimentacao,
    duracao_jejum: `${protocolo.horas_jejum}h`,
    duracao_alimentacao: `${protocolo.horas_alimentacao}h`
  };
}
