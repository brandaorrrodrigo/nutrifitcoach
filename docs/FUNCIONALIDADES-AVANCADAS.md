# 🚀 FUNCIONALIDADES AVANÇADAS - NUTRIFITCOACH

## 📋 ÍNDICE

1. [IA para Ajuste de Porções](#1-ia-para-ajuste-de-porcoes)
2. [Substituições Automáticas](#2-substituicoes-automaticas)
3. [Ciclo de Carboidratos](#3-ciclo-de-carboidratos)
4. [Periodização Menstrual](#4-periodizacao-menstrual)
5. [Lista de Compras](#5-lista-de-compras)
6. [Como Usar](#como-usar)

---

## 1. IA PARA AJUSTE DE PORÇÕES

### O que faz
Ajusta automaticamente as porções do cardápio baseado em:
- Feedback do usuário
- Objetivos específicos
- Perfil individual
- Saciedade e praticidade

### Como funciona
```typescript
// Ajuste com IA (recomendado)
const resultado = await ajustarPorcoesComIA(
  refeicoes,
  anamnese,
  "Estou com muita fome à noite"
);

// Ajuste rápido (sem IA)
const refeicoesAjustadas = ajustarPorcoesRapido(
  refeicoes,
  1.2 // +20% nas porções
);
```

### Exemplos
**Usuário:** "Não consigo comer tanto no café da manhã"
**IA:** Reduz porções do café, aumenta no lanche da manhã

**Usuário:** "Estou com fome antes de dormir"
**IA:** Aumenta proteína no jantar, sugere lanche noturno

---

## 2. SUBSTITUIÇÕES AUTOMÁTICAS

### O que faz
Sugere alternativas para alimentos que você:
- Não gosta
- Não tem acesso
- Quer variar
- Tem intolerância

### Tabela de Substituições

**PROTEÍNAS:**
- Frango → Peru, Atum, Tilápia
- Carne → Frango coxa, Porco lombo
- Salmão → Sardinha, Truta, Cavala
- Ovo → Tofu, Cottage

**CARBOIDRATOS:**
- Arroz → Quinoa, Arroz selvagem
- Batata doce → Inhame, Mandioca, Abóbora
- Aveia → Farelo de aveia, Quinoa em flocos

**GORDURAS:**
- Abacate → Azeitonas
- Azeite → Óleo de abacate
- Castanhas → Amêndoas, Nozes

### Como usar
```typescript
// Buscar substituições
const opcoes = encontrarSubstituicoes(
  'Frango',
  'CETOGENICA',
  'Não gosto de frango'
);

// Aplicar substituição
const novaRefeicao = substituirAlimento(
  refeicao,
  'Frango Grelhado',
  'Salmão'
);
```

---

## 3. CICLO DE CARBOIDRATOS (CARB CYCLING)

### O que é
Variação estratégica de carboidratos ao longo da semana para:
- ✅ Maximizar perda de gordura
- ✅ Preservar massa muscular
- ✅ Otimizar performance
- ✅ Evitar adaptação metabólica

### Protocolos Disponíveis

#### 🔥 EMAGRECIMENTO PADRÃO
**Para:** Perda de gordura moderada
- Segunda: ALTO (250g) - Treino pesado
- Terça: MODERADO (150g) - Treino moderado
- Quarta: BAIXO (80g) - Cardio
- Quinta: ALTO (250g) - Treino pesado
- Sexta: MODERADO (150g) - Treino moderado
- Sábado: BAIXO (80g) - Descanso
- Domingo: BAIXO (80g) - Descanso

#### ⚖️ RECOMPOSIÇÃO CORPORAL
**Para:** Perder gordura + Ganhar músculo
- 3 dias ALTO (treino pesado)
- 2 dias MODERADO (cardio)
- 2 dias BAIXO (descanso)

#### 💪 GANHO DE MASSA LIMPO
**Para:** Hipertrofia sem excesso de gordura
- 4 dias ALTO (treino pesado)
- 3 dias MODERADO (recuperação)

#### 🔪 CUTTING AGRESSIVO
**Para:** Máxima definição (competição)
- 2 dias MODERADO (treino)
- 4 dias BAIXO (cardio)
- 1 dia ZERO (descanso)

#### 🌸 MULHER - PERIODIZAÇÃO HORMONAL
**Para:** Mulheres alinhado com ciclo menstrual
- Segue fases hormonais
- Otimiza sensibilidade à insulina

### Como ativar
```typescript
// Recomendar protocolo automaticamente
const protocolo = recomendarProtocoloCarbCycling(
  'perda de peso',
  'feminino',
  'intermediario'
);

// Gerar cardápio do dia
const cardapio = ajustarCardapioPorCiclo(
  cardapioBase,
  diaCiclo,
  peso
);
```

---

## 4. PERIODIZAÇÃO MENSTRUAL

### O que é
Sistema que ajusta **TUDO** baseado no ciclo menstrual:
- 🍽️ Nutrição
- 💪 Treino
- 💊 Suplementação
- 😌 Estratégias de bem-estar

### As 5 Fases

#### 🩸 MENSTRUAÇÃO (Dias 1-5)
**Hormônios:** Baixos
**Energia:** Reduzida
**Treino:** Leve

**Ajustes Nutricionais:**
- Calorias: Manter
- Proteína: +5%
- Ferro: ESSENCIAL

**Suplementos:**
- Ferro
- Vitamina C
- Magnésio
- Ômega-3

**Dicas:**
- 🩸 Carnes vermelhas, feijão
- 💧 3L+ água/dia
- ☕ Reduzir cafeína
- 🌶️ Gengibre anti-inflamatório

---

#### 🌱 FOLICULAR (Dias 6-13)
**Hormônios:** Estrogênio subindo
**Energia:** CRESCENTE
**Treino:** PESADO

**Ajustes Nutricionais:**
- Calorias: +5%
- Carboidratos: +10%
- Proteína: +10%

**É A MELHOR FASE! 💪**
- Máxima sensibilidade à insulina
- Janela anabólica ótima
- Alta energia e força
- TREINE PESADO!

**Suplementos:**
- Creatina
- BCAA
- Beta-alanina

**Dicas:**
- 💪 Quebre seus recordes aqui!
- 🍚 Carbs são seus amigos
- 🥩 Alta proteína
- ⚡ Use pré-treinos

---

#### 🔥 OVULATÓRIA (Dias 14-16)
**Hormônios:** PICO MÁXIMO
**Energia:** EXPLOSIVA
**Treino:** MÁXIMA INTENSIDADE

**Ajustes Nutricionais:**
- Calorias: +10%
- Carboidratos: +15%
- Proteína: +10%

**DIA DE BATER PRs! 🎯**
- Estrogênio no pico
- Testosterona alta
- Força máxima
- Performance épica

**Suplementos:**
- Creatina (dose ataque)
- Cafeína
- Beta-alanina

**Dicas:**
- 🔥 APROVEITE! Você está no AUGE!
- 🍽️ Coma BASTANTE
- 💥 Tente máximas
- 📸 Tire fotos - melhor fase!

---

#### 🌙 LÚTEA INICIAL (Dias 17-23)
**Hormônios:** Progesterona subindo
**Energia:** Ainda boa
**Treino:** Alto volume

**Ajustes Nutricionais:**
- Calorias: +5%
- Gorduras: +10% (termogênese)
- Proteína: +5%

**Metabolismo 5-10% mais rápido!**

**Suplementos:**
- Magnésio
- Vitamina B6
- Ômega-3

**Dicas:**
- 🔥 Aproveite metabolismo acelerado
- 🥑 Gorduras boas importantes
- 😴 Priorize sono

---

#### 😤 LÚTEA TARDIA / TPM (Dias 24-28)
**Hormônios:** Caindo
**Energia:** BAIXA
**Treino:** MANUTENÇÃO

**Ajustes Nutricionais:**
- Carboidratos: -10%
- Proteína: +10% (saciedade)
- Gordura: +5%

**PIOR sensibilidade à insulina**
**Retenção de líquidos**
**Compulsão alimentar**

**Suplementos:**
- Magnésio (400mg)
- Vitamina B6
- 5-HTP (humor)
- Chá de camomila

**Sintomas comuns:**
- Irritabilidade
- Ansiedade
- Fadiga
- Inchaço
- Compulsão por doces

**Dicas:**
- 🚫 NÃO faça dieta restritiva
- 🍫 Permita chocolate 70%+
- 💧 MUITA água (3.5L+)
- 🧘 Yoga, caminhada
- 😴 Durma 8-9h
- 🧂 Evite sódio
- 💆 RELAXE - é temporário!

### Como usar
```typescript
// Calcular fase atual
const { fase, diaAtual, diasRestantes } = calcularFaseAtual(
  dataUltimaMenstruacao,
  28 // duração do ciclo
);

// Ajustar cardápio
const cardapioAjustado = ajustarCardapioPorFase(
  cardapioBase,
  FASES_CICLO_MENSTRUAL[fase]
);
```

---

## 5. LISTA DE COMPRAS

### O que faz
Gera lista automática de supermercado:
- 📋 Organizada por categoria
- 💰 Com custo estimado
- ⭐ Marca itens essenciais
- 📱 Exportável (PDF/texto)

### Categorias
1. Proteínas
2. Carboidratos
3. Vegetais
4. Frutas
5. Laticínios
6. Gorduras
7. Temperos
8. Bebidas
9. Outros

### Como usar
```typescript
// Gerar lista semanal
const lista = gerarListaCompras(
  [cardapio1, cardapio2, ...], // Cardápios da semana
  'semanal'
);

// Gerar lista mensal
const listaMensal = gerarListaCompras(
  cardapiosMes,
  'mensal'
);

// Exportar
const texto = exportarListaTexto(lista);
```

### Exemplo de Lista
```
═══════════════════════════════════════
📋 LISTA DE COMPRAS - SEMANAL
═══════════════════════════════════════

▸ PROTEÍNAS
────────────────────────────────────────
⭐ [ ] Frango Peito - 2kg
⭐ [ ] Ovos - 2 dúzias
   [ ] Salmão - 600g
   [ ] Atum lata - 4 unidades

▸ CARBOIDRATOS
────────────────────────────────────────
⭐ [ ] Arroz Integral - 1kg
⭐ [ ] Batata Doce - 2kg
   [ ] Aveia - 500g
   [ ] Pão Integral - 2 pacotes

...

💰 CUSTO ESTIMADO: R$ 245

📌 DICAS:
   🛒 Vá com lista - evita compras desnecessárias
   💰 Compare preços
   ❄️ Proteínas podem ser congeladas
```

---

## COMO USAR TUDO JUNTO

### Fluxo Completo
```typescript
// 1. Gerar cardápio base
const cardapio = await gerarCardapioPorPerfil(anamnese, 'CETOGENICA');

// 2. Se for mulher, ajustar por fase menstrual
if (anamnese.sexo === 'feminino') {
  const fase = calcularFaseAtual(
    anamnese.dataUltimaMenstruacao,
    anamnese.duracaoCiclo
  );
  cardapio = ajustarCardapioPorFase(
    cardapio,
    FASES_CICLO_MENSTRUAL[fase.fase]
  );
}

// 3. Ativar ciclo de carboidratos
const protocolo = recomendarProtocoloCarbCycling(
  anamnese.objetivo,
  anamnese.sexo,
  'intermediario'
);

// 4. Ajustar porções com IA
const cardapioFinal = await ajustarPorcoesComIA(
  cardapio.refeicoes,
  anamnese,
  "Feedback do usuário"
);

// 5. Fazer substituições se necessário
if (naoGostaFrango) {
  cardapioFinal = substituirAlimento(
    cardapioFinal,
    'Frango',
    'Peru'
  );
}

// 6. Gerar lista de compras
const lista = gerarListaCompras(
  cardapiosSemana,
  'semanal'
);
```

---

## API ENDPOINTS

### POST /api/cardapio-avancado

**Ações disponíveis:**

1. `ajustar_porcoes_ia`
2. `ajustar_porcoes_rapido`
3. `buscar_substituicoes`
4. `substituir_alimento`
5. `ativar_ciclo_carboidratos`
6. `gerar_cardapio_ciclo`
7. `verificar_fase_menstrual`
8. `ajustar_por_fase`
9. `gerar_lista_compras`

### Exemplos de Uso
```typescript
// Ajustar porções
const response = await fetch('/api/cardapio-avancado', {
  method: 'POST',
  body: JSON.stringify({
    acao: 'ajustar_porcoes_ia',
    dados: {
      refeicoes,
      anamnese,
      feedback: "Muita comida no almoço"
    }
  })
});

// Verificar fase menstrual
const response = await fetch('/api/cardapio-avancado', {
  method: 'POST',
  body: JSON.stringify({
    acao: 'verificar_fase_menstrual',
    dados: {
      dataUltimaMenstruacao: '2025-01-01',
      duracaoCiclo: 28
    }
  })
});

// Gerar lista de compras
const response = await fetch('/api/cardapio-avancado', {
  method: 'POST',
  body: JSON.stringify({
    acao: 'gerar_lista_compras',
    dados: {
      cardapios: [...],
      periodo: 'semanal'
    }
  })
});
```

---

## 🎯 BENEFÍCIOS

### Para o Usuário
✅ Cardápios que SE ADAPTAM automaticamente
✅ Substitui alimentos facilmente
✅ Otimiza resultados com ciclagem
✅ Respeita ciclo hormonal feminino
✅ Lista de compras automática

### Para Mulheres
✅ Treino alinhado com hormônios
✅ Nutrição otimizada por fase
✅ Menos TPM e sintomas
✅ Melhor performance
✅ Resultados mais rápidos

### Para Performance
✅ Ciclo de carbs = menos adaptação
✅ Máxima preservação muscular
✅ Perda de gordura acelerada
✅ Treinos mais efetivos

---

## 📱 PRÓXIMOS PASSOS

1. **Teste todas funcionalidades**
2. **Implemente no dashboard**
3. **Adicione botões na UI**
4. **Eduque usuários sobre uso**

---

## 🚀 TUDO PRONTO!

Agora o NutriFitCoach tem:
✅ 11 tipos de dietas
✅ IA para ajustes
✅ Substituições automáticas
✅ Ciclo de carboidratos (5 protocolos)
✅ Periodização menstrual completa
✅ Lista de compras automática

**É LITERALMENTE O SISTEMA MAIS AVANÇADO DO MERCADO! 🔥**
