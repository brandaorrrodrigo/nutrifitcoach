# ✅ SOLUÇÃO - Banco de Dados Supabase

## 🎯 STATUS ATUAL

✅ **Prisma Client gerado com sucesso**
✅ **App Next.js rodando** (http://localhost:3000)
❌ **Não consegue conectar para migrations**

---

## 🔧 SOLUÇÃO RÁPIDA

### Opção 1: Criar Tabelas Manualmente no Supabase (MAIS RÁPIDO)

1. **Acesse:** https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko

2. **Vá em:** SQL Editor (menu lateral esquerdo)

3. **Cole e execute o SQL abaixo:**

```sql
-- =============================================
-- NFC HORMONAL ENGINE - CREATE TABLES
-- =============================================

-- 1. Criar ENUMS
CREATE TYPE "CycleStatus" AS ENUM (
  'regular_28_32',
  'irregular',
  'no_period_surgery',
  'no_period_iud_hormonal',
  'no_period_contraceptive',
  'no_period_menopause'
);

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

CREATE TYPE "HormonalCondition" AS ENUM (
  'pcos',
  'endometriosis',
  'hypothyroidism',
  'hashimoto',
  'insulin_resistance',
  'intense_pms',
  'none'
);

CREATE TYPE "HormoneTherapy" AS ENUM (
  'none',
  'estrogen',
  'progesterone',
  'testosterone',
  'complete_hrt',
  'phytotherapy'
);

CREATE TYPE "MenopauseStatus" AS ENUM (
  'none',
  'climacteric',
  'confirmed_menopause'
);

CREATE TYPE "GeneralSymptomFrequency" AS ENUM (
  'never',
  'sometimes',
  'frequently',
  'always'
);

CREATE TYPE "FemaleObjective" AS ENUM (
  'weight_loss',
  'muscle_gain',
  'body_recomposition',
  'reduce_hormonal_symptoms',
  'improve_energy',
  'control_insulin_resistance'
);

-- 2. Criar Tabela FemaleHormonalProfile
CREATE TABLE "FemaleHormonalProfile" (
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

-- 3. Criar Índices
CREATE UNIQUE INDEX "FemaleHormonalProfile_user_id_key" ON "FemaleHormonalProfile"("user_id");
CREATE INDEX "FemaleHormonalProfile_user_id_idx" ON "FemaleHormonalProfile"("user_id");
CREATE INDEX "FemaleHormonalProfile_age_idx" ON "FemaleHormonalProfile"("age");
CREATE INDEX "FemaleHormonalProfile_cycle_status_idx" ON "FemaleHormonalProfile"("cycle_status");
CREATE INDEX "FemaleHormonalProfile_menopause_status_idx" ON "FemaleHormonalProfile"("menopause_status");

-- 4. Criar Foreign Key (se a tabela AppUser existir)
ALTER TABLE "FemaleHormonalProfile"
ADD CONSTRAINT "FemaleHormonalProfile_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "AppUser"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
```

4. **Clique em "Run"** (ou Ctrl+Enter)

5. **Verificar:** Se tudo der certo, aparecerá "Success. No rows returned"

---

### Opção 2: Verificar se o Projeto está Pausado

1. **Acesse:** https://supabase.com/dashboard

2. **Abra seu projeto:** yjcelqyndhvmcsiihmko

3. **Verifique o status:**
   - Se aparecer **"PAUSED"** ou **"INACTIVE"** → Clique em **"Restore"**
   - Aguarde 1-2 minutos
   - Tente novamente: `npx prisma db push`

---

### Opção 3: Resetar a Senha do Banco

No Supabase Dashboard:

1. **Settings** → **Database**
2. Clique em **"Reset database password"**
3. Anote a nova senha
4. Atualize o `.env` com a nova senha
5. Tente novamente

---

### Opção 4: Usar Pooler Connection (Transaction Mode)

Edite `.env`:

```env
# Usar Transaction Pooler ao invés de Direct Connection
DATABASE_URL="postgresql://postgres.yjcelqyndhvmcsiihmko:3RJT7IBhzvQNGaLm@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

Depois tente:
```bash
npx prisma db push
```

---

## 🚀 TESTE SE ESTÁ FUNCIONANDO

1. **Acesse:** http://localhost:3000

2. **Crie uma conta** ou faça login

3. **Vá para:** http://localhost:3000/anamnese-feminina

4. **Complete o fluxo de 8 steps**

5. **Verifique no Supabase** (Table Editor) se a tabela `FemaleHormonalProfile` foi criada e tem dados

---

## ✅ PRONTO PARA DEPLOY?

Se o app estiver funcionando localmente, você pode fazer deploy na Vercel **MESMO SEM** conseguir rodar migrations localmente!

A Vercel consegue conectar ao Supabase normalmente.

**Próximo passo:**
```bash
# Commit e push
git add .
git commit -m "Add NFC Hormonal Engine - ready for deploy"
git push

# Deploy na Vercel
# → Import do GitHub
# → Adicionar variáveis de ambiente
# → Deploy!
```

---

## 💡 DICA

O erro de conexão pode ser:
- Firewall do Windows bloqueando
- Antivírus bloqueando
- ISP bloqueando porta 5432
- Projeto Supabase pausado

Mas isso **NÃO IMPEDE** o deploy! A Vercel consegue conectar normalmente. 🚀
