/**
 * MEAL PLAN GENERATOR ENGINE
 *
 * Algoritmo que gera cardápios balanceados baseado em:
 * - Perfil nutricional do usuário
 * - Macros calculados
 * - Restrições alimentares
 * - Preferências pessoais
 * - Banco de alimentos disponíveis
 */

import { v4 as uuidv4 } from 'uuid';
import {
  NutritionalProfileData,
  FoodData,
  Meal,
  MealItem,
  MealTime,
  DailyMealPlan,
  MealPlan,
  FoodCategory,
  DietaryRestriction
} from './types';
import { FOOD_DATABASE_SEED, FOODS_BY_CATEGORY } from './food-database-seed';

// ============================================
// CONFIGURAÇÕES
// ============================================

/**
 * Distribuição padrão de refeições no dia
 */
const DEFAULT_MEAL_DISTRIBUTION: Record<number, MealTime[]> = {
  3: ['breakfast', 'lunch', 'dinner'],
  4: ['breakfast', 'lunch', 'afternoon_snack', 'dinner'],
  5: ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner'],
  6: ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack'],
};

/**
 * Distribuição de calorias por refeição (%)
 */
const CALORIE_DISTRIBUTION: Record<MealTime, number> = {
  breakfast: 0.25,        // 25%
  morning_snack: 0.10,    // 10%
  lunch: 0.30,            // 30%
  afternoon_snack: 0.10,  // 10%
  dinner: 0.25,           // 25%
  evening_snack: 0.05,    // 5%
  pre_workout: 0.15,      // 15%
  post_workout: 0.15,     // 15%
};

// ============================================
// TIPOS AUXILIARES
// ============================================

interface MealMacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodSelection {
  food: FoodData;
  amount: number; // gramas
}

// ============================================
// FILTROS DE ALIMENTOS
// ============================================

/**
 * Filtra alimentos baseado em restrições alimentares
 */
function filterFoodsByRestrictions(
  foods: FoodData[],
  restrictions: DietaryRestriction[],
  allergies: string[],
  dislikedFoods: string[]
): FoodData[] {
  return foods.filter(food => {
    // Alergias
    if (allergies.some(allergy =>
      food.name.toLowerCase().includes(allergy.toLowerCase()) ||
      food.tags?.some(tag => tag.toLowerCase().includes(allergy.toLowerCase()))
    )) {
      return false;
    }

    // Alimentos não gostados
    if (dislikedFoods.some(disliked =>
      food.name.toLowerCase().includes(disliked.toLowerCase())
    )) {
      return false;
    }

    // Restrições dietárias
    for (const restriction of restrictions) {
      if (restriction === 'vegetarian') {
        if (food.category === 'protein' &&
            (food.tags?.includes('carne') || food.tags?.includes('peixe'))) {
          return false;
        }
      }

      if (restriction === 'vegan') {
        if (food.category === 'dairy' ||
            (food.category === 'protein' && !food.tags?.includes('vegetal'))) {
          return false;
        }
      }

      if (restriction === 'lactose_intolerant') {
        if (food.category === 'dairy' && !food.tags?.includes('sem lactose')) {
          return false;
        }
      }

      if (restriction === 'gluten_free') {
        if (food.tags?.includes('glúten') || food.tags?.includes('trigo')) {
          return false;
        }
      }

      if (restriction === 'low_carb') {
        if (food.category === 'carbohydrate' && food.carbs > 20) {
          return false;
        }
      }

      if (restriction === 'ketogenic') {
        if (food.category === 'carbohydrate' || food.carbs > 10) {
          return false;
        }
      }
    }

    return true;
  });
}

// ============================================
// SELEÇÃO DE ALIMENTOS
// ============================================

/**
 * Seleciona proteína para a refeição
 */
function selectProtein(
  targetProtein: number,
  availableFoods: FoodData[],
  usedFoods: Set<string>
): FoodSelection | null {
  const proteinFoods = availableFoods.filter(f =>
    f.category === 'protein' && !usedFoods.has(f.id)
  );

  if (proteinFoods.length === 0) return null;

  // Escolher aleatoriamente
  const selectedFood = proteinFoods[Math.floor(Math.random() * proteinFoods.length)];

  // Calcular quantidade necessária
  const amount = Math.round((targetProtein / selectedFood.protein) * 100);

  // Limitar quantidade (min 50g, max 300g)
  const finalAmount = Math.max(50, Math.min(300, amount));

  return { food: selectedFood, amount: finalAmount };
}

/**
 * Seleciona carboidrato para a refeição
 */
function selectCarb(
  targetCarbs: number,
  availableFoods: FoodData[],
  usedFoods: Set<string>,
  mealTime: MealTime
): FoodSelection | null {
  const carbFoods = availableFoods.filter(f =>
    (f.category === 'carbohydrate' || f.category === 'grain') &&
    !usedFoods.has(f.id)
  );

  if (carbFoods.length === 0) return null;

  // Preferir carbos complexos em refeições principais
  let selectedFood: FoodData;
  if (mealTime === 'lunch' || mealTime === 'dinner') {
    const complexCarbs = carbFoods.filter(f => f.fiber > 2);
    selectedFood = complexCarbs.length > 0
      ? complexCarbs[Math.floor(Math.random() * complexCarbs.length)]
      : carbFoods[Math.floor(Math.random() * carbFoods.length)];
  } else {
    selectedFood = carbFoods[Math.floor(Math.random() * carbFoods.length)];
  }

  const amount = Math.round((targetCarbs / selectedFood.carbs) * 100);
  const finalAmount = Math.max(30, Math.min(250, amount));

  return { food: selectedFood, amount: finalAmount };
}

/**
 * Seleciona vegetais para a refeição
 */
function selectVegetables(
  availableFoods: FoodData[],
  usedFoods: Set<string>,
  count: number = 2
): FoodSelection[] {
  const vegetables = availableFoods.filter(f =>
    f.category === 'vegetable' && !usedFoods.has(f.id)
  );

  if (vegetables.length === 0) return [];

  const selections: FoodSelection[] = [];
  const shuffled = vegetables.sort(() => 0.5 - Math.random());

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    selections.push({
      food: shuffled[i],
      amount: 80 // quantidade padrão de vegetais
    });
    usedFoods.add(shuffled[i].id);
  }

  return selections;
}

/**
 * Seleciona gordura saudável para a refeição
 */
function selectFat(
  targetFat: number,
  availableFoods: FoodData[],
  usedFoods: Set<string>
): FoodSelection | null {
  const fatFoods = availableFoods.filter(f =>
    (f.category === 'fat' || f.category === 'nut_seed') &&
    !usedFoods.has(f.id)
  );

  if (fatFoods.length === 0) return null;

  const selectedFood = fatFoods[Math.floor(Math.random() * fatFoods.length)];
  const amount = Math.round((targetFat / selectedFood.fat) * 100);
  const finalAmount = Math.max(5, Math.min(30, amount));

  return { food: selectedFood, amount: finalAmount };
}

// ============================================
// GERAÇÃO DE REFEIÇÃO
// ============================================

/**
 * Gera uma refeição completa
 */
function generateMeal(
  mealTime: MealTime,
  macroTarget: MealMacroTarget,
  availableFoods: FoodData[],
  usedFoods: Set<string>
): Meal {
  const mealItems: MealItem[] = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  // 1. Adicionar proteína (prioritário)
  const proteinSelection = selectProtein(macroTarget.protein, availableFoods, usedFoods);
  if (proteinSelection) {
    const { food, amount } = proteinSelection;
    const multiplier = amount / 100;

    mealItems.push({
      foodId: food.id,
      foodName: food.name,
      amount,
      calories: food.calories * multiplier,
      protein: food.protein * multiplier,
      carbs: food.carbs * multiplier,
      fat: food.fat * multiplier,
      fiber: food.fiber * multiplier
    });

    totalCalories += food.calories * multiplier;
    totalProtein += food.protein * multiplier;
    totalCarbs += food.carbs * multiplier;
    totalFat += food.fat * multiplier;
    totalFiber += food.fiber * multiplier;
    usedFoods.add(food.id);
  }

  // 2. Adicionar carboidrato (se não for low carb/keto)
  const remainingCarbs = macroTarget.carbs - totalCarbs;
  if (remainingCarbs > 20) {
    const carbSelection = selectCarb(remainingCarbs, availableFoods, usedFoods, mealTime);
    if (carbSelection) {
      const { food, amount } = carbSelection;
      const multiplier = amount / 100;

      mealItems.push({
        foodId: food.id,
        foodName: food.name,
        amount,
        calories: food.calories * multiplier,
        protein: food.protein * multiplier,
        carbs: food.carbs * multiplier,
        fat: food.fat * multiplier,
        fiber: food.fiber * multiplier
      });

      totalCalories += food.calories * multiplier;
      totalProtein += food.protein * multiplier;
      totalCarbs += food.carbs * multiplier;
      totalFat += food.fat * multiplier;
      totalFiber += food.fiber * multiplier;
      usedFoods.add(food.id);
    }
  }

  // 3. Adicionar vegetais (em refeições principais)
  if (mealTime === 'lunch' || mealTime === 'dinner') {
    const vegetables = selectVegetables(availableFoods, usedFoods, 2);
    vegetables.forEach(({ food, amount }) => {
      const multiplier = amount / 100;

      mealItems.push({
        foodId: food.id,
        foodName: food.name,
        amount,
        calories: food.calories * multiplier,
        protein: food.protein * multiplier,
        carbs: food.carbs * multiplier,
        fat: food.fat * multiplier,
        fiber: food.fiber * multiplier
      });

      totalCalories += food.calories * multiplier;
      totalProtein += food.protein * multiplier;
      totalCarbs += food.carbs * multiplier;
      totalFat += food.fat * multiplier;
      totalFiber += food.fiber * multiplier;
    });
  }

  // 4. Adicionar gordura (se necessário para atingir meta)
  const remainingFat = macroTarget.fat - totalFat;
  if (remainingFat > 5) {
    const fatSelection = selectFat(remainingFat, availableFoods, usedFoods);
    if (fatSelection) {
      const { food, amount } = fatSelection;
      const multiplier = amount / 100;

      mealItems.push({
        foodId: food.id,
        foodName: food.name,
        amount,
        calories: food.calories * multiplier,
        protein: food.protein * multiplier,
        carbs: food.carbs * multiplier,
        fat: food.fat * multiplier,
        fiber: food.fiber * multiplier
      });

      totalCalories += food.calories * multiplier;
      totalProtein += food.protein * multiplier;
      totalCarbs += food.carbs * multiplier;
      totalFat += food.fat * multiplier;
      totalFiber += food.fiber * multiplier;
    }
  }

  return {
    mealTime,
    items: mealItems,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    totalCarbs: Math.round(totalCarbs),
    totalFat: Math.round(totalFat),
    totalFiber: Math.round(totalFiber * 10) / 10
  };
}

// ============================================
// GERAÇÃO DE PLANO DIÁRIO
// ============================================

/**
 * Gera plano de refeições para 1 dia
 */
export function generateDailyMealPlan(
  profile: NutritionalProfileData,
  date: Date
): DailyMealPlan {
  const {
    targetCalories = 2000,
    targetProtein = 150,
    targetCarbs = 200,
    targetFat = 67,
    mealsPerDay = 5,
    dietaryRestrictions = [],
    foodAllergies = [],
    dislikedFoods = []
  } = profile;

  // Filtrar alimentos disponíveis
  const availableFoods = filterFoodsByRestrictions(
    FOOD_DATABASE_SEED,
    dietaryRestrictions,
    foodAllergies,
    dislikedFoods
  );

  // Determinar refeições do dia
  const mealTimes = DEFAULT_MEAL_DISTRIBUTION[mealsPerDay] || DEFAULT_MEAL_DISTRIBUTION[5];

  // Gerar cada refeição
  const meals: Meal[] = [];
  const usedFoods = new Set<string>();

  for (const mealTime of mealTimes) {
    const distribution = CALORIE_DISTRIBUTION[mealTime];

    const macroTarget: MealMacroTarget = {
      calories: targetCalories * distribution,
      protein: targetProtein * distribution,
      carbs: targetCarbs * distribution,
      fat: targetFat * distribution
    };

    const meal = generateMeal(mealTime, macroTarget, availableFoods, usedFoods);
    meals.push(meal);
  }

  // Calcular totais
  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat,
      fiber: acc.fiber + meal.totalFiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return {
    date: date.toISOString().split('T')[0],
    dayOfWeek: date.getDay(),
    meals,
    totalCalories: Math.round(dailyTotals.calories),
    totalProtein: Math.round(dailyTotals.protein),
    totalCarbs: Math.round(dailyTotals.carbs),
    totalFat: Math.round(dailyTotals.fat),
    totalFiber: Math.round(dailyTotals.fiber * 10) / 10
  };
}

/**
 * Gera plano de refeições completo (1 ou 7 dias)
 */
export function generateMealPlan(
  userId: string,
  profile: NutritionalProfileData,
  daysCount: number = 1,
  startDate?: Date
): MealPlan {
  const start = startDate || new Date();
  const days: DailyMealPlan[] = [];

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);

    const dailyPlan = generateDailyMealPlan(profile, date);
    days.push(dailyPlan);
  }

  // Calcular médias
  const avgCalories = Math.round(
    days.reduce((sum, day) => sum + day.totalCalories, 0) / daysCount
  );
  const avgProtein = Math.round(
    days.reduce((sum, day) => sum + day.totalProtein, 0) / daysCount
  );
  const avgCarbs = Math.round(
    days.reduce((sum, day) => sum + day.totalCarbs, 0) / daysCount
  );
  const avgFat = Math.round(
    days.reduce((sum, day) => sum + day.totalFat, 0) / daysCount
  );

  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + daysCount - 1);

  return {
    id: uuidv4(),
    userId,
    nutritionalProfileId: '', // será preenchido depois
    name: daysCount === 1
      ? `Cardápio do Dia - ${start.toLocaleDateString('pt-BR')}`
      : `Cardápio Semanal - ${start.toLocaleDateString('pt-BR')}`,
    startDate: start.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    daysCount,
    days,
    dailyAvgCalories: avgCalories,
    dailyAvgProtein: avgProtein,
    dailyAvgCarbs: avgCarbs,
    dailyAvgFat: avgFat,
    isActive: true,
    isFavorite: false,
    createdAt: new Date().toISOString()
  };
}
