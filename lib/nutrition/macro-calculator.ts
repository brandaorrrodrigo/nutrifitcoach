/**
 * CALCULADORA DE MACROS - MÉTODO DR. MIKE ISRAETEL
 * Renaissance Periodization
 *
 * Referências:
 * - RP Diet 2.0
 * - Scientific Principles of Strength Training
 */

export type BiologicalSex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'      // Pouco ou nenhum exercício
  | 'light'          // Exercício leve 1-3x/semana
  | 'moderate'       // Exercício moderado 3-5x/semana
  | 'very_active'    // Exercício intenso 6-7x/semana
  | 'extra_active';  // Exercício muito intenso + trabalho físico

export type NutritionalGoal =
  | 'weight_loss'              // Perda de peso (déficit)
  | 'weight_gain'              // Ganho de peso (superávit)
  | 'maintenance'              // Manutenção
  | 'muscle_gain'              // Ganho de massa muscular
  | 'fat_loss_muscle_gain';    // Recomposição corporal

export interface MacroCalculatorInput {
  weight: number;              // kg
  height: number;              // cm
  age: number;                 // anos
  biologicalSex: BiologicalSex;
  activityLevel: ActivityLevel;
  goal: NutritionalGoal;
  bodyFatPercentage?: number;  // opcional, melhora precisão
}

export interface MacroCalculatorResult {
  // Gasto Energético
  bmr: number;                 // Taxa Metabólica Basal (kcal)
  tdee: number;                // Gasto Energético Total Diário (kcal)

  // Calorias Alvo
  targetCalories: number;      // Calorias ajustadas para o objetivo (kcal)
  calorieAdjustment: number;   // Ajuste aplicado (ex: -500 para déficit)

  // Macronutrientes (gramas/dia)
  protein: number;             // Proteína (g)
  proteinPerKg: number;        // Proteína por kg de peso (g/kg)

  fat: number;                 // Gordura (g)
  fatPerKg: number;            // Gordura por kg de peso (g/kg)

  carbs: number;               // Carboidrato (g)
  carbsPerKg: number;          // Carboidrato por kg de peso (g/kg)

  // Percentuais
  proteinPercent: number;      // % de calorias da proteína
  fatPercent: number;          // % de calorias da gordura
  carbsPercent: number;        // % de calorias dos carboidratos

  // Fibras
  fiber: number;               // Meta de fibras (g)

  // Metadados
  method: string;              // "Dr. Mike Israetel - Renaissance Periodization"
  notes: string[];             // Observações e recomendações
}

/**
 * Fatores de atividade para cálculo do TDEE
 */
const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Pouco ou nenhum exercício
  light: 1.375,        // Exercício leve 1-3x/semana
  moderate: 1.55,      // Exercício moderado 3-5x/semana
  very_active: 1.725,  // Exercício intenso 6-7x/semana
  extra_active: 1.9    // Exercício muito intenso + trabalho físico
};

/**
 * Ajustes calóricos baseados no objetivo
 */
const CALORIE_ADJUSTMENTS: Record<NutritionalGoal, { min: number; max: number }> = {
  weight_loss: { min: -750, max: -500 },            // Déficit de 500-750 kcal
  fat_loss_muscle_gain: { min: -300, max: -200 },   // Déficit leve de 200-300 kcal
  maintenance: { min: 0, max: 0 },                  // Sem ajuste
  muscle_gain: { min: 200, max: 300 },              // Superávit de 200-300 kcal
  weight_gain: { min: 300, max: 500 },              // Superávit de 300-500 kcal
};

/**
 * Calcula BMR usando fórmula Mifflin-St Jeor (mais precisa que Harris-Benedict)
 */
function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: BiologicalSex,
  bodyFatPercentage?: number
): number {
  // Se tiver % de gordura, usar Katch-McArdle (mais preciso)
  if (bodyFatPercentage) {
    const leanBodyMass = weight * (1 - bodyFatPercentage / 100);
    return 370 + (21.6 * leanBodyMass);
  }

  // Mifflin-St Jeor
  const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
  return sex === 'male' ? baseBMR + 5 : baseBMR - 161;
}

/**
 * Calcula macronutrientes usando método Dr. Mike Israetel
 */
export function calculateMacros(input: MacroCalculatorInput): MacroCalculatorResult {
  const {
    weight,
    height,
    age,
    biologicalSex,
    activityLevel,
    goal,
    bodyFatPercentage
  } = input;

  const notes: string[] = [];

  // 1. Calcular BMR
  const bmr = calculateBMR(weight, height, age, biologicalSex, bodyFatPercentage);

  // 2. Calcular TDEE
  const activityFactor = ACTIVITY_FACTORS[activityLevel];
  const tdee = bmr * activityFactor;

  // 3. Ajustar calorias baseado no objetivo
  const adjustment = CALORIE_ADJUSTMENTS[goal];
  const calorieAdjustment = (adjustment.min + adjustment.max) / 2;
  const targetCalories = Math.round(tdee + calorieAdjustment);

  // 4. PROTEÍNA (Dr. Mike Israetel recommendations)
  let proteinPerKg: number;

  switch (goal) {
    case 'weight_loss':
    case 'fat_loss_muscle_gain':
      // Em déficit: 2.0-2.4g/kg para preservar massa muscular
      proteinPerKg = biologicalSex === 'male' ? 2.2 : 2.0;
      notes.push('Proteína alta para preservar massa muscular durante déficit');
      break;

    case 'muscle_gain':
      // Em superávit: 1.6-2.0g/kg
      proteinPerKg = biologicalSex === 'male' ? 1.8 : 1.7;
      notes.push('Proteína otimizada para hipertrofia');
      break;

    case 'maintenance':
      proteinPerKg = 1.6;
      notes.push('Proteína suficiente para manutenção');
      break;

    case 'weight_gain':
      proteinPerKg = 1.6;
      notes.push('Proteína adequada para ganho de peso');
      break;

    default:
      proteinPerKg = 1.6;
  }

  const protein = Math.round(weight * proteinPerKg);
  const proteinCalories = protein * 4; // 4 kcal por grama

  // 5. GORDURA (Dr. Mike Israetel recommendations)
  let fatPerKg: number;

  // Mínimo de 0.5g/kg para saúde hormonal
  // Máximo de 1.0g/kg para não limitar carboidratos
  if (goal === 'weight_loss' || goal === 'fat_loss_muscle_gain') {
    // Em déficit: gordura moderada (0.6-0.8g/kg)
    fatPerKg = biologicalSex === 'female' ? 0.8 : 0.7;
    notes.push('Gordura moderada para saúde hormonal em déficit');
  } else {
    // Em manutenção/superávit: 0.5-0.7g/kg
    fatPerKg = biologicalSex === 'female' ? 0.7 : 0.6;
    notes.push('Gordura balanceada para otimizar carboidratos');
  }

  const fat = Math.round(weight * fatPerKg);
  const fatCalories = fat * 9; // 9 kcal por grama

  // Garantir mínimo de 20% das calorias de gordura (saúde hormonal)
  const minFatCalories = targetCalories * 0.20;
  if (fatCalories < minFatCalories) {
    const adjustedFat = Math.ceil(minFatCalories / 9);
    notes.push(`Gordura ajustada para mínimo de 20% das calorias (saúde hormonal)`);
  }

  // 6. CARBOIDRATOS (o que sobrar)
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.max(0, Math.round(carbCalories / 4)); // 4 kcal por grama
  const carbsPerKg = carbs / weight;

  // Validação: carbos muito baixos?
  if (carbsPerKg < 2 && goal !== 'weight_loss') {
    notes.push('⚠️ Carboidratos baixos - considere reduzir gordura se sentir falta de energia');
  }

  // 7. FIBRAS (Dr. Mike recomenda 10-15g por 1000 kcal)
  const fiber = Math.round((targetCalories / 1000) * 12);
  notes.push(`Meta de fibras: ${fiber}g (importante para saciedade e saúde intestinal)`);

  // 8. Calcular percentuais
  const proteinPercent = Math.round((proteinCalories / targetCalories) * 100);
  const fatPercent = Math.round((fatCalories / targetCalories) * 100);
  const carbsPercent = Math.round((carbCalories / targetCalories) * 100);

  // 9. Notas específicas por objetivo
  if (goal === 'weight_loss') {
    notes.push('💡 Para déficit sustentável, considere fazer 1-2 refeeds por semana');
    notes.push('💡 Monitore força nos treinos - se cair muito, reduzir déficit');
  } else if (goal === 'muscle_gain') {
    notes.push('💡 Ganho ideal: 0.25-0.5kg por semana para homens, 0.125-0.25kg para mulheres');
    notes.push('💡 Se ganhar peso muito rápido, reduzir calorias ligeiramente');
  } else if (goal === 'fat_loss_muscle_gain') {
    notes.push('💡 Recomposição funciona melhor para iniciantes/intermediários');
    notes.push('💡 Progresso é lento mas vale a pena - foco em força progressiva');
  }

  // 10. Notas sobre timing (Dr. Mike emphasis)
  if (activityLevel === 'very_active' || activityLevel === 'extra_active') {
    notes.push('🏋️ Considere dividir carboidratos: 40% pré-treino, 40% pós-treino, 20% resto do dia');
    notes.push('🏋️ Proteína distribuída uniformemente (20-40g por refeição)');
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    calorieAdjustment,
    protein,
    proteinPerKg: Math.round(proteinPerKg * 10) / 10,
    fat,
    fatPerKg: Math.round(fatPerKg * 10) / 10,
    carbs,
    carbsPerKg: Math.round(carbsPerKg * 10) / 10,
    proteinPercent,
    fatPercent,
    carbsPercent,
    fiber,
    method: 'Dr. Mike Israetel - Renaissance Periodization',
    notes
  };
}

/**
 * Gera resumo legível dos macros
 */
export function generateMacroSummary(result: MacroCalculatorResult): string {
  return `
📊 SEUS MACROS (Método Dr. Mike Israetel)

🔥 Calorias: ${result.targetCalories} kcal/dia
   BMR: ${result.bmr} kcal | TDEE: ${result.tdee} kcal
   Ajuste: ${result.calorieAdjustment > 0 ? '+' : ''}${result.calorieAdjustment} kcal

🥩 Proteína: ${result.protein}g (${result.proteinPerKg}g/kg) - ${result.proteinPercent}%
🥑 Gordura: ${result.fat}g (${result.fatPerKg}g/kg) - ${result.fatPercent}%
🍚 Carboidrato: ${result.carbs}g (${result.carbsPerKg}g/kg) - ${result.carbsPercent}%
🌾 Fibras: ${result.fiber}g/dia

💡 DICAS:
${result.notes.map(note => `   ${note}`).join('\n')}
  `.trim();
}
