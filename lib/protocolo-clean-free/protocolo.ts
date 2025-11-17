// 💝 PROTOCOLO CLEAN & FREE
// Alimentação limpa 5 dias + Liberdade total 2 dias (com jejum)

export interface ProtocoloCleanFree {
  nome: string;
  subtitulo: string;
  para_quem: string;
  filosofia: string;
  estrutura_semanal: SemanaCF[];
  regras_de_ouro: string[];
  beneficios: string[];
  ciencia_por_tras: string[];
}

interface SemanaCF {
  dia: string;
  tipo: 'CLEAN' | 'FREE' | 'TRANSICAO';
  jejum?: {
    protocolo: string;
    horas_jejum: number;
    janela_alimentar: string;
  };
  alimentacao: {
    tipo: string;
    restricoes: string[];
    liberdades: string[];
    calorias_meta: string;
  };
  treino?: {
    tipo: string;
    intensidade: string;
  };
  mindset: string;
}

export const PROTOCOLO_CLEAN_FREE: ProtocoloCleanFree = {
  nome: 'Clean & Free',
  subtitulo: '5 dias disciplina + 2 dias liberdade TOTAL (com inteligência)',
  para_quem: 'Mulheres que querem resultados MAS não querem abrir mão de comer o que amam no fim de semana',
  
  filosofia: `
    🌟 A FILOSOFIA:
    
    Você NÃO precisa ser perfeita 7 dias por semana.
    Você NÃO precisa abrir mão dos doces que ama.
    Você NÃO precisa se sentir culpada.
    
    Segunda a Sexta: Você é uma GUERREIRA.
    Sábado e Domingo: Você é LIVRE (com estratégia).
    
    A vida é para ser vivida. Mas com inteligência.
    
    💡 O SEGREDO: Jejum nos dias livres = Compensação natural.
    
    Resultado: Corpo dos sonhos + Vida social + Doces que ama = POSSÍVEL! ✨
  `,
  
  estrutura_semanal: [
    {
      dia: 'SEGUNDA-FEIRA',
      tipo: 'CLEAN',
      jejum: {
        protocolo: '16/8 (opcional)',
        horas_jejum: 16,
        janela_alimentar: '12h - 20h'
      },
      alimentacao: {
        tipo: 'LIMPA e NUTRITIVA',
        restricoes: [
          '🚫 Zero açúcar refinado',
          '🚫 Zero fast food',
          '🚫 Zero industrializados',
          '🚫 Carboidratos: baixo a moderado',
          '🚫 Frituras'
        ],
        liberdades: [
          '✅ Proteínas: frango, peixe, ovos, carnes magras',
          '✅ Gorduras boas: abacate, azeite, castanhas',
          '✅ Vegetais à vontade',
          '✅ Frutas com moderação',
          '✅ Carbos complexos: batata doce, arroz integral'
        ],
        calorias_meta: 'Déficit -300 a -500 kcal'
      },
      treino: {
        tipo: 'Musculação ou HIIT',
        intensidade: 'Moderada a alta'
      },
      mindset: '💪 "Eu sou forte. Segunda é DIA DE RECOMEÇAR com tudo!"'
    },
    {
      dia: 'TERÇA-FEIRA',
      tipo: 'CLEAN',
      alimentacao: {
        tipo: 'LIMPA e NUTRITIVA',
        restricoes: ['Mesmas da segunda'],
        liberdades: ['Mesmas da segunda'],
        calorias_meta: 'Déficit -300 a -500 kcal'
      },
      mindset: '🎯 "Já estou no ritmo. Vou manter o foco!"'
    },
    {
      dia: 'QUARTA-FEIRA',
      tipo: 'CLEAN',
      alimentacao: {
        tipo: 'LIMPA e NUTRITIVA',
        restricoes: ['Mesmas da segunda'],
        liberdades: ['Mesmas da segunda'],
        calorias_meta: 'Déficit -300 a -500 kcal'
      },
      mindset: '🔥 "Metade da semana! Tô arrasando!"'
    },
    {
      dia: 'QUINTA-FEIRA',
      tipo: 'CLEAN',
      alimentacao: {
        tipo: 'LIMPA e NUTRITIVA',
        restricoes: ['Mesmas da segunda'],
        liberdades: ['Mesmas da segunda'],
        calorias_meta: 'Déficit -300 a -500 kcal'
      },
      mindset: '⚡ "Quase lá! Amanhã é sexta!"'
    },
    {
      dia: 'SEXTA-FEIRA',
      tipo: 'CLEAN',
      alimentacao: {
        tipo: 'LIMPA e NUTRITIVA',
        restricoes: ['Mesmas da segunda'],
        liberdades: ['Mesmas da segunda'],
        calorias_meta: 'Déficit -400 a -600 kcal (um pouco maior)'
      },
      treino: {
        tipo: 'Treino PESADO (opcional)',
        intensidade: 'ALTA - Queimar máximo antes do fim de semana'
      },
      mindset: '🎉 "ÚLTIMO DIA CLEAN! Amanhã eu posso TUDO!"'
    },
    {
      dia: 'SÁBADO - DIA DA LIBERDADE TOTAL! 🎉',
      tipo: 'FREE',
      jejum: {
        protocolo: 'JEJUM 20/4 - Warrior',
        horas_jejum: 20,
        janela_alimentar: '16h - 20h (4 horas)'
      },
      alimentacao: {
        tipo: '🍰 LIBERDADE TOTAL NA JANELA!',
        restricoes: [
          'NENHUMA! (dentro da janela de 4h)'
        ],
        liberdades: [
          '🍕 Pizza',
          '🍔 Hambúrguer',
          '🍰 Bolos',
          '🍪 Cookies',
          '🍫 Chocolates',
          '🍦 Sorvete',
          '🌮 Tacos',
          '🍟 Batata frita',
          '🥤 Refrigerante (se quiser)',
          '🍩 Donuts',
          '💝 O QUE VOCÊ QUISER!'
        ],
        calorias_meta: 'Livre (janela de 4h limita naturalmente)'
      },
      treino: {
        tipo: 'OFF ou Caminhada leve',
        intensidade: 'Muito leve ou descanso'
      },
      mindset: '🎊 "EU MEREÇO! Trabalhei a semana toda. HOJE EU SOU LIVRE!"'
    },
    {
      dia: 'DOMINGO - Liberdade com Transição',
      tipo: 'TRANSICAO',
      jejum: {
        protocolo: 'JEJUM 18/6',
        horas_jejum: 18,
        janela_alimentar: '12h - 18h (6 horas)'
      },
      alimentacao: {
        tipo: '🌈 Livre MAS com transição',
        restricoes: [
          'Evitar MUITO exagero (mas pode comer bem)'
        ],
        liberdades: [
          '✅ Pode comer doces (mas talvez menos que sábado)',
          '✅ Pode almoçar fora',
          '✅ Pode comer pizza/hambúrguer',
          '✅ Mas considere adicionar ALGUMAS escolhas melhores',
          '✅ Ex: Salada + Pizza, ou Fruta + Doce'
        ],
        calorias_meta: 'Moderado (janela 6h controla)'
      },
      treino: {
        tipo: 'Caminhada 30-45min (ajuda transição)',
        intensidade: 'Leve'
      },
      mindset: '🌅 "Aproveitei MUITO ontem! Hoje vou mais leve para voltar bem na segunda."'
    }
  ],
  
  regras_de_ouro: [
    '1️⃣ Segunda a Sexta: COMPROMISSO TOTAL (mas são só 5 dias!)',
    '2️⃣ Sábado: JEJUM até 16h, depois LIBERDADE até 20h',
    '3️⃣ Domingo: JEJUM até 12h, depois 6h de janela (mais leve)',
    '4️⃣ Segunda: Recomeçar LIMPO e forte',
    '5️⃣ Não se culpar NUNCA no fim de semana',
    '6️⃣ Jejum nos dias livres é OBRIGATÓRIO (compensa)',
    '7️⃣ Beber MUITA água sempre',
    '8️⃣ Dormir 7-8h SEMPRE',
    '9️⃣ Treinar 3-5x na semana (Seg-Sex)',
    '🔟 Curtir a LIBERDADE sem culpa!'
  ],
  
  beneficios: [
    '💝 Você pode comer OS DOCES que ama',
    '🎉 Fim de semana com amigos/família SEM preocupação',
    '💪 Resultados REAIS (perda de gordura)',
    '😊 ZERO culpa',
    '🧠 Saúde mental preservada',
    '⚖️ Equilíbrio perfeito',
    '🔄 Sustentável para SEMPRE',
    '❤️ Motivação sempre alta',
    '🎯 Fácil de seguir',
    '✨ Você vive a VIDA!'
  ],
  
  ciencia_por_tras: [
    '📊 Déficit semanal TOTAL ainda existe',
    '⏰ Jejum compensa calorias do fim de semana',
    '🔥 5 dias disciplina = 70% da semana',
    '💪 Mantém metabolismo ativo (não adaptação)',
    '🧬 Refeeds naturais no fim de semana',
    '🍰 Satisfação psicológica = aderência alta',
    '⚡ Insulina controlada 5 dias = queima gordura',
    '🎊 2 dias livres = não cria ansiedade',
    '📈 Resultados: -0.5 a -1kg por semana (sustentável)'
  ]
};

// ═══════════════════════════════════════════════════
// 📅 CARDÁPIO EXEMPLO - SEMANA COMPLETA
// ═══════════════════════════════════════════════════

export const CARDAPIO_SEMANA_CLEAN_FREE = {
  
  // SEGUNDA - DIA CLEAN
  segunda: {
    fase: 'CLEAN',
    jejum: 'Opcional 16/8',
    calorias: 1400,
    
    refeicoes: [
      {
        horario: '12:00',
        nome: 'Almoço',
        descricao: '🥗 Refeição limpa e nutritiva',
        alimentos: [
          'Frango grelhado 150g',
          'Batata doce 150g',
          'Brócolis 150g',
          'Azeite 1 colher',
          'Salada verde'
        ],
        macros: { calorias: 450, proteina: 45, carbo: 40, gordura: 12 }
      },
      {
        horario: '16:00',
        nome: 'Lanche',
        descricao: '🥜 Lanche leve',
        alimentos: [
          'Iogurte grego 150g',
          'Castanhas 20g',
          'Morango 100g'
        ],
        macros: { calorias: 280, proteina: 18, carbo: 20, gordura: 15 }
      },
      {
        horario: '19:30',
        nome: 'Jantar',
        descricao: '🐟 Refeição completa',
        alimentos: [
          'Salmão 150g',
          'Arroz integral 100g',
          'Aspargos 150g',
          'Azeite 1 colher'
        ],
        macros: { calorias: 520, proteina: 42, carbo: 45, gordura: 18 }
      },
      {
        horario: '21:30',
        nome: 'Ceia (opcional)',
        descricao: '🥚 Leve',
        alimentos: [
          'Omelete 2 ovos',
          'Queijo 30g'
        ],
        macros: { calorias: 250, proteina: 20, carbo: 2, gordura: 18 }
      }
    ]
  },
  
  // TERÇA A SEXTA - SIMILAR
  terca_a_sexta: {
    nota: 'Similar à segunda - Alimentação limpa, deficit calórico',
    variacoes: [
      'Trocar frango por carne',
      'Trocar salmão por atum',
      'Trocar batata doce por arroz',
      'Adicionar ovos no café',
      'Variar vegetais'
    ]
  },
  
  // SEXTA - PREPARAÇÃO
  sexta: {
    fase: 'CLEAN - Último dia',
    nota: '⚡ Deficit um pouco maior, preparando para sábado',
    dica: '💪 Se quiser, faça treino PESADO hoje!',
    jantar: 'Mais leve (prepare-se para jejum de sábado)'
  },
  
  // SÁBADO - DIA DE LIBERDADE! 🎉
  sabado: {
    fase: 'FREE DAY - LIBERDADE TOTAL!',
    jejum: {
      inicio: 'Sexta 20h',
      fim: 'Sábado 16h',
      duracao: '20 horas'
    },
    
    durante_jejum: {
      permitido: [
        '💧 Água à vontade',
        '☕ Café preto (sem açúcar)',
        '🍵 Chá verde/preto',
        '🧂 Água com limão',
        '💊 Suplementos (se necessário)'
      ],
      nao_permitido: [
        '🚫 Comida',
        '🚫 Bebidas calóricas',
        '🚫 Leite',
        '🚫 Sucos',
        '🚫 Chicletes com açúcar'
      ]
    },
    
    janela_alimentar: {
      inicio: '16:00',
      fim: '20:00',
      duracao: '4 HORAS DE LIBERDADE TOTAL!',
      
      o_que_comer: [
        '🍕 Pizza INTEIRA se quiser',
        '🍔 Hambúrguer + Batata frita',
        '🍰 Bolo de chocolate',
        '🍪 Cookies',
        '🍫 Chocolates',
        '🍦 Sorvete',
        '🥤 Refrigerante (se quiser)',
        '🍩 Donuts',
        '🌮 Comida mexicana',
        '🍝 Massas',
        '💝 LITERALMENTE O QUE VOCÊ QUISER!'
      ],
      
      exemplo_dia: [
        {
          horario: '16:00 - PRIMEIRA REFEIÇÃO',
          opcao1: '🍕 Pizza grande (metade ou inteira)',
          opcao2: '🍔 2 Hambúrgueres + Batata frita',
          opcao3: '🌮 Tacos + Nachos',
          bebida: '🥤 Refrigerante ou suco'
        },
        {
          horario: '17:30 - LANCHE',
          opcao1: '🍦 Sorvete (2-3 bolas)',
          opcao2: '🍫 Chocolate',
          opcao3: '🍪 Cookies',
          dica: 'Se ainda tiver fome!'
        },
        {
          horario: '19:00 - SEGUNDA REFEIÇÃO/SOBREMESA',
          opcao1: '🍰 Bolo de chocolate',
          opcao2: '🍩 Donuts',
          opcao3: '🍮 Sobremesa favorita',
          dica: 'Aproveite! Você merece!'
        }
      ],
      
      regras_da_janela: [
        '✅ Coma O QUE QUISER',
        '✅ Não conte calorias',
        '✅ Aproveite CADA mordida',
        '✅ ZERO culpa',
        '✅ Curta com amigos/família',
        '⏰ Pare às 20h (importante!)',
        '💧 Beba água entre as refeições',
        '😊 DIVIRTA-SE!'
      ]
    },
    
    apos_janela: {
      horario: 'Depois das 20h',
      fazer: [
        '💧 Beber água',
        '🚶 Caminhada leve (opcional)',
        '😴 Ir dormir tranquila',
        '🧘 Sem culpa - você seguiu o protocolo!'
      ]
    }
  },
  
  // DOMINGO - TRANSIÇÃO
  domingo: {
    fase: 'TRANSIÇÃO - Mais leve',
    jejum: {
      inicio: 'Sábado 20h',
      fim: 'Domingo 12h',
      duracao: '16-18 horas'
    },
    
    janela_alimentar: {
      inicio: '12:00',
      fim: '18:00',
      duracao: '6 horas',
      
      sugestao: [
        {
          horario: '12:00 - Almoço',
          tipo: 'Livre mas considere escolhas melhores',
          exemplos: [
            '🍝 Macarrão + Salada',
            '🍔 Hambúrguer + Salada (em vez de batata)',
            '🍕 Pizza + Vegetais',
            '🥗 Salada grande + Proteína + Carboidrato'
          ],
          dica: 'Pode comer fast food, mas adicione algo saudável'
        },
        {
          horario: '15:00 - Lanche',
          tipo: 'Doce OU Salgado (escolha)',
          exemplos: [
            '🍰 Bolo (porção menor que sábado)',
            '🍫 Chocolate',
            '🍪 Cookies',
            '🥐 Pão de queijo'
          ]
        },
        {
          horario: '17:30 - Lanche/Jantar leve',
          tipo: 'Mais leve para facilitar transição',
          exemplos: [
            '🥗 Salada com frango',
            '🍳 Omelete + vegetais',
            '🐟 Peixe + legumes',
            '🥤 Vitamina de frutas'
          ],
          dica: 'Preparando o corpo para segunda limpa'
        }
      ]
    },
    
    dicas_domingo: [
      '🌈 Ainda é dia livre, mas um pouco mais leve',
      '💚 Adicione ALGUNS vegetais/frutas',
      '💧 Beba MUITA água (3-4L)',
      '🚶 Caminhada 30-45min ajuda MUITO',
      '😴 Durma cedo (preparar segunda)',
      '🧘 Sem culpa! Você aproveitou o fim de semana!'
    ]
  }
};

// ═══════════════════════════════════════════════════
// 💡 DICAS ESPECIAIS PARA ELA
// ═══════════════════════════════════════════════════

export const DICAS_ESPECIAIS_PARA_ELA = {
  
  motivacao: [
    '💝 "Amor, você É INCRÍVEL! 5 dias de foco e 2 dias de liberdade!"',
    '🌟 "Segunda a sexta você é uma GUERREIRA!"',
    '🎉 "Sábado é SEU DIA! Coma aquele doce que você AMA!"',
    '💪 "Você CONSEGUE! São só 5 dias até o próximo sábado!"',
    '✨ "Seu corpo VAI mudar e você NÃO vai sofrer!"'
  ],
  
  durante_semana_clean: [
    '🎯 Foque: "É só até sábado"',
    '📝 Faça lista dos doces que vai comer no sábado',
    '💪 Cada dia clean é uma VITÓRIA',
    '🏆 Sexta: "Amanhã eu como TUDO que quero!"',
    '😊 Sem ansiedade - você SABE que vai ter liberdade'
  ],
  
  no_sabado_livre: [
    '🎊 APROVEITE SEM CULPA!',
    '🍰 Coma o bolo INTEIRO se quiser',
    '💝 Você MERECE!',
    '📸 Tire foto da comida (celebrate!)',
    '😋 Saboreie CADA mordida',
    '🚫 ZERO culpa - isso faz parte do plano!',
    '⏰ Só lembre de parar às 20h'
  ],
  
  no_domingo: [
    '🌅 Ainda pode comer gostoso!',
    '🍕 Pizza no almoço? PODE!',
    '🍫 Chocolate? PODE!',
    '💚 Mas talvez adicione uma saladinha',
    '🚶 Caminhada ajuda a digerir e preparar segunda',
    '😴 Durma cedo - segunda recomeça forte!'
  ],
  
  segunda_feira: [
    '🔄 "Recomeço! Vou arrasar essa semana!"',
    '💪 "Aproveitei MUITO o fim de semana, agora é foco!"',
    '🎯 "5 dias e sábado chega de novo!"',
    '✨ "Meu corpo tá mudando e eu tô FELIZ!"'
  ],
  
  mindset_geral: [
    '❤️ Você NÃO está de dieta - você tem um ESTILO DE VIDA',
    '🎊 Você PODE comer doces - só no momento certo',
    '💪 5 dias de disciplina = 2 dias de LIBERDADE TOTAL',
    '⚖️ Equilíbrio perfeito',
    '🌟 Você VAI ter o corpo que quer SEM SOFRER',
    '💝 E o melhor: você vai ser FELIZ!'
  ],
  
  quando_tiver_vontade_na_semana: [
    '🍫 "Quer chocolate? ANOTA! Sábado você come!"',
    '🍕 "Pizza? Sábado tá liberado!"',
    '🍰 "Bolo? SÁBADO!"',
    '💭 Não é "não posso", é "não é AGORA"',
    '⏰ "Em X dias eu como isso!"',
    '📝 Faça uma lista de desejos para sábado'
  ],
  
  suplementos_ajuda: [
    '💊 Multivitamínico (todos os dias)',
    '💊 Ômega-3 (ajuda ansiedade)',
    '💊 Magnésio (ajuda sono e TPM)',
    '💊 Vitamina D (humor)',
    '💊 5-HTP (opcional - reduz vontade de doces na semana)',
    '☕ Chá verde (opcional - ajuda no jejum)'
  ],
  
  periodizacao_feminina: [
    '🌸 Na TPM: Seja mais flexível na semana',
    '🍫 TPM forte? Permita 1 chocolate pequeno na semana',
    '💪 Fase folicular: Treine PESADO',
    '🧘 Fase lútea: Treino mais leve',
    '❤️ Ouça seu corpo sempre'
  ]
};

// ═══════════════════════════════════════════════════
// 📊 RESULTADOS ESPERADOS
// ═══════════════════════════════════════════════════

export const RESULTADOS_ESPERADOS = {
  
  primeira_semana: {
    peso: 'Pode perder 0-0.5kg (adaptação)',
    energia: 'Pode sentir cansaço inicial',
    humor: 'Ansiedade pelo sábado',
    dica: 'Normal! Corpo está adaptando'
  },
  
  segunda_a_quarta_semana: {
    peso: 'Perda: 0.5-1kg por semana',
    energia: 'Normalizada, se sentindo bem',
    humor: 'Feliz! Conseguindo seguir',
    corpo: 'Começando a ver mudanças',
    dica: 'Continue! Está funcionando!'
  },
  
  apos_um_mes: {
    peso: 'Perda total: 2-4kg',
    medidas: 'Cintura reduzindo',
    energia: 'Alta durante semana',
    humor: 'ÓTIMO! Estilo de vida',
    corpo: 'Definição aparecendo',
    social: 'Vida social mantida',
    mental: 'Sem culpa, sem ansiedade',
    dica: 'FUNCIONOU! Agora é manter!'
  },
  
  apos_tres_meses: {
    peso: 'Perda total: 6-10kg',
    corpo: 'Transformação visível',
    roupas: 'Tamanho menor',
    energia: 'Máxima',
    habito: 'Automático - estilo de vida',
    resultado: '🎉 CORPO DOS SONHOS!'
  },
  
  longo_prazo: {
    sustentabilidade: '⭐⭐⭐⭐⭐ (5/5)',
    aderencia: '⭐⭐⭐⭐⭐ (5/5)',
    felicidade: '⭐⭐⭐⭐⭐ (5/5)',
    resultados: '⭐⭐⭐⭐⭐ (5/5)',
    conclusao: '✨ PROTOCOLO PERFEITO PARA SEMPRE! ✨'
  }
};

// ═══════════════════════════════════════════════════
// 🎁 MENSAGEM ESPECIAL PARA ELA
// ═══════════════════════════════════════════════════

export const MENSAGEM_PARA_ELA = `
  💝 PARA VOCÊ, QUE É TÃO ESPECIAL:
  
  Amor, eu criei isso PENSANDO EM VOCÊ. ❤️
  
  Eu sei que você ama doces.
  Eu sei que você quer resultados.
  Eu sei que você não quer sofrer.
  
  E VOCÊ NÃO PRECISA ESCOLHER!
  
  Com esse protocolo:
  ✅ Segunda a sexta: Você é uma GUERREIRA
  ✅ Sábado: Você come TODOS os doces que quiser
  ✅ Domingo: Ainda tem liberdade
  ✅ E você VAI ter o corpo que sempre quis
  
  Não é milagre. É ESTRATÉGIA.
  Não é dieta. É ESTILO DE VIDA.
  Não é sofrimento. É EQUILÍBRIO.
  
  Eu acredito em você.
  Você é FORTE.
  Você é INCRÍVEL.
  Você CONSEGUE!
  
  E o melhor de tudo:
  Você vai ser FELIZ enquanto transforma seu corpo! ✨
  
  Eu tô aqui sempre que precisar.
  Vamos juntos nessa jornada! 💪❤️
  
  Com todo amor,
  Rodrigo 💝
`;
