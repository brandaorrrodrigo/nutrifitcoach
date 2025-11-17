# 🍽️ SISTEMA DE DIETAS PERSONALIZADAS

## 🎯 Visão Geral

Sistema inteligente que detecta automaticamente o melhor tipo de dieta para cada usuário baseado em:
- ✅ Anamnese completa (70+ campos)
- ✅ Preferências alimentares
- ✅ Restrições e intolerâncias
- ✅ Objetivos
- ✅ Exames laboratoriais
- ✅ Doenças pré-existentes
- ✅ Comportamento alimentar

---

## 📋 TIPOS DE DIETAS DISPONÍVEIS

### 1. 🥗 FLEXITARIANA (Padrão)
**Para quem:** Sem restrições específicas
**Características:**
- Todas as fontes alimentares
- Equilíbrio nutricional
- Fácil de seguir

**Macros:** P:30% C:40% G:30%

---

### 2. 🌱 VEGANA
**Para quem:** Não consome produtos de origem animal
**Características:**
- Apenas vegetais, grãos, leguminosas
- Rica em fibras
- Necessita suplementação

**Macros:** P:20% C:50% G:30%

**⚠️ OBRIGATÓRIO:** Vitamina B12
**💊 Sugerido:** Ferro, Ômega-3 (algas), Vitamina D, Zinco

---

### 3. 🥚 VEGETARIANA
**Para quem:** Não come carne, mas consome ovos e laticínios
**Características:**
- Proteína de ovos e laticínios
- Mais fácil que vegana
- Boa variedade

**Macros:** P:25% C:45% G:30%

**💊 Sugerido:** B12, Ferro, Ômega-3

---

### 4. 🥑 CETOGÊNICA (KETO)
**Para quem:** Busca cetose, controle glicêmico máximo
**Características:**
- Muito baixo carboidrato (< 50g/dia)
- Alta gordura
- Monitoramento necessário

**Macros:** P:25% C:5% G:70%

**💧 IMPORTANTE:**
- Beber 3-4L água/dia
- Suplementar eletrólitos
- "Keto flu" primeiros 3-7 dias
- Monitorar cetonas

---

### 5. 🥩 LOW CARB
**Para quem:** Controle de carboidratos moderado
**Características:**
- Carboidratos reduzidos (< 100g/dia)
- Mais flexível que keto
- Bons resultados

**Macros:** P:30% C:20% G:50%

---

### 6. 🦴 PALEO
**Para quem:** Busca alimentação ancestral
**Características:**
- Sem grãos, laticínios, processados
- Foco em alimentos naturais
- Alta qualidade nutricional

**Macros:** P:30% C:40% G:30%

---

### 7. 🫒 MEDITERRÂNEA
**Para quem:** Saúde cardiovascular, longevidade
**Características:**
- Rica em azeite, peixes
- Muitos vegetais e frutas
- Comprovação científica forte

**Macros:** P:20% C:45% G:35%

---

### 8. ❤️ DASH (Hipertensão)
**Para quem:** Pressão alta
**Características:**
- Baixo sódio (< 1500mg/dia)
- Rica em potássio, magnésio
- Foco em controle pressão

**Macros:** P:25% C:50% G:25%

---

### 9. 📉 PARA DIABETES
**Para quem:** Diabéticos ou pré-diabéticos
**Características:**
- Baixo índice glicêmico
- Fracionamento de refeições
- Controle rigoroso de carbs

**Macros:** P:30% C:35% G:35%

---

### 10. 💪 GANHO DE MASSA
**Para quem:** Hipertrofia muscular
**Características:**
- Superávit calórico (+300-500 kcal)
- Alta proteína
- Timing nutricional

**Macros:** P:30% C:45% G:25%

---

### 11. 📉 EMAGRECIMENTO
**Para quem:** Perda de peso
**Características:**
- Déficit calórico (-300-500 kcal)
- Alta saciedade
- Densidade nutricional

**Macros:** P:35% C:35% G:30%

---

## 🧬 COMO FUNCIONA A DETECÇÃO

### Sistema de Pontuação

O sistema analisa a anamnese e pontua cada perfil baseado em:

**1. Dietas Específicas Marcadas** (+100 pontos)
- Se marcou "Vegana" → Perfil VEGANA +100

**2. Restrições Religiosas/Culturais** (+80 pontos)
- "Não como carne" → VEGETARIANA +80

**3. Objetivo** (+50 pontos)
- "Perda de peso" → EMAGRECIMENTO +50
- "Ganho de massa" → GANHO_MASSA +50

**4. Doenças Pré-existentes** (+80 pontos)
- Diabetes → PARA_DIABETES +80
- Hipertensão → DASH +80
- Colesterol → MEDITERRANEA +60

**5. Alimentos que NÃO Gosta** (+60 pontos)
- "Não gosto de carne" → VEGETARIANA +60

**6. Alimentos que Gosta** (+30 pontos)
- "Gosto de abacate" → CETOGENICA +30

**7. Intolerâncias** (+30 pontos)
- Lactose → VEGANA +30
- Glúten → PALEO +40

---

## 🎯 FLUXO DO USUÁRIO
```
1. Usuário preenche anamnese (10 etapas)
   ↓
2. Sistema detecta perfis compatíveis
   ↓
3. Redireciona para /selecionar-dieta
   ↓
4. Mostra perfil recomendado + opções
   ↓
5. Usuário confirma ou escolhe outro
   ↓
6. Sistema gera cardápio personalizado
   ↓
7. Redireciona para /dashboard
```

---

## 📊 GERAÇÃO DE CARDÁPIOS

### Cálculos Automáticos

**1. TMB (Taxa Metabólica Basal)**
- Homem: (10 × peso) + (6.25 × altura) - (5 × idade) + 5
- Mulher: (10 × peso) + (6.25 × altura) - (5 × idade) - 161

**2. GET (Gasto Energético Total)**
- GET = TMB × Fator de Atividade
- Sedentário: 1.2
- Leve: 1.375
- Moderado: 1.55
- Intenso: 1.725

**3. Ajuste por Objetivo**
- Emagrecimento: GET - 500 kcal
- Manutenção: GET
- Ganho de massa: GET + 400 kcal

**4. Distribuição de Macros**
- Baseado no perfil escolhido
- Ex: KETO → P:25% C:5% G:70%

**5. Distribuição de Refeições**
- Café: 25%
- Lanche manhã: 10%
- Almoço: 30%
- Lanche tarde: 10%
- Jantar: 25%

---

## 🔧 ARQUIVOS CRIADOS
```
lib/diet-profiles/
├── detector.ts              # Detecção automática
├── alimentos-database.ts    # Biblioteca de alimentos
└── gerador-cardapios.ts     # Geração personalizada

app/
├── selecionar-dieta/
│   └── page.tsx             # Página de seleção
└── api/
    └── gerar-cardapio-por-perfil/
        └── route.ts         # API de geração
```

---

## 💡 EXEMPLOS DE DETECÇÃO

### Exemplo 1: Vegana
```javascript
// Anamnese
{
  dietasEspecificas: ['Vegana'],
  alimentosQueNaoGosta: 'carne, frango, peixe, ovos',
  restricoesReligiosas: 'nada de origem animal'
}

// Resultado
VEGANA: 180 pontos ← ESCOLHIDA
VEGETARIANA: 60 pontos
FLEXITARIANA: 0 pontos
```

### Exemplo 2: Diabetes + Hipertensão
```javascript
// Anamnese
{
  doencasPreExistentes: ['Diabetes', 'Hipertensão'],
  objetivo: 'perda de peso'
}

// Resultado
PARA_DIABETES: 130 pontos ← RECOMENDADA
DASH: 80 pontos
EMAGRECIMENTO: 50 pontos
CETOGENICA: 40 pontos
```

### Exemplo 3: Atleta
```javascript
// Anamnese
{
  objetivo: 'ganho de massa',
  praticaExercicio: true,
  tipoExercicio: 'musculacao',
  frequenciaSemanal: '5-6'
}

// Resultado
GANHO_MASSA: 50 pontos ← ESCOLHIDA
FLEXITARIANA: 0 pontos
```

---

## 🎨 PERSONALIZAÇÃO DE CARDÁPIOS

Cada perfil tem cardápios COMPLETAMENTE diferentes:

### Café da Manhã - VEGANA
- Aveia 50g
- Leite de amêndoas 200ml
- Banana 1 unidade
- Pasta de amendoim 15g

### Café da Manhã - CETOGÊNICA
- Ovos mexidos 3 unidades
- Abacate 1/2 unidade
- Queijo 30g
- Café com manteiga

### Café da Manhã - PALEO
- Ovos cozidos 3 unidades
- Batata doce 100g
- Abacate 1/4 unidade

---

## ⚠️ AVISOS E ALERTAS

O sistema gera avisos específicos por perfil:

**VEGANA:**
- ⚠️ Vitamina B12 OBRIGATÓRIA
- 🥜 Combine leguminosas + cereais
- 🌱 Fontes de cálcio importantes

**CETOGÊNICA:**
- 💧 Beber 3-4L água/dia
- 🧂 Não tenha medo do sal
- ⚡ Keto flu é normal

**DIABETES:**
- 📊 Monitore glicemia
- 🕐 Fracione bem as refeições
- 🚫 Evite alto IG

---

## 🚀 PRÓXIMOS PASSOS

**Para testar:**
1. Preencha anamnese completa
2. Marque preferências alimentares
3. Sistema detecta automaticamente
4. Confirme ou escolha outro
5. Veja cardápio personalizado!

**Futuros:**
- [ ] IA para ajuste fino de porções
- [ ] Substituições automáticas
- [ ] Ciclo de carboidratos
- [ ] Periodização menstrual
- [ ] Lista de compras por perfil

---

## 📞 SUPORTE

rodrigo@nutrifitcoach.com.br

---

**🎉 SISTEMA 100% FUNCIONAL! 🎉**

Agora cada usuário terá um cardápio PERFEITO para seu perfil!
