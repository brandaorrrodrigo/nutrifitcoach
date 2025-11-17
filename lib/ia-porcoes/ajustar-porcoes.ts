import { getAIClient, AIMessage } from '../ai-client/unified-client';

interface AjustePorcao {
  alimento: string;
  porcao_original: string;
  porcao_ajustada: string;
  razao: string;
}

export async function ajustarPorcoesComIA(
  refeicoes: any[],
  anamnese: any,
  feedback_usuario?: string,
  provider?: 'claude' | 'ollama'
): Promise<{ refeicoes_ajustadas: any[]; explicacao: string }> {
  
  const prompt = `Você é um nutricionista expert em ajuste de porções alimentares.

DADOS DO USUÁRIO:
- Peso: ${anamnese.peso}kg
- Altura: ${anamnese.altura}cm
- Idade: ${anamnese.idade} anos
- Sexo: ${anamnese.sexo}
- Objetivo: ${anamnese.objetivo}
- Nível de atividade: ${anamnese.praticaExercicio ? anamnese.frequenciaSemanal : 'Sedentário'}
- Preferências: ${anamnese.alimentosQueGosta || 'Nenhuma específica'}
- Restrições: ${anamnese.restricoes || 'Nenhuma'}

CARDÁPIO ATUAL:
${JSON.stringify(refeicoes, null, 2)}

${feedback_usuario ? `FEEDBACK DO USUÁRIO:\n${feedback_usuario}\n` : ''}

TAREFA:
1. Analise se as porções estão adequadas para o perfil do usuário
2. Ajuste porções que estejam muito altas ou muito baixas
3. Considere:
   - Saciedade
   - Praticidade
   - Adesão ao plano
   - Palatabilidade
   - Equilíbrio nutricional
4. Se o usuário deu feedback, priorize os ajustes solicitados

IMPORTANTE:
- Mantenha o total de calorias dentro de ±5%
- Ajuste porções de forma realista (não mude radicalmente)
- Considere preferências pessoais
- Seja prático (porções fáceis de medir)

RESPONDA EM JSON:
{
  "ajustes": [
    {
      "refeicao": "nome da refeição",
      "alimento": "nome do alimento",
      "porcao_original": "100g",
      "porcao_ajustada": "120g",
      "razao": "explicação curta do ajuste"
    }
  ],
  "refeicoes_ajustadas": [...array completo de refeições com ajustes],
  "explicacao_geral": "resumo dos ajustes feitos",
  "calorias_antes": número,
  "calorias_depois": número,
  "diferenca_percentual": número
}`;

  const aiClient = getAIClient();
  
  const messages: AIMessage[] = [
    {
      role: 'user',
      content: prompt
    }
  ];

  const response = await aiClient.chat(messages, {
    provider: provider,
    maxTokens: 4000,
    temperature: 0.7
  });

  // Extrair JSON da resposta
  const jsonMatch = response.content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('IA não retornou JSON válido');
  }

  const resultado = JSON.parse(jsonMatch[0]);

  return {
    refeicoes_ajustadas: resultado.refeicoes_ajustadas,
    explicacao: resultado.explicacao_geral
  };
}

// Ajuste rápido sem IA (fallback)
export function ajustarPorcoesRapido(
  refeicoes: any[],
  fator: number // 0.8 = -20%, 1.2 = +20%
): any[] {
  return refeicoes.map(refeicao => ({
    ...refeicao,
    alimentos: refeicao.alimentos.map((alimento: any) => {
      const quantidade = parseFloat(alimento.quantidade);
      const novaQuantidade = Math.round(quantidade * fator);
      
      return {
        ...alimento,
        quantidade: `${novaQuantidade}${alimento.quantidade.replace(/\d+/g, '')}`,
        calorias: Math.round(alimento.calorias * fator),
        proteina: Math.round(alimento.proteina * fator * 10) / 10,
        carboidrato: Math.round(alimento.carboidrato * fator * 10) / 10,
        gordura: Math.round(alimento.gordura * fator * 10) / 10
      };
    }),
    macros: {
      calorias: Math.round(refeicao.macros.calorias * fator),
      proteina: Math.round(refeicao.macros.proteina * fator * 10) / 10,
      carboidrato: Math.round(refeicao.macros.carboidrato * fator * 10) / 10,
      gordura: Math.round(refeicao.macros.gordura * fator * 10) / 10
    }
  }));
}
