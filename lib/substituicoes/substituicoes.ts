import { getAIClient, AIMessage } from '../ai-client/unified-client';
import { ALIMENTOS_DATABASE } from '@/lib/diet-profiles/alimentos-database';

interface Substituicao {
  original: string;
  substituto: string;
  similaridade: number;
  razao: string;
}

// ... [MANTER TODO O CÓDIGO DE SUBSTITUIÇÕES EQUIVALENTES] ...

// IA para substituições personalizadas - ATUALIZADO
export async function sugerirSubstituicaoComIA(
  alimento: string,
  motivo: string,
  perfil_dieta: string,
  preferencias: string[],
  provider?: 'claude' | 'ollama'
): Promise<string[]> {
  
  const prompt = `Você é um nutricionista expert.

ALIMENTO A SUBSTITUIR: ${alimento}
MOTIVO: ${motivo}
PERFIL DE DIETA: ${perfil_dieta}
PREFERÊNCIAS: ${preferencias.join(', ')}

Sugira 3 substituições adequadas que:
1. Tenham perfil nutricional similar
2. Sejam compatíveis com a dieta ${perfil_dieta}
3. Respeitem as preferências do usuário
4. Sejam fáceis de encontrar

RESPONDA APENAS COM ARRAY JSON:
["Substituto 1", "Substituto 2", "Substituto 3"]`;

  const aiClient = getAIClient();
  
  const messages: AIMessage[] = [
    {
      role: 'user',
      content: prompt
    }
  ];

  const response = await aiClient.chat(messages, {
    provider: provider,
    maxTokens: 500,
    temperature: 0.7
  });

  const jsonMatch = response.content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  return JSON.parse(jsonMatch[0]);
}

// ... [MANTER RESTO DO CÓDIGO] ...
