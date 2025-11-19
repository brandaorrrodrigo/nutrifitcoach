# 🌸 NFC Hormonal Engine

## O que é?

O **NFC Hormonal Engine** é o sistema de inteligência hormonal do NutriFitCoach. Ele classifica automaticamente o perfil hormonal de mulheres e gera recomendações nutricionais personalizadas baseadas em:

- **Ciclo menstrual** e fase atual
- **Anticoncepcionais** e seus efeitos
- **Condições hormonais** (SOP, endometriose, hipotireoidismo, etc.)
- **Menopausa/Climatério** e sintomas
- **Sintomas gerais** (retenção, humor, energia, etc.)
- **Objetivos** (perder peso, ganhar massa, melhorar sintomas, etc.)

## Como funciona?

### 1. Coleta de Dados (8 Steps)

O sistema faz 8 perguntas estratégicas:

1. **Idade** → Determina fase hormonal provável
2. **Estado Menstrual** → Regular, irregular, sem menstruação
3. **Anticoncepcional** → Tipo e efeitos colaterais
4. **Condições Hormonais** → SOP, endometriose, tireoide, etc.
5. **Reposição Hormonal** → TH, THM, fitoterápicos
6. **Menopausa/Climatério** → Status e sintomas
7. **Sintomas Gerais** → Frequência de 7 sintomas comuns
8. **Objetivo** → O que a mulher quer alcançar

### 2. Classificação Automática

A função `classifyHormonalProfile()` analisa as respostas e retorna:

```typescript
{
  perfil_hormonal: "SOP" | "ciclo_regular" | "menopausa" | ...,
  subperfil: "fase_folicular" | "termico_alto" | ...,
  objetivo: "weight_loss" | "improve_energy" | ...,
  ajustes_nutricionais: [
    "Dieta low-carb com foco em controle glicêmico",
    "Aumentar fibras solúveis",
    ...
  ],
  sensibilidades: [
    "Alta sensibilidade a carboidratos refinados",
    ...
  ],
  alertas: [
    "Retenção líquida frequente - reduzir sódio",
    ...
  ],
  pontos_criticos: [
    "Controlar carboidratos em todas as refeições",
    ...
  ]
}
```

### 3. Aplicação na Dieta

Os dados são salvos no banco e usados para:
- Ajustar macros (low-carb para SOP, proteína alta para menopausa)
- Recomendar alimentos específicos
- Evitar alimentos sensíveis
- Sugerir suplementação
- Adaptar timing de carboidratos conforme ciclo

## Perfis Hormonais Suportados

### 1. SOP (Ovário Policístico)
- **Foco**: Controle glicêmico e resistência à insulina
- **Dieta**: Low-carb, alto em fibras
- **Alimentos-chave**: Aveia, linhaça, chia, peixes gordos
- **Evitar**: Carboidratos de alto IG, açúcares

### 2. Resistência à Insulina
- **Foco**: Sensibilidade insulínica
- **Dieta**: Low-carb moderada, jejum intermitente
- **Alimentos-chave**: Canela, vinagre de maçã, proteínas
- **Evitar**: Carboidratos refinados

### 3. Endometriose
- **Foco**: Anti-inflamatório intenso
- **Dieta**: Reduzir glúten, laticínios, carne vermelha
- **Alimentos-chave**: Brócolis, couve, cúrcuma, gengibre
- **Evitar**: Alimentos pró-inflamatórios

### 4. Hipotireoidismo/Hashimoto
- **Foco**: Suporte tireoidiano
- **Dieta**: Selênio, iodo, zinco
- **Alimentos-chave**: Castanha do Pará, peixes, algas
- **Evitar**: Excesso de crucíferas cruas

### 5. Menopausa
- **Foco**: Saúde óssea, controle de peso abdominal
- **Dieta**: Alta em cálcio, vitamina D, fitoestrogênios
- **Alimentos-chave**: Soja orgânica, linhaça, vegetais
- **Evitar**: Sal excessivo (retenção)

### 6. Climatério (Perimenopausa)
- **Foco**: Estabilidade hormonal
- **Dieta**: Fitoestrogênios, carboidratos moderados
- **Alimentos-chave**: Linhaça, soja, frutas vermelhas
- **Evitar**: Excesso de cafeína

### 7. Anticoncepcional
- **Foco**: Repor nutrientes depletados
- **Dieta**: Vitaminas B, magnésio, zinco
- **Alimentos-chave**: Folhas verdes, abacate, sementes
- **Evitar**: Excesso de sódio (se houver retenção)

### 8. Ciclo Regular
- **Foco**: Adaptar dieta às fases do ciclo
- **Fase Folicular**: Carboidratos moderados, energia estável
- **Fase Ovulatória**: Manter equilíbrio
- **Fase Lútea**: Aumentar carboidratos complexos, magnésio
- **Menstrual**: Ferro, vitamina C

### 9. TPM Intensa
- **Foco**: Controlar compulsão e sintomas pré-menstruais
- **Dieta**: Magnésio++, B6, cálcio
- **Alimentos-chave**: Cacau 70%, banana, aveia
- **Evitar**: Cafeína e sal na fase lútea

## Sintomas e Ajustes

### Retenção Líquida
```typescript
if (bloating === 'frequently' || bloating === 'always') {
  ajustes.push('Reduzir sal e processados');
  ajustes.push('Aumentar potássio (banana, abacate)');
  ajustes.push('Chás diuréticos (hibisco, chá verde)');
}
```

### Alterações de Humor
```typescript
if (mood_changes === 'frequently') {
  ajustes.push('Evitar picos glicêmicos');
  ajustes.push('Aumentar triptofano (banana, aveia, cacau)');
  ajustes.push('Magnésio e vitaminas B');
}
```

### Fadiga Extrema
```typescript
if (extreme_fatigue === 'frequently') {
  ajustes.push('Aumentar ferro heme (carnes magras)');
  ajustes.push('Vitamina C para absorção de ferro');
  ajustes.push('Complexo B');
  alertas.push('Solicitar: hemograma, ferritina, B12, tireoide');
}
```

### Compulsão Pré-Menstrual
```typescript
if (pms_cravings === 'frequently') {
  ajustes.push('Aumentar carboidratos complexos na fase lútea');
  pontos_criticos.push('Não restringir carboidratos na TPM');
  pontos_criticos.push('Permitir chocolate 70%');
}
```

## Exemplo de Uso

```typescript
import { classifyHormonalProfile } from '@/lib/hormonal/engine';

const profileData = {
  age: 28,
  cycle_status: 'regular_28_32',
  contraceptive_type: 'none',
  contraceptive_effects: [],
  hormonal_conditions: ['intense_pms'],
  hormone_therapy: 'none',
  menopause_status: 'none',
  menopause_symptoms: [],
  general_symptoms: {
    bloating: 'sometimes',
    mood_changes: 'frequently',
    appetite_increase: 'sometimes',
    pms_cravings: 'always',
    extreme_fatigue: 'sometimes',
    headaches: 'sometimes',
    libido_loss: 'never',
  },
  objective: 'reduce_hormonal_symptoms',
};

const classification = classifyHormonalProfile(profileData);

console.log(classification);
/*
{
  perfil_hormonal: "ciclo_regular",
  subperfil: "pms_intenso",
  objetivo: "reduce_hormonal_symptoms",
  ajustes_nutricionais: [
    "Adaptar carboidratos conforme fase do ciclo",
    "Aumentar magnésio 7-10 dias antes da menstruação",
    "Incluir cálcio e vitamina B6",
    "Reduzir cafeína e sal na fase lútea",
    ...
  ],
  sensibilidades: [...],
  alertas: [...],
  pontos_criticos: [
    "Monitorar compulsão alimentar na fase lútea",
    "Não restringir carboidratos drasticamente no pré-menstrual"
  ]
}
*/
```

## Expansões Futuras

### 1. Tracking de Ciclo
```typescript
// Detectar fase atual automaticamente
const currentPhase = determineCyclePhase(lastPeriodDate);

// Ajustar dieta em tempo real
if (currentPhase === 'fase_lutea') {
  // Aumentar carboidratos complexos
  // Adicionar magnésio
}
```

### 2. Sintomas por Fase
```typescript
// Monitorar sintomas ao longo do ciclo
trackSymptoms(date, symptoms);

// Identificar padrões
const pattern = analyzeSymptomPattern(userId);
```

### 3. Recomendações Dinâmicas
```typescript
// Push notifications
if (profile.cycle_day === 21 && profile.pms === 'intense') {
  notify('Fase lútea: Aumente carboidratos complexos');
}
```

## Validação

Todos os inputs são validados com Zod:

```typescript
import { FemaleHormonalProfileSchema } from './validation';

const result = FemaleHormonalProfileSchema.safeParse(data);

if (!result.success) {
  console.error(result.error.issues);
}
```

## Tipos TypeScript

```typescript
import type {
  CycleStatus,
  ContraceptiveType,
  HormonalCondition,
  FemaleHormonalProfileData,
  HormonalProfileClassification,
} from './types';
```

---

**Desenvolvido com 💜 ciência e empatia**
*O metabolismo feminino é complexo. Nós respeitamos isso.*
