import { DIET_PROFILES } from './detector';
import { ALIMENTOS_DATABASE, filtrarAlimentosPorPerfil } from './alimentos-database';

interface RefeicaoGerada {
  horario: string;
  nome: string;
  alimentos: Array<{
    nome: string;
    quantidade: string;
    calorias: number;
    proteina: number;
    carboidrato: number;
    gordura: number;
  }>;
  macros: {
    calorias: number;
    proteina: number;
    carboidrato: number;
    gordura: number;
  };
}

export function gerarCardapioPorPerfil(anamnese: any, perfilId: string) {
  const perfil = DIET_PROFILES[perfilId as keyof typeof DIET_PROFILES];
  const alimentosDisponiveis = filtrarAlimentosPorPerfil(perfilId);
  
  // Calcular necessidades calóricas
  const peso = parseFloat(anamnese.peso);
  const altura = parseFloat(anamnese.altura);
  const idade = anamnese.idade;
  const sexo = anamnese.sexo;
  const objetivo = anamnese.objetivo;
  const nivelAtividade = anamnese.praticaExercicio ? 1.55 : 1.2;
  
  // TMB (Mifflin-St Jeor)
  let tmb;
  if (sexo === 'masculino') {
    tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
  } else {
    tmb = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
  }
  
  // GET (Gasto Energético Total)
  let get = tmb * nivelAtividade;
  
  // Ajustar baseado no objetivo
  let caloriasAlvo = get;
  if (objetivo === 'perda de peso') {
    caloriasAlvo = get - 500; // Déficit de 500 kcal
  } else if (objetivo === 'ganho de massa') {
    caloriasAlvo = get + 400; // Superávit de 400 kcal
  }
  
  // Calcular macros baseado no perfil
  const proteinaGramas = Math.round((caloriasAlvo * (perfil.macros_padrao.proteina / 100)) / 4);
  const carboidratoGramas = Math.round((caloriasAlvo * (perfil.macros_padrao.carboidrato / 100)) / 4);
  const gorduraGramas = Math.round((caloriasAlvo * (perfil.macros_padrao.gordura / 100)) / 9);
  
  // Gerar refeições
  const refeicoes = gerarRefeicoesPorPerfil(
    perfilId,
    alimentosDisponiveis,
    caloriasAlvo,
    { proteina: proteinaGramas, carboidrato: carboidratoGramas, gordura: gorduraGramas },
    anamnese
  );
  
  return {
    perfil,
    caloriasAlvo: Math.round(caloriasAlvo),
    macrosAlvo: {
      proteina: proteinaGramas,
      carboidrato: carboidratoGramas,
      gordura: gorduraGramas
    },
    refeicoes,
    informacoes_adicionais: gerarInformacoesAdicionais(perfil, anamnese),
    suplementos_sugeridos: perfil.suplementos_sugeridos || [],
    suplementos_obrigatorios: perfil.suplementos_obrigatorios || []
  };
}

function gerarRefeicoesPorPerfil(
  perfilId: string,
  alimentos: any,
  caloriasAlvo: number,
  macrosAlvo: any,
  anamnese: any
): RefeicaoGerada[] {
  
  // Distribuição de calorias por refeição
  const distribuicao = {
    cafeDaManha: 0.25,
    lancheManha: 0.10,
    almoco: 0.30,
    lancheTarde: 0.10,
    jantar: 0.25
  };
  
  const refeicoes: RefeicaoGerada[] = [];
  
  // CAFÉ DA MANHÃ
  refeicoes.push(gerarCafeDaManha(perfilId, caloriasAlvo * distribuicao.cafeDaManha, alimentos, anamnese));
  
  // LANCHE DA MANHÃ
  refeicoes.push(gerarLanche(perfilId, caloriasAlvo * distribuicao.lancheManha, alimentos, 'Lanche da Manhã', '10:00'));
  
  // ALMOÇO
  refeicoes.push(gerarAlmoco(perfilId, caloriasAlvo * distribuicao.almoco, alimentos, anamnese));
  
  // LANCHE DA TARDE
  refeicoes.push(gerarLanche(perfilId, caloriasAlvo * distribuicao.lancheTarde, alimentos, 'Lanche da Tarde', '16:00'));
  
  // JANTAR
  refeicoes.push(gerarJantar(perfilId, caloriasAlvo * distribuicao.jantar, alimentos, anamnese));
  
  return refeicoes;
}

function gerarCafeDaManha(perfilId: string, calorias: number, alimentos: any, anamnese: any): RefeicaoGerada {
  const items: any[] = [];
  
  switch (perfilId) {
    case 'VEGANA':
      items.push({
        nome: 'Aveia',
        quantidade: '50g',
        calorias: 170,
        proteina: 6,
        carboidrato: 30,
        gordura: 3
      });
      items.push({
        nome: 'Leite de Amêndoas',
        quantidade: '200ml',
        calorias: 30,
        proteina: 1,
        carboidrato: 1,
        gordura: 2.5
      });
      items.push({
        nome: 'Banana',
        quantidade: '1 unidade',
        calorias: 105,
        proteina: 1,
        carboidrato: 27,
        gordura: 0.4
      });
      items.push({
        nome: 'Pasta de Amendoim',
        quantidade: '15g',
        calorias: 90,
        proteina: 4,
        carboidrato: 3,
        gordura: 8
      });
      break;
      
    case 'CETOGENICA':
      items.push({
        nome: 'Ovos Mexidos',
        quantidade: '3 unidades',
        calorias: 210,
        proteina: 18,
        carboidrato: 1.5,
        gordura: 15
      });
      items.push({
        nome: 'Abacate',
        quantidade: '1/2 unidade',
        calorias: 120,
        proteina: 1.5,
        carboidrato: 6,
        gordura: 11
      });
      items.push({
        nome: 'Queijo',
        quantidade: '30g',
        calorias: 110,
        proteina: 7,
        carboidrato: 1,
        gordura: 9
      });
      items.push({
        nome: 'Café com Manteiga',
        quantidade: '1 xícara',
        calorias: 100,
        proteina: 0,
        carboidrato: 0,
        gordura: 11
      });
      break;
      
    case 'VEGETARIANA':
      items.push({
        nome: 'Ovos Mexidos',
        quantidade: '2 unidades',
        calorias: 140,
        proteina: 12,
        carboidrato: 1,
        gordura: 10
      });
      items.push({
        nome: 'Pão Integral',
        quantidade: '2 fatias',
        calorias: 140,
        proteina: 6,
        carboidrato: 26,
        gordura: 2
      });
      items.push({
        nome: 'Queijo Branco',
        quantidade: '30g',
        calorias: 70,
        proteina: 6,
        carboidrato: 2,
        gordura: 5
      });
      items.push({
        nome: 'Tomate',
        quantidade: '1 unidade',
        calorias: 20,
        proteina: 1,
        carboidrato: 4,
        gordura: 0
      });
      break;
      
    case 'PALEO':
      items.push({
        nome: 'Ovos Cozidos',
        quantidade: '3 unidades',
        calorias: 210,
        proteina: 18,
        carboidrato: 1.5,
        gordura: 15
      });
      items.push({
        nome: 'Batata Doce',
        quantidade: '100g',
        calorias: 86,
        proteina: 2,
        carboidrato: 20,
        gordura: 0.1
      });
      items.push({
        nome: 'Abacate',
        quantidade: '1/4 unidade',
        calorias: 60,
        proteina: 0.8,
        carboidrato: 3,
        gordura: 5.5
      });
      break;
      
    default: // FLEXITARIANA
      items.push({
        nome: 'Ovos Mexidos',
        quantidade: '2 unidades',
        calorias: 140,
        proteina: 12,
        carboidrato: 1,
        gordura: 10
      });
      items.push({
        nome: 'Pão Integral',
        quantidade: '2 fatias',
        calorias: 140,
        proteina: 6,
        carboidrato: 26,
        gordura: 2
      });
      items.push({
        nome: 'Abacate',
        quantidade: '1/4 unidade',
        calorias: 60,
        proteina: 0.8,
        carboidrato: 3,
        gordura: 5.5
      });
      items.push({
        nome: 'Café',
        quantidade: '1 xícara',
        calorias: 5,
        proteina: 0,
        carboidrato: 1,
        gordura: 0
      });
  }
  
  const macros = items.reduce((acc, item) => ({
    calorias: acc.calorias + item.calorias,
    proteina: acc.proteina + item.proteina,
    carboidrato: acc.carboidrato + item.carboidrato,
    gordura: acc.gordura + item.gordura
  }), { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 });
  
  return {
    horario: '07:00',
    nome: 'Café da Manhã',
    alimentos: items,
    macros
  };
}

function gerarLanche(perfilId: string, calorias: number, alimentos: any, nome: string, horario: string): RefeicaoGerada {
  const items: any[] = [];
  
  switch (perfilId) {
    case 'VEGANA':
      items.push({
        nome: 'Frutas Vermelhas',
        quantidade: '100g',
        calorias: 50,
        proteina: 1,
        carboidrato: 12,
        gordura: 0.3
      });
      items.push({
        nome: 'Castanhas',
        quantidade: '30g',
        calorias: 195,
        proteina: 6,
        carboidrato: 4.5,
        gordura: 18
      });
      break;
      
    case 'CETOGENICA':
      items.push({
        nome: 'Macadâmias',
        quantidade: '30g',
        calorias: 215,
        proteina: 2,
        carboidrato: 4,
        gordura: 22
      });
      items.push({
        nome: 'Queijo',
        quantidade: '30g',
        calorias: 110,
        proteina: 7,
        carboidrato: 1,
        gordura: 9
      });
      break;
      
    case 'VEGETARIANA':
      items.push({
        nome: 'Iogurte Grego',
        quantidade: '150g',
        calorias: 150,
        proteina: 15,
        carboidrato: 6,
        gordura: 0.6
      });
      items.push({
        nome: 'Granola',
        quantidade: '30g',
        calorias: 120,
        proteina: 3,
        carboidrato: 20,
        gordura: 3
      });
      break;
      
    default:
      items.push({
        nome: 'Whey Protein',
        quantidade: '30g',
        calorias: 120,
        proteina: 24,
        carboidrato: 3,
        gordura: 1.5
      });
      items.push({
        nome: 'Banana',
        quantidade: '1 unidade',
        calorias: 105,
        proteina: 1,
        carboidrato: 27,
        gordura: 0.4
      });
  }
  
  const macros = items.reduce((acc, item) => ({
    calorias: acc.calorias + item.calorias,
    proteina: acc.proteina + item.proteina,
    carboidrato: acc.carboidrato + item.carboidrato,
    gordura: acc.gordura + item.gordura
  }), { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 });
  
  return {
    horario,
    nome,
    alimentos: items,
    macros
  };
}

function gerarAlmoco(perfilId: string, calorias: number, alimentos: any, anamnese: any): RefeicaoGerada {
  const items: any[] = [];
  
  switch (perfilId) {
    case 'VEGANA':
      items.push({
        nome: 'Tofu Grelhado',
        quantidade: '150g',
        calorias: 120,
        proteina: 12,
        carboidrato: 3,
        gordura: 6
      });
      items.push({
        nome: 'Arroz Integral',
        quantidade: '150g',
        calorias: 165,
        proteina: 4,
        carboidrato: 35,
        gordura: 1.5
      });
      items.push({
        nome: 'Feijão',
        quantidade: '100g',
        calorias: 130,
        proteina: 9,
        carboidrato: 24,
        gordura: 0.5
      });
      items.push({
        nome: 'Brócolis',
        quantidade: '100g',
        calorias: 34,
        proteina: 2.8,
        carboidrato: 7,
        gordura: 0.4
      });
      items.push({
        nome: 'Salada Verde',
        quantidade: '100g',
        calorias: 25,
        proteina: 1.5,
        carboidrato: 5,
        gordura: 0.2
      });
      break;
      
    case 'CETOGENICA':
      items.push({
        nome: 'Frango Grelhado',
        quantidade: '200g',
        calorias: 330,
        proteina: 62,
        carboidrato: 0,
        gordura: 7
      });
      items.push({
        nome: 'Abacate',
        quantidade: '1/2 unidade',
        calorias: 120,
        proteina: 1.5,
        carboidrato: 6,
        gordura: 11
      });
      items.push({
        nome: 'Brócolis',
        quantidade: '150g',
        calorias: 50,
        proteina: 4,
        carboidrato: 10,
        gordura: 0.6
      });
      items.push({
        nome: 'Azeite',
        quantidade: '1 colher sopa',
        calorias: 120,
        proteina: 0,
        carboidrato: 0,
        gordura: 14
      });
      break;
      
    case 'VEGETARIANA':
      items.push({
        nome: 'Ovos Cozidos',
        quantidade: '2 unidades',
        calorias: 140,
        proteina: 12,
        carboidrato: 1,
        gordura: 10
      });
      items.push({
        nome: 'Arroz Integral',
        quantidade: '150g',
        calorias: 165,
        proteina: 4,
        carboidrato: 35,
        gordura: 1.5
      });
      items.push({
        nome: 'Feijão',
        quantidade: '100g',
        calorias: 130,
        proteina: 9,
        carboidrato: 24,
        gordura: 0.5
      });
      items.push({
        nome: 'Salada',
        quantidade: '150g',
        calorias: 50,
        proteina: 2,
        carboidrato: 10,
        gordura: 0.5
      });
      items.push({
        nome: 'Legumes',
        quantidade: '100g',
        calorias: 40,
        proteina: 1.5,
        carboidrato: 8,
        gordura: 0.3
      });
      break;
      
    default: // FLEXITARIANA
      items.push({
        nome: 'Frango Grelhado',
        quantidade: '150g',
        calorias: 248,
        proteina: 47,
        carboidrato: 0,
        gordura: 5.4
      });
      items.push({
        nome: 'Arroz Integral',
        quantidade: '150g',
        calorias: 165,
        proteina: 4,
        carboidrato: 35,
        gordura: 1.5
      });
      items.push({
        nome: 'Feijão',
        quantidade: '100g',
        calorias: 130,
        proteina: 9,
        carboidrato: 24,
        gordura: 0.5
      });
      items.push({
        nome: 'Brócolis',
        quantidade: '100g',
        calorias: 34,
        proteina: 2.8,
        carboidrato: 7,
        gordura: 0.4
      });
      items.push({
        nome: 'Salada',
        quantidade: '100g',
        calorias: 25,
        proteina: 1.5,
        carboidrato: 5,
        gordura: 0.2
      });
  }
  
  const macros = items.reduce((acc, item) => ({
    calorias: acc.calorias + item.calorias,
    proteina: acc.proteina + item.proteina,
    carboidrato: acc.carboidrato + item.carboidrato,
    gordura: acc.gordura + item.gordura
  }), { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 });
  
  return {
    horario: '12:30',
    nome: 'Almoço',
    alimentos: items,
    macros
  };
}

function gerarJantar(perfilId: string, calorias: number, alimentos: any, anamnese: any): RefeicaoGerada {
  const items: any[] = [];
  
  switch (perfilId) {
    case 'VEGANA':
      items.push({
        nome: 'Grão de Bico',
        quantidade: '150g',
        calorias: 248,
        proteina: 14,
        carboidrato: 40,
        gordura: 4.5
      });
      items.push({
        nome: 'Quinoa',
        quantidade: '100g',
        calorias: 120,
        proteina: 4.4,
        carboidrato: 21,
        gordura: 1.9
      });
      items.push({
        nome: 'Vegetais Refogados',
        quantidade: '150g',
        calorias: 70,
        proteina: 3,
        carboidrato: 12,
        gordura: 1
      });
      items.push({
        nome: 'Salada',
        quantidade: '100g',
        calorias: 25,
        proteina: 1.5,
        carboidrato: 5,
        gordura: 0.2
      });
      break;
      
    case 'CETOGENICA':
      items.push({
        nome: 'Salmão',
        quantidade: '150g',
        calorias: 280,
        proteina: 34,
        carboidrato: 0,
        gordura: 15
      });
      items.push({
        nome: 'Aspargos',
        quantidade: '150g',
        calorias: 30,
        proteina: 3,
        carboidrato: 6,
        gordura: 0.2
      });
      items.push({
        nome: 'Manteiga',
        quantidade: '10g',
        calorias: 75,
        proteina: 0,
        carboidrato: 0,
        gordura: 8.5
      });
      items.push({
        nome: 'Salada Verde',
        quantidade: '100g',
        calorias: 25,
        proteina: 1.5,
        carboidrato: 5,
        gordura: 0.2
      });
      break;
      
    case 'VEGETARIANA':
      items.push({
        nome: 'Queijo Cottage',
        quantidade: '150g',
        calorias: 147,
        proteina: 17,
        carboidrato: 4.5,
        gordura: 6
      });
      items.push({
        nome: 'Batata Doce',
        quantidade: '150g',
        calorias: 129,
        proteina: 3,
        carboidrato: 30,
        gordura: 0.2
      });
      items.push({
        nome: 'Brócolis',
        quantidade: '100g',
        calorias: 34,
        proteina: 2.8,
        carboidrato: 7,
        gordura: 0.4
      });
      items.push({
        nome: 'Salada',
        quantidade: '100g',
        calorias: 25,
        proteina: 1.5,
        carboidrato: 5,
        gordura: 0.2
      });
      break;
      
    default: // FLEXITARIANA
      items.push({
        nome: 'Salmão',
        quantidade: '150g',
        calorias: 280,
        proteina: 34,
        carboidrato: 0,
        gordura: 15
      });
      items.push({
        nome: 'Batata Doce',
        quantidade: '120g',
        calorias: 103,
        proteina: 2.4,
        carboidrato: 24,
        gordura: 0.1
      });
      items.push({
        nome: 'Brócolis',
        quantidade: '100g',
        calorias: 34,
        proteina: 2.8,
        carboidrato: 7,
        gordura: 0.4
      });
      items.push({
        nome: 'Salada',
        quantidade: '100g',
        calorias: 25,
        proteina: 1.5,
        carboidrato: 5,
        gordura: 0.2
      });
  }
  
  const macros = items.reduce((acc, item) => ({
    calorias: acc.calorias + item.calorias,
    proteina: acc.proteina + item.proteina,
    carboidrato: acc.carboidrato + item.carboidrato,
    gordura: acc.gordura + item.gordura
  }), { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 });
  
  return {
    horario: '19:30',
    nome: 'Jantar',
    alimentos: items,
    macros
  };
}

function gerarInformacoesAdicionais(perfil: any, anamnese: any) {
  const infos: string[] = [];
  
  // Informações baseadas no perfil
  switch (perfil.id) {
    case 'vegana':
      infos.push('⚠️ IMPORTANTE: Suplementar Vitamina B12 é OBRIGATÓRIO');
      infos.push('💊 Considere suplementar: Ferro, Ômega-3 (algas), Vitamina D');
      infos.push('🥜 Combine leguminosas + cereais para proteína completa');
      infos.push('🌱 Consuma fontes de cálcio: brócolis, tofu, leite vegetal fortificado');
      break;
      
    case 'cetogenica':
      infos.push('💧 Beba MUITA água (3-4L/dia)');
      infos.push('🧂 Não tenha medo do sal! Você precisa de eletrólitos');
      infos.push('📊 Monitore cetonas (sangue ou urina)');
      infos.push('⚡ "Keto flu" é normal nos primeiros 3-7 dias');
      infos.push('🥑 Priorize gorduras boas (abacate, azeite, oleaginosas)');
      break;
      
    case 'vegetariana':
      infos.push('🥚 Ovos são excelente fonte proteica');
      infos.push('🧀 Laticínios fornecem B12 e cálcio');
      infos.push('💊 Considere suplementar: Ferro, Ômega-3');
      break;
      
    case 'para-diabetes':
      infos.push('📊 Monitore glicemia regularmente');
      infos.push('🕐 Fracione bem as refeições (5-6x/dia)');
      infos.push('🚫 Evite carboidratos de alto índice glicêmico');
      infos.push('🥗 Priorize fibras em TODAS as refeições');
      break;
  }
  
  // Informações baseadas em exames
  if (anamnese.analiseExames?.alertas?.length > 0) {
    infos.push('⚠️ ATENÇÃO: Consulte seus resultados de exames na página "Minha Anamnese"');
  }
  
  // Informações baseadas em objetivos
  if (anamnese.objetivo === 'ganho de massa') {
    infos.push('💪 Proteína pós-treino em até 2h');
    infos.push('🍚 Carboidratos ao redor do treino');
    infos.push('😴 Durma 7-9h por noite para recuperação');
  } else if (anamnese.objetivo === 'perda de peso') {
    infos.push('⚖️ Pese-se 1x por semana, sempre no mesmo horário');
    infos.push('📸 Tire fotos semanais para acompanhar evolução');
    infos.push('🚫 Evite "dia do lixo", prefira refeição livre');
  }
  
  return infos;
}
