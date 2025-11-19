/**
 * TIPOS DO SISTEMA DE NUTRIÇÃO
 */

// ============================================
// ENUMS E TIPOS BÁSICOS
// ============================================

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very_active'
  | 'extra_active';

export type NutritionalGoal =
  | 'weight_loss'
  | 'weight_gain'
  | 'maintenance'
  | 'muscle_gain'
  | 'fat_loss_muscle_gain';

export type DietaryRestriction =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'lactose_intolerant'
  | 'gluten_free'
  | 'low_carb'
  | 'ketogenic';

export type MealTime =
  | 'breakfast'
  | 'morning_snack'
  | 'lunch'
  | 'afternoon_snack'
  | 'dinner'
  | 'evening_snack'
  | 'pre_workout'
  | 'post_workout';

export type FoodCategory =
  | 'protein'
  | 'carbohydrate'
  | 'fat'
  | 'vegetable'
  | 'fruit'
  | 'dairy'
  | 'legume'
  | 'grain'
  | 'nut_seed'
  | 'beverage'
  | 'condiment';

// ============================================
// LABELS PARA UI
// ============================================

export const ActivityLevelLabels: Record<ActivityLevel, string> = {
  sedentary: 'Sedentário (pouco ou nenhum exercício)',
  light: 'Levemente ativo (exercício leve 1-3x/semana)',
  moderate: 'Moderadamente ativo (exercício moderado 3-5x/semana)',
  very_active: 'Muito ativo (exercício intenso 6-7x/semana)',
  extra_active: 'Extremamente ativo (exercício muito intenso + trabalho físico)'
};

export const NutritionalGoalLabels: Record<NutritionalGoal, string> = {
  weight_loss: 'Perda de Peso (Emagrecimento)',
  fat_loss_muscle_gain: 'Recomposição Corporal (perder gordura e ganhar músculo)',
  maintenance: 'Manutenção do Peso',
  muscle_gain: 'Ganho de Massa Muscular',
  weight_gain: 'Ganho de Peso'
};

export const DietaryRestrictionLabels: Record<DietaryRestriction, string> = {
  none: 'Nenhuma restrição',
  vegetarian: 'Vegetariano (sem carne)',
  vegan: 'Vegano (sem produtos animais)',
  lactose_intolerant: 'Intolerante à Lactose',
  gluten_free: 'Sem Glúten (Celíaco)',
  low_carb: 'Low Carb',
  ketogenic: 'Cetogênica (Keto)'
};

export const MealTimeLabels: Record<MealTime, string> = {
  breakfast: 'Café da Manhã',
  morning_snack: 'Lanche da Manhã',
  lunch: 'Almoço',
  afternoon_snack: 'Lanche da Tarde',
  dinner: 'Jantar',
  evening_snack: 'Ceia',
  pre_workout: 'Pré-Treino',
  post_workout: 'Pós-Treino'
};

export const FoodCategoryLabels: Record<FoodCategory, string> = {
  protein: 'Proteína',
  carbohydrate: 'Carboidrato',
  fat: 'Gordura',
  vegetable: 'Vegetal/Verdura',
  fruit: 'Fruta',
  dairy: 'Laticínio',
  legume: 'Leguminosa',
  grain: 'Grão/Cereal',
  nut_seed: 'Oleaginosa',
  beverage: 'Bebida',
  condiment: 'Tempero/Condimento'
};

// ============================================
// PERFIL NUTRICIONAL
// ============================================

export interface NutritionalProfileData {
  // Dados antropométricos
  weight: number;              // kg
  height: number;              // cm
  age: number;
  biologicalSex: 'male' | 'female';
  bodyFatPercentage?: number;

  // Atividade e objetivo
  activityLevel: ActivityLevel;
  goal: NutritionalGoal;

  // Restrições
  dietaryRestrictions: DietaryRestriction[];
  foodAllergies: string[];
  dislikedFoods: string[];
  preferredFoods: string[];

  // Rotina
  mealsPerDay: number;
  mealTimes?: Partial<Record<MealTime, string>>; // { breakfast: "07:00", lunch: "12:00" }
  workoutTime?: string;
  hasPreWorkoutMeal: boolean;
  hasPostWorkoutMeal: boolean;

  // Macros calculados
  bmr?: number;
  tdee?: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

// ============================================
// ALIMENTOS
// ============================================

export interface FoodData {
  id: string;
  name: string;
  category: FoodCategory;

  // Macros por 100g
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium?: number; // mg

  // Metadados
  commonPortion?: string;     // "1 unidade média"
  commonPortionGrams?: number; // 100
  isCommon?: boolean;
  isBrazilian?: boolean;
  tags?: string[];
}

// ============================================
// REFEIÇÕES E CARDÁPIOS
// ============================================

export interface MealItem {
  foodId: string;
  foodName: string;
  amount: number;              // gramas
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Meal {
  mealTime: MealTime;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  preparationNotes?: string;   // Como preparar
}

export interface DailyMealPlan {
  date: string;                // ISO date
  dayOfWeek: number;           // 0-6 (domingo = 0)
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  nutritionalProfileId: string;
  name: string;
  startDate: string;
  endDate: string;
  daysCount: number;           // 1 ou 7
  days: DailyMealPlan[];

  // Médias
  dailyAvgCalories: number;
  dailyAvgProtein: number;
  dailyAvgCarbs: number;
  dailyAvgFat: number;

  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
}

// ============================================
// LISTA DE COMPRAS
// ============================================

export interface ShoppingListItem {
  foodName: string;
  amount: number;
  unit: string;                // "g", "kg", "unidade", "ml", "L"
  category: string;            // "Açougue", "Hortifrúti", etc
  isChecked?: boolean;
}

export interface ShoppingList {
  id: string;
  userId: string;
  mealPlanId: string;
  items: ShoppingListItem[];
  createdAt: string;
}

// ============================================
// GERAÇÃO DE CARDÁPIO
// ============================================

export interface MealPlanGenerationInput {
  nutritionalProfile: NutritionalProfileData;
  daysCount: number;           // 1 ou 7
  startDate?: string;          // ISO date
  includeShoppingList?: boolean;
}

export interface MealPlanGenerationResult {
  mealPlan: MealPlan;
  shoppingList?: ShoppingList;
  warnings?: string[];         // Avisos (ex: "Não foi possível atingir meta de proteína exata")
  suggestions?: string[];      // Sugestões de melhoria
}
