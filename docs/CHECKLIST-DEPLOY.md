# ? CHECKLIST DEPLOY - NUTRIFITCOACH

## ?? ANTES DO DEPLOY

### Código
- [ ] npm run build sem erros
- [ ] Todas as páginas testadas
- [ ] Sem erros no console do navegador
- [ ] Funcionalidades testadas manualmente

### Stripe
- [ ] Modo PRODUÇÃO ativado no dashboard
- [ ] Produto Mensal criado (R$ 100, 15 dias trial)
- [ ] Produto Anual criado (R$ 1000, 30 dias trial)
- [ ] Price IDs copiados
- [ ] Webhook configurado
- [ ] Teste de pagamento feito

### Ambiente
- [ ] .env.production criado com valores REAIS
- [ ] STRIPE_SECRET_KEY (<YOUR_STRIPE_SECRET_KEY>...)
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_...)
- [ ] STRIPE_PRICE_ID_MONTHLY (price_...)
- [ ] STRIPE_PRICE_ID_YEARLY (price_...)
- [ ] ANTHROPIC_API_KEY
- [ ] NEXT_PUBLIC_SITE_URL

## ?? DEPLOY

### Git
- [ ] Repositório GitHub criado
- [ ] .gitignore configurado (.env.local, .env.production)
- [ ] Código commitado

### Vercel
- [ ] Conta criada em vercel.com
- [ ] Projeto importado do GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy executado
- [ ] Site abrindo em .vercel.app

### Domínio
- [ ] Domínio adicionado no Vercel
- [ ] DNS configurado (A ou CNAME)
- [ ] Propagação DNS concluída
- [ ] SSL ativo (HTTPS)
- [ ] Site abrindo em nutrifitcoach.com.br

## ? PÓS-DEPLOY

### Testes em Produção
- [ ] Abrir todas as páginas
- [ ] Testar cadastro
- [ ] Testar login
- [ ] Gerar cardápio
- [ ] Testar pagamento (usar cartão de teste do Stripe)
- [ ] Testar responsividade (mobile/tablet/desktop)

### Monitoramento
- [ ] Google Analytics configurado
- [ ] Verificar logs no Vercel
- [ ] Configurar alertas de erro (Sentry)

### Legal
- [ ] Política de Privacidade publicada
- [ ] Termos de Uso publicados
- [ ] Página de Contato funcionando

### Marketing
- [ ] Página de preços revisada
- [ ] Links de redes sociais
- [ ] Meta tags (SEO) configuradas

## ?? PRIMEIRA SEMANA

- [ ] Monitorar erros diariamente
- [ ] Verificar pagamentos
- [ ] Responder suporte
- [ ] Coletar feedback
- [ ] Ajustar conforme necessário

---

## ?? EM CASO DE PROBLEMA

### Site fora do ar
1. Verificar Vercel dashboard
2. Ver logs de erro
3. Verificar variáveis de ambiente
4. Fazer rollback se necessário

### Pagamentos não funcionam
1. Verificar webhook do Stripe
2. Ver logs do Stripe
3. Verificar chaves de API
4. Testar em modo de teste

### Erros no código
1. Ver logs no Vercel
2. Fazer fix
3. Commit & push
4. Deploy automático

---

**Data deploy:** _____________

**URL Produção:** https://nutrifitcoach.com.br

**URL Vercel:** https://______.vercel.app

**Notas:**
_________________________________
_________________________________
_________________________________
