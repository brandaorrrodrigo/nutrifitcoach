-- =============================================
-- NFC HORMONAL ENGINE - Manual Migration
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar ENUMS (se ainda não existirem)
DO $$ BEGIN
    CREATE TYPE "CycleStatus" AS ENUM (
      'regular_28_32',
      'irregular',
      'no_period_surgery',
      'no_period_iud_hormonal',
      'no_period_contraceptive',
      'no_period_menopause'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ContraceptiveType" AS ENUM (
      'combined_pill',
      'progesterone_only_pill',
      'mirena_iud',
      'copper_iud',
      'vaginal_ring',
      'hormonal_patch',
      'implant',
      'none'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "HormonalCondition" AS ENUM (
      'pcos',
      'endometriosis',
      'hypothyroidism',
      'hashimoto',
      'insulin_resistance',
      'intense_pms',
      'none'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "HormoneTherapy" AS ENUM (
      'none',
      'estrogen',
      'progesterone',
      'testosterone',
      'complete_hrt',
      'phytotherapy'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MenopauseStatus" AS ENUM (
      'none',
      'climacteric',
      'confirmed_menopause'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "GeneralSymptomFrequency" AS ENUM (
      'never',
      'sometimes',
      'frequently',
      'always'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "FemaleObjective" AS ENUM (
      'weight_loss',
      'muscle_gain',
      'body_recomposition',
      'reduce_hormonal_symptoms',
      'improve_energy',
      'control_insulin_resistance'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Criar Tabela FemaleHormonalProfile (se não existir)
CREATE TABLE IF NOT EXISTS "FemaleHormonalProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "cycle_status" "CycleStatus" NOT NULL,
    "contraceptive_type" "ContraceptiveType" NOT NULL,
    "contraceptive_effects" TEXT[],
    "hormonal_conditions" "HormonalCondition"[],
    "hormone_therapy" "HormoneTherapy" NOT NULL,
    "menopause_status" "MenopauseStatus" NOT NULL,
    "menopause_symptoms" TEXT[],
    "general_symptoms" JSONB NOT NULL,
    "objective" "FemaleObjective" NOT NULL,
    "hormonal_profile" TEXT,
    "hormonal_subprofile" TEXT,
    "nutritional_adjustments" JSONB,
    "sensitivities" JSONB,
    "alerts" JSONB,
    "critical_points" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FemaleHormonalProfile_pkey" PRIMARY KEY ("id")
);

-- 3. Criar Índices (se não existirem)
CREATE UNIQUE INDEX IF NOT EXISTS "FemaleHormonalProfile_user_id_key"
ON "FemaleHormonalProfile"("user_id");

CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_user_id_idx"
ON "FemaleHormonalProfile"("user_id");

CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_age_idx"
ON "FemaleHormonalProfile"("age");

CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_cycle_status_idx"
ON "FemaleHormonalProfile"("cycle_status");

CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_menopause_status_idx"
ON "FemaleHormonalProfile"("menopause_status");

-- 4. Criar Foreign Key (se a tabela AppUser existir)
DO $$ BEGIN
    ALTER TABLE "FemaleHormonalProfile"
    ADD CONSTRAINT "FemaleHormonalProfile_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "AppUser"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Finalizado! ✅
