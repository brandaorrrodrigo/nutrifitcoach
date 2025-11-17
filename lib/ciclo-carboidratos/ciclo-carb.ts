// Sistema de Ciclo de Carboidratos (Carb Cycling)

export interface DiaCiclo {
  dia: string;
  tipo: 'alto' | 'moderado' | 'baixo' | 'zero';
  carboidratos_gramas: number;
  calorias_ajuste: number;
  objetivo_dia: string;
  treino: boolean;
}

export interface CicloCarboidratos {
  nome: string;
  descricao: string;
  objetivo: string;
  semana: DiaCiclo[];
  macros_medios: {
    proteina: number;
    carboidrato: number;
    gordura: number;
  };
}

// Protocolos prontos de ciclo de carboidratos
export const PROTOCOLOS_CARB_CYCLING: Record<string, CicloCarboidratos> = {
  
  EMAGRECIMENTO_PADRAO: {
    nome: 'Emagrecimento Padrão',
    descricao: 'Ciclo clássico para perda de gordura mantendo massa muscular',
    objetivo: 'Perda de gordura',
    semana: [
      { dia: 'Segunda', tipo: 'alto', carboidratos_gramas: 250, calorias_ajuste: 0, objetivo_dia: 'Treino pesado', treino: true },
      { dia: 'Terça', tipo: 'moderado', carboidratos_gramas: 150, calorias_ajuste: -200, objetivo_dia: 'Treino moderado', treino: true },
      { dia: 'Quarta', tipo: 'baixo', carboidratos_gramas: 80, calorias_ajuste: -400, objetivo_dia: 'Cardio leve', treino: true },
      { dia: 'Quinta', tipo: 'alto', carboidratos_gramas: 250, calorias_ajuste: 0, objetivo_dia: 'Treino pesado', treino: true },
      { dia: 'Sexta', tipo: 'moderado', carboidratos_gramas: 150, calorias_ajuste: -200, objetivo_dia: 'Treino moderado', treino: true },
      { dia: 'Sábado', tipo: 'baixo', carboidratos_gramas: 80, calorias_ajuste: -400, objetivo_dia: 'Descanso/cardio', treino: false },
      { dia: 'Domingo', tipo: 'baixo', carboidratos_gramas: 80, calorias_ajuste: -400, objetivo_dia: 'Descanso', treino: false }
    ],
    macros_medios: { proteina: 180, carboidrato: 145, gordura: 50 }
  },

  RECOMPOSICAO: {
    nome: 'Recomposição Corporal',
    descricao: 'Perder gordura e ganhar músculo simultaneamente',
    objetivo: 'Recomposição',
    semana: [
      { dia: 'Segunda', tipo: 'alto', carboidratos_gramas: 300, calorias_ajuste: 200, objetivo_dia: 'Treino superior', treino: true },
      { dia: 'Terça', tipo: 'moderado', carboidratos_gramas: 180, calorias_ajuste: 0, objetivo_dia: 'Cardio', treino: true },
      { dia: 'Quarta', tipo: 'alto', carboidratos_gramas: 300, calorias_ajuste: 200, objetivo_dia: 'Treino inferior', treino: true },
      { dia: 'Quinta', tipo: 'moderado', carboidratos_gramas: 180, calorias_ajuste: 0, objetivo_dia: 'Cardio', treino: true },
      { dia: 'Sexta', tipo: 'alto', carboidratos_gramas: 300, calorias_ajuste: 200, objetivo_dia: 'Treino full body', treino: true },
      { dia: 'Sábado', tipo: 'baixo', carboidratos_gramas: 100, calorias_ajuste: -300, objetivo_dia: 'Cardio leve', treino: true },
      { dia: 'Domingo', tipo: 'baixo', carboidratos_gramas: 100, calorias_ajuste: -300, objetivo_dia: 'Descanso', treino: false }
    ],
    macros_medios: { proteina: 200, carboidrato: 195, gordura: 55 }
  },

  GANHO_MASSA: {
    nome: 'Ganho de Massa Limpo',
    descricao: 'Maximizar hipertrofia minimizando ganho de gordura',
    objetivo: 'Hipertrofia',
    semana: [
      { dia: 'Segunda', tipo: 'alto', carboidratos_gramas: 400, calorias_ajuste: 400, objetivo_dia: 'Treino pesado A', treino: true },
      { dia: 'Terça', tipo: 'alto', carboidratos_gramas: 400, calorias_ajuste: 400, objetivo_dia: 'Treino pesado B', treino: true },
      { dia: 'Quarta', tipo: 'moderado', carboidratos_gramas: 250, calorias_ajuste: 0, objetivo_dia: 'Cardio/recuperação', treino: true },
      { dia: 'Quinta', tipo: 'alto', carboidratos_gramas: 400, calorias_ajuste: 400, objetivo_dia: 'Treino pesado C', treino: true },
      { dia: 'Sexta', tipo: 'alto', carboidratos_gramas: 400, calorias_ajuste: 400, objetivo_dia: 'Treino pesado D', treino: true },
      { dia: 'Sábado', tipo: 'moderado', carboidratos_gramas: 250, calorias_ajuste: 0, objetivo_dia: 'Cardio/ativo', treino: true },
      { dia: 'Domingo', tipo: 'moderado', carboidratos_gramas: 250, calorias_ajuste: 0, objetivo_dia: 'Descanso', treino: false }
    ],
    macros_medios: { proteina: 220, carboidrato: 335, gordura: 70 }
  },

  CUTTING_AGRESSIVO: {
    nome: 'Cutting Agressivo',
    descricao: 'Máxima perda de gordura (pré-competição)',
    objetivo: 'Cutting extremo',
    semana: [
      { dia: 'Segunda', tipo: 'moderado', carboidratos_gramas: 150, calorias_ajuste: -200, objetivo_dia: 'Treino A', treino: true },
      { dia: 'Terça', tipo: 'baixo', carboidratos_gramas: 50, calorias_ajuste: -500, objetivo_dia: 'Cardio', treino: true },
      { dia: 'Quarta', tipo: 'moderado', carboidratos_gramas: 150, calorias_ajuste: -200, objetivo_dia: 'Treino B', treino: true },
      { dia: 'Quinta', tipo: 'baixo', carboidratos_gramas: 50, calorias_ajuste: -500, objetivo_dia: 'Cardio', treino: true },
      { dia: 'Sexta', tipo: 'alto', carboidratos_gramas: 250, calorias_ajuste: 0, objetivo_dia: 'Refeed/Treino C', treino: true },
      { dia: 'Sábado', tipo: 'baixo', carboidratos_gramas: 50, calorias_ajuste: -500, objetivo_dia: 'Cardio', treino: true },
      { dia: 'Domingo', tipo: 'zero', carboidratos_gramas: 20, calorias_ajuste: -600, objetivo_dia: 'Descanso', treino: false }
    ],
    macros_medios: { proteina: 200, carboidrato: 95, gordura: 60 }
  },

  MULHER_PERIODIZACAO: {
    nome: 'Mulher - Periodização Hormonal',
    descricao: 'Ciclo alinhado com fase menstrual',
    objetivo: 'Perda de gordura feminina',
    semana: [
      { dia: 'Segunda', tipo: 'alto', carboidratos_gramas: 220, calorias_ajuste: 0, objetivo_dia: 'Fase Folicular - Treino pesado', treino: true },
      { dia: 'Terça', tipo: 'alto', carboidratos_gramas: 220, calorias_ajuste: 0, objetivo_dia: 'Fase Folicular - Treino pesado', treino: true },
      { dia: 'Quarta', tipo: 'moderado', carboidratos_gramas: 150, calorias_ajuste: -150, objetivo_dia: 'Cardio moderado', treino: true },
      { dia: 'Quinta', tipo: 'alto', carboidratos_gramas: 220, calorias_ajuste: 0, objetivo_dia: 'Ovulação - Alta energia', treino: true },
      { dia: 'Sexta', tipo: 'moderado', carboidratos_gramas: 150, calorias_ajuste: -150, objetivo_dia: 'Treino moderado', treino: true },
      { dia: 'Sábado', tipo: 'baixo', carboidratos_gramas: 100, calorias_ajuste: -300, objetivo_dia: 'Fase Lútea - Cardio', treino: true },
      { dia: 'Domingo', tipo: 'moderado', carboidratos_gramas: 150, calorias_ajuste: -150, objetivo_dia: 'Descanso ativo', treino: false }
    ],
    macros_medios: { proteina: 140, carboidrato: 172, gordura: 50 }
  }
};

// Função para gerar cardápio baseado no dia do ciclo
export function ajustarCardapioPorCiclo(
  cardapioBase: any,
  diaCiclo: DiaCiclo,
  peso: number
): any {
  
  // Calcular fator de ajuste
  const carbsBase = cardapioBase.macros.carboidrato;
  const fatorCarbs = diaCiclo.carboidratos_gramas / carbsBase;
  
  // Ajustar refeições
  const refeicoesAjustadas = cardapioBase.refeicoes.map((refeicao: any) => {
    
    const alimentosAjustados = refeicao.alimentos.map((alimento: any) => {
      
      // Se é fonte de carboidrato, ajustar
      if (alimento.carboidrato > 5) {
        return {
          ...alimento,
          quantidade: ajustarQuantidade(alimento.quantidade, fatorCarbs),
          calorias: Math.round(alimento.calorias * fatorCarbs),
          carboidrato: Math.round(alimento.carboidrato * fatorCarbs * 10) / 10
        };
      }
      
      return alimento;
    });
    
    // Recalcular macros da refeição
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
    ciclo_carb: {
      dia: diaCiclo.dia,
      tipo: diaCiclo.tipo,
      objetivo: diaCiclo.objetivo_dia,
      treino: diaCiclo.treino
    }
  };
}

function ajustarQuantidade(quantidade: string, fator: number): string {
  const valor = parseFloat(quantidade);
  const novoValor = Math.round(valor * fator);
  const unidade = quantidade.replace(/[\d.]/g, '').trim();
  return `${novoValor}${unidade}`;
}

// Recomendação automática de protocolo
export function recomendarProtocoloCarbCycling(
  objetivo: string,
  sexo: string,
  experiencia: string
): string {
  
  if (sexo === 'feminino') {
    return 'MULHER_PERIODIZACAO';
  }
  
  if (objetivo.includes('perda de peso') || objetivo.includes('emagrecimento')) {
    if (experiencia === 'avancado') {
      return 'CUTTING_AGRESSIVO';
    }
    return 'EMAGRECIMENTO_PADRAO';
  }
  
  if (objetivo.includes('ganho de massa') || objetivo.includes('hipertrofia')) {
    return 'GANHO_MASSA';
  }
  
  return 'RECOMPOSICAO';
}
