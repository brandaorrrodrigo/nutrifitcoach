# 🚀 Guia de Setup - PostgreSQL com Supabase

Este guia te leva passo a passo para configurar o banco de dados PostgreSQL do **NutriFitCoach** no Supabase e fazer deploy na Vercel.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Conta no Supabase (https://supabase.com)
- [ ] Conta na Vercel (https://vercel.com)
- [ ] Node.js instalado (versão 18+)
- [ ] Projeto clonado localmente em `D:\NutriFitcoach`

---

## 🗄️ PARTE 1: Criar Projeto no Supabase

### Passo 1: Acessar o Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Faça login com sua conta
3. Clique em **"New Project"** (Novo Projeto)

### Passo 2: Configurar o Projeto

Preencha os dados do projeto:

- **Organization**: Selecione sua organização (ou crie uma nova)
- **Name**: `NutriFitCoach`
- **Database Password**: Crie uma senha FORTE e **ANOTE EM LUGAR SEGURO**
  - ⚠️ **IMPORTANTE**: Você vai precisar dessa senha para a connection string!
  - Exemplo: `Minha$enh@Forte123!`
- **Region**: Escolha a região mais próxima dos seus usuários
  - Brasil: `South America (São Paulo)` (se disponível)
  - Alternativa: `East US (North Virginia)`
- **Pricing Plan**: Free (ou pago, conforme necessidade)

Clique em **"Create new project"** e aguarde 2-3 minutos enquanto o Supabase provisiona o banco.

---

## 🔗 PARTE 2: Obter a Connection String

### Passo 3: Copiar a Connection String

Após o projeto ser criado:

1. No painel esquerdo, clique em **"Settings"** (⚙️ Configurações)
2. Clique em **"Database"**
3. Role até a seção **"Connection string"**
4. Selecione a aba **"URI"** (ou "Postgres")
5. Clique em **"Session mode"** (recomendado para aplicações serverless)
6. Você verá algo assim:

```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

7. **COPIE** essa string completa
8. **SUBSTITUA** `[YOUR-PASSWORD]` pela senha que você criou no Passo 2

**Exemplo final:**
```
postgresql://postgres.abcdefghijklm:Minha$enh@Forte123!@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

9. **ADICIONE** `?sslmode=require` no final da URL:

```
postgresql://postgres.abcdefghijklm:Minha$enh@Forte123!@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

⚠️ **IMPORTANTE**: O `?sslmode=require` é **obrigatório** para conexões seguras em produção!

---

## ⚙️ PARTE 3: Configurar Variáveis de Ambiente na Vercel

### Passo 4: Adicionar DATABASE_URL na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **NutriFitCoach**
3. Vá em **Settings** → **Environment Variables**
4. Clique em **"Add New"**
5. Preencha:
   - **Key**: `DATABASE_URL`
   - **Value**: Cole a connection string completa (com `?sslmode=require`)
   - **Environment**: Marque **Production**, **Preview** e **Development**
6. Clique em **"Save"**

### Passo 5: Adicionar outras variáveis obrigatórias

Repita o processo acima para TODAS essas variáveis:

| Key | Value (exemplo) | Onde obter |
|-----|-----------------|------------|
| `NEXTAUTH_SECRET` | `vK8mQ9x2Lp7...` (32+ chars) | Gere com: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://nutrifitcoach.vercel.app` | URL do seu site na Vercel |
| `STRIPE_SECRET_KEY` | `sk_live_...` ou `sk_test_...` | Stripe Dashboard > API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | `pk_live_...` ou `pk_test_...` | Stripe Dashboard > API Keys |

**Opcional (mas recomendado):**
- `STRIPE_WEBHOOK_SECRET` (para webhooks do Stripe)
- `ANTHROPIC_API_KEY` (para IA do Claude)

---

## 💻 PARTE 4: Criar as Tabelas no Supabase

Agora vamos criar toda a estrutura de tabelas no banco de dados do Supabase.

### Passo 6: Configurar .env.local localmente (Desenvolvimento)

No seu computador, navegue até a pasta do projeto:

```bash
cd D:\NutriFitcoach
```

Copie o arquivo de exemplo:

```bash
copy .env.example .env.local
```

Abra `.env.local` e edite a linha `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres.abcdefghijklm:Minha$enh@Forte123!@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

⚠️ **IMPORTANTE**: Use a MESMA connection string que você configurou na Vercel!

### Passo 7: Rodar o Comando do Prisma

Como o projeto **NÃO tem migrations** (usa `prisma db push`), execute:

```bash
npx prisma db push
```

Este comando vai:
1. Ler o arquivo `prisma/schema.prisma`
2. Conectar no Supabase usando a `DATABASE_URL`
3. Criar TODAS as tabelas, índices, enums e constraints
4. Sincronizar o schema com o banco

**Output esperado:**
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-0-sa-east-1.pooler.supabase.com:5432"

🚀  Your database is now in sync with your Prisma schema. Done in 2.34s
```

✅ **Sucesso!** Todas as tabelas foram criadas no Supabase!

---

## 🌱 PARTE 5: Popular o Banco (Seed) - OPCIONAL

O projeto tem um seed script para popular questões do ENEM. **Isso é opcional** e NÃO é necessário para login/registro funcionar.

### Quando rodar o seed?

Execute o seed APENAS se você quer usar o sistema de **simulados ENEM** do projeto.

### Como rodar o seed:

```bash
npx prisma db seed
```

**O que o seed faz:**
- Cria um usuário de teste: `teste@enem.com.br`
- Popula questões do ENEM (se encontrar os arquivos JSON)
- Configura gamificação para o usuário de teste

**Arquivos de questões esperados:**
- `D:/enem-ia/backend/enem_ingestion/todas_questoes_enem.json` (preferencial)
- `D:\NutriFitcoach\prisma\enem_questions_seed.json` (fallback)

⚠️ **ATENÇÃO**: Se nenhum arquivo for encontrado, o seed vai falhar. Isso é normal se você não tem os dados do ENEM.

---

## 🧪 PARTE 6: Testar Localmente

### Passo 8: Instalar dependências

```bash
npm install
```

### Passo 9: Gerar o Prisma Client

```bash
npx prisma generate
```

### Passo 10: Rodar o projeto em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Passo 11: Testar o Registro de Usuário

1. Vá em: http://localhost:3000/registro
2. Preencha:
   - Nome: Seu Nome
   - Email: seu@email.com
   - Senha: abc123 (mínimo 6 caracteres)
3. Clique em **"Criar Conta Grátis"**
4. Se funcionar, você será redirecionado para `/dashboard`

✅ **Se você foi redirecionado para o dashboard, o banco está funcionando perfeitamente!**

---

## 🚢 PARTE 7: Deploy na Vercel

### Passo 12: Fazer commit e push

```bash
git add .
git commit -m "chore: update .env.example with Supabase instructions"
git push
```

### Passo 13: Aguardar deploy automático

A Vercel vai detectar o push e fazer deploy automaticamente.

### Passo 14: Verificar em produção

1. Acesse: https://nutrifitcoach.vercel.app/registro
2. Crie uma conta de teste
3. Faça login

✅ **Se funcionar, PARABÉNS! Seu projeto está 100% funcional em produção!**

---

## 🔍 Verificar Tabelas no Supabase (Opcional)

Para visualizar as tabelas criadas:

1. No Supabase Dashboard, vá em **"Table Editor"**
2. Você verá todas as tabelas criadas:
   - `AppUser` (usuários)
   - `Account`, `Session`, `VerificationToken` (NextAuth)
   - `UserStreak`, `UserDailyTargets` (gamificação)
   - `MealPhoto`, `MealAnalysis`, `MealScore` (fotos de refeições)
   - `EnemSimulado`, `EnemQuestao`, etc. (simulados ENEM)

---

## 🐛 Troubleshooting

### Erro: "Environment variable not found: DATABASE_URL"

**Solução:** Certifique-se de que criou o arquivo `.env.local` e copiou a connection string corretamente.

### Erro: "Error parsing connection string: Invalid connection string"

**Solução:** Verifique se:
- A senha está URL-encoded (caracteres especiais como `@`, `#`, `!` devem ser escapados)
- Não há espaços na connection string
- O formato está correto: `postgresql://user:password@host:port/database?sslmode=require`

### Erro: "P1001: Can't reach database server"

**Solução:**
- Verifique se o projeto Supabase está **ativo** (não pausado)
- Verifique se a região/host está correta
- Tente usar **"Session mode"** ao invés de "Transaction mode"

### Erro ao rodar seed: "Nenhum arquivo de questões encontrado"

**Solução:** Isso é normal se você não tem os arquivos JSON de questões ENEM. O seed é **opcional** e não afeta login/registro.

### Tabelas não aparecem no Supabase

**Solução:**
1. No Supabase, vá em **SQL Editor**
2. Execute: `SELECT * FROM "AppUser" LIMIT 10;`
3. Se aparecer erro "relation does not exist", rode `npx prisma db push` novamente

---

## ✅ Checklist Final

```
✅ Projeto criado no Supabase
✅ Connection string copiada e ajustada (com ?sslmode=require)
✅ DATABASE_URL configurada na Vercel
✅ NEXTAUTH_SECRET, NEXTAUTH_URL configuradas na Vercel
✅ STRIPE_SECRET_KEY e NEXT_PUBLIC_STRIPE_PUBLIC_KEY configuradas
✅ .env.local criado localmente com DATABASE_URL
✅ npx prisma db push executado (tabelas criadas)
✅ npx prisma generate executado
✅ Teste local funcionando (registro + login)
✅ Deploy na Vercel funcionando
✅ Teste em produção funcionando
```

---

## 📚 Comandos Úteis

### Visualizar schema do banco
```bash
npx prisma studio
```

### Resetar banco (CUIDADO: apaga tudo!)
```bash
npx prisma db push --force-reset
```

### Ver logs de erro do Prisma
```bash
npx prisma db push --skip-generate
```

### Atualizar schema após mudanças
```bash
npx prisma db push
npx prisma generate
```

---

## 🎯 Resumo Executivo (TL;DR)

**Para desenvolvedores apressados:**

```bash
# 1. Criar projeto no Supabase e copiar connection string
# 2. Configurar variáveis na Vercel (DATABASE_URL, NEXTAUTH_SECRET, etc.)
# 3. No projeto local:

cd D:\NutriFitcoach
copy .env.example .env.local
# (editar .env.local com DATABASE_URL do Supabase)

npm install
npx prisma db push
npx prisma generate
npm run dev

# 4. Testar registro em http://localhost:3000/registro
# 5. Fazer push e verificar produção
```

**Pronto!** 🎉

---

**Dúvidas ou problemas?** Revise este guia passo a passo ou consulte a documentação:
- Supabase: https://supabase.com/docs
- Prisma: https://www.prisma.io/docs
- Vercel: https://vercel.com/docs
