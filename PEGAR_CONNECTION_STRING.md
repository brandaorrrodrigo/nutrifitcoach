# 📋 COMO PEGAR A CONNECTION STRING CORRETA

## 🎯 PASSO A PASSO

### 1. Acesse o Dashboard do Supabase
https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko

### 2. Vá em Settings
- Menu lateral esquerdo
- Clique em **"Settings"** (ícone de engrenagem)

### 3. Clique em "Database"
- Na aba "Configuration"
- Scroll até encontrar **"Connection string"**

### 4. IMPORTANTE: Escolha a ABA CORRETA

Você vai ver 3 abas:
- **URI** ← USE ESTA! ⭐
- Session pooler
- Transaction pooler

**Clique na aba "URI"**

### 5. Copiar a String

Você verá algo assim:
```
postgresql://postgres:[YOUR-PASSWORD]@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres
```

### 6. Substituir [YOUR-PASSWORD]

A senha é: `3RJT7IBhzvQNGaLm`

String final deve ficar:
```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres
```

### 7. Adicionar Parâmetros SSL

Adicione no final:
```
postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require
```

### 8. Colar no .env

Abra `D:\nutrifitcoach\.env` e substitua a linha:

```env
DATABASE_URL="postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require"
```

### 9. Testar

```bash
node test-db-connection.js
```

---

## ⚠️ SE AINDA NÃO FUNCIONAR

### Tentar com IPv4

Às vezes o Windows bloqueia IPv6. Force IPv4:

```env
DATABASE_URL="postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require&connect_timeout=10"
```

### Desabilitar Firewall (temporário)

1. Windows Defender Firewall
2. Turn off (apenas para teste)
3. Tentar novamente

### Verificar Antivírus

Alguns antivírus bloqueiam conexões PostgreSQL na porta 5432.

---

## 🚀 ALTERNATIVA: USAR SUPABASE CLIENT DIRETO

Se a conexão Prisma não funcionar, podemos usar o Supabase Client (sempre funciona):

```bash
npm install @supabase/supabase-js
```

E adaptar o código para usar Supabase Client ao invés de Prisma.

---

## 💡 SOLUÇÃO MAIS RÁPIDA

**FAZER DEPLOY NA VERCEL AGORA!**

A Vercel **SEMPRE** consegue conectar ao Supabase, mesmo que seu PC não consiga (problema de firewall/ISP).

Você pode:
1. Fazer deploy na Vercel
2. Testar lá
3. Desenvolver direto na produção ou continuar tentando local

Me avise qual caminho prefere! 🚀
