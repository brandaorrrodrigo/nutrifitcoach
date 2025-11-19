# ✅ CHECKLIST: VARIÁVEIS DE AMBIENTE NA VERCEL

## 🎯 AÇÃO NECESSÁRIA

Você precisa adicionar/verificar as variáveis de ambiente na Vercel **ANTES** que o deploy funcione.

---

## 📋 COMO ADICIONAR NA VERCEL

### 1. Acesse o Dashboard da Vercel
https://vercel.com/dashboard

### 2. Selecione seu projeto
Click em **`nutrifitcoach`**

### 3. Vá em Settings
Click em **Settings** (menu lateral esquerdo)

### 4. Vá em Environment Variables
Click em **Environment Variables**

### 5. Adicione TODAS estas variáveis
Click em **"Add"** para cada variável abaixo

---

## 🔐 VARIÁVEIS OBRIGATÓRIAS

### DATABASE_URL
**Valor:**
```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

**Environment:** Production, Preview, Development (selecione todos)

---

### SUPABASE_URL
**Valor:**
```
https://yjcelqyndhvmcsiihmko.supabase.co
```

**Environment:** Production, Preview, Development

---

### SUPABASE_ANON_KEY
**Valor:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjQ3OTMsImV4cCI6MjA3OTAwMDc5M30.LHVpPkkD5mnUfDhbkz5oqiPLA68MfgyFgTPBvnkEipE
```

**Environment:** Production, Preview, Development

---

### SUPABASE_SERVICE_ROLE_KEY
**Valor:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQyNDc5MywiZXhwIjoyMDc5MDAwNzkzfQ.FvcOln5vNHk6HDAW21IXnZeVi4z982LWARTCUHXv8g8
```

**Environment:** Production, Preview, Development

---

### NEXTAUTH_SECRET

**GERAR NOVO:**
1. Acesse: https://generate-secret.vercel.app/32
2. Copie o valor gerado
3. Cole aqui

**OU use este temporário:**
```
bba148f1e82c0c0ad55a14d2d73c34c42e4d783d42fa0dfd0b1ee7c77f3fe7ad
```

**Environment:** Production, Preview, Development

---

### NEXTAUTH_URL

**⚠️ DEIXE VAZIO AGORA!**

Você vai preencher depois do primeiro deploy com a URL da Vercel.

**Environment:** Production

---

### NEXT_PUBLIC_SITE_URL

**⚠️ DEIXE VAZIO AGORA!**

Você vai preencher depois do primeiro deploy com a URL da Vercel.

**Environment:** Production, Preview, Development

---

### NEXT_PUBLIC_ENVIRONMENT
**Valor:**
```
production
```

**Environment:** Production

---

## 🔧 VARIÁVEIS OPCIONAIS (podem deixar vazias)

Estas **NÃO** impedem o deploy:

### STRIPE_SECRET_KEY
**Deixe vazio por enquanto** (você pode adicionar depois quando configurar Stripe)

### STRIPE_WEBHOOK_SECRET
**Deixe vazio por enquanto**

### ANTHROPIC_API_KEY
**Deixe vazio por enquanto** (para funcionalidades de IA)

### RAG_STORAGE_PATH
**Valor opcional:**
```
./data/legacy/
```

---

## ✅ DEPOIS DE ADICIONAR AS VARIÁVEIS

### 1. Force um Redeploy

Vá em **Deployments** → Click nos 3 pontinhos do último deployment → **"Redeploy"**

### 2. Aguarde o Build (2-5 minutos)

### 3. Quando terminar, copie a URL

Exemplo: `https://nutrifitcoach-xyz.vercel.app`

### 4. Volte em Environment Variables

Edite estas 2 variáveis que deixou vazias:

**NEXTAUTH_URL:**
```
https://nutrifitcoach-xyz.vercel.app
```
(substitua pela sua URL real)

**NEXT_PUBLIC_SITE_URL:**
```
https://nutrifitcoach-xyz.vercel.app
```
(substitua pela sua URL real)

### 5. Force outro Redeploy

Deployments → Redeploy novamente

### 6. TESTE!

Acesse `https://nutrifitcoach-xyz.vercel.app` e teste:
- ✅ Criar conta
- ✅ Fazer login
- ✅ Acessar `/anamnese-feminina`
- ✅ Completar as 8 etapas do NFC Hormonal Engine

---

## 🆘 SE O BUILD AINDA FALHAR

### Verificar Logs

1. Click no deployment que falhou
2. Vá em **"Build Logs"**
3. Procure por erros específicos
4. Me envie o erro completo

### Erros Comuns

#### "Can't reach database server"
- Significa que alguma variável está errada
- Verifique se `DATABASE_URL` está EXATAMENTE como mostrado acima
- Verifique se não tem espaços antes/depois

#### "NEXTAUTH_SECRET is required"
- Faltou adicionar `NEXTAUTH_SECRET`
- Adicione a variável e faça redeploy

#### "Module not found"
- Problema com dependências
- Deve resolver sozinho no próximo deploy

---

## 💡 DICA

**Copie todas as variáveis de uma vez:**

Na Vercel, você pode colar múltiplas variáveis no formato:

```
DATABASE_URL="postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
SUPABASE_URL="https://yjcelqyndhvmcsiihmko.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjQ3OTMsImV4cCI6MjA3OTAwMDc5M30.LHVpPkkD5mnUfDhbkz5oqiPLA68MfgyFgTPBvnkEipE"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQyNDc5MywiZXhwIjoyMDc5MDAwNzkzfQ.FvcOln5vNHk6HDAW21IXnZeVi4z982LWARTCUHXv8g8"
NEXTAUTH_SECRET="bba148f1e82c0c0ad55a14d2d73c34c42e4d783d42fa0dfd0b1ee7c77f3fe7ad"
NEXT_PUBLIC_ENVIRONMENT="production"
```

---

## 🎯 RESUMO

1. ✅ Adicione as 7 variáveis OBRIGATÓRIAS na Vercel
2. ✅ Force um Redeploy
3. ✅ Copie a URL do deploy
4. ✅ Adicione `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` com a URL
5. ✅ Force outro Redeploy
6. 🎉 TESTE SEU APP!

---

**Sua vez! Me avise quando:**
- ✅ Adicionar as variáveis
- ✅ O deploy completar
- ❌ Aparecer algum erro
