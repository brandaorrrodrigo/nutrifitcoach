-- =============================================
-- NUTRIFITCOACH - CRIAR TODAS AS TABELAS
-- Execute este SQL completo no Supabase SQL Editor
-- =============================================

-- 1. Criar ENUMS
DO $$ BEGIN
    CREATE TYPE "Visibility" AS ENUM ('private', 'followers', 'public');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "ModerationStatus" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "CaptureSource" AS ENUM ('mobile', 'web', 'whatsapp', 'telegram', 'upload');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "MealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack', 'preworkout', 'postworkout');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "SimuladoStatus" AS ENUM ('em_andamento', 'finalizado', 'abandonado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "AreaConhecimento" AS ENUM ('linguagens', 'matematica', 'ciencias_natureza', 'ciencias_humanas');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "CycleStatus" AS ENUM ('regular_28_32', 'irregular', 'no_period_surgery', 'no_period_iud_hormonal', 'no_period_contraceptive', 'no_period_menopause');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "ContraceptiveType" AS ENUM ('combined_pill', 'progesterone_only_pill', 'mirena_iud', 'copper_iud', 'vaginal_ring', 'hormonal_patch', 'implant', 'none');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "HormonalCondition" AS ENUM ('pcos', 'endometriosis', 'hypothyroidism', 'hashimoto', 'insulin_resistance', 'intense_pms', 'none');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "HormoneTherapy" AS ENUM ('none', 'estrogen', 'progesterone', 'testosterone', 'complete_hrt', 'phytotherapy');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "MenopauseStatus" AS ENUM ('none', 'climacteric', 'confirmed_menopause');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "GeneralSymptomFrequency" AS ENUM ('never', 'sometimes', 'frequently', 'always');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "FemaleObjective" AS ENUM ('weight_loss', 'muscle_gain', 'body_recomposition', 'reduce_hormonal_symptoms', 'improve_energy', 'control_insulin_resistance');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Criar Tabela AppUser (Principal)
CREATE TABLE IF NOT EXISTS "AppUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "is_founder" BOOLEAN NOT NULL DEFAULT false,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AppUser_email_key" ON "AppUser"("email");

-- 3. Criar Tabela FemaleHormonalProfile
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

CREATE UNIQUE INDEX IF NOT EXISTS "FemaleHormonalProfile_user_id_key" ON "FemaleHormonalProfile"("user_id");
CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_user_id_idx" ON "FemaleHormonalProfile"("user_id");
CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_age_idx" ON "FemaleHormonalProfile"("age");
CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_cycle_status_idx" ON "FemaleHormonalProfile"("cycle_status");
CREATE INDEX IF NOT EXISTS "FemaleHormonalProfile_menopause_status_idx" ON "FemaleHormonalProfile"("menopause_status");

-- 4. Criar Foreign Key
DO $$ BEGIN
    ALTER TABLE "FemaleHormonalProfile"
    ADD CONSTRAINT "FemaleHormonalProfile_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "AppUser"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. Criar outras tabelas essenciais (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");

CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- 6. Criar Foreign Keys para NextAuth
DO $$ BEGIN
    ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Finalizado! ✅
SELECT 'Todas as tabelas criadas com sucesso!' AS status;
