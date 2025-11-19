/**
 * SEED DE ALIMENTOS BRASILEIROS
 * Baseado na Tabela TACO e alimentos comuns do dia-a-dia
 *
 * Top 100 alimentos mais usados em dietas brasileiras
 */

import { FoodData, FoodCategory } from './types';

export const BRAZILIAN_FOODS: Omit<FoodData, 'id'>[] = [
  // ============================================
  // PROTEÍNAS - CARNES
  // ============================================
  {
    name: 'Frango, peito, grelhado',
    category: 'protein',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sodium: 63,
    commonPortion: '1 filé médio',
    commonPortionGrams: 120,
    isCommon: true,
    isBrazilian: true,
    tags: ['frango', 'ave', 'magro', 'grelhado']
  },
  {
    name: 'Frango, peito, cozido',
    category: 'protein',
    calories: 159,
    protein: 32,
    carbs: 0,
    fat: 3,
    fiber: 0,
    sodium: 60,
    isCommon: true,
    isBrazilian: true,
    tags: ['frango', 'ave', 'magro', 'cozido']
  },
  {
    name: 'Carne bovina, patinho, grelhado',
    category: 'protein',
    calories: 219,
    protein: 36,
    carbs: 0,
    fat: 7.5,
    fiber: 0,
    sodium: 57,
    commonPortion: '1 bife médio',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['carne', 'boi', 'magro']
  },
  {
    name: 'Carne bovina, alcatra, grelhada',
    category: 'protein',
    calories: 242,
    protein: 30,
    carbs: 0,
    fat: 13,
    fiber: 0,
    sodium: 59,
    isCommon: true,
    isBrazilian: true,
    tags: ['carne', 'boi']
  },
  {
    name: 'Carne moída, magra, refogada',
    category: 'protein',
    calories: 219,
    protein: 26,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sodium: 64,
    commonPortion: '1 concha',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['carne', 'boi', 'moída']
  },
  {
    name: 'Peixe, tilápia, grelhada',
    category: 'protein',
    calories: 128,
    protein: 26,
    carbs: 0,
    fat: 2.7,
    fiber: 0,
    sodium: 52,
    commonPortion: '1 filé',
    commonPortionGrams: 120,
    isCommon: true,
    isBrazilian: true,
    tags: ['peixe', 'magro', 'grelhado']
  },
  {
    name: 'Peixe, salmão, grelhado',
    category: 'protein',
    calories: 211,
    protein: 29,
    carbs: 0,
    fat: 10,
    fiber: 0,
    sodium: 59,
    isCommon: true,
    isBrazilian: false,
    tags: ['peixe', 'ômega3']
  },
  {
    name: 'Ovo de galinha, inteiro, cozido',
    category: 'protein',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    sodium: 124,
    commonPortion: '1 unidade média',
    commonPortionGrams: 50,
    isCommon: true,
    isBrazilian: true,
    tags: ['ovo', 'cozido']
  },
  {
    name: 'Ovo de galinha, clara, cozida',
    category: 'protein',
    calories: 52,
    protein: 11,
    carbs: 0.7,
    fat: 0.2,
    fiber: 0,
    sodium: 166,
    commonPortion: '1 unidade',
    commonPortionGrams: 33,
    isCommon: true,
    isBrazilian: true,
    tags: ['ovo', 'clara', 'magro']
  },
  {
    name: 'Peru, peito, fatiado',
    category: 'protein',
    calories: 103,
    protein: 22,
    carbs: 1.2,
    fat: 1.2,
    fiber: 0,
    sodium: 1050,
    commonPortion: '3 fatias',
    commonPortionGrams: 30,
    isCommon: true,
    isBrazilian: true,
    tags: ['peru', 'ave', 'magro', 'frio']
  },

  // ============================================
  // CARBOIDRATOS - GRÃOS E CEREAIS
  // ============================================
  {
    name: 'Arroz branco, cozido',
    category: 'carbohydrate',
    calories: 130,
    protein: 2.5,
    carbs: 28,
    fat: 0.2,
    fiber: 0.3,
    sodium: 1,
    commonPortion: '1 escumadeira',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['arroz', 'cozido', 'básico']
  },
  {
    name: 'Arroz integral, cozido',
    category: 'carbohydrate',
    calories: 124,
    protein: 2.6,
    carbs: 26,
    fat: 1,
    fiber: 2.7,
    sodium: 1,
    isCommon: true,
    isBrazilian: true,
    tags: ['arroz', 'integral', 'cozido']
  },
  {
    name: 'Batata doce, cozida',
    category: 'carbohydrate',
    calories: 77,
    protein: 0.6,
    carbs: 18,
    fat: 0.1,
    fiber: 2.2,
    sodium: 27,
    commonPortion: '1 unidade média',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['batata', 'doce', 'cozida', 'tuberculo']
  },
  {
    name: 'Batata inglesa, cozida',
    category: 'carbohydrate',
    calories: 52,
    protein: 1.2,
    carbs: 11,
    fat: 0.1,
    fiber: 1.3,
    sodium: 5,
    commonPortion: '1 unidade média',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['batata', 'inglesa', 'cozida']
  },
  {
    name: 'Mandioca, cozida',
    category: 'carbohydrate',
    calories: 125,
    protein: 0.6,
    carbs: 30,
    fat: 0.3,
    fiber: 1.6,
    sodium: 2,
    commonPortion: '1 pedaço médio',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['mandioca', 'aipim', 'macaxeira', 'cozida']
  },
  {
    name: 'Macarrão, massa cozida',
    category: 'carbohydrate',
    calories: 135,
    protein: 5,
    carbs: 26,
    fat: 0.9,
    fiber: 1.2,
    sodium: 1,
    commonPortion: '1 escumadeira',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['macarrão', 'massa', 'cozida']
  },
  {
    name: 'Macarrão integral, cozido',
    category: 'carbohydrate',
    calories: 117,
    protein: 5,
    carbs: 23,
    fat: 1.3,
    fiber: 4,
    sodium: 4,
    isCommon: true,
    isBrazilian: true,
    tags: ['macarrão', 'integral', 'cozida']
  },
  {
    name: 'Pão francês',
    category: 'carbohydrate',
    calories: 300,
    protein: 8,
    carbs: 58,
    fat: 3.3,
    fiber: 2.3,
    sodium: 648,
    commonPortion: '1 unidade',
    commonPortionGrams: 50,
    isCommon: true,
    isBrazilian: true,
    tags: ['pão', 'francês']
  },
  {
    name: 'Pão integral',
    category: 'carbohydrate',
    calories: 253,
    protein: 8.4,
    carbs: 49,
    fat: 3.3,
    fiber: 6.9,
    sodium: 524,
    commonPortion: '2 fatias',
    commonPortionGrams: 50,
    isCommon: true,
    isBrazilian: true,
    tags: ['pão', 'integral']
  },
  {
    name: 'Tapioca, crepioca (ovo + tapioca)',
    category: 'carbohydrate',
    calories: 180,
    protein: 6,
    carbs: 30,
    fat: 4,
    fiber: 0.5,
    sodium: 80,
    commonPortion: '1 unidade',
    commonPortionGrams: 80,
    isCommon: true,
    isBrazilian: true,
    tags: ['tapioca', 'crepioca', 'ovo']
  },
  {
    name: 'Aveia em flocos',
    category: 'carbohydrate',
    calories: 394,
    protein: 13.9,
    carbs: 66.6,
    fat: 8.5,
    fiber: 9.1,
    sodium: 5,
    commonPortion: '3 colheres de sopa',
    commonPortionGrams: 30,
    isCommon: true,
    isBrazilian: true,
    tags: ['aveia', 'cereal', 'fibra']
  },

  // ============================================
  // LEGUMINOSAS
  // ============================================
  {
    name: 'Feijão preto, cozido',
    category: 'legume',
    calories: 77,
    protein: 4.5,
    carbs: 14,
    fat: 0.5,
    fiber: 8.4,
    sodium: 2,
    commonPortion: '1 concha',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['feijão', 'preto', 'cozido']
  },
  {
    name: 'Feijão carioca, cozido',
    category: 'legume',
    calories: 76,
    protein: 4.8,
    carbs: 13.6,
    fat: 0.5,
    fiber: 8.5,
    sodium: 2,
    isCommon: true,
    isBrazilian: true,
    tags: ['feijão', 'carioca', 'cozido']
  },
  {
    name: 'Lentilha, cozida',
    category: 'legume',
    calories: 93,
    protein: 6.3,
    carbs: 16,
    fat: 0.5,
    fiber: 7.9,
    sodium: 2,
    commonPortion: '1 concha',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['lentilha', 'cozida']
  },
  {
    name: 'Grão de bico, cozido',
    category: 'legume',
    calories: 121,
    protein: 6.8,
    carbs: 19.7,
    fat: 1.7,
    fiber: 7.6,
    sodium: 5,
    isCommon: true,
    isBrazilian: true,
    tags: ['grão', 'bico', 'cozido']
  },

  // ============================================
  // VEGETAIS E VERDURAS
  // ============================================
  {
    name: 'Brócolis, cozido',
    category: 'vegetable',
    calories: 25,
    protein: 2.4,
    carbs: 4.1,
    fat: 0.2,
    fiber: 3.1,
    sodium: 25,
    commonPortion: '1 xícara',
    commonPortionGrams: 80,
    isCommon: true,
    isBrazilian: true,
    tags: ['brócolis', 'verde', 'cozido']
  },
  {
    name: 'Couve-flor, cozida',
    category: 'vegetable',
    calories: 20,
    protein: 1.6,
    carbs: 3.5,
    fat: 0.3,
    fiber: 2.3,
    sodium: 13,
    isCommon: true,
    isBrazilian: true,
    tags: ['couve', 'flor', 'cozida']
  },
  {
    name: 'Alface, crespa, crua',
    category: 'vegetable',
    calories: 11,
    protein: 1.3,
    carbs: 1.7,
    fat: 0.2,
    fiber: 2.1,
    sodium: 9,
    commonPortion: '2 folhas',
    commonPortionGrams: 20,
    isCommon: true,
    isBrazilian: true,
    tags: ['alface', 'folha', 'crua', 'salada']
  },
  {
    name: 'Tomate, cru',
    category: 'vegetable',
    calories: 15,
    protein: 1.1,
    carbs: 3.1,
    fat: 0.2,
    fiber: 1.2,
    sodium: 4,
    commonPortion: '1 unidade média',
    commonPortionGrams: 80,
    isCommon: true,
    isBrazilian: true,
    tags: ['tomate', 'cru', 'salada']
  },
  {
    name: 'Cenoura, crua',
    category: 'vegetable',
    calories: 34,
    protein: 1.3,
    carbs: 7.7,
    fat: 0.2,
    fiber: 3.2,
    sodium: 42,
    commonPortion: '1 unidade média',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['cenoura', 'crua', 'salada']
  },
  {
    name: 'Pepino, cru',
    category: 'vegetable',
    calories: 10,
    protein: 0.6,
    carbs: 2.2,
    fat: 0.1,
    fiber: 0.6,
    sodium: 2,
    commonPortion: '1/2 unidade',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['pepino', 'cru', 'salada']
  },
  {
    name: 'Abobrinha, cozida',
    category: 'vegetable',
    calories: 20,
    protein: 1.2,
    carbs: 4.3,
    fat: 0.2,
    fiber: 2.1,
    sodium: 3,
    isCommon: true,
    isBrazilian: true,
    tags: ['abobrinha', 'cozida']
  },
  {
    name: 'Espinafre, refogado',
    category: 'vegetable',
    calories: 28,
    protein: 2.9,
    carbs: 4.2,
    fat: 0.4,
    fiber: 3.3,
    sodium: 76,
    commonPortion: '1 colher de servir',
    commonPortionGrams: 50,
    isCommon: true,
    isBrazilian: true,
    tags: ['espinafre', 'verde', 'refogado']
  },
  {
    name: 'Couve, refogada',
    category: 'vegetable',
    calories: 29,
    protein: 3.3,
    carbs: 4.5,
    fat: 0.5,
    fiber: 3.6,
    sodium: 18,
    isCommon: true,
    isBrazilian: true,
    tags: ['couve', 'verde', 'refogada']
  },

  // ============================================
  // FRUTAS
  // ============================================
  {
    name: 'Banana, prata, crua',
    category: 'fruit',
    calories: 98,
    protein: 1.3,
    carbs: 26,
    fat: 0.1,
    fiber: 2,
    sodium: 1,
    commonPortion: '1 unidade média',
    commonPortionGrams: 60,
    isCommon: true,
    isBrazilian: true,
    tags: ['banana', 'prata']
  },
  {
    name: 'Maçã, crua',
    category: 'fruit',
    calories: 63,
    protein: 0.3,
    carbs: 17,
    fat: 0.2,
    fiber: 1.3,
    sodium: 1,
    commonPortion: '1 unidade média',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['maçã']
  },
  {
    name: 'Morango, cru',
    category: 'fruit',
    calories: 30,
    protein: 0.9,
    carbs: 6.8,
    fat: 0.3,
    fiber: 1.7,
    sodium: 1,
    commonPortion: '5 unidades',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['morango', 'berry']
  },
  {
    name: 'Mamão papaya, cru',
    category: 'fruit',
    calories: 40,
    protein: 0.8,
    carbs: 10,
    fat: 0.1,
    fiber: 1.8,
    sodium: 3,
    commonPortion: '1 fatia',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['mamão', 'papaya']
  },
  {
    name: 'Abacaxi, cru',
    category: 'fruit',
    calories: 48,
    protein: 1.2,
    carbs: 12,
    fat: 0.1,
    fiber: 1.3,
    sodium: 1,
    commonPortion: '1 rodela',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['abacaxi']
  },
  {
    name: 'Melancia, crua',
    category: 'fruit',
    calories: 33,
    protein: 0.9,
    carbs: 8,
    fat: 0.2,
    fiber: 0.3,
    sodium: 1,
    commonPortion: '1 fatia',
    commonPortionGrams: 200,
    isCommon: true,
    isBrazilian: true,
    tags: ['melancia', 'hidratante']
  },

  // ============================================
  // LATICÍNIOS
  // ============================================
  {
    name: 'Leite desnatado',
    category: 'dairy',
    calories: 35,
    protein: 3.4,
    carbs: 4.9,
    fat: 0.2,
    fiber: 0,
    sodium: 51,
    commonPortion: '1 copo (200ml)',
    commonPortionGrams: 200,
    isCommon: true,
    isBrazilian: true,
    tags: ['leite', 'desnatado', 'magro']
  },
  {
    name: 'Iogurte natural desnatado',
    category: 'dairy',
    calories: 51,
    protein: 4.8,
    carbs: 7.5,
    fat: 0.2,
    fiber: 0,
    sodium: 62,
    commonPortion: '1 pote (170g)',
    commonPortionGrams: 170,
    isCommon: true,
    isBrazilian: true,
    tags: ['iogurte', 'natural', 'desnatado']
  },
  {
    name: 'Queijo cottage',
    category: 'dairy',
    calories: 102,
    protein: 12.5,
    carbs: 4.1,
    fat: 4,
    fiber: 0,
    sodium: 350,
    commonPortion: '2 colheres de sopa',
    commonPortionGrams: 50,
    isCommon: true,
    isBrazilian: true,
    tags: ['queijo', 'cottage', 'magro']
  },
  {
    name: 'Queijo minas frescal',
    category: 'dairy',
    calories: 264,
    protein: 17.4,
    carbs: 2.9,
    fat: 21,
    fiber: 0,
    sodium: 396,
    commonPortion: '1 fatia',
    commonPortionGrams: 30,
    isCommon: true,
    isBrazilian: true,
    tags: ['queijo', 'minas', 'frescal']
  },
  {
    name: 'Requeijão light',
    category: 'dairy',
    calories: 158,
    protein: 9,
    carbs: 5.6,
    fat: 11,
    fiber: 0,
    sodium: 420,
    commonPortion: '1 colher de sopa',
    commonPortionGrams: 20,
    isCommon: true,
    isBrazilian: true,
    tags: ['requeijão', 'light']
  },

  // ============================================
  // GORDURAS SAUDÁVEIS
  // ============================================
  {
    name: 'Azeite de oliva extra virgem',
    category: 'fat',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    sodium: 2,
    commonPortion: '1 colher de sopa',
    commonPortionGrams: 13,
    isCommon: true,
    isBrazilian: false,
    tags: ['azeite', 'oliva', 'gordura', 'saudável']
  },
  {
    name: 'Abacate, cru',
    category: 'fat',
    calories: 96,
    protein: 1.2,
    carbs: 6,
    fat: 8.4,
    fiber: 6.3,
    sodium: 2,
    commonPortion: '1/2 unidade',
    commonPortionGrams: 100,
    isCommon: true,
    isBrazilian: true,
    tags: ['abacate', 'gordura', 'saudável']
  },
  {
    name: 'Castanha do Pará',
    category: 'nut_seed',
    calories: 643,
    protein: 14.5,
    carbs: 15,
    fat: 63.5,
    fiber: 7.9,
    sodium: 1,
    commonPortion: '2 unidades',
    commonPortionGrams: 10,
    isCommon: true,
    isBrazilian: true,
    tags: ['castanha', 'oleaginosa', 'selênio']
  },
  {
    name: 'Amendoim, torrado',
    category: 'nut_seed',
    calories: 544,
    protein: 27,
    carbs: 20,
    fat: 44,
    fiber: 8,
    sodium: 8,
    commonPortion: '1 colher de sopa',
    commonPortionGrams: 15,
    isCommon: true,
    isBrazilian: true,
    tags: ['amendoim', 'oleaginosa']
  },
  {
    name: 'Pasta de amendoim integral',
    category: 'nut_seed',
    calories: 588,
    protein: 25,
    carbs: 18,
    fat: 50,
    fiber: 7,
    sodium: 20,
    commonPortion: '1 colher de sopa',
    commonPortionGrams: 16,
    isCommon: true,
    isBrazilian: true,
    tags: ['amendoim', 'pasta', 'integral']
  },

  // ============================================
  // BEBIDAS E OUTROS
  // ============================================
  {
    name: 'Café, coado, sem açúcar',
    category: 'beverage',
    calories: 4,
    protein: 0.1,
    carbs: 0.8,
    fat: 0,
    fiber: 0,
    sodium: 2,
    commonPortion: '1 xícara',
    commonPortionGrams: 50,
    isCommon: true,
    isBrazilian: true,
    tags: ['café', 'coado']
  },
  {
    name: 'Água de coco',
    category: 'beverage',
    calories: 22,
    protein: 0.4,
    carbs: 5.5,
    fat: 0.1,
    fiber: 0.1,
    sodium: 25,
    commonPortion: '1 copo',
    commonPortionGrams: 200,
    isCommon: true,
    isBrazilian: true,
    tags: ['água', 'coco', 'hidratante']
  },
  {
    name: 'Whey Protein (média)',
    category: 'protein',
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1.5,
    fiber: 0,
    sodium: 100,
    commonPortion: '1 scoop',
    commonPortionGrams: 30,
    isCommon: true,
    isBrazilian: false,
    tags: ['whey', 'proteína', 'suplemento']
  },
  {
    name: 'Creatina monohidratada',
    category: 'condiment',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
    commonPortion: '1 colher de chá',
    commonPortionGrams: 5,
    isCommon: true,
    isBrazilian: false,
    tags: ['creatina', 'suplemento']
  },
];

/**
 * Função auxiliar para gerar IDs únicos
 */
export function generateFoodId(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Seed completo com IDs
 */
export const FOOD_DATABASE_SEED: FoodData[] = BRAZILIAN_FOODS.map(food => ({
  ...food,
  id: generateFoodId(food.name)
}));

// Exportar por categoria para facilitar busca
export const FOODS_BY_CATEGORY = {
  protein: FOOD_DATABASE_SEED.filter(f => f.category === 'protein'),
  carbohydrate: FOOD_DATABASE_SEED.filter(f => f.category === 'carbohydrate'),
  fat: FOOD_DATABASE_SEED.filter(f => f.category === 'fat'),
  vegetable: FOOD_DATABASE_SEED.filter(f => f.category === 'vegetable'),
  fruit: FOOD_DATABASE_SEED.filter(f => f.category === 'fruit'),
  dairy: FOOD_DATABASE_SEED.filter(f => f.category === 'dairy'),
  legume: FOOD_DATABASE_SEED.filter(f => f.category === 'legume'),
  nut_seed: FOOD_DATABASE_SEED.filter(f => f.category === 'nut_seed'),
  beverage: FOOD_DATABASE_SEED.filter(f => f.category === 'beverage'),
};

console.log(`✅ Banco de alimentos carregado: ${FOOD_DATABASE_SEED.length} alimentos`);
