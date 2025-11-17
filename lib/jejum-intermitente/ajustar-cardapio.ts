import { ProtocoloJejum } from './protocolos';

export function ajustarCardapioParaJejum(
  cardapioBase: any,
  protocolo: ProtocoloJejum,
  horarioInicio: string
): any {
  
  const janela = calcularJanelaAlimentar(protocolo, horarioInicio);
  
  // Redistribuir refeições na janela alimentar
  const refeicoesAjustadas = redistribuirRefeicoes(
    cardapioBase.refeicoes,
    protocolo.refeicoes_sugeridas,
    janela.inicio_alimentacao,
    janela.fim_alimentacao
  );
  
  return {
    ...cardapioBase,
    jejum: {
      protocolo: protocolo.nome,
      inicio_jejum: janela.inicio_jejum,
      fim_jejum: janela.fim_jejum,
      duracao_jejum: janela.duracao_jejum,
      janela_alimentar: `${janela.inicio_alimentacao} - ${janela.fim_alimentacao}`,
      duracao_janela: janela.duracao_alimentacao
    },
    refeicoes: refeicoesAjustadas
  };
}

function redistribuirRefeicoes(
  refeicoesOriginais: any[],
  numeroRefeicoes: number,
  inicioJanela: string,
  fimJanela: string
): any[] {
  
  const [horaInicio, minInicio] = inicioJanela.split(':').map(Number);
  const [horaFim, minFim] = fimJanela.split(':').map(Number);
  
  let duracaoJanela = horaFim - horaInicio;
  if (duracaoJanela < 0) duracaoJanela += 24;
  
  const intervalo = Math.floor(duracaoJanela / numeroRefeicoes);
  
  const novasRefeicoes: any[] = [];
  
  if (numeroRefeicoes === 1) {
    // OMAD ou Guerreiro - 1 refeição grande
    const refeicoesConsolidadas = consolidarRefeicoes(refeicoesOriginais);
    novasRefeicoes.push({
      ...refeicoesConsolidadas,
      horario: inicioJanela,
      nome: 'Refeição Única'
    });
  } else if (numeroRefeicoes === 2) {
    // 2 refeições
    const [ref1, ref2] = dividirEmDuas(refeicoesOriginais);
    
    novasRefeicoes.push({
      ...ref1,
      horario: inicioJanela,
      nome: 'Primeira Refeição (Quebra de Jejum)'
    });
    
    const hora2 = (horaInicio + intervalo) % 24;
    novasRefeicoes.push({
      ...ref2,
      horario: `${String(hora2).padStart(2, '0')}:${String(minInicio).padStart(2, '0')}`,
      nome: 'Segunda Refeição'
    });
  } else if (numeroRefeicoes === 3) {
    // 3 refeições (16/8 típico)
    const [ref1, ref2, ref3] = dividirEmTres(refeicoesOriginais);
    
    novasRefeicoes.push({
      ...ref1,
      horario: inicioJanela,
      nome: 'Almoço (Quebra de Jejum)'
    });
    
    const hora2 = (horaInicio + Math.floor(duracaoJanela / 2)) % 24;
    novasRefeicoes.push({
      ...ref2,
      horario: `${String(hora2).padStart(2, '0')}:${String(minInicio).padStart(2, '0')}`,
      nome: 'Lanche'
    });
    
    const hora3 = Math.max(horaFim - 1, (horaInicio + duracaoJanela - 1) % 24);
    novasRefeicoes.push({
      ...ref3,
      horario: `${String(hora3).padStart(2, '0')}:${String(minInicio).padStart(2, '0')}`,
      nome: 'Jantar'
    });
  }
  
  return novasRefeicoes;
}

function consolidarRefeicoes(refeicoes: any[]): any {
  const todosAlimentos = refeicoes.flatMap(r => r.alimentos);
  
  const macrosTotais = todosAlimentos.reduce((acc, alimento) => ({
    calorias: acc.calorias + alimento.calorias,
    proteina: acc.proteina + alimento.proteina,
    carboidrato: acc.carboidrato + alimento.carboidrato,
    gordura: acc.gordura + alimento.gordura
  }), { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 });
  
  return {
    alimentos: todosAlimentos,
    macros: macrosTotais
  };
}

function dividirEmDuas(refeicoes: any[]): any[] {
  const total = refeicoes.reduce((acc, r) => acc + r.macros.calorias, 0);
  const metade = total / 2;
  
  let ref1Alimentos: any[] = [];
  let ref2Alimentos: any[] = [];
  let calorias1 = 0;
  
  refeicoes.forEach(refeicao => {
    refeicao.alimentos.forEach((alimento: any) => {
      if (calorias1 < metade) {
        ref1Alimentos.push(alimento);
        calorias1 += alimento.calorias;
      } else {
        ref2Alimentos.push(alimento);
      }
    });
  });
  
  return [
    {
      alimentos: ref1Alimentos,
      macros: calcularMacros(ref1Alimentos)
    },
    {
      alimentos: ref2Alimentos,
      macros: calcularMacros(ref2Alimentos)
    }
  ];
}

function dividirEmTres(refeicoes: any[]): any[] {
  const total = refeicoes.reduce((acc, r) => acc + r.macros.calorias, 0);
  const terco = total / 3;
  
  let ref1: any[] = [];
  let ref2: any[] = [];
  let ref3: any[] = [];
  let cal1 = 0, cal2 = 0;
  
  refeicoes.forEach(refeicao => {
    refeicao.alimentos.forEach((alimento: any) => {
      if (cal1 < terco) {
        ref1.push(alimento);
        cal1 += alimento.calorias;
      } else if (cal2 < terco) {
        ref2.push(alimento);
        cal2 += alimento.calorias;
      } else {
        ref3.push(alimento);
      }
    });
  });
  
  return [
    { alimentos: ref1, macros: calcularMacros(ref1) },
    { alimentos: ref2, macros: calcularMacros(ref2) },
    { alimentos: ref3, macros: calcularMacros(ref3) }
  ];
}

function calcularMacros(alimentos: any[]) {
  return alimentos.reduce((acc, a) => ({
    calorias: acc.calorias + a.calorias,
    proteina: acc.proteina + a.proteina,
    carboidrato: acc.carboidrato + a.carboidrato,
    gordura: acc.gordura + a.gordura
  }), { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 });
}

function calcularJanelaAlimentar(protocolo: any, horario: string) {
  const [hora, min] = horario.split(':').map(Number);
  const horaFim = (hora + protocolo.horas_jejum) % 24;
  const horaFimJanela = (horaFim + protocolo.horas_alimentacao) % 24;
  
  return {
    inicio_jejum: horario,
    fim_jejum: `${String(horaFim).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
    inicio_alimentacao: `${String(horaFim).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
    fim_alimentacao: `${String(horaFimJanela).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
    duracao_jejum: `${protocolo.horas_jejum}h`,
    duracao_alimentacao: `${protocolo.horas_alimentacao}h`
  };
}

// Dicas para quebra de jejum
export const DICAS_QUEBRA_JEJUM = {
  alimentos_ideais: [
    '🥗 Salada verde com azeite',
    '🥑 Abacate',
    '🥚 Ovos cozidos',
    '🥜 Oleaginosas',
    '🐟 Peixe grelhado',
    '🥤 Caldo de ossos',
    '🥒 Pepino'
  ],
  alimentos_evitar: [
    '🚫 Carboidratos refinados (pão branco, massas)',
    '🚫 Doces e açúcares',
    '🚫 Frituras',
    '🚫 Grandes volumes de comida',
    '🚫 Bebidas gaseificadas'
  ],
  como_quebrar: [
    '1️⃣ Comece com água',
    '2️⃣ Pequena porção de salada ou vegetais',
    '3️⃣ Aguarde 15-20 min',
    '4️⃣ Refeição principal equilibrada',
    '5️⃣ Mastigue devagar'
  ]
};
