# 🔍 COMO PEGAR A CONNECTION STRING DO POOLER

## 📍 LOCALIZAÇÃO NO SUPABASE

1. Acesse: https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko/settings/database

2. **Scroll para baixo** até encontrar a seção **"Connection string"**

3. Você verá **VÁRIAS ABAS** (não apenas uma!):
   - **URI** ← Você está vendo esta
   - **JDBC**
   - **Session mode** ← PRECISAMOS DESTA! 🎯
   - **Transaction mode**
   - **.NET**
   - **Golang**
   - **etc.**

---

## 🎯 PASSO A PASSO COM IMAGENS VISUAIS

### PASSO 1: Encontre as ABAS

Na seção "Connection string", procure por **ABAS HORIZONTAIS** acima da connection string.

Deve ter algo assim:

```
Connection string
┌─────┬──────┬──────────────┬─────────────────┬──────┐
│ URI │ JDBC │ Session mode │ Transaction mode│ .NET │ ...
└─────┴──────┴──────────────┴─────────────────┴──────┘
```

### PASSO 2: Click em "Session mode"

Click na aba **"Session mode"**

### PASSO 3: Copie a string

A connection string vai **MUDAR** e mostrar algo diferente, tipo:

```
postgresql://postgres.yjcelqyndhvmcsiihmko:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

**Diferenças importantes:**
- ❌ Não é `db.yjcelqyndhvmcsiihmko.supabase.co:5432`
- ✅ É `pooler.supabase.com:6543` ou `pooler.supabase.com:5432`
- ✅ Tem `postgres.PROJETO_ID` no início

---

## 🔍 SE NÃO ACHAR AS ABAS

Pode ser que a interface do Supabase tenha mudado. Tente isso:

### ALTERNATIVA 1: Procure por "Connection Pooling"

1. Na mesma página (Database Settings)
2. Procure por uma seção chamada **"Connection Pooling"** ou **"Connection Pool"**
3. Pode ter a string lá

### ALTERNATIVA 2: Use esta string construída

Se você não conseguir achar, use esta string que eu montei baseado no seu projeto:

```
postgresql://postgres.yjcelqyndhvmcsiihmko:3RJT7IBhzvQNGaLm@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**OU esta alternativa:**

```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

A diferença é apenas a porta (5432 → 6543).

---

## 🎯 TENTE ESTAS OPÇÕES

Vamos testar 3 connection strings diferentes. Atualize na Vercel e teste cada uma:

### OPÇÃO 1: Pooler Session Mode (mais recomendado)
```
postgresql://postgres.yjcelqyndhvmcsiihmko:3RJT7IBhzvQNGaLm@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### OPÇÃO 2: Direct Connection com porta pooler
```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### OPÇÃO 3: Direct Connection com SSL
```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require&connection_limit=1
```

---

## 📋 COMO TESTAR

Para cada opção:

1. **Copie a connection string**
2. **Vá na Vercel:** Settings → Environment Variables
3. **Edite DATABASE_URL** e cole a string
4. **Save**
5. **Redeploy**
6. **Teste:** https://nutrifitcoach.vercel.app/api/debug
7. **Se der erro, tente a próxima opção**

---

## 🆘 SE NENHUMA FUNCIONAR

Pode ser um problema de IP whitelist do Supabase. Nesse caso:

1. Vá em: https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko/settings/database
2. Procure por **"IP Allowlist"** ou **"Network Restrictions"**
3. Se tiver restrições, **desabilite** ou **adicione:** `0.0.0.0/0` (permitir todos IPs)

---

## 💡 PRÓXIMO PASSO

**Vamos tentar a OPÇÃO 1 primeiro?**

Atualize `DATABASE_URL` na Vercel com:
```
postgresql://postgres.yjcelqyndhvmcsiihmko:3RJT7IBhzvQNGaLm@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

Depois faça redeploy e teste `/api/debug` novamente!
