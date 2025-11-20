-- ============================================
-- PROGRESS PHOTOS - Fotos de Evolução
-- ============================================
-- Sistema para rastrear evolução física dos usuários
-- com suporte a sessões de 4 fotos + metadados corporais

-- Enum para tipos de foto de progresso
CREATE TYPE "ProgressPhotoType" AS ENUM (
  'frontal',
  'posterior',
  'lado_direito',
  'lado_esquerdo'
);

-- Tabela principal de fotos de progresso
CREATE TABLE "ProgressPhoto" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL, -- Agrupa 4 fotos da mesma data/sessão
    "photo_type" "ProgressPhotoType" NOT NULL,

    -- URLs das imagens
    "original_url" TEXT NOT NULL,
    "watermarked_url" TEXT NOT NULL, -- Com marca d'água do NutriFitCoach
    "thumb_url" TEXT,

    -- Metadados da sessão (todos obrigatórios exceto BF%)
    "taken_at" TIMESTAMP(3) NOT NULL,
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "height_cm" DECIMAL(5,2) NOT NULL,
    "age_years" INTEGER NOT NULL,
    "body_fat_percent" DECIMAL(4,2), -- Opcional

    -- Metadados técnicos
    "width" INTEGER,
    "height" INTEGER,
    "file_size_bytes" INTEGER,
    "sha256" TEXT, -- Hash para detectar duplicatas

    -- Visibilidade e compartilhamento
    "visibility" "Visibility" DEFAULT 'private' NOT NULL,
    "shared_to" TEXT[] DEFAULT '{}', -- ["whatsapp", "instagram", "tiktok", "facebook"]

    -- Análise futura (para rede social)
    "likes_count" INTEGER DEFAULT 0,
    "comments_count" INTEGER DEFAULT 0,
    "shares_count" INTEGER DEFAULT 0,

    -- Timestamps
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT "ProgressPhoto_pkey" PRIMARY KEY ("id")
);

-- Foreign key para usuário
ALTER TABLE "ProgressPhoto"
ADD CONSTRAINT "ProgressPhoto_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Índices para performance
CREATE INDEX "ProgressPhoto_user_id_idx" ON "ProgressPhoto"("user_id");
CREATE INDEX "ProgressPhoto_session_id_idx" ON "ProgressPhoto"("session_id");
CREATE INDEX "ProgressPhoto_taken_at_idx" ON "ProgressPhoto"("taken_at");
CREATE INDEX "ProgressPhoto_user_session_idx" ON "ProgressPhoto"("user_id", "session_id");

-- Constraint para garantir apenas 1 foto de cada tipo por sessão
CREATE UNIQUE INDEX "ProgressPhoto_session_type_unique"
ON "ProgressPhoto"("session_id", "photo_type");

-- ============================================
-- PROGRESS SESSIONS - Sessões de Fotos
-- ============================================
-- Tabela auxiliar para agrupar metadados das sessões

CREATE TABLE "ProgressSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL,

    -- Metadados da sessão
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "height_cm" DECIMAL(5,2) NOT NULL,
    "age_years" INTEGER NOT NULL,
    "body_fat_percent" DECIMAL(4,2),

    -- Cálculos automáticos
    "bmi" DECIMAL(4,2), -- IMC = peso / (altura em metros)²
    "lean_mass_kg" DECIMAL(5,2), -- Massa magra (se BF% disponível)
    "fat_mass_kg" DECIMAL(5,2), -- Massa gorda (se BF% disponível)

    -- Comparação com sessão anterior
    "weight_change_kg" DECIMAL(5,2), -- Diferença de peso
    "bf_change_percent" DECIMAL(4,2), -- Diferença de BF%
    "days_since_last" INTEGER, -- Dias desde última sessão

    -- Status da sessão
    "is_complete" BOOLEAN DEFAULT false, -- true quando tem 4 fotos
    "photos_count" INTEGER DEFAULT 0,

    -- Notas do usuário
    "notes" TEXT,

    -- Timestamps
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT "ProgressSession_pkey" PRIMARY KEY ("id")
);

-- Foreign key para usuário
ALTER TABLE "ProgressSession"
ADD CONSTRAINT "ProgressSession_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Índices para performance
CREATE INDEX "ProgressSession_user_id_idx" ON "ProgressSession"("user_id");
CREATE INDEX "ProgressSession_session_date_idx" ON "ProgressSession"("session_date");
CREATE INDEX "ProgressSession_user_date_idx" ON "ProgressSession"("user_id", "session_date" DESC);

-- Comentários para documentação
COMMENT ON TABLE "ProgressPhoto" IS 'Fotos de evolução física dos usuários (4 ângulos padrão por sessão)';
COMMENT ON TABLE "ProgressSession" IS 'Sessões agrupadas de fotos de progresso com metadados corporais';
COMMENT ON COLUMN "ProgressPhoto"."session_id" IS 'Agrupa as 4 fotos (frontal, posterior, laterais) da mesma data';
COMMENT ON COLUMN "ProgressPhoto"."watermarked_url" IS 'URL da imagem com marca d água NutriFitCoach.com.br';
COMMENT ON COLUMN "ProgressSession"."is_complete" IS 'TRUE quando a sessão tem as 4 fotos obrigatórias';
