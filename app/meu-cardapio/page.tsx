'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MealPlan, MealTimeLabels } from '@/lib/nutrition/types';

export default function MeuCardapioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!planId) {
      router.push('/anamnese-nutricional');
      return;
    }

    fetchMealPlan();
  }, [planId]);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      setError('');

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Configuração do Supabase não encontrada');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error: fetchError } = await supabase
        .from('MealPlan')
        .select('*')
        .eq('id', planId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Cardápio não encontrado');

      // Reconstruct MealPlan object
      const plan: MealPlan = {
        id: data.id,
        userId: data.user_id,
        nutritionalProfileId: data.nutritional_profile_id,
        name: data.name,
        startDate: data.start_date,
        endDate: data.end_date,
        daysCount: data.days_count,
        days: data.meals_data,
        dailyAvgCalories: data.daily_avg_calories,
        dailyAvgProtein: data.daily_avg_protein,
        dailyAvgCarbs: data.daily_avg_carbs,
        dailyAvgFat: data.daily_avg_fat,
        isActive: data.is_active,
        isFavorite: data.is_favorite,
        createdAt: data.created_at
      };

      setMealPlan(plan);
    } catch (err: any) {
      console.error('Erro ao buscar cardápio:', err);
      setError(err.message || 'Erro ao carregar cardápio');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewPlan = () => {
    router.push('/anamnese-nutricional');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu cardápio...</p>
        </div>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Erro</h1>
          <p className="text-gray-600 mb-6">{error || 'Cardápio não encontrado'}</p>
          <button
            onClick={handleNewPlan}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Criar Novo Cardápio
          </button>
        </div>
      </div>
    );
  }

  const currentDay = mealPlan.days[0]; // Show first day (for now)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 print:shadow-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {mealPlan.name}
              </h1>
              <p className="text-gray-600">
                {new Date(mealPlan.startDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>🖨️</span>
                Imprimir
              </button>
              <button
                onClick={handleNewPlan}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>✨</span>
                Novo Cardápio
              </button>
            </div>
          </div>

          {/* Daily Macros Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="text-orange-600 text-sm font-medium mb-1">Calorias</div>
              <div className="text-2xl font-bold text-orange-700">
                {currentDay.totalCalories}
              </div>
              <div className="text-xs text-orange-600 mt-1">kcal</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
              <div className="text-red-600 text-sm font-medium mb-1">Proteínas</div>
              <div className="text-2xl font-bold text-red-700">
                {currentDay.totalProtein}g
              </div>
              <div className="text-xs text-red-600 mt-1">
                {Math.round((currentDay.totalProtein * 4 / currentDay.totalCalories) * 100)}% do total
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="text-blue-600 text-sm font-medium mb-1">Carboidratos</div>
              <div className="text-2xl font-bold text-blue-700">
                {currentDay.totalCarbs}g
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {Math.round((currentDay.totalCarbs * 4 / currentDay.totalCalories) * 100)}% do total
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
              <div className="text-yellow-600 text-sm font-medium mb-1">Gorduras</div>
              <div className="text-2xl font-bold text-yellow-700">
                {currentDay.totalFat}g
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                {Math.round((currentDay.totalFat * 9 / currentDay.totalCalories) * 100)}% do total
              </div>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Proteínas</span>
                <span className="text-gray-800 font-medium">{currentDay.totalProtein}g</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
                  style={{ width: `${Math.min((currentDay.totalProtein / mealPlan.dailyAvgProtein) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Carboidratos</span>
                <span className="text-gray-800 font-medium">{currentDay.totalCarbs}g</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${Math.min((currentDay.totalCarbs / mealPlan.dailyAvgCarbs) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Gorduras</span>
                <span className="text-gray-800 font-medium">{currentDay.totalFat}g</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all"
                  style={{ width: `${Math.min((currentDay.totalFat / mealPlan.dailyAvgFat) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-6">
          {currentDay.meals.map((meal, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 print:shadow-none print:break-inside-avoid"
            >
              {/* Meal Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {MealTimeLabels[meal.mealTime]}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {meal.totalCalories} kcal • {meal.totalProtein}g proteína
                  </p>
                </div>
                <div className="text-4xl">
                  {meal.mealTime === 'breakfast' && '🌅'}
                  {meal.mealTime === 'morning_snack' && '☕'}
                  {meal.mealTime === 'lunch' && '🍽️'}
                  {meal.mealTime === 'afternoon_snack' && '🥤'}
                  {meal.mealTime === 'dinner' && '🌙'}
                  {meal.mealTime === 'evening_snack' && '🌃'}
                </div>
              </div>

              {/* Meal Items */}
              <div className="space-y-3">
                {meal.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {item.foodName}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.amount}g • {Math.round(item.calories)} kcal
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-red-600 font-medium">
                        P: {Math.round(item.protein)}g
                      </div>
                      <div className="text-blue-600">
                        C: {Math.round(item.carbs)}g
                      </div>
                      <div className="text-yellow-600">
                        G: {Math.round(item.fat)}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meal Totals */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total da Refeição</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-orange-600 font-medium">
                      {meal.totalCalories} kcal
                    </span>
                    <span className="text-red-600">
                      P: {meal.totalProtein}g
                    </span>
                    <span className="text-blue-600">
                      C: {meal.totalCarbs}g
                    </span>
                    <span className="text-yellow-600">
                      G: {meal.totalFat}g
                    </span>
                    <span className="text-green-600">
                      Fibra: {meal.totalFiber}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6 print:shadow-none">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>Método:</strong> Dr. Mike Israetel (Renaissance Periodization)
            </p>
            <p className="text-sm">
              Este cardápio foi gerado automaticamente pelo NutriFitCoach baseado no seu perfil nutricional.
              Consulte sempre um nutricionista para orientação personalizada.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
