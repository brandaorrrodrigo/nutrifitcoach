# 🔑 PEGAR A SENHA EXATA DO SUPABASE

## ⚠️ IMPORTANTE

O erro "Tenant or user not found" geralmente significa que a **SENHA ESTÁ INCORRETA** ou foi resetada.

---

## 📋 COMO VERIFICAR/RESETAR A SENHA

### OPÇÃO 1: Verificar a senha atual

1. Acesse: https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko/settings/database

2. Scroll até **"Database password"**

3. A senha pode estar **MASCARADA** (escondida com `******`)

4. **NÃO tem como ver a senha antiga!** Você precisa resetar.

---

### OPÇÃO 2: RESETAR A SENHA DO BANCO (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko/settings/database

2. Procure por **"Reset database password"** ou **"Database password"**

3. Click em **"Reset database password"** ou **"Generate new password"**

4. **COPIE A NOVA SENHA** que aparecer (você NÃO vai conseguir ver de novo!)

5. Salve em algum lugar seguro

---

## 🎯 DEPOIS DE RESETAR A SENHA

### 1. Montar a nova connection string

Com a nova senha em mãos, monte assim:

```
postgresql://postgres:NOVA_SENHA_AQUI@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require
```

**Exemplo:** Se a nova senha for `AbC123XyZ`, fica:
```
postgresql://postgres:AbC123XyZ@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require
```

### 2. Atualizar na Vercel

1. Vercel → Settings → Environment Variables
2. Edite `DATABASE_URL`
3. Cole a nova connection string
4. Save
5. Redeploy

### 3. Atualizar no .env local

Edite `D:\nutrifitcoach\.env`:

```env
DATABASE_URL="postgresql://postgres:NOVA_SENHA_AQUI@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require"
```

### 4. Testar

https://nutrifitcoach.vercel.app/api/debug

Deve mostrar: `"database_connection": "OK"`

---

## 🔍 ALTERNATIVA: USAR SUPABASE SERVICE ROLE KEY

Se o Prisma continuar dando problema, podemos usar o **Supabase Client** ao invés do Prisma para criar usuários.

Mas primeiro vamos tentar resetar a senha!

---

## ⚡ AÇÃO AGORA

1. **Resetar senha** no Supabase Database Settings
2. **Copiar a nova senha**
3. **Me enviar** (pode censurar metade se quiser)
4. Eu monto a connection string correta
5. Você atualiza na Vercel

**OU**

Se preferir fazer você mesmo:
1. Resete a senha
2. Monte a string: `postgresql://postgres:SENHA@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require`
3. Atualize na Vercel
4. Redeploy
5. Teste `/api/debug`

---

## 🆘 SE NÃO ACHAR "RESET PASSWORD"

Tire um **print da tela** do Database Settings e me envie. Vou te mostrar exatamente onde clicar!
