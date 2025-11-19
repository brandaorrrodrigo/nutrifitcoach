'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ActivityLevel,
  NutritionalGoal,
  DietaryRestriction,
  ActivityLevelLabels,
  NutritionalGoalLabels,
  DietaryRestrictionLabels,
  NutritionalProfileData
} from '@/lib/nutrition/types';
import { calculateMacros, generateMacroSummary } from '@/lib/nutrition/macro-calculator';

export default function AnamneseNutricionalPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dados do formulário
  const [formData, setFormData] = useState<Partial<NutritionalProfileData>>({
    biologicalSex: 'female',
    activityLevel: 'moderate',
    goal: 'weight_loss',
    dietaryRestrictions: [],
    foodAllergies: [],
    dislikedFoods: [],
    preferredFoods: [],
    mealsPerDay: 5,
    hasPreWorkoutMeal: true,
    hasPostWorkoutMeal: true
  });

  const [macroResult, setMacroResult] = useState<any>(null);

  // Handlers
  const handleInputChange = (field: keyof NutritionalProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validações por step
    if (currentStep === 1) {
      if (!formData.weight || !formData.height || !formData.age) {
        setError('Preencha todos os campos');
        return;
      }
      if (formData.weight < 30 || formData.weight > 300) {
        setError('Peso deve estar entre 30 e 300 kg');
        return;
      }
      if (formData.height < 100 || formData.height > 250) {
        setError('Altura deve estar entre 100 e 250 cm');
        return;
      }
      if (formData.age < 12 || formData.age > 120) {
        setError('Idade deve estar entre 12 e 120 anos');
        return;
      }
    }

    setError('');

    // Se chegou no último step, calcular macros
    if (currentStep === 4) {
      calculateAndShowMacros();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setError('');
  };

  const calculateAndShowMacros = () => {
    if (!formData.weight || !formData.height || !formData.age || !formData.biologicalSex) {
      setError('Dados incompletos');
      return;
    }

    const result = calculateMacros({
      weight: formData.weight,
      height: formData.height,
      age: formData.age,
      biologicalSex: formData.biologicalSex,
      activityLevel: formData.activityLevel!,
      goal: formData.goal!,
      bodyFatPercentage: formData.bodyFatPercentage
    });

    setMacroResult(result);
    setCurrentStep(5);
  };

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setError('');

    try {
      const profileData: NutritionalProfileData = {
        weight: formData.weight!,
        height: formData.height!,
        age: formData.age!,
        biologicalSex: formData.biologicalSex!,
        bodyFatPercentage: formData.bodyFatPercentage,
        activityLevel: formData.activityLevel!,
        goal: formData.goal!,
        dietaryRestrictions: formData.dietaryRestrictions || [],
        foodAllergies: formData.foodAllergies || [],
        dislikedFoods: formData.dislikedFoods || [],
        preferredFoods: formData.preferredFoods || [],
        mealsPerDay: formData.mealsPerDay || 5,
        mealTimes: formData.mealTimes,
        workoutTime: formData.workoutTime,
        hasPreWorkoutMeal: formData.hasPreWorkoutMeal ?? true,
        hasPostWorkoutMeal: formData.hasPostWorkoutMeal ?? true,
        bmr: macroResult.bmr,
        tdee: macroResult.tdee,
        targetCalories: macroResult.targetCalories,
        targetProtein: macroResult.protein,
        targetCarbs: macroResult.carbs,
        targetFat: macroResult.fat
      };

      const response = await fetch('/api/nutrition/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Importante: envia cookies de sessão
        body: JSON.stringify({
          nutritionalProfile: profileData,
          daysCount: 1
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar cardápio');
      }

      // Redirecionar para página de visualização
      router.push(`/meu-cardapio?planId=${data.mealPlan.id}`);

    } catch (err: any) {
      setError(err.message || 'Erro ao gerar cardápio');
    } finally {
      setLoading(false);
    }
  };

  const toggleRestriction = (restriction: DietaryRestriction) => {
    const current = formData.dietaryRestrictions || [];
    const newRestrictions = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    handleInputChange('dietaryRestrictions', newRestrictions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Anamnese Nutricional
          </h1>
          <p className="text-gray-600">
            Vamos criar seu cardápio personalizado
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                className={`w-full h-2 mx-1 rounded-full transition-all ${
                  step <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Dados Básicos</span>
            <span>Atividade</span>
            <span>Objetivo</span>
            <span>Restrições</span>
            <span>Macros</span>
          </div>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* STEP 1: Dados Antropométricos */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dados Básicos
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo Biológico
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['female', 'male'] as const).map(sex => (
                    <button
                      key={sex}
                      type="button"
                      onClick={() => handleInputChange('biologicalSex', sex)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        formData.biologicalSex === sex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sex === 'female' ? '👩 Feminino' : '👨 Masculino'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight || ''}
                    onChange={e => handleInputChange('weight', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="70"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height || ''}
                    onChange={e => handleInputChange('height', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="165"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={e => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="30"
                    min="12"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % de Gordura Corporal (opcional)
                </label>
                <input
                  type="number"
                  value={formData.bodyFatPercentage || ''}
                  onChange={e => handleInputChange('bodyFatPercentage', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="25"
                  min="5"
                  max="50"
                  step="0.1"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Se souber, melhora a precisão do cálculo
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Nível de Atividade */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Nível de Atividade Física
              </h2>

              <div className="space-y-3">
                {(Object.entries(ActivityLevelLabels) as [ActivityLevel, string][]).map(([level, label]) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleInputChange('activityLevel', level)}
                    className={`w-full text-left py-4 px-6 rounded-lg border-2 transition-all ${
                      formData.activityLevel === level
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{label}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantas refeições por dia?
                </label>
                <select
                  value={formData.mealsPerDay}
                  onChange={e => handleInputChange('mealsPerDay', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value={3}>3 refeições</option>
                  <option value={4}>4 refeições</option>
                  <option value={5}>5 refeições (recomendado)</option>
                  <option value={6}>6 refeições</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Objetivo */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Qual seu Objetivo?
              </h2>

              <div className="space-y-3">
                {(Object.entries(NutritionalGoalLabels) as [NutritionalGoal, string][]).map(([goal, label]) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleInputChange('goal', goal)}
                    className={`w-full text-left py-4 px-6 rounded-lg border-2 transition-all ${
                      formData.goal === goal
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Restrições */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Restrições Alimentares
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecione suas restrições (se houver):
                </label>
                <div className="space-y-2">
                  {(Object.entries(DietaryRestrictionLabels) as [DietaryRestriction, string][]).map(([restriction, label]) => (
                    <button
                      key={restriction}
                      type="button"
                      onClick={() => toggleRestriction(restriction)}
                      className={`w-full text-left py-3 px-4 rounded-lg border transition-all ${
                        formData.dietaryRestrictions?.includes(restriction)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias Alimentares (separe por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: amendoim, camarão, leite"
                  onChange={e => handleInputChange('foodAllergies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alimentos que NÃO gosta (separe por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: brócolis, fígado, beterraba"
                  onChange={e => handleInputChange('dislikedFoods', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Resumo dos Macros */}
          {currentStep === 5 && macroResult && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Seus Macronutrientes
              </h2>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {macroResult.targetCalories}
                    </div>
                    <div className="text-sm text-gray-600">kcal/dia</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {macroResult.protein}g
                    </div>
                    <div className="text-sm text-gray-600">Proteína</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {macroResult.carbs}g
                    </div>
                    <div className="text-sm text-gray-600">Carboidrato</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {macroResult.fat}g
                    </div>
                    <div className="text-sm text-gray-600">Gordura</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">💡 Recomendações:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {macroResult.notes.map((note: string, i: number) => (
                      <li key={i}>• {note}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Método Dr. Mike Israetel</strong> - Renaissance Periodization
                </p>
              </div>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && currentStep < 5 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                ← Voltar
              </button>
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Próximo →
              </button>
            ) : (
              <button
                onClick={handleGenerateMealPlan}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gerando seu cardápio...' : '🍽️ Gerar Meu Cardápio!'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
