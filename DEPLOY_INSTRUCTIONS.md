# 🚀 INSTRUÇÕES DE DEPLOY NA VERCEL

## ✅ STATUS ATUAL
- ✅ Código no GitHub: https://github.com/brandaorrrodrigo/nutrifitcoach
- ✅ NFC Hormonal Engine completo
- ✅ Supabase ativo e configurado
- 🎯 **PRÓXIMO PASSO:** Importar na Vercel

---

## 📋 PASSO 1: ACESSAR VERCEL

1. Acesse: **https://vercel.com/login**

2. **Login com GitHub** (recomendado)
   - Click em "Continue with GitHub"
   - Autorize a Vercel a acessar seus repositórios

---

## 📋 PASSO 2: CRIAR NOVO PROJETO

1. No Dashboard da Vercel, click em **"Add New..."**

2. Selecione **"Project"**

3. Na tela "Import Git Repository":
   - Procure por: `nutrifitcoach`
   - Click em **"Import"** ao lado do repositório `brandaorrrodrigo/nutrifitcoach`

---

## 📋 PASSO 3: CONFIGURAR O PROJETO

Na tela de configuração:

### Framework Preset
- **Deve detectar automaticamente:** Next.js
- Se não detectar, selecione: **Next.js**

### Root Directory
- **Deixe:** `./` (raiz do projeto)

### Build Command
- **Deixe padrão ou use:** `npm run build`

### Output Directory
- **Deixe padrão:** `.next`

---

## 📋 PASSO 4: ADICIONAR VARIÁVEIS DE AMBIENTE

**IMPORTANTE:** Antes de fazer deploy, adicione estas variáveis.

Click em **"Environment Variables"** e adicione uma por uma:

### 🔐 DATABASE (OBRIGATÓRIO)

**Nome:** `DATABASE_URL`
**Valor:**
```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

---

### 🔐 SUPABASE (OBRIGATÓRIO)

**Nome:** `SUPABASE_URL`
**Valor:**
```
https://yjcelqyndhvmcsiihmko.supabase.co
```

**Nome:** `SUPABASE_ANON_KEY`
**Valor:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjQ3OTMsImV4cCI6MjA3OTAwMDc5M30.LHVpPkkD5mnUfDhbkz5oqiPLA68MfgyFgTPBvnkEipE
```

**Nome:** `SUPABASE_SERVICE_ROLE_KEY`
**Valor:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQyNDc5MywiZXhwIjoyMDc5MDAwNzkzfQ.FvcOln5vNHk6HDAW21IXnZeVi4z982LWARTCUHXv8g8
```

---

### 🔐 NEXTAUTH (OBRIGATÓRIO)

**Nome:** `NEXTAUTH_SECRET`
**Valor:** (gerar novo)

**Como gerar:**
- Acesse: https://generate-secret.vercel.app/32
- Copie o secret gerado
- Cole aqui

**OU use este temporário:**
```
bba148f1e82c0c0ad55a14d2d73c34c42e4d783d42fa0dfd0b1ee7c77f3fe7ad
```

**Nome:** `NEXTAUTH_URL`
**Valor:** (deixe em branco por enquanto)
- Você vai preencher depois do primeiro deploy com a URL da Vercel

---

### 🔐 NEXT.JS PUBLIC (OBRIGATÓRIO)

**Nome:** `NEXT_PUBLIC_SITE_URL`
**Valor:** (deixe em branco por enquanto)
- Você vai preencher depois do primeiro deploy

**Nome:** `NEXT_PUBLIC_ENVIRONMENT`
**Valor:**
```
production
```

---

### 🔐 OPCIONAIS (pode adicionar depois)

**Nome:** `ANTHROPIC_API_KEY`
**Valor:** (deixe vazio por enquanto)

**Nome:** `STRIPE_SECRET_KEY`
**Valor:** (deixe vazio por enquanto)

**Nome:** `RAG_STORAGE_PATH`
**Valor:**
```
./data/legacy/
```

---

## 📋 PASSO 5: FAZER DEPLOY

1. Depois de adicionar as variáveis de ambiente **OBRIGATÓRIAS**, click em **"Deploy"**

2. **Aguarde o build** (2-5 minutos) ☕

3. Você verá o progresso:
   ```
   ⏳ Initializing...
   📦 Installing dependencies...
   🏗️  Building...
   ✅ Deploying...
   🎉 Ready!
   ```

---

## 📋 PASSO 6: COPIAR URL E ATUALIZAR ENV VARS

1. **Quando o deploy terminar**, você verá a mensagem de sucesso com um link

2. **Copie a URL** do seu site (exemplo: `https://nutrifitcoach-xyz.vercel.app`)

3. **Vá para:** Settings → Environment Variables

4. **Edite as variáveis:**
   - `NEXTAUTH_URL` = `https://nutrifitcoach-xyz.vercel.app` (sua URL)
   - `NEXT_PUBLIC_SITE_URL` = `https://nutrifitcoach-xyz.vercel.app` (sua URL)

5. **Click em "Save"**

6. **Vá para:** Deployments → Click nos 3 pontinhos do último deployment → **"Redeploy"**

7. Aguarde o novo deploy terminar (1-2 minutos)

---

## 📋 PASSO 7: TESTAR!

1. **Acesse sua URL:** `https://nutrifitcoach-xyz.vercel.app`

2. **Teste o registro:**
   - Click em "Registrar" ou "Criar Conta"
   - Preencha os dados
   - Deve criar conta com sucesso! ✅

3. **Teste a anamnese feminina:**
   - Acesse: `https://nutrifitcoach-xyz.vercel.app/anamnese-feminina`
   - Preencha as 8 etapas
   - Deve salvar e gerar perfil hormonal! ✅

---

## 🔧 SE DER ERRO NO DEPLOY

### Ver Logs de Build

1. No Dashboard da Vercel
2. Click no deployment que falhou
3. Vá em **"Logs"** ou **"Build Logs"**
4. Copie o erro e me envie

### Erros Comuns

#### "Cannot find module..."
- Faltou alguma dependência
- Solução: Verificar package.json

#### "Prisma Client not generated"
- O Prisma não gerou o client
- Solução: Já está no build script, deve funcionar automaticamente

#### "Database connection error"
- Problema com DATABASE_URL
- Solução: Verificar se a variável está correta (copiar novamente)

#### "NEXTAUTH_SECRET is required"
- Faltou definir NEXTAUTH_SECRET
- Solução: Adicionar a variável

---

## 🎉 PRONTO!

Seu **NutriFitCoach com NFC Hormonal Engine** está **NO AR**! 🚀

### Próximos Passos (opcional):

1. **Domínio customizado:**
   - Vercel Dashboard → Settings → Domains
   - Add seu domínio personalizado

2. **Analytics:**
   - Vercel Analytics (já incluído grátis)

3. **Configurar Stripe:**
   - Adicionar as keys do Stripe nas env vars
   - Testar pagamentos

4. **Configurar Anthropic AI:**
   - Adicionar ANTHROPIC_API_KEY
   - Testar geração de planos com IA

---

## 📱 COMPARTILHAR

Depois que funcionar, você pode compartilhar sua URL com usuários para testar!

**Sua aplicação está pronta para produção!** 🎊
