# 🦙 INTEGRAÇÃO OLLAMA + LLAMA - NUTRIFITCOACH

## 🎯 VISÃO GERAL

Sistema unificado de IA que permite usar:
- **Claude (Anthropic)** - Na nuvem, muito poderoso
- **Llama (Ollama)** - Local, rápido, privado, grátis

## ⚙️ CONFIGURAÇÃO

### 1. Variáveis de Ambiente (.env.local)
```env
# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Qual usar por padrão?
DEFAULT_AI_PROVIDER=ollama  # ou 'claude'

# Fallback automático?
AI_FALLBACK_ENABLED=true  # ou 'false'

# Claude (Anthropic)
ANTHROPIC_API_KEY=sua_chave_aqui
```

### 2. Instalar e Rodar Ollama
```bash
# Windows (você já tem)
ollama serve

# Verificar se está rodando
curl http://localhost:11434/api/tags

# Baixar modelo (se não tiver)
ollama pull llama3.1:8b
```

## 🚀 COMO USAR

### No Código
```typescript
import { getAIClient } from '@/lib/ai-client/unified-client';

const aiClient = getAIClient();

// Usar provedor padrão (.env)
const response = await aiClient.chat([
  { role: 'user', content: 'Olá!' }
]);

// Forçar Claude
const response = await aiClient.chat([
  { role: 'user', content: 'Olá!' }
], {
  provider: 'claude'
});

// Forçar Ollama
const response = await aiClient.chat([
  { role: 'user', content: 'Olá!' }
], {
  provider: 'ollama',
  model: 'llama3.1:8b',  // opcional
  temperature: 0.7,
  maxTokens: 4000
});
```

### Verificar Status
```bash
# API
GET /api/ai-status

# Interface
http://localhost:3000/configuracoes-ia
```

## 💡 COMO FUNCIONA

1. **Provedor Padrão**: Sistema usa o definido em `DEFAULT_AI_PROVIDER`

2. **Fallback Automático**: Se `AI_FALLBACK_ENABLED=true`:
   - Tenta provedor principal
   - Se falhar, tenta o outro automaticamente
   - Garante que sempre funcione!

3. **Transparente**: O código não precisa saber qual está usando

## 🆚 COMPARAÇÃO

### Ollama (Local)
**Vantagens:**
- ✅ **GRÁTIS** - Zero custo de API
- ✅ **RÁPIDO** - Usa suas RTX 3090
- ✅ **PRIVADO** - Dados não saem da máquina
- ✅ **OFFLINE** - Funciona sem internet

**Desvantagens:**
- ❌ Menos poderoso que Claude
- ❌ Precisa rodar servidor local
- ❌ Consome GPU

**Ideal para:**
- Produção (economia)
- Tarefas simples/médias
- Privacidade
- Alto volume

### Claude (Nuvem)
**Vantagens:**
- ✅ **MUITO PODEROSO** - Melhor qualidade
- ✅ **SEM SETUP** - Só precisa da API key
- ✅ **ESCALÁVEL** - Sem limite de hardware

**Desvantagens:**
- ❌ **CUSTA DINHEIRO** - Paga por token
- ❌ Latência maior
- ❌ Precisa internet
- ❌ Dados vão para Anthropic

**Ideal para:**
- Desenvolvimento
- Tarefas complexas
- Quando precisa máxima qualidade

## 📊 RECOMENDAÇÃO

### Desenvolvimento
```env
DEFAULT_AI_PROVIDER=claude
AI_FALLBACK_ENABLED=false
```
Use Claude para desenvolver e testar.

### Produção
```env
DEFAULT_AI_PROVIDER=ollama
AI_FALLBACK_ENABLED=true
```
Use Ollama para economizar, com fallback para Claude se der problema.

## 🔧 TROUBLESHOOTING

### Ollama não conecta
```bash
# Verificar se está rodando
curl http://localhost:11434/api/tags

# Se não, iniciar
ollama serve
```

### Ollama lento
- Verificar uso de GPU
- Considerar modelo menor (llama3:7b)
- Ajustar num_predict (tokens)

### Claude dando erro
- Verificar API key no .env.local
- Verificar saldo de créditos
- Ver logs de erro

## 🎮 INTERFACE

Acesse: `http://localhost:3000/configuracoes-ia`

Veja:
- Status de cada provedor
- Modelos disponíveis
- Configuração atual
- Instruções

## 📝 NOTAS

- Cliente unificado em `lib/ai-client/unified-client.ts`
- Funções de IA atualizadas para usar cliente unificado
- Fallback automático opcional
- Interface de monitoramento

## 🚀 DEPLOY

### Desenvolvimento
Use Claude (mais fácil, sem setup)

### Produção com Ollama
1. Servidor precisa ter Ollama instalado
2. Ollama precisa estar rodando
3. Configurar `OLLAMA_BASE_URL` para IP do servidor
4. Usar fallback para Claude como backup

### Produção só Claude
1. Configurar `DEFAULT_AI_PROVIDER=claude`
2. Adicionar `ANTHROPIC_API_KEY` nas env vars do Vercel
3. Monitorar custos

---

**AGORA VOCÊ TEM OS DOIS! ESCOLHA O MELHOR PARA CADA CASO! 🎉**
