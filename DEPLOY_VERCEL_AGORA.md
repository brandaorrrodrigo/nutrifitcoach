# 🚀 DEPLOY NA VERCEL - PASSO A PASSO

## ✅ SITUAÇÃO ATUAL

- ✅ Código completo e pronto
- ✅ NFC Hormonal Engine implementado
- ✅ Supabase ativo (projeto verde)
- ✅ Tabelas criadas no banco
- ❌ Firewall local bloqueando conexão

**SOLUÇÃO:** Deploy na Vercel (funciona 100%)

---

## 📋 PASSO A PASSO

### 1️⃣ PREPARAR GIT

```bash
cd D:\nutrifitcoach

# Ver o que mudou
git status

# Adicionar tudo
git add .

# Commit
git commit -m "NutriFitCoach com NFC Hormonal Engine completo"
```

### 2️⃣ CRIAR REPOSITÓRIO NO GITHUB

1. Acesse: https://github.com/new

2. Preencha:
   - Repository name: `nutrifitcoach`
   - Description: `Plataforma de nutrição com IA - NFC Hormonal Engine`
   - Visibility: **Private** (recomendado)

3. **NÃO marque** "Initialize with README"

4. Click **"Create repository"**

### 3️⃣ CONECTAR LOCAL COM GITHUB

Copie os comandos que aparecem na tela do GitHub:

```bash
git remote add origin https://github.com/SEU-USUARIO/nutrifitcoach.git
git branch -M main
git push -u origin main
```

**OU** se já tem o remote configurado:

```bash
git push
```

### 4️⃣ ACESSAR VERCEL

1. Acesse: https://vercel.com/login

2. Login com GitHub (recomendado)

### 5️⃣ IMPORT PROJECT

1. Click **"Add New..."** → **"Project"**

2. Click **"Import Git Repository"**

3. Procure por `nutrifitcoach`

4. Click **"Import"**

### 6️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

Na tela de configuração, adicione as variáveis:

```env
# DATABASE
DATABASE_URL=postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?pgbouncer=true

# SUPABASE
SUPABASE_URL=https://yjcelqyndhvmcsiihmko.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjQ3OTMsImV4cCI6MjA3OTAwMDc5M30.LHVpPkkD5mnUfDhbkz5oqiPLA68MfgyFgTPBvnkEipE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQyNDc5MywiZXhwIjoyMDc5MDAwNzkzfQ.FvcOln5vNHk6HDAW21IXnZeVi4z982LWARTCUHXv8g8

# NEXTAUTH (GERAR NOVO!)
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# NEXT PUBLIC
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ENVIRONMENT=production

# ANTHROPIC (opcional)
ANTHROPIC_API_KEY=
```

**⚠️ IMPORTANTE:**

Para `NEXTAUTH_SECRET`, gerar novo:
- Online: https://generate-secret.vercel.app/32
- Ou usar: `openssl rand -base64 32`

Para `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL`:
- Deixe em branco agora
- Depois do deploy, a Vercel vai te dar a URL
- Você volta e adiciona

### 7️⃣ DEPLOY

1. Click **"Deploy"**

2. Aguarde 2-5 minutos ☕

3. Você verá:
   ```
   ✅ Building...
   ✅ Deploying...
   ✅ Ready!
   ```

### 8️⃣ COPIAR URL E ATUALIZAR ENV VARS

1. Copie a URL do seu site (ex: `https://nutrifitcoach-xyz.vercel.app`)

2. Vá em: **Settings** → **Environment Variables**

3. **Edite:**
   - `NEXTAUTH_URL` = `https://nutrifitcoach-xyz.vercel.app`
   - `NEXT_PUBLIC_SITE_URL` = `https://nutrifitcoach-xyz.vercel.app`

4. Click **"Save"**

5. Vá em **"Deployments"** → Click nos 3 pontinhos → **"Redeploy"**

### 9️⃣ TESTAR!

1. Acesse: `https://nutrifitcoach-xyz.vercel.app`

2. Crie uma conta

3. Teste a anamnese feminina: `/anamnese-feminina`

4. **DEVE FUNCIONAR!** ✅

---

## 🎉 PRONTO!

Seu **NutriFitCoach** está **NO AR**! 🚀

---

## 🔧 SE DER ERRO NO DEPLOY

### Ver Logs

1. Vercel Dashboard
2. Click no deployment
3. Vá em **"Logs"**
4. Me mande o erro

### Erro de Build

Se falhar no build:
- Verificar se todas as variáveis estão corretas
- Ver se não tem erro de TypeScript

### Erro de Runtime

Se buildar mas não funcionar:
- Verificar logs
- Verificar se `NEXTAUTH_URL` está correto
- Verificar se Supabase está ativo

---

## 📱 DOMÍNIO CUSTOMIZADO (OPCIONAL)

Depois que funcionar, você pode adicionar domínio:

1. Vercel Dashboard → Settings → Domains
2. Add Domain
3. Configure DNS conforme instruções

---

**Vamos fazer o deploy agora?** 🚀
