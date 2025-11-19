import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { calculateMacros } from '@/lib/nutrition/macro-calculator';
import { generateMealPlan } from '@/lib/nutrition/meal-plan-generator';
import { NutritionalProfileData } from '@/lib/nutrition/types';

/**
 * POST /api/nutrition/generate-meal-plan
 *
 * Gera um cardápio personalizado baseado no perfil nutricional
 */
export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { nutritionalProfile, daysCount = 1 } = body;

    if (!nutritionalProfile) {
      return NextResponse.json({
        error: 'Perfil nutricional é obrigatório'
      }, { status: 400 });
    }

    // Criar cliente Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Configuração do servidor incorreta'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Buscar usuário
    const { data: user } = await supabase
      .from('AppUser')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // 1. Calcular macros se não estiverem no perfil
    const profile: NutritionalProfileData = nutritionalProfile;

    if (!profile.targetCalories || !profile.targetProtein) {
      const macroResult = calculateMacros({
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        biologicalSex: profile.biologicalSex,
        activityLevel: profile.activityLevel,
        goal: profile.goal,
        bodyFatPercentage: profile.bodyFatPercentage
      });

      profile.bmr = macroResult.bmr;
      profile.tdee = macroResult.tdee;
      profile.targetCalories = macroResult.targetCalories;
      profile.targetProtein = macroResult.protein;
      profile.targetCarbs = macroResult.carbs;
      profile.targetFat = macroResult.fat;
    }

    // 2. Salvar ou atualizar perfil nutricional no banco
    const profileData = {
      user_id: user.id,
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      biological_sex: profile.biologicalSex,
      body_fat_percentage: profile.bodyFatPercentage || null,
      activity_level: profile.activityLevel,
      goal: profile.goal,
      dietary_restrictions: profile.dietaryRestrictions || [],
      food_allergies: profile.foodAllergies || [],
      disliked_foods: profile.dislikedFoods || [],
      preferred_foods: profile.preferredFoods || [],
      meals_per_day: profile.mealsPerDay || 5,
      meal_times: profile.mealTimes || null,
      workout_time: profile.workoutTime || null,
      has_pre_workout_meal: profile.hasPreWorkoutMeal ?? true,
      has_post_workout_meal: profile.hasPostWorkoutMeal ?? true,
      bmr: profile.bmr,
      tdee: profile.tdee,
      target_calories: profile.targetCalories,
      target_protein: profile.targetProtein,
      target_carbs: profile.targetCarbs,
      target_fat: profile.targetFat,
      updated_at: new Date().toISOString()
    };

    const { data: savedProfile, error: profileError } = await supabase
      .from('NutritionalProfile')
      .upsert({
        id: uuidv4(),
        ...profileData,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Erro ao salvar perfil:', profileError);
      return NextResponse.json({
        error: 'Erro ao salvar perfil nutricional'
      }, { status: 500 });
    }

    // 3. Gerar cardápio
    console.log('🍽️ Gerando cardápio para:', user.id);
    const mealPlan = generateMealPlan(user.id, profile, daysCount);

    // 4. Salvar cardápio no banco
    const mealPlanData = {
      id: mealPlan.id,
      user_id: user.id,
      nutritional_profile_id: savedProfile.id,
      name: mealPlan.name,
      start_date: mealPlan.startDate,
      end_date: mealPlan.endDate,
      days_count: mealPlan.daysCount,
      meals_data: mealPlan.days,
      daily_avg_calories: mealPlan.dailyAvgCalories,
      daily_avg_protein: mealPlan.dailyAvgProtein,
      daily_avg_carbs: mealPlan.dailyAvgCarbs,
      daily_avg_fat: mealPlan.dailyAvgFat,
      is_active: true,
      is_favorite: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: mealPlanError } = await supabase
      .from('MealPlan')
      .insert(mealPlanData);

    if (mealPlanError) {
      console.error('Erro ao salvar cardápio:', mealPlanError);
      return NextResponse.json({
        error: 'Erro ao salvar cardápio'
      }, { status: 500 });
    }

    console.log('✅ Cardápio gerado com sucesso:', mealPlan.id);

    return NextResponse.json({
      success: true,
      mealPlan,
      message: 'Cardápio gerado com sucesso!'
    });

  } catch (error: any) {
    console.error('❌ Erro ao gerar cardápio:', error);
    return NextResponse.json({
      error: 'Erro ao gerar cardápio. Tente novamente.'
    }, { status: 500 });
  }
}

// Import uuid (faltou no topo)
import { v4 as uuidv4 } from 'uuid';
