# 🔧 TROUBLESHOOTING - Conexão com Banco de Dados

## ❌ Erro Atual

```
Error: P1001: Can't reach database server at `db.yjcelqyndhvmcsiihmko.supabase.co:5432`
```

---

## ✅ SOLUÇÃO PASSO A PASSO

### 1. Verificar se o Projeto Supabase está ativo

1. Acesse: https://supabase.com/dashboard
2. Vá no seu projeto: `nutrifitcoach`
3. Verifique se aparece **"Active"** ou **"Paused"**
4. Se estiver **Paused**, click em **"Restore"**

---

### 2. Verificar se a senha está correta

No dashboard do Supabase:
1. Settings → Database
2. Veja a opção **"Reset Database Password"** se necessário
3. **IMPORTANTE:** A senha atual é: `3RJT7IBhzvQNGaLm`

---

### 3. Obter a Connection String CORRETA

No Supabase Dashboard:
1. Settings → Database
2. Scroll até **"Connection string"**
3. **Clique em "URI"** (não Supavisor, não Transaction)
4. Copie o texto que aparece
5. Substitua `[YOUR-PASSWORD]` pela senha: `3RJT7IBhzvQNGaLm`

**Formato esperado:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres
```

---

### 4. Atualizar .env com a String Correta

Abra o arquivo `.env` e substitua:

```env
DATABASE_URL="postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres"
```

**Adicione parâmetros SSL** (algumas conexões precisam):
```env
DATABASE_URL="postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require"
```

---

### 5. Verificar IPv6/Firewall (Windows)

Às vezes o Windows bloqueia conexões IPv6. Tente:

**Opção A: Forçar IPv4**
```env
DATABASE_URL="postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require&connect_timeout=10"
```

**Opção B: Desabilitar temporariamente Firewall do Windows**
```
Windows Defender Firewall → Turn off (temporariamente)
```

---

### 6. Testar conexão diretamente

**Com psql (se tiver instalado):**
```bash
psql "postgresql://postgres:3RJT7IBhzvQNGaLm@db.yjcelqyndhvmcsiihmko.supabase.co:5432/postgres?sslmode=require"
```

**Com Node.js (teste rápido):**
```bash
node -e "require('pg').Client({connectionString:process.env.DATABASE_URL}).connect().then(()=>console.log('✅ Conectado!')).catch(e=>console.log('❌',e.message))"
```

---

### 7. Usar Supabase CLI (alternativa)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link projeto
supabase link --project-ref yjcelqyndhvmcsiihmko

# Executar migrations via CLI
supabase db push
```

---

### 8. SOLUÇÃO ALTERNATIVA: Usar Transaction Pooler

Se a conexão direta não funcionar, tente o **Transaction Pooler**:

No Supabase Dashboard:
1. Settings → Database
2. Connection string → **Transaction** (não Session, não Supavisor)
3. Porta: **6543**

```env
DATABASE_URL="postgresql://postgres.yjcelqyndhvmcsiihmko:3RJT7IBhzvQNGaLm@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

---

### 9. ÚLTIMO RECURSO: Criar novo projeto Supabase

Se nada funcionar:

1. Criar novo projeto no Supabase
2. Copiar novas credenciais
3. Atualizar `.env`
4. Tentar novamente

---

## 🎯 COMANDO FINAL PARA EXECUTAR

Depois de corrigir o `.env`:

```bash
# 1. Testar conexão
npx prisma db pull

# 2. Se conectar, executar push
npx prisma db push

# 3. Gerar client
npx prisma generate

# 4. Abrir studio para verificar
npx prisma studio
```

---

## 📞 AINDA COM PROBLEMA?

### Verificar Logs do Supabase

1. Supabase Dashboard
2. Database → Logs
3. Ver se há erros de conexão

### Verificar Status do Supabase

https://status.supabase.com

---

## ✅ CHECKLIST RÁPIDO

- [ ] Projeto Supabase está **Active** (não Paused)
- [ ] Senha está correta: `3RJT7IBhzvQNGaLm`
- [ ] Connection String está correta no `.env`
- [ ] Adicionou `?sslmode=require` no final da URL
- [ ] Firewall do Windows não está bloqueando
- [ ] Internet está funcionando
- [ ] Supabase está online (status.supabase.com)

---

## 🔄 DEPOIS DE RESOLVER

Quando conectar com sucesso:

```bash
# 1. Push schema
npx prisma db push

# 2. Gerar client
npx prisma generate

# 3. Verificar tabelas
npx prisma studio
```

Deve aparecer a tabela **FemaleHormonalProfile** criada! ✅
