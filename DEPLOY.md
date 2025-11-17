# 🚀 GUIA DE DEPLOY - NUTRIFITCOACH

## 📋 PRÉ-REQUISITOS

- Node.js 20+ instalado
- PostgreSQL 14+ rodando
- Conta Vercel (recomendado) ou servidor com PM2
- Variáveis de ambiente configuradas

---

## 🔧 CONFIGURAÇÃO INICIAL

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/seu-usuario/nutrifitcoach.git
cd nutrifitcoach
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env

# Editar .env com suas credenciais
nano .env
```

**Variáveis Obrigatórias:**
- `DATABASE_URL` - String de conexão PostgreSQL
- `NEXTAUTH_SECRET` - Gerar com: `openssl rand -base64 32`
- `NEXTAUTH_URL` - URL da aplicação

**Variáveis Opcionais (mas recomendadas):**
- `ANTHROPIC_API_KEY` - Para funcionalidades de IA
- `STRIPE_SECRET_KEY` - Para pagamentos
- `TELEGRAM_BOT_TOKEN` - Para notificações

### 3. Preparar Banco de Dados

```bash
# Executar migrations
npm run db:push

# (Opcional) Popular com dados de exemplo
npm run db:seed
```

---

## 🌐 OPÇÃO A: DEPLOY NA VERCEL (Recomendado)

### Vantagens
- ✅ Deploy automático via Git
- ✅ SSL grátis
- ✅ CDN global
- ✅ Escalabilidade automática
- ✅ Preview deployments
- ✅ Zero config

### Passo a Passo

1. **Criar Projeto no Vercel**
   ```bash
   # Via CLI
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Conectar ao GitHub**
   - Acesse: https://vercel.com/new
   - Selecione o repositório
   - Configure as variáveis de ambiente

3. **Adicionar Variáveis de Ambiente**
   - Vá em: Settings → Environment Variables
   - Adicione todas as variáveis do `.env`
   - Salve

4. **Deploy Automático**
   - Cada push na branch `main` faz deploy automático
   - PRs geram preview deployments

### Comandos Úteis

```bash
# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Ver domains
vercel domains
```

---

## 🖥️ OPÇÃO B: DEPLOY VIA HOSTINGER/VPS (PM2)

### Vantagens
- ✅ Controle total do servidor
- ✅ Mais barato em escala
- ✅ Integração com outros serviços

### Passo a Passo

1. **Preparar Build Standalone**

```bash
# Gerar build otimizado
npm run build:standalone

# Resultado em: .next/standalone
```

2. **Configurar Servidor**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Copiar arquivos para servidor
scp -r .next/standalone/* user@server:/var/www/nutrifitcoach/
scp package.json user@server:/var/www/nutrifitcoach/
scp -r public user@server:/var/www/nutrifitcoach/
```

3. **Iniciar com PM2**

```bash
# No servidor
cd /var/www/nutrifitcoach

# Criar ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'nutrifitcoach',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar config do PM2
pm2 save
pm2 startup
```

4. **Configurar NGINX Reverse Proxy**

```nginx
# /etc/nginx/sites-available/nutrifitcoach

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache de assets estáticos
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Compressão gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

5. **SSL com Certbot**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d nutrifitcoach.com.br -d www.nutrifitcoach.com.br

# Renovação automática
sudo certbot renew --dry-run
```

### Comandos PM2 Úteis

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs nutrifitcoach

# Restart
pm2 restart nutrifitcoach

# Stop
pm2 stop nutrifitcoach

# Monitoramento
pm2 monit
```

---

## 🔍 VERIFICAÇÃO PÓS-DEPLOY

### 1. Health Check

```bash
curl https://seu-dominio.com/api/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "ai": "configured",
    "storage": "ok"
  }
}
```

### 2. Testes Manuais

- [ ] Login funciona
- [ ] Registro de novo usuário
- [ ] Anamnese completa
- [ ] Geração de cardápio com IA
- [ ] Upload de fotos
- [ ] ChatBot responde
- [ ] Dashboard carrega
- [ ] Progresso exibe gráficos
- [ ] Pagamentos Stripe (se configurado)

### 3. Performance

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://seu-dominio.com --view
```

**Metas:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 🔐 SEGURANÇA

### Headers de Segurança (já configurado)

✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ X-DNS-Prefetch-Control: on
✅ Strict-Transport-Security (via middleware)
✅ Content-Security-Policy (via middleware)

### Rate Limiting

✅ Implementado nas rotas:
- /api/chat (10 req/min autenticado, 3 req/min público)
- /api/vision
- /api/rag
- /api/upload-foto

### Validações

✅ Input sanitization em todos endpoints
✅ Upload de fotos validado e comprimido
✅ Senhas com policy forte
✅ JWT com refresh tokens

---

## 📊 MONITORAMENTO

### Logs

```bash
# Ver logs em tempo real (Vercel)
vercel logs --follow

# Ver logs PM2
pm2 logs nutrifitcoach --lines 100
```

### Métricas

- Health Check: `GET /api/health`
- Uptime: PM2 ou Vercel Analytics
- Erros: Logs do Pino (JSON estruturado)

### Alertas (Opcional)

Configure Sentry para monitoramento de erros:

```bash
# Instalar
npm install @sentry/nextjs

# Adicionar ao .env
SENTRY_DSN="seu-dsn"
```

---

## 🔄 UPDATES E MANUTENÇÃO

### Deploy de Atualizações

**Vercel:**
```bash
git push origin main  # Deploy automático
```

**PM2:**
```bash
# No servidor
cd /var/www/nutrifitcoach
git pull
npm install
npm run build
pm2 restart nutrifitcoach
```

### Backup do Banco

```bash
# Backup PostgreSQL
pg_dump -U usuario -d nutrifitcoach > backup-$(date +%Y%m%d).sql

# Restaurar
psql -U usuario -d nutrifitcoach < backup-20250117.sql
```

---

## 🆘 TROUBLESHOOTING

### Erro: "Database connection failed"

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão manual
psql $DATABASE_URL
```

### Erro: "Module not found"

```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Erro: "NEXTAUTH_SECRET not found"

```bash
# Gerar novo secret
openssl rand -base64 32

# Adicionar ao .env
NEXTAUTH_SECRET="cole-aqui"
```

### Build com erro de memória

```bash
# Aumentar memória do Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 📞 SUPORTE

- Documentação: `/docs`
- GitHub Issues: `https://github.com/seu-usuario/nutrifitcoach/issues`
- Email: suporte@nutrifitcoach.com.br

---

**Última atualização:** 2025-01-17
**Versão:** 1.0.0
