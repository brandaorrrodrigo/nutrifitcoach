// Treino de Depleção de Glicogênio - Protocolo Dan Duchaine

export const TREINO_DEPLETACAO_CKD = {
  nome: 'Depleção de Glicogênio - Full Body',
  quando: 'Sexta-feira 21h (antes da recarga)',
  duracao: '60-90 minutos',
  objetivo: 'Esvaziar COMPLETAMENTE os estoques de glicogênio muscular',
  intensidade: 'Moderada (60-70% 1RM)',
  descanso: '30-45 segundos entre séries',
  
  avisos_importantes: [
    '⚠️ NÃO vá até a falha muscular',
    '⚠️ Objetivo é VOLUME, não intensidade máxima',
    '⚠️ Você VAI sentir fraqueza - é esperado',
    '⚠️ Músculos vão ficar "vazios" e "murchos"',
    '⚠️ Hidrate MUITO durante o treino',
    '⚠️ Tome BCAA antes e durante',
    '⚠️ NÃO coma 2-3h antes do treino'
  ],
  
  aquecimento: {
    duracao: '10 minutos',
    atividades: [
      '5min esteira/bike leve',
      '5min alongamento dinâmico',
      '1-2 séries leves de cada exercício'
    ]
  },
  
  circuito_completo: [
    {
      ordem: 1,
      grupo_muscular: 'PERNAS (Maior reserva de glicogênio)',
      objetivo: 'Esgotar glicogênio das pernas PRIMEIRO',
      exercicios: [
        {
          nome: 'Agachamento Livre',
          series: 4,
          repeticoes: '15-20',
          carga: '60% do 1RM',
          descanso: '45s',
          tecnica: 'Cadência normal, amplitude completa',
          observacao: 'Pode usar Smith se necessário'
        },
        {
          nome: 'Leg Press 45°',
          series: 3,
          repeticoes: '15-20',
          carga: 'Moderada',
          descanso: '45s',
          tecnica: 'Descer até 90°',
          observacao: 'Foco em volume'
        },
        {
          nome: 'Cadeira Extensora',
          series: 3,
          repeticoes: '15-20',
          carga: 'Moderada',
          descanso: '30s',
          tecnica: 'Contração no topo',
          observacao: 'Queimar quadríceps'
        },
        {
          nome: 'Mesa Flexora',
          series: 3,
          repeticoes: '15-20',
          carga: 'Moderada',
          descanso: '30s',
          tecnica: 'Amplitude completa',
          observacao: 'Posterior de coxa'
        },
        {
          nome: 'Panturrilha em Pé',
          series: 4,
          repeticoes: '20-25',
          carga: 'Moderada',
          descanso: '30s',
          tecnica: 'Amplitude máxima',
          observacao: 'Não esquecer panturrilhas'
        }
      ]
    },
    {
      ordem: 2,
      grupo_muscular: 'PEITO',
      exercicios: [
        {
          nome: 'Supino Reto',
          series: 3,
          repeticoes: '12-15',
          carga: '60-65% do 1RM',
          descanso: '45s'
        },
        {
          nome: 'Supino Inclinado',
          series: 3,
          repeticoes: '12-15',
          carga: 'Moderada',
          descanso: '45s'
        },
        {
          nome: 'Crucifixo Reto',
          series: 3,
          repeticoes: '15',
          carga: 'Leve/Moderada',
          descanso: '30s'
        }
      ]
    },
    {
      ordem: 3,
      grupo_muscular: 'COSTAS',
      exercicios: [
        {
          nome: 'Barra Fixa',
          series: 3,
          repeticoes: '10-12',
          carga: 'Peso corporal',
          descanso: '45s',
          observacao: 'Pode usar assistida'
        },
        {
          nome: 'Remada Curvada',
          series: 3,
          repeticoes: '12-15',
          carga: 'Moderada',
          descanso: '45s'
        },
        {
          nome: 'Pulldown',
          series: 3,
          repeticoes: '15',
          carga: 'Moderada',
          descanso: '30s'
        }
      ]
    },
    {
      ordem: 4,
      grupo_muscular: 'OMBROS',
      exercicios: [
        {
          nome: 'Desenvolvimento com Barra',
          series: 3,
          repeticoes: '12-15',
          carga: 'Moderada',
          descanso: '45s'
        },
        {
          nome: 'Elevação Lateral',
          series: 3,
          repeticoes: '15',
          carga: 'Leve/Moderada',
          descanso: '30s'
        }
      ]
    },
    {
      ordem: 5,
      grupo_muscular: 'BRAÇOS',
      exercicios: [
        {
          nome: 'Rosca Direta',
          series: 3,
          repeticoes: '15',
          carga: 'Moderada',
          descanso: '30s'
        },
        {
          nome: 'Tríceps Testa',
          series: 3,
          repeticoes: '15',
          carga: 'Moderada',
          descanso: '30s'
        }
      ]
    }
  ],
  
  finalizacao: {
    atividade: '10min cardio leve',
    objetivo: 'Garantir depleção máxima',
    intensidade: 'Baixa (caminhada rápida ou bike)'
  },
  
  pos_treino_imediato: {
    o_que_fazer: [
      '💧 Beber 500ml água',
      '🚿 Banho',
      '⏰ Aguardar 1-2h',
      '🍽️ PRIMEIRA REFEIÇÃO DE RECARGA'
    ],
    o_que_nao_fazer: [
      '🚫 NÃO comer imediatamente',
      '🚫 NÃO tomar whey pós-treino ainda',
      '🚫 NÃO comer gorduras'
    ]
  },
  
  sinais_depletacao_correta: [
    '✅ Músculos "vazios" ao toque',
    '✅ Sensação de fraqueza muscular',
    '✅ Músculos parecem menores',
    '✅ Sede intensa',
    '✅ Leve tontura (normal)',
    '✅ Suor abundante'
  ]
};
