# 🥗 NutriFitCoach - Plataforma de Nutrição com IA

> Seu nutricionista pessoal powered by Claude AI

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-orange)](https://www.anthropic.com/)

---

## 🌟 Funcionalidades

### 🏥 Anamnese Nutricional Completa
- Questionário detalhado em 10 etapas
- Upload de exames laboratoriais
- Fotos de progresso
- Análise antropométrica automatizada

### 🤖 IA Avançada (Claude 3.5 Sonnet)
- Geração de cardápios personalizados
- Análise de refeições por foto
- ChatBot nutricional 24/7
- RAG com conhecimento especializado

### 📊 Acompanhamento de Progresso
- Gráficos de evolução de peso
- Comparação de fotos antes/depois
- Métricas de macronutrientes
- Histórico completo

### 🎮 Gamificação
- Sistema de pontos e níveis
- Badges de conquistas
- Ranking de usuários
- Streaks diárias

### 📚 Módulo ENEM
- Simulados completos
- Ranking por desempenho
- Estatísticas por área
- Sistema de níveis (Bronze → Diamond)

### 💳 Pagamentos
- Integração com Stripe
- Planos Premium
- Webhooks automáticos

---

## 🚀 Tecnologias

### Frontend
- **Next.js 15** - React framework com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling com design system customizado
- **Recharts** - Gráficos de progresso
- **PWA** - Instalável no mobile

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database
- **NextAuth.js** - Autenticação completa

### IA & ML
- **Anthropic Claude** - LLM principal
- **RAG** - Retrieval Augmented Generation
- **Embeddings** - Busca semântica

### Segurança
- **Rate Limiting** - Proteção contra abuse
- **Input Validation** - Sanitização completa
- **JWT Refresh Tokens** - Auth seguro
- **Security Headers** - CSP, HSTS, etc.
- **Password Policy** - Senhas fortes obrigatórias

### DevOps
- **Pino** - Logging estruturado
- **Sharp** - Compressão de imagens
- **Jest** - Testes automatizados
- **Bundle Analyzer** - Otimização de bundle

---

## 📦 Instalação Rápida

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/nutrifitcoach.git
cd nutrifitcoach

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4. Preparar banco de dados
npm run db:push
npm run db:seed  # Opcional: dados de exemplo

# 5. Iniciar aplicação
npm run dev
```

Acesse: http://localhost:3000

---

## 🔧 Variáveis de Ambiente

Consulte [.env.example](.env.example) para lista completa.

**Obrigatórias:**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"
```

**Opcionais:**
```env
ANTHROPIC_API_KEY="sk-ant-..."      # IA
STRIPE_SECRET_KEY="sk_test_..."     # Pagamentos
TELEGRAM_BOT_TOKEN="..."            # Notificações
```

---

## 📚 Documentação

- [Guia de Deploy](./DEPLOY.md) - Deploy em Vercel ou VPS
- [Documentação Completa](./docs/DOCUMENTATION.md)
- [Auth Setup](./docs/AUTH-SETUP.md)
- [PWA Documentation](./docs/PWA-DOCUMENTATION.md)

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📊 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento
npm run build            # Build de produção
npm run build:analyze    # Build com análise de bundle
npm run start            # Iniciar produção
npm run lint             # ESLint
npm run format           # Prettier
npm run health           # Health check
```

### Database

```bash
npm run db:push          # Sync schema
npm run db:migrate       # Migration
npm run db:seed          # Popular dados
npm run db:studio        # UI do Prisma
```

---

## 🏗️ Arquitetura

```
nutrifitcoach/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard do usuário
│   ├── enem/             # Módulo ENEM
│   └── (auth)/           # Rotas de autenticação
├── components/
│   ├── ui/               # Componentes UI reutilizáveis
│   ├── shared/           # Componentes compartilhados
│   └── layout/           # Layout components
├── lib/
│   ├── security/         # Validações e rate limiting
│   ├── utils/            # Utilitários
│   └── prisma.ts         # Prisma singleton
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/
    └── uploads/          # Uploads de usuários
```

---

## 🔐 Segurança

### Implementado
- ✅ Rate limiting em rotas críticas
- ✅ Input sanitization
- ✅ SQL injection protection (Prisma)
- ✅ XSS prevention
- ✅ CSRF protection (NextAuth)
- ✅ Secure headers (CSP, HSTS, etc)
- ✅ Password hashing (bcrypt)
- ✅ JWT with refresh tokens

### Headers
- `Content-Security-Policy` - Previne XSS
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME sniffing
- `Strict-Transport-Security` - Force HTTPS
- `Referrer-Policy` - Controla referrer

---

## 📈 Performance

### Otimizações Implementadas
- ✅ Lazy loading de componentes pesados (ChatBot, Recharts)
- ✅ Image optimization com next/image (WebP/AVIF)
- ✅ Compressão de uploads (Sharp)
- ✅ API caching com revalidate
- ✅ Bundle optimization
- ✅ Code splitting automático

### Métricas (Lighthouse)
- Performance: 90+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 90+

---

## 🛠️ Deploy

### Vercel (Recomendado)

```bash
# Via CLI
vercel

# Ou conectar via GitHub
# → Deploy automático em cada push
```

### VPS com PM2

```bash
npm run build:standalone
# Copiar .next/standalone para servidor
pm2 start ecosystem.config.js
```

Consulte [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit: `git commit -m 'Adiciona MinhaFeature'`
4. Push: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

---

## 📝 Changelog

### v1.0.0 (2025-01-17)
- ✨ Sistema completo de anamnese
- ✨ IA com Claude 3.5 Sonnet
- ✨ RAG com conhecimento especializado
- ✨ Módulo ENEM completo
- ✨ Gamificação e ranking
- ✨ PWA instalável
- 🔒 Segurança completa (FASE 2)
- ⚡ Performance otimizada (FASE 3)
- 🎨 Design system premium (FASE 5)
- 🚀 Deploy ready (FASE 6)

---

## 📄 Licença

Este projeto é proprietário.

---

## 📞 Suporte

- 📧 Email: suporte@nutrifitcoach.com.br
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/nutrifitcoach/issues)
- 📖 Docs: [/docs](./docs)

---

## 🎯 Roadmap

- [ ] App mobile nativo (React Native)
- [ ] Integração com wearables (Apple Health, Google Fit)
- [ ] Marketplace de nutricionistas
- [ ] Análise de composição corporal por IA
- [ ] Integração com supermercados

---

**Feito com ❤️ usando Next.js e Claude AI**
