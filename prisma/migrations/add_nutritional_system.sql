-- =============================================
-- SISTEMA DE NUTRIÇÃO - TABELAS
-- =============================================

-- 1. ENUMS

DO $$ BEGIN
    CREATE TYPE "ActivityLevel" AS ENUM ('sedentary', 'light', 'moderate', 'very_active', 'extra_active');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "NutritionalGoal" AS ENUM ('weight_loss', 'weight_gain', 'maintenance', 'muscle_gain', 'fat_loss_muscle_gain');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "DietaryRestriction" AS ENUM ('none', 'vegetarian', 'vegan', 'lactose_intolerant', 'gluten_free', 'low_carb', 'ketogenic');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "MealTime" AS ENUM ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack', 'pre_workout', 'post_workout');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "FoodCategory" AS ENUM ('protein', 'carbohydrate', 'fat', 'vegetable', 'fruit', 'dairy', 'legume', 'grain', 'nut_seed', 'beverage', 'condiment');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABELA DE PERFIL NUTRICIONAL

CREATE TABLE IF NOT EXISTS "NutritionalProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    -- Dados antropométricos
    "weight" DECIMAL(5,2) NOT NULL, -- kg
    "height" DECIMAL(5,2) NOT NULL, -- cm
    "age" INTEGER NOT NULL,
    "biological_sex" TEXT NOT NULL, -- 'male' or 'female'
    "body_fat_percentage" DECIMAL(4,2), -- opcional

    -- Nível de atividade e objetivo
    "activity_level" "ActivityLevel" NOT NULL,
    "goal" "NutritionalGoal" NOT NULL,

    -- Restrições e preferências
    "dietary_restrictions" "DietaryRestriction"[] NOT NULL DEFAULT '{}',
    "food_allergies" TEXT[], -- array de alimentos
    "disliked_foods" TEXT[], -- alimentos que não gosta
    "preferred_foods" TEXT[], -- alimentos preferidos

    -- Rotina
    "meals_per_day" INTEGER NOT NULL DEFAULT 5,
    "meal_times" JSONB, -- horários preferidos para cada refeição
    "workout_time" TEXT, -- horário do treino
    "has_pre_workout_meal" BOOLEAN DEFAULT true,
    "has_post_workout_meal" BOOLEAN DEFAULT true,

    -- Cálculos (armazenados para histórico)
    "bmr" DECIMAL(7,2), -- Taxa Metabólica Basal
    "tdee" DECIMAL(7,2), -- Gasto Energético Total Diário
    "target_calories" DECIMAL(7,2), -- Calorias alvo
    "target_protein" DECIMAL(6,2), -- gramas
    "target_carbs" DECIMAL(6,2), -- gramas
    "target_fat" DECIMAL(6,2), -- gramas

    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NutritionalProfile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "NutritionalProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AppUser"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "NutritionalProfile_user_id_key" ON "NutritionalProfile"("user_id");

-- 3. TABELA DE ALIMENTOS (TACO)

CREATE TABLE IF NOT EXISTS "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,

    -- Informações nutricionais (por 100g)
    "calories" DECIMAL(6,2) NOT NULL,
    "protein" DECIMAL(5,2) NOT NULL,
    "carbs" DECIMAL(5,2) NOT NULL,
    "fat" DECIMAL(5,2) NOT NULL,
    "fiber" DECIMAL(5,2) DEFAULT 0,
    "sodium" DECIMAL(6,2) DEFAULT 0, -- mg

    -- Metadados
    "common_portion" TEXT, -- "1 unidade média (100g)"
    "common_portion_grams" DECIMAL(6,2), -- 100
    "is_common" BOOLEAN DEFAULT true, -- alimentos comuns do dia-a-dia
    "is_brazilian" BOOLEAN DEFAULT true, -- alimentos típicos brasileiros

    -- Tags para busca
    "tags" TEXT[], -- ['frango', 'ave', 'proteina', 'magro']

    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Food_category_idx" ON "Food"("category");
CREATE INDEX IF NOT EXISTS "Food_name_idx" ON "Food"("name");
CREATE INDEX IF NOT EXISTS "Food_is_common_idx" ON "Food"("is_common");

-- 4. TABELA DE CARDÁPIOS GERADOS

CREATE TABLE IF NOT EXISTS "MealPlan" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nutritional_profile_id" TEXT NOT NULL,

    -- Informações do plano
    "name" TEXT, -- "Cardápio Emagrecimento - Semana 1"
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "days_count" INTEGER NOT NULL DEFAULT 1, -- 1 ou 7

    -- Dados completos do cardápio (JSONB para flexibilidade)
    "meals_data" JSONB NOT NULL, -- estrutura completa dos dias/refeições

    -- Totais calculados
    "daily_avg_calories" DECIMAL(7,2),
    "daily_avg_protein" DECIMAL(6,2),
    "daily_avg_carbs" DECIMAL(6,2),
    "daily_avg_fat" DECIMAL(6,2),

    -- Status
    "is_active" BOOLEAN DEFAULT true,
    "is_favorite" BOOLEAN DEFAULT false,

    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MealPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AppUser"("id") ON DELETE CASCADE,
    CONSTRAINT "MealPlan_nutritional_profile_id_fkey" FOREIGN KEY ("nutritional_profile_id") REFERENCES "NutritionalProfile"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "MealPlan_user_id_idx" ON "MealPlan"("user_id");
CREATE INDEX IF NOT EXISTS "MealPlan_is_active_idx" ON "MealPlan"("is_active");
CREATE INDEX IF NOT EXISTS "MealPlan_created_at_idx" ON "MealPlan"("created_at");

-- 5. TABELA DE LISTA DE COMPRAS

CREATE TABLE IF NOT EXISTS "ShoppingList" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "meal_plan_id" TEXT NOT NULL,

    "items" JSONB NOT NULL, -- { "Frango": { amount: 1000, unit: "g", category: "Açougue" } }

    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShoppingList_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ShoppingList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AppUser"("id") ON DELETE CASCADE,
    CONSTRAINT "ShoppingList_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "MealPlan"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "ShoppingList_user_id_idx" ON "ShoppingList"("user_id");
CREATE INDEX IF NOT EXISTS "ShoppingList_meal_plan_id_idx" ON "ShoppingList"("meal_plan_id");

-- Verificar criação
SELECT 'Sistema de nutrição criado com sucesso!' as status;
