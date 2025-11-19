# ✅ CHECKLIST COMPLETO - NUTRIFITCOACH NO AR

## 📋 ÍNDICE
1. [PRÉ-REQUISITOS](#1-pré-requisitos)
2. [BANCO DE DADOS](#2-banco-de-dados)
3. [VARIÁVEIS DE AMBIENTE](#3-variáveis-de-ambiente)
4. [TESTES LOCAIS](#4-testes-locais)
5. [DEPLOY](#5-deploy)
6. [PÓS-DEPLOY](#6-pós-deploy)
7. [CHECKLIST FINAL](#7-checklist-final)

---

## 1. PRÉ-REQUISITOS

### 1.1 Contas Necessárias

- [ ] **Supabase** (Banco de Dados PostgreSQL)
  - Criar conta em https://supabase.com
  - Criar novo projeto
  - Anotar: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

- [ ] **Vercel** (Hospedagem - RECOMENDADO)
  - Criar conta em https://vercel.com
  - Conectar com GitHub
  - OU: VPS própria (Digital Ocean, AWS, etc.)

- [ ] **Anthropic** (IA - Claude)
  - Criar conta em https://console.anthropic.com
  - Gerar API Key
  - Anotar: `ANTHROPIC_API_KEY`

- [ ] **Stripe** (Pagamentos - OPCIONAL no início)
  - Criar conta em https://stripe.com
  - Modo teste disponível
  - Anotar: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`

### 1.2 Ferramentas Instaladas Localmente

- [ ] **Node.js 20+**
  ```bash
  node --version  # Deve ser v20.x ou superior
  ```

- [ ] **Git**
  ```bash
  git --version
  ```

- [ ] **PostgreSQL Client** (opcional, para debug)
  ```bash
  psql --version
  ```

---

## 2. BANCO DE DADOS

### 2.1 Configurar Supabase

1. [ ] **Criar projeto no Supabase**
   - Acesse https://supabase.com/dashboard
   - New Project
   - Nome: `nutrifitcoach`
   - Região: `South America (São Paulo)` (mais próxima)
   - Senha do DB: **ANOTE ESSA SENHA!**

2. [ ] **Obter credenciais**
   - Vá em `Settings` → `Database`
   - Copie `Connection String` (URI mode)
   - Substitua `[YOUR-PASSWORD]` pela senha do DB

3. [ ] **Exemplo de DATABASE_URL:**
   ```
   postgresql://postgres.xxxxxx:SUA_SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```

### 2.2 Executar Migrations

```bash
# Na pasta do projeto
cd D:\nutrifitcoach

# 1. Criar migration do NFC Hormonal Engine
npx prisma migrate dev --name add_female_hormonal_profile

# 2. Verificar se migrou corretamente
npx prisma migrate status

# 3. Gerar Prisma Client
npx prisma generate

# 4. (Opcional) Popular com dados de exemplo
npm run db:seed
```

### 2.3 Verificar Tabelas

```bash
# Abrir Prisma Studio (UI visual do banco)
npx prisma studio
```

**Tabelas que devem existir:**
- ✅ AppUser
- ✅ MealPhoto
- ✅ MealAnalysis
- ✅ UserStreak
- ✅ EnemSimulado
- ✅ FemaleHormonalProfile (NOVO!)
- ✅ Account, Session (NextAuth)

---

## 3. VARIÁVEIS DE AMBIENTE

### 3.1 Criar arquivo `.env`

```bash
# Copiar template
cp .env.example .env

# Editar com suas credenciais reais
code .env  # ou notepad .env
```

### 3.2 Preencher TODAS as variáveis obrigatórias

```env
# ==========================================
# BANCO DE DADOS (OBRIGATÓRIO)
# ==========================================
DATABASE_URL="postgresql://postgres.xxxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"

# ==========================================
# SUPABASE (OBRIGATÓRIO)
# ==========================================
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ==========================================
# NEXTAUTH (OBRIGATÓRIO)
# ==========================================
NEXTAUTH_SECRET="gere-uma-string-aleatoria-de-32-caracteres-aqui"
NEXTAUTH_URL="http://localhost:3000"  # Mudar para URL de produção depois

# ==========================================
# ANTHROPIC (RECOMENDADO)
# ==========================================
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxx"

# ==========================================
# STRIPE (OPCIONAL - pode deixar vazio no início)
# ==========================================
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=""

# ==========================================
# OUTROS (OPCIONAL)
# ==========================================
TELEGRAM_BOT_TOKEN=""
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_WHATSAPP_NUMBER=""

# ==========================================
# NEXT.JS
# ==========================================
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_ENVIRONMENT="development"
```

### 3.3 Gerar NEXTAUTH_SECRET

**Opção 1: Online**
```
https://generate-secret.vercel.app/32
```

**Opção 2: Terminal**
```bash
# Linux/Mac
openssl rand -base64 32

# PowerShell (Windows)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## 4. TESTES LOCAIS

### 4.1 Instalar Dependências

```bash
cd D:\nutrifitcoach
npm install
```

### 4.2 Executar em Desenvolvimento

```bash
npm run dev
```

**Deve abrir em:** http://localhost:3000

### 4.3 Testar Funcionalidades Principais

- [ ] **Homepage** (http://localhost:3000)
  - [ ] Carrega sem erros
  - [ ] Design está correto

- [ ] **Registro de Usuário** (/registro)
  - [ ] Criar nova conta
  - [ ] Login funciona
  - [ ] Redirecionamento correto

- [ ] **Anamnese Principal** (/anamnese)
  - [ ] Formulário completo funciona
  - [ ] Upload de fotos funciona
  - [ ] Salvamento no banco funciona

- [ ] **Anamnese Feminina** (/anamnese-feminina)
  - [ ] Tela de introdução aparece
  - [ ] 8 steps funcionam
  - [ ] Salvamento funciona
  - [ ] Classificação hormonal funciona
  - [ ] Tela de finalização aparece

- [ ] **Dashboard** (/dashboard)
  - [ ] Mostra dados do usuário
  - [ ] Gráficos aparecem

- [ ] **Geração de Dieta** (/selecionar-dieta)
  - [ ] Lista de protocolos aparece
  - [ ] Geração funciona (se tiver ANTHROPIC_API_KEY)

- [ ] **API Health Check**
  ```bash
  curl http://localhost:3000/api/health
  # Deve retornar: {"status":"ok"}
  ```

### 4.4 Verificar Logs

```bash
# Deve aparecer no terminal:
✓ Ready in Xms
○ Compiling /...
✓ Compiled /...
```

**NÃO deve ter:**
- ❌ Erros de TypeScript
- ❌ Erros de Prisma
- ❌ Erros de conexão com DB
- ❌ Warnings críticos

### 4.5 Build de Produção (Teste Local)

```bash
npm run build
```

**Deve concluir SEM ERROS:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### 4.6 Executar Produção Local

```bash
npm run start
```

Acessar: http://localhost:3000 e testar novamente.

---

## 5. DEPLOY

### 🚀 OPÇÃO A: VERCEL (RECOMENDADO - MAIS FÁCIL)

#### 5.1 Preparar Repositório GitHub

```bash
# Se ainda não tem repo GitHub
git init
git add .
git commit -m "Initial commit - NutriFitCoach ready for deploy"

# Criar repositório no GitHub
# https://github.com/new

# Conectar local com GitHub
git remote add origin https://github.com/SEU-USUARIO/nutrifitcoach.git
git branch -M main
git push -u origin main
```

#### 5.2 Deploy na Vercel

1. [ ] **Acessar Vercel**
   - https://vercel.com/dashboard

2. [ ] **Import Project**
   - Click "Add New" → "Project"
   - Import Git Repository
   - Selecionar seu repo do GitHub
   - Click "Import"

3. [ ] **Configurar Variáveis de Ambiente**
   - Na aba "Environment Variables"
   - Adicionar TODAS as variáveis do `.env`
   - **IMPORTANTE:** Mudar:
     - `NEXTAUTH_URL` → URL real da Vercel (ex: `https://nutrifitcoach.vercel.app`)
     - `NEXT_PUBLIC_SITE_URL` → mesma URL
     - `NEXT_PUBLIC_ENVIRONMENT` → `production`

4. [ ] **Deploy**
   - Click "Deploy"
   - Aguardar 2-5 minutos
   - ✅ Deploy concluído!

5. [ ] **Acessar Site**
   - URL: `https://nutrifitcoach.vercel.app` (ou domínio customizado)

#### 5.3 Configurar Domínio Customizado (Opcional)

1. [ ] Comprar domínio (ex: Registro.br, Hostinger, etc.)
2. [ ] Na Vercel: Settings → Domains
3. [ ] Add Domain → `nutrifitcoach.com.br`
4. [ ] Configurar DNS conforme instruções da Vercel

---

### 🖥️ OPÇÃO B: VPS (MAIS CONTROLE)

#### 5.1 Preparar VPS

**Providers recomendados:**
- Digital Ocean (Droplet)
- AWS EC2
- Google Cloud
- Contabo

**Specs mínimas:**
- 2 GB RAM
- 1 vCPU
- 25 GB SSD
- Ubuntu 22.04 LTS

#### 5.2 Configurar Servidor

```bash
# SSH no servidor
ssh root@SEU_IP

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar PM2 (process manager)
npm install -g pm2

# Instalar Nginx (reverse proxy)
apt install -y nginx

# Instalar Certbot (SSL grátis)
apt install -y certbot python3-certbot-nginx
```

#### 5.3 Deploy da Aplicação

```bash
# Clonar repositório
cd /var/www
git clone https://github.com/SEU-USUARIO/nutrifitcoach.git
cd nutrifitcoach

# Instalar dependências
npm install

# Criar .env com variáveis de produção
nano .env
# Colar todas as variáveis

# Build
npm run build

# Iniciar com PM2
pm2 start npm --name "nutrifitcoach" -- start
pm2 save
pm2 startup
```

#### 5.4 Configurar Nginx

```bash
nano /etc/nginx/sites-available/nutrifitcoach
```

```nginx
server {
    listen 80;
    server_name nutrifitcoach.com.br www.nutrifitcoach.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar configuração
ln -s /etc/nginx/sites-available/nutrifitcoach /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Configurar SSL (HTTPS)
certbot --nginx -d nutrifitcoach.com.br -d www.nutrifitcoach.com.br
```

---

## 6. PÓS-DEPLOY

### 6.1 Verificações Essenciais

- [ ] **Site está acessível**
  - [ ] HTTPS funciona (cadeado verde)
  - [ ] Redirecionamento HTTP → HTTPS funciona

- [ ] **Funcionalidades principais**
  - [ ] Registro de usuários
  - [ ] Login/Logout
  - [ ] Anamnese (principal + feminina)
  - [ ] Dashboard
  - [ ] Upload de fotos
  - [ ] Geração de dietas (se tiver Anthropic API)

- [ ] **Performance**
  - [ ] Lighthouse Score > 90
  - [ ] Tempo de carregamento < 3s
  - [ ] Imagens otimizadas

- [ ] **SEO**
  - [ ] Título e meta description corretos
  - [ ] Open Graph tags
  - [ ] Sitemap acessível (/sitemap.xml)
  - [ ] robots.txt acessível (/robots.txt)

### 6.2 Configurar Monitoramento

**Opção 1: Vercel Analytics (se usando Vercel)**
- [ ] Ativar em Vercel Dashboard → Analytics

**Opção 2: Google Analytics**
```bash
# Adicionar em app/layout.tsx
# Componente GoogleAnalytics já existe!
```

**Opção 3: Sentry (erros)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 6.3 Configurar Backups do Banco

**Supabase tem backup automático!**
- [ ] Verificar em Supabase → Database → Backups
- [ ] Point-in-time recovery disponível

**Manual (opcional):**
```bash
# Backup local semanal
pg_dump DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 6.4 Criar Documentação para o Time

- [ ] Documentar processo de deploy
- [ ] Credenciais em gerenciador de senhas (1Password, Bitwarden)
- [ ] Playbook de troubleshooting

---

## 7. CHECKLIST FINAL

### 🎯 OBRIGATÓRIO ANTES DE LANÇAR

- [ ] ✅ Banco de dados no ar (Supabase)
- [ ] ✅ Migrations executadas
- [ ] ✅ `.env` configurado com TODAS as variáveis
- [ ] ✅ Build local passa sem erros
- [ ] ✅ Testes locais passam
- [ ] ✅ Deploy concluído (Vercel ou VPS)
- [ ] ✅ HTTPS configurado
- [ ] ✅ Registro de usuário funciona
- [ ] ✅ Login funciona
- [ ] ✅ Anamnese funciona
- [ ] ✅ Dashboard funciona
- [ ] ✅ NFC Hormonal Engine funciona

### 🔒 SEGURANÇA

- [ ] Senhas fortes em produção
- [ ] NEXTAUTH_SECRET gerado (não usar exemplo)
- [ ] Variáveis sensíveis não commitadas no Git
- [ ] `.env` no `.gitignore`
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] CSP headers configurados

### ⚡ PERFORMANCE

- [ ] Build otimizado
- [ ] Imagens comprimidas
- [ ] Lazy loading ativado
- [ ] CDN configurado (Vercel já tem)
- [ ] Cache configurado

### 📊 MONITORAMENTO

- [ ] Logs configurados
- [ ] Analytics ativo
- [ ] Error tracking (Sentry ou similar)
- [ ] Uptime monitoring (UptimeRobot, etc.)

### 💰 PAGAMENTOS (se ativar Stripe)

- [ ] Webhook configurado
- [ ] Modo teste funciona
- [ ] Modo produção configurado
- [ ] Planos criados no Stripe Dashboard

---

## 🚨 TROUBLESHOOTING COMUM

### Erro: "Database connection failed"
```bash
# Verificar DATABASE_URL
# Verificar se Supabase está online
# Verificar se IP está na whitelist do Supabase
```

### Erro: "NEXTAUTH_SECRET is not set"
```bash
# Gerar novo secret
openssl rand -base64 32
# Adicionar no .env
```

### Erro: Build falha na Vercel
```bash
# Verificar logs da Vercel
# Verificar se .env tem TODAS as variáveis
# Tentar build local primeiro: npm run build
```

### Site lento
```bash
# Verificar Lighthouse
# Otimizar imagens
# Ativar caching
# Verificar região do Supabase
```

---

## 📞 SUPORTE

**Se algo não funcionar:**

1. Verificar logs (Vercel Logs ou `pm2 logs`)
2. Verificar `.env` (variáveis corretas?)
3. Verificar banco de dados (Prisma Studio)
4. Testar localmente primeiro
5. Consultar documentação:
   - Next.js: https://nextjs.org/docs
   - Prisma: https://prisma.io/docs
   - Supabase: https://supabase.com/docs

---

## ✅ DEPLOY CONCLUÍDO!

Quando completar TODOS os itens acima, seu **NutriFitCoach** estará **NO AR** e pronto para receber usuárias! 🚀

**URL de Produção:** `https://_____.vercel.app` ou `https://nutrifitcoach.com.br`

🌸 *Feito com ciência e amor* 🌸
