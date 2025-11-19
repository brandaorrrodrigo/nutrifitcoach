# 🚀 DEPLOY RÁPIDO - 15 MINUTOS

## ⏱️ TEMPO TOTAL: ~15 minutos

---

## 1️⃣ BANCO DE DADOS (3 min)

```bash
# 1. Criar conta no Supabase
https://supabase.com

# 2. New Project → Nome: nutrifitcoach
# 3. Copiar DATABASE_URL (Settings → Database → Connection String)
```

---

## 2️⃣ VARIÁVEIS DE AMBIENTE (2 min)

```bash
# Criar .env
cp .env.example .env

# Preencher (mínimo):
DATABASE_URL="postgresql://..." # Do Supabase
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-..." # (opcional)
```

---

## 3️⃣ PREPARAR BANCO (2 min)

```bash
cd D:\nutrifitcoach

# Instalar dependências
npm install

# Executar migration
npx prisma migrate dev --name initial

# Gerar Prisma Client
npx prisma generate
```

---

## 4️⃣ TESTAR LOCAL (3 min)

```bash
# Build
npm run build

# Se passou, testar dev
npm run dev

# Acessar http://localhost:3000
# Criar uma conta
# Testar anamnese feminina
```

---

## 5️⃣ DEPLOY VERCEL (5 min)

```bash
# 1. Push para GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USUARIO/nutrifitcoach.git
git push -u origin main

# 2. Ir para Vercel
https://vercel.com/new

# 3. Import Repository → Selecionar seu repo

# 4. Adicionar Environment Variables (copiar do .env local)
# IMPORTANTE: Mudar NEXTAUTH_URL para URL da Vercel!

# 5. Deploy!
```

---

## ✅ PRONTO!

Seu site estará em:
```
https://nutrifitcoach.vercel.app
```

---

## 🔧 SE ALGO DER ERRADO

### Erro de Build na Vercel?
```bash
# Verificar logs da Vercel
# Verificar se TODAS as variáveis estão no .env
# Tentar build local: npm run build
```

### Erro de Database?
```bash
# Verificar DATABASE_URL
# Verificar se migration rodou: npx prisma migrate status
```

### Site não carrega?
```bash
# Verificar se NEXTAUTH_URL está correto (URL da Vercel)
# Verificar logs: Vercel → Deployments → [seu deploy] → Logs
```

---

## 📞 AJUDA

Checklist completo: `CHECKLIST_DEPLOY.md`

---

**Deploy em 15 minutos ✅**
