# 🌸 NFC Hormonal Engine - Guia de Integração

## 📋 Visão Geral

O **NFC Hormonal Engine** é o módulo completo de anamnese feminina do NutriFitCoach. Ele foi projetado para ser acionado automaticamente após a anamnese principal quando o usuário informa que é do sexo feminino.

## 🎯 Objetivo

Criar dietas femininas altamente personalizadas com base em:
- Ciclo menstrual
- Uso de anticoncepcionais
- Condições hormonais (SOP, endometriose, hipotireoidismo, etc.)
- Menopausa/climatério
- Sintomas hormonais
- Objetivos específicos

## 🗂️ Estrutura do Projeto

```
nutrifitcoach/
├── lib/
│   └── hormonal/
│       ├── types.ts                 # Tipos TypeScript e labels
│       ├── validation.ts            # Schemas Zod para validação
│       └── engine.ts                # NFC Hormonal Engine (classificação)
│
├── components/
│   └── hormonal/
│       ├── HormonalOnboarding.tsx   # Componente principal (gerenciador de fluxo)
│       ├── IntroductionScreen.tsx   # Tela de introdução
│       ├── CompletionScreen.tsx     # Tela de finalização
│       ├── StepContainer.tsx        # Container reutilizável para steps
│       └── steps/
│           ├── Step1Age.tsx
│           ├── Step2CycleStatus.tsx
│           ├── Step3Contraceptive.tsx
│           ├── Step4Conditions.tsx
│           ├── Step5HormoneTherapy.tsx
│           ├── Step6Menopause.tsx
│           ├── Step7GeneralSymptoms.tsx
│           └── Step8Objective.tsx
│
├── app/
│   ├── anamnese-feminina/
│   │   └── page.tsx                 # Rota principal do módulo
│   │
│   └── api/
│       └── hormonal-profile/
│           ├── complete/
│           │   └── route.ts         # API para salvar perfil completo
│           └── save-progress/
│               └── route.ts         # API para salvar progresso parcial
│
└── prisma/
    └── schema.prisma                # Schema com FemaleHormonalProfile model
```

## 🔧 Como Integrar com a Anamnese Principal

### Opção 1: Integração após anamnese principal

No arquivo `app/anamnese/page.tsx`, após o usuário completar a anamnese e informar que é do sexo feminino:

\`\`\`typescript
// app/anamnese/page.tsx

const handleSubmit = async () => {
  setLoading(true);

  try {
    // Salvar anamnese principal
    const response = await fetch('/api/anamnese-completa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // Se usuária é do sexo feminino, redirecionar para anamnese hormonal
      if (formData.sexo === 'feminino') {
        router.push('/anamnese-feminina');
      } else {
        router.push('/selecionar-dieta');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
\`\`\`

### Opção 2: Integração inline (dentro da anamnese)

Adicionar o componente diretamente após o step de informações pessoais:

\`\`\`typescript
import { HormonalOnboarding } from '@/components/hormonal/HormonalOnboarding';

// No componente de anamnese
{showHormonalSection && formData.sexo === 'feminino' && (
  <HormonalOnboarding />
)}
\`\`\`

## 🗄️ Banco de Dados

### 1. Adicionar o model ao Prisma Schema

O model `FemaleHormonalProfile` já foi adicionado ao `prisma/schema.prisma`.

### 2. Executar migration

\`\`\`bash
npx prisma migrate dev --name add_female_hormonal_profile
\`\`\`

### 3. Gerar cliente Prisma

\`\`\`bash
npx prisma generate
\`\`\`

## 📊 Como Usar os Dados do Perfil Hormonal

### 1. Buscar perfil da usuária

\`\`\`typescript
import { prisma } from '@/lib/prisma';

const hormonalProfile = await prisma.femaleHormonalProfile.findUnique({
  where: { user_id: userId },
  include: { user: true }
});

if (hormonalProfile) {
  const classification = {
    perfil_hormonal: hormonalProfile.hormonal_profile,
    subperfil: hormonalProfile.hormonal_subprofile,
    ajustes_nutricionais: hormonalProfile.nutritional_adjustments,
    sensibilidades: hormonalProfile.sensitivities,
    alertas: hormonalProfile.alerts,
    pontos_criticos: hormonalProfile.critical_points,
  };
}
\`\`\`

### 2. Usar na geração de dietas

\`\`\`typescript
import { classifyHormonalProfile } from '@/lib/hormonal/engine';

// Ao gerar dieta para usuária
if (user.femaleHormonalProfile) {
  const profile = user.femaleHormonalProfile;

  // Ajustar macros baseado no perfil
  if (profile.hormonal_profile === 'SOP' || profile.hormonal_profile === 'resistencia_insulina') {
    // Dieta low-carb
    carboidratos = calculoBase * 0.25; // 25% das calorias
    proteinas = calculoBase * 0.35;    // 35%
    gorduras = calculoBase * 0.40;     // 40%
  } else if (profile.hormonal_profile === 'menopausa') {
    // Dieta com foco em cálcio e proteína
    proteinas = calculoBase * 0.30;
    // Adicionar alimentos ricos em cálcio e vitamina D
  }

  // Adicionar suplementos baseados em alertas
  if (profile.alerts.includes('fadiga')) {
    suplementos.push('Ferro', 'Vitamina B12', 'Vitamina D');
  }
}
\`\`\`

### 3. Adaptar dieta conforme fase do ciclo (futuro)

\`\`\`typescript
import { determineCyclePhase } from '@/lib/hormonal/engine';

if (profile.cycle_status === 'regular_28_32') {
  const phase = determineCyclePhase(profile.last_period_date);

  if (phase === 'fase_lutea') {
    // Aumentar carboidratos complexos
    // Adicionar magnésio e triptofano
  } else if (phase === 'fase_folicular') {
    // Carboidratos moderados
  }
}
\`\`\`

## 🎨 Tema Visual

O módulo usa cores suaves e femininas:
- Rosa: `from-pink-50` to `to-pink-600`
- Lavanda: `lavender-50` to `lavender-600`
- Pêssego: `peach-50` to `peach-500`

Gradientes personalizados:
- `bg-gradient-to-br from-pink-50 via-lavender-50 to-peach-50`
- `bg-gradient-to-r from-pink-500 to-purple-500`

## 🔒 Segurança e Privacidade

- ✅ Todas as rotas de API verificam autenticação via NextAuth
- ✅ Dados sensíveis são armazenados de forma segura no Prisma/PostgreSQL
- ✅ Validação com Zod em todos os inputs
- ✅ Relação 1:1 entre User e FemaleHormonalProfile (unique constraint)

## 🚀 Próximas Expansões

O módulo foi projetado para futuras expansões:

1. **Análise de fotos**: Detectar retenção, inchaço visual
2. **Recomendações por fase**: Ajustar dieta automaticamente conforme o ciclo
3. **Suplementação educacional**: Sugerir suplementos baseados em deficiências
4. **Ajuste de treino por fase**: Adaptar intensidade do treino ao ciclo
5. **Monitoramento contínuo**: Tracking de sintomas, peso, energia
6. **Notificações inteligentes**: Lembrar usuária de ajustar dieta na fase lútea

## 📝 Exemplo de Fluxo Completo

\`\`\`
1. Usuária completa anamnese principal
2. Sistema detecta sexo = feminino
3. Redireciona para /anamnese-feminina
4. Tela de introdução acolhedora
5. 8 steps de perguntas adaptativas
6. Salvamento automático a cada step
7. Classificação automática via NFC Hormonal Engine
8. Tela de finalização com resumo do perfil
9. Continuar para seleção de dieta
10. Sistema usa perfil hormonal para gerar dieta personalizada
\`\`\`

## 🧪 Testando o Módulo

### 1. Acessar diretamente a rota

\`\`\`
http://localhost:3000/anamnese-feminina
\`\`\`

### 2. Verificar perfil salvo

\`\`\`typescript
// No console do Prisma Studio
npx prisma studio

// Abrir tabela FemaleHormonalProfile
\`\`\`

### 3. Testar API

\`\`\`bash
# Complete profile
curl -X POST http://localhost:3000/api/hormonal-profile/complete \\
  -H "Content-Type: application/json" \\
  -d '{"age": 28, "cycle_status": "regular_28_32", ...}'
\`\`\`

## 💡 Dicas de Uso

1. **Validação**: Todos os enums do Prisma têm schemas Zod correspondentes
2. **Labels**: Use os objetos `*Labels` de `types.ts` para exibir texto amigável
3. **Engine**: A função `classifyHormonalProfile()` é o coração do sistema
4. **Extensibilidade**: Adicione novos sintomas ou condições facilmente nos enums

## 🐛 Troubleshooting

### Erro: "zod is not defined"
```bash
npm install zod
```

### Erro: "FemaleHormonalProfile does not exist"
```bash
npx prisma generate
npx prisma migrate dev
```

### Erro de autenticação na API
Certifique-se de que NextAuth está configurado e a sessão está ativa.

---

**Desenvolvido com 💜 para o NutriFitCoach**
*Respeitando a biologia feminina, com ciência e cuidado.*
