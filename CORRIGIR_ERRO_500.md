# 🔧 CORRIGIR ERRO 500 NO REGISTRO

## ❌ PROBLEMA

Erro 500 em `/api/auth/register` ao tentar criar conta em https://nutrifitcoach.vercel.app

## 🎯 CAUSA PROVÁVEL

1. **Variáveis de ambiente não configuradas na Vercel**
2. **Tabelas não criadas no Supabase**
3. **Connection string incorreta**

---

## ✅ SOLUÇÃO PASSO A PASSO

### PASSO 1: VERIFICAR LOGS NA VERCEL

1. Acesse: https://vercel.com/dashboard
2. Click no projeto **nutrifitcoach**
3. Vá em **Deployments**
4. Click no deployment mais recente
5. Click em **"Runtime Logs"** ou **"Functions"**
6. Procure por erros relacionados a:
   - `Can't reach database`
   - `DATABASE_URL`
   - `Prisma`
   - `P1001`, `P2002`, etc.

**Me envie o log completo se tiver!**

---

### PASSO 2: VERIFICAR VARIÁVEIS DE AMBIENTE

1. Ainda no projeto Vercel, vá em **Settings**
2. Click em **Environment Variables**

#### Verifique se TODAS estas variáveis existem:

✅ **DATABASE_URL**
```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

✅ **SUPABASE_URL**
```
https://yjcelqyndhvmcsiihmko.supabase.co
```

✅ **SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjQ3OTMsImV4cCI6MjA3OTAwMDc5M30.LHVpPkkD5mnUfDhbkz5oqiPLA68MfgyFgTPBvnkEipE
```

✅ **SUPABASE_SERVICE_ROLE_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqY2VscXluZGh2bWNzaWlobWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQyNDc5MywiZXhwIjoyMDc5MDAwNzkzfQ.FvcOln5vNHk6HDAW21IXnZeVi4z982LWARTCUHXv8g8
```

✅ **NEXTAUTH_SECRET**
```
bba148f1e82c0c0ad55a14d2d73c34c42e4d783d42fa0dfd0b1ee7c77f3fe7ad
```

✅ **NEXTAUTH_URL**
```
https://nutrifitcoach.vercel.app
```

✅ **NEXT_PUBLIC_SITE_URL**
```
https://nutrifitcoach.vercel.app
```

✅ **NEXT_PUBLIC_ENVIRONMENT**
```
production
```

#### Se alguma variável estiver faltando:

1. Click em **"Add New"**
2. Cole o nome e valor
3. Selecione **Production, Preview, Development**
4. Click **"Save"**

#### Depois de adicionar/corrigir:

1. Vá em **Deployments**
2. Click nos 3 pontinhos do último deployment
3. Click **"Redeploy"**
4. Aguarde 2-3 minutos

---

### PASSO 3: VERIFICAR SE TABELAS EXISTEM NO SUPABASE

1. Acesse: https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko

2. Vá em **Table Editor** (menu lateral)

3. Verifique se existem estas tabelas:
   - ✅ `AppUser`
   - ✅ `FemaleHormonalProfile`
   - ✅ `Account` (NextAuth)
   - ✅ `Session` (NextAuth)

#### Se NÃO existirem:

1. Vá em **SQL Editor**
2. Click em **"New query"**
3. Copie TODO o conteúdo do arquivo: `D:\nutrifitcoach\EXECUTAR_NO_SUPABASE.sql`
4. Cole no editor SQL
5. Click em **"Run"**
6. Aguarde completar (pode demorar 10-30 segundos)

#### Depois de executar o SQL:

1. Volte na Vercel
2. Force um **Redeploy**
3. Teste novamente

---

### PASSO 4: TESTAR NOVAMENTE

Depois de corrigir:

1. Acesse: https://nutrifitcoach.vercel.app/registro

2. Preencha:
   - Nome: Teste
   - Email: teste@email.com
   - Senha: 123456

3. Click **"Criar Conta"**

4. **Deve funcionar!** ✅

---

## 🔍 DIAGNÓSTICO RÁPIDO

### Se aparecer "Can't reach database server":
- ❌ `DATABASE_URL` está incorreta
- **Solução:** Copie novamente do Supabase Dashboard

### Se aparecer "Prisma Client not found":
- ❌ Build problem
- **Solução:** Redeploy na Vercel

### Se aparecer "relation AppUser does not exist":
- ❌ Tabelas não criadas no Supabase
- **Solução:** Execute o SQL no Supabase

### Se aparecer "NEXTAUTH_SECRET is required":
- ❌ Variável de ambiente faltando
- **Solução:** Adicione na Vercel e redeploy

---

## 📋 CHECKLIST RÁPIDO

Antes de testar novamente:

- [ ] Variáveis de ambiente adicionadas na Vercel (8 variáveis)
- [ ] SQL executado no Supabase (tabelas criadas)
- [ ] Redeploy feito na Vercel
- [ ] Logs da Vercel verificados (sem erros)
- [ ] Supabase project status = verde (ativo)

---

## 🆘 SE AINDA NÃO FUNCIONAR

**Me envie:**

1. **Screenshot das variáveis de ambiente** na Vercel (pode tampar os valores)
2. **Screenshot das tabelas** no Supabase Table Editor
3. **Logs completos** do Runtime Logs da Vercel (quando tentar criar conta)

Com isso eu consigo identificar exatamente o problema!

---

## 🎯 PRÓXIMO PASSO

Depois que o registro funcionar:

1. ✅ Criar conta
2. ✅ Fazer login
3. ✅ Acessar `/anamnese-feminina`
4. 🎉 Testar o NFC Hormonal Engine completo!
