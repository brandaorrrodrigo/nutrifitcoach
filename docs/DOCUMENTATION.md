# 🥗 NUTRIFITCOACH - Sistema Ultra Completo

## 🎯 Visão Geral

Sistema profissional de nutrição com IA, gamificação, análise de exames laboratoriais e tudo mais que um nutricionista precisa.

## ✨ Funcionalidades Completas

### 🏥 ANAMNESE PROFISSIONAL (10 ETAPAS)

**Etapa 1: Dados Pessoais**
- Nome, email, telefone, data de nascimento
- Sexo, estado civil, profissão
- Validações completas

**Etapa 2: Antropometria Completa**
- Peso, altura, IMC automático
- Circunferências: cintura, quadril, braço, coxa, panturrilha
- % gordura corporal e massa magra
- Upload de fotos corporais (frente, lado, costas)

**Etapa 3: Histórico Médico Detalhado**
- Doenças pré-existentes (checkboxes)
- Cirurgias realizadas
- Medicamentos em uso (com dosagem)
- Suplementos
- Alergias e intolerâncias

**Etapa 4: Exames Laboratoriais com Análise IA**
- Upload de PDFs dos exames
- Ou preenchimento manual:
  - Glicemia (com análise de diabetes/pré-diabetes)
  - Colesterol Total, HDL, LDL (classificação de risco)
  - Triglicerídeos
  - TSH, T3, T4 (análise tireoide)
  - Vitamina D e B12 (deficiências)
  - Hemoglobina Glicada
- **IA analisa e dá alertas automáticos**
- **Sugestões nutricionais baseadas nos resultados**

**Etapa 5: Histórico Alimentar**
- Dietas anteriores (detalhado)
- Tempo da última dieta
- Resultados obtidos
- Motivo de ter parado

**Etapa 6: Rotina e Estilo de Vida**
- Horas de sono + qualidade
- Nível de estresse (escala)
- Tipo de trabalho (sedentário/ativo)
- Horário de trabalho
- Consumo de água (litros/dia)
- Consumo de álcool (frequência)
- Tabagismo

**Etapa 7: Atividade Física**
- Pratica exercícios? (sim/não)
- Tipo de exercício (musculação, corrida, etc)
- Frequência semanal
- Duração dos treinos
- Objetivo do treino

**Etapa 8: Específico por Gênero**

*Mulheres:*
- Ciclo menstrual (regular/irregular)
- Usa anticoncepcional?
- Gestante? Amamentando?
- Menopausa?
- Sintomas TPM (checkboxes)

*Homens:*
- Problemas de próstata
- Calvície/queda de cabelo

**Etapa 9: Objetivos Detalhados**
- Objetivo principal (dropdown)
- Meta de peso específica
- Prazo desejado (1 mês a 1 ano)
- Motivação principal (texto livre)
- Expectativas do programa

**Etapa 10: Comportamento Alimentar + Preferências**
- Comportamentos:
  - Belisca entre refeições
  - Come compulsivamente
  - Come por ansiedade/estresse
  - Pula refeições
  - Prefere doces ou salgados
- Alimentos que GOSTA (texto)
- Alimentos que NÃO GOSTA (texto)
- Restrições religiosas/culturais
- Dietas específicas (vegetariana, vegana, low carb, etc)

### 🤖 ANÁLISE IA COMPLETA

**Análise de Exames Laboratoriais:**
- Glicemia: Normal/Pré-diabetes/Diabetes
- Colesterol: Desejável/Limítrofe/Alto
- HDL: Baixo/Adequado/Ótimo
- LDL: Ótimo/Limítrofe/Alto
- Triglicerídeos: Normal/Limítrofe/Alto
- TSH: Hipo/Normal/Hipertireoidismo
- Vitaminas: Deficiente/Insuficiente/Adequado

**Análise Antropométrica:**
- Classificação IMC automática
- Risco de saúde (baixo/moderado/alto)
- Análise cintura/quadril (risco metabólico)
- % gordura vs padrões saudáveis

**Análise de Risco Integrada:**
- Cruza TODOS os dados
- Identifica fatores de risco
- Pontuação de risco geral
- Alertas prioritários

**Recomendações Personalizadas:**
- Baseadas em objetivo + exames + comportamento
- Suplementação recomendada
- Ajustes no cardápio
- Alertas médicos quando necessário

### 📊 GERAÇÃO DE CARDÁPIO

**Com Ollama (IA Avançada):**
- Lê TODA a anamnese
- Considera TODOS os exames
- Respeita TODAS as restrições
- Personaliza por comportamento
- Ajusta por atividade física
- Carboidratos adaptados ao ciclo menstrual (mulheres)

**Sem Ollama (Fallback):**
- Algoritmo profissional
- Distribuição macro perfeita
- Alimentos brasileiros

### 🎮 GAMIFICAÇÃO COMPLETA
- Sistema de pontos/XP
- Níveis progressivos
- Badges/conquistas
- Streak de dias
- Ranking público
- Recompensas por completar anamnese (+150 pontos)

### 📈 ACOMPANHAMENTO
- Registro de peso e medidas
- Gráficos de evolução
- Upload de fotos
- Comparações antes/depois
- Histórico completo

### 💎 EXTRAS
- Download PDF profissional
- Lista de compras organizada
- Sistema de substituições
- WhatsApp + Telegram bots
- Notificações push
- Multi-idioma (PT/EN/ES)
- PWA (app mobile)

## 🗄️ Banco de Dados
```prisma
model AnamneseCompleta {
  - 70+ campos
  - JSON para exames
  - Arrays para listas
  - Análises IA salvas
  - Recomendações armazenadas
}
```

## 🚀 Como Usar

### Instalação
```bash
npm install
npx prisma generate
npx prisma db push
```

### Desenvolvimento
```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Next.js
npm run dev
```

### Testar Anamnese
1. Acesse `/anamnese`
2. Preencha as 10 etapas
3. Upload exames (opcional)
4. Upload fotos (opcional)
5. Aguarde análise IA (1-2 min)
6. Veja resultados completos

## 📱 APIs Disponíveis

### POST /api/anamnese-completa
Processa anamnese completa + gera plano
```json
{
  "nome": "João Silva",
  "peso": "80",
  "altura": "175",
  "glicemia": "95",
  // ... 70+ campos
}
```

**Retorna:**
```json
{
  "plano": { /* cardápio completo */ },
  "analises": {
    "exames": { /* análise detalhada */ },
    "antropometria": { /* IMC, risco, etc */ },
    "risco": { /* fatores de risco */ }
  },
  "recomendacoes": [ /* sugestões IA */ ]
}
```

### POST /api/upload-foto
Upload de fotos/exames
```bash
FormData com arquivo
```

### GET /minha-anamnese
Visualiza análise completa da anamnese

## 🏗️ Estrutura
```
app/
├── anamnese/              # Wizard 10 etapas
├── minha-anamnese/        # Visualização resultados
├── dashboard/             # Cardápio + análises
├── api/
│   ├── anamnese-completa/ # Processamento IA
│   └── upload-foto/       # Upload arquivos
```

## 🎯 Diferencial

### O que torna esta anamnese ÚNICA:

1. **Mais Completa do Mercado**
   - 10 etapas profissionais
   - 70+ campos de dados
   - Upload de exames reais
   - Fotos corporais

2. **IA Analisa Exames**
   - Detecta alterações
   - Alerta riscos
   - Sugere intervenções
   - Personaliza cardápio

3. **Análise Integrada**
   - Cruza múltiplas variáveis
   - Identifica padrões
   - Pontuação de risco
   - Recomendações holísticas

4. **UX Profissional**
   - Wizard intuitivo
   - Barra de progresso
   - Validações inteligentes
   - Design médico

5. **Científicamente Embasado**
   - Valores de referência corretos
   - Classificações médicas
   - Cálculos precisos
   - Protocolos atualizados

## 📊 Análises Fornecidas

### Exames (12 marcadores):
- ✅ Glicemia (diabetes)
- ✅ Lipidograma completo (4 marcadores)
- ✅ Tireoide (3 hormônios)
- ✅ Vitaminas (D, B12)
- ✅ Hemoglobina glicada

### Antropometria:
- ✅ IMC + classificação
- ✅ 6 circunferências
- ✅ % gordura corporal
- ✅ Massa magra
- ✅ Relação cintura/quadril

### Risco:
- ✅ Cardiovascular
- ✅ Metabólico
- ✅ Hormonal
- ✅ Nutricional
- ✅ Comportamental

## 🔬 Validações Científicas

Todos os valores de referência são baseados em:
- Diretrizes da Sociedade Brasileira de Cardiologia
- American Diabetes Association
- Consenso Brasileiro de Tireoide
- WHO (Organização Mundial da Saúde)

## 🎓 Casos de Uso

### Para Nutricionistas:
- Anamnese completa digital
- Análise automática
- Histórico do paciente
- Geração de cardápios
- Acompanhamento contínuo

### Para Pacientes:
- Auto-avaliação guiada
- Entendimento dos exames
- Plano personalizado
- Acompanhamento fácil
- Motivação gamificada

## 📞 Suporte

rodrigo@nutrifitcoach.com.br

---

**© 2025 NutriFitCoach - Nutrição com IA + Ciência**
