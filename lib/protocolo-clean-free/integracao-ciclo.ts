// Integração Clean & Free com Periodização Menstrual

import { FASES_CICLO_MENSTRUAL, calcularFaseAtual } from '../periodizacao-menstrual/periodizacao';
import { PROTOCOLO_CLEAN_FREE } from './protocolo';

export interface CleanFreeComCiclo {
  protocolo_base: typeof PROTOCOLO_CLEAN_FREE;
  adaptacao_ciclo: AdaptacaoCiclo;
  quando_recomendar: string[];
  beneficios_mulheres: string[];
}

interface AdaptacaoCiclo {
  menstruacao: {
    dias: [number, number];
    ajustes: string[];
    flexibilidade: string;
  };
  folicular: {
    dias: [number, number];
    ajustes: string[];
    aproveitamento: string;
  };
  ovulatoria: {
    dias: [number, number];
    ajustes: string[];
    aproveitamento: string;
  };
  lutea_inicial: {
    dias: [number, number];
    ajustes: string[];
    preparacao: string;
  };
  lutea_tardia_tpm: {
    dias: [number, number];
    ajustes: string[];
    foco_especial: string;
  };
}

export const CLEAN_FREE_PERIODIZADO: CleanFreeComCiclo = {
  protocolo_base: PROTOCOLO_CLEAN_FREE,
  
  adaptacao_ciclo: {
    
    menstruacao: {
      dias: [1, 5],
      ajustes: [
        '🩸 Seja mais gentil consigo mesma',
        '💪 Se não conseguir treinar, tudo bem',
        '🍫 Se PRECISAR de chocolate na semana, permita 1 pequeno',
        '😴 Priorize descanso',
        '💧 Hidrate muito (ajuda cólicas)'
      ],
      flexibilidade: 'ALTA - Ouça seu corpo, não seja rígida'
    },
    
    folicular: {
      dias: [6, 13],
      ajustes: [
        '💪 MELHOR FASE! Aproveite para treinar pesado',
        '🎯 Disciplina fica MAIS FÁCIL',
        '✨ Alta energia - maximize resultados',
        '🥗 Corpo responde MUITO BEM à dieta limpa',
        '🔥 Aproveite esta janela anabólica'
      ],
      aproveitamento: 'MÁXIMO - Esta é SUA semana! Foque e arrasa!'
    },
    
    ovulatoria: {
      dias: [14, 16],
      ajustes: [
        '🔥 PICO DE ENERGIA!',
        '💪 Treine no MÁXIMO',
        '🎊 Se o fim de semana livre cair aqui, aproveite SEM culpa',
        '⚡ Metabolismo acelerado',
        '✨ Melhor momento do mês'
      ],
      aproveitamento: 'EXPLOSIVO - Você está no auge!'
    },
    
    lutea_inicial: {
      dias: [17, 23],
      ajustes: [
        '😌 Começa a ficar mais difícil',
        '🍫 Vontade de doces aumentando',
        '💭 "Só mais X dias até sábado"',
        '🧘 Pratique mindfulness',
        '💊 Magnésio ajuda MUITO'
      ],
      preparacao: 'Prepare-se - TPM vem aí, mas você tem estratégia!'
    },
    
    lutea_tardia_tpm: {
      dias: [24, 28],
      ajustes: [
        '🚨 FASE CRÍTICA - MOMENTO DO CLEAN & FREE BRILHAR!',
        '🍫 Vontade de doces no MÁXIMO',
        '💝 MAS você SABE que sábado pode TUDO',
        '📝 Faça lista de todos doces que vai comer',
        '🧠 "Não é NÃO, é sábado"',
        '💪 Seja forte - falta pouco!',
        '☕ Chá, café, água com limão ajudam',
        '🚶 Caminhe se sentir ansiedade',
        '😴 Durma bem (8-9h)',
        '💊 Magnésio, B6, Ômega-3 ESSENCIAIS'
      ],
      foco_especial: `
        💝 É AQUI QUE O PROTOCOLO FAZ DIFERENÇA!
        
        Em vez de:
        ❌ Furar dieta e se sentir culpada
        ❌ Sofrer brigando com vontade
        ❌ Desistir de tudo
        
        Você:
        ✅ AGUENTA até sábado (são só dias!)
        ✅ SABE que vai ter recompensa
        ✅ Come TUDO que quer no sábado
        ✅ ZERO culpa
        ✅ Segunda recomeça limpa
        
        🎯 TPM + Clean & Free = COMBINAÇÃO PERFEITA!
      `
    }
  },
  
  quando_recomendar: [
    '🌸 Mulheres com TPM forte',
    '🍫 Vontade intensa de doces na TPM',
    '😤 Dificuldade em manter dieta na fase lútea',
    '🎢 Alterações de humor relacionadas ao ciclo',
    '💪 Quer resultados MAS não quer sofrer',
    '🎉 Quer ter vida social no fim de semana',
    '⚖️ Busca equilíbrio sustentável',
    '❤️ Saúde mental é prioridade',
    '🌟 Primeira vez tentando emagrecer',
    '🔄 Já tentou outras dietas e não conseguiu'
  ],
  
  beneficios_mulheres: [
    '💝 Respeita seu ciclo hormonal',
    '🍫 Permite doces quando você mais precisa',
    '🧠 Saúde mental preservada',
    '😊 Menos ansiedade alimentar',
    '💪 Mantém massa muscular',
    '📉 Emagrecimento consistente',
    '🎉 Vida social mantida',
    '⚖️ Equilíbrio hormonal respeitado',
    '🌟 Autoestima alta',
    '✨ Sustentável PARA SEMPRE',
    '❤️ Sem culpa, sem sofrimento',
    '🎯 Resultados reais e duradouros'
  ]
};

// Função para recomendar Clean & Free baseado na fase do ciclo
export function deveRecomendarCleanFree(
  dataUltimaMenstruacao: Date,
  duracaoCiclo: number = 28,
  historicoCompulsao?: boolean,
  primeiraVez?: boolean
): {
  recomendar: boolean;
  razao: string;
  intensidade: 'baixa' | 'media' | 'alta' | 'muito_alta';
  mensagem: string;
} {
  
  const fase = calcularFaseAtual(dataUltimaMenstruacao, duracaoCiclo);
  
  // FASE LÚTEA TARDIA (TPM) - RECOMENDAÇÃO MÁXIMA
  if (fase.fase === 'LUTEA_TARDIA') {
    return {
      recomendar: true,
      razao: 'Você está na fase TPM - momento perfeito para Clean & Free!',
      intensidade: 'muito_alta',
      mensagem: `
        🌸 VOCÊ ESTÁ NA TPM!
        
        Esta é EXATAMENTE a fase onde o Clean & Free BRILHA! ✨
        
        Nesta fase:
        - 🍫 Vontade de doces está NO MÁXIMO
        - 😤 Irritabilidade aumentada
        - 💪 Mais difícil manter disciplina
        
        Com Clean & Free:
        ✅ Você AGUENTA até sábado
        ✅ Come TUDO que quer no fim de semana
        ✅ Sem culpa - faz parte do plano!
        ✅ Segunda recomeça forte
        
        💝 Perfeito para você AGORA!
      `
    };
  }
  
  // FASE LÚTEA INICIAL - RECOMENDAÇÃO ALTA
  if (fase.fase === 'LUTEA_INICIAL') {
    return {
      recomendar: true,
      razao: 'TPM se aproximando - Clean & Free vai te ajudar!',
      intensidade: 'alta',
      mensagem: `
        🌙 TPM SE APROXIMANDO...
        
        Você já está sentindo:
        - Vontade de doces aumentando
        - Energia diminuindo um pouco
        - Ansiedade alimentar
        
        Clean & Free te prepara:
        ✅ Semana organizada e limpa
        ✅ Recompensa garantida no sábado
        ✅ Estratégia para lidar com TPM
        
        💪 Comece agora, quando a TPM chegar você estará preparada!
      `
    };
  }
  
  // MENSTRUAÇÃO - RECOMENDAÇÃO MÉDIA (com flexibilidade)
  if (fase.fase === 'MENSTRUACAO') {
    return {
      recomendar: true,
      razao: 'Menstruação - Clean & Free com flexibilidade',
      intensidade: 'media',
      mensagem: `
        🩸 VOCÊ ESTÁ MENSTRUADA
        
        Clean & Free funciona, mas seja gentil:
        ✅ Siga o protocolo
        ✅ MAS seja mais flexível
        ✅ Se precisar de 1 chocolate na semana, OK
        ✅ Não force treinos pesados
        
        💝 Cuide de você nesta fase!
      `
    };
  }
  
  // FOLICULAR - RECOMENDAÇÃO BAIXA (mas ainda funciona)
  if (fase.fase === 'FOLICULAR') {
    return {
      recomendar: historicoCompulsao || primeiraVez ? true : false,
      razao: 'Fase boa - disciplina mais fácil, mas Clean & Free ainda é válido',
      intensidade: 'baixa',
      mensagem: `
        🌱 FASE FOLICULAR - SUA MELHOR FASE!
        
        Nesta fase:
        ✅ Alta energia
        ✅ Disciplina mais fácil
        ✅ Metabolismo ótimo
        
        Clean & Free aqui:
        - Funciona perfeitamente
        - Você pode até nem precisar tanto
        - Mas garante equilíbrio
        - E prepara para TPM futura
        
        💪 Aproveite esta fase para ARRASAR!
      `
    };
  }
  
  // OVULATÓRIA - RECOMENDAÇÃO BAIXA
  return {
    recomendar: historicoCompulsao || primeiraVez ? true : false,
    razao: 'Pico de energia - qualquer protocolo funciona bem',
    intensidade: 'baixa',
    mensagem: `
      🔥 OVULAÇÃO - VOCÊ ESTÁ NO AUGE!
      
      Esta é a MELHOR fase do mês:
      - Energia MÁXIMA
      - Força aumentada
      - Metabolismo ótimo
      - Disciplina fácil
      
      Clean & Free funciona, mas você pode escolher qualquer protocolo.
      
      💪 Aproveite este momento!
    `
  };
}

// Calendário Clean & Free adaptado ao ciclo de 28 dias
export function gerarCalendarioCleanFreeCiclo(
  dataUltimaMenstruacao: Date,
  duracaoCiclo: number = 28
): any[] {
  
  const calendario: any[] = [];
  const inicioMenstruacao = new Date(dataUltimaMenstruacao);
  
  for (let dia = 1; dia <= duracaoCiclo; dia++) {
    const dataAtual = new Date(inicioMenstruacao);
    dataAtual.setDate(inicioMenstruacao.getDate() + dia - 1);
    
    const diaSemana = dataAtual.getDay(); // 0 = Domingo, 6 = Sábado
    
    // Determinar fase do ciclo
    let faseCiclo = '';
    let energia = '';
    let vontadeDoces = '';
    
    if (dia >= 1 && dia <= 5) {
      faseCiclo = 'Menstruação';
      energia = 'Baixa';
      vontadeDoces = 'Média';
    } else if (dia >= 6 && dia <= 13) {
      faseCiclo = 'Folicular';
      energia = 'Alta';
      vontadeDoces = 'Baixa';
    } else if (dia >= 14 && dia <= 16) {
      faseCiclo = 'Ovulatória';
      energia = 'MÁXIMA';
      vontadeDoces = 'Muito Baixa';
    } else if (dia >= 17 && dia <= 23) {
      faseCiclo = 'Lútea Inicial';
      energia = 'Média';
      vontadeDoces = 'Média-Alta';
    } else {
      faseCiclo = 'Lútea Tardia (TPM)';
      energia = 'Baixa';
      vontadeDoces = 'MUITO ALTA 🚨';
    }
    
    // Determinar tipo de dia (Clean ou Free)
    let tipoDia = '';
    let alimentacao = '';
    let jejum = '';
    
    if (diaSemana === 6) { // Sábado
      tipoDia = 'FREE DAY 🎉';
      alimentacao = 'LIBERDADE TOTAL!';
      jejum = '20h (até 16h)';
    } else if (diaSemana === 0) { // Domingo
      tipoDia = 'TRANSIÇÃO 🌈';
      alimentacao = 'Livre mas mais leve';
      jejum = '18h (até 12h)';
    } else { // Seg-Sex
      tipoDia = 'CLEAN DAY 💪';
      alimentacao = 'Limpa e nutritiva';
      jejum = 'Opcional 16/8';
    }
    
    calendario.push({
      dia_ciclo: dia,
      data: dataAtual.toLocaleDateString('pt-BR'),
      dia_semana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][diaSemana],
      fase_ciclo: faseCiclo,
      energia: energia,
      vontade_doces: vontadeDoces,
      tipo_dia: tipoDia,
      alimentacao: alimentacao,
      jejum: jejum
    });
  }
  
  return calendario;
}

// Estatísticas e análise de aderência
export function analisarAderenciaCleanFree(historico: any[]): {
  dias_clean: number;
  dias_free: number;
  dias_seguidos: number;
  taxa_sucesso: number;
  fases_dificeis: string[];
  fases_faceis: string[];
  recomendacoes: string[];
} {
  
  const diasClean = historico.filter(d => d.tipo === 'clean' && d.seguiu).length;
  const diasFree = historico.filter(d => d.tipo === 'free').length;
  const diasTotal = historico.length;
  
  const taxaSucesso = (diasClean / (diasTotal - diasFree)) * 100;
  
  // Analisar fases difíceis
  const fasesDificeis: string[] = [];
  const fasesFaceis: string[] = [];
  
  historico.forEach(dia => {
    if (dia.fase_ciclo === 'TPM' && !dia.seguiu) {
      if (!fasesDificeis.includes('TPM')) fasesDificeis.push('TPM');
    }
    if (dia.fase_ciclo === 'Folicular' && dia.seguiu) {
      if (!fasesFaceis.includes('Folicular')) fasesFaceis.push('Folicular');
    }
  });
  
  const recomendacoes: string[] = [];
  
  if (taxaSucesso < 70) {
    recomendacoes.push('Seja mais gentil consigo mesma na TPM');
    recomendacoes.push('Considere permitir 1 chocolate pequeno na semana TPM');
  }
  
  if (fasesDificeis.includes('TPM')) {
    recomendacoes.push('TPM é sua fase mais difícil - use mais estratégias');
    recomendacoes.push('Aumente magnésio e B6 nesta fase');
  }
  
  return {
    dias_clean: diasClean,
    dias_free: diasFree,
    dias_seguidos: 0, // Calcular sequência
    taxa_sucesso: Math.round(taxaSucesso),
    fases_dificeis: fasesDificeis,
    fases_faceis: fasesFaceis,
    recomendacoes: recomendacoes
  };
}
