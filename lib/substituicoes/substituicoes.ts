import { askAI } from '../ai-client/unified-client';
import { ALIMENTOS_DATABASE } from '@/lib/diet-profiles/alimentos-database';

interface Substituicao {
  original: string;
  substituto: string;
  similaridade: number;
  razao: string;
}

// Encontrar substituições para um alimento
export function encontrarSubstituicoes(alimento: string, limite: number = 5): Substituicao[] {
  const alimentoLower = alimento.toLowerCase();
  const substituicoes: Substituicao[] = [];

  // Buscar no database de alimentos
  for (const item of ALIMENTOS_DATABASE) {
    if (item.nome.toLowerCase().includes(alimentoLower) ||
        alimentoLower.includes(item.nome.toLowerCase())) {
      continue; // Pular o mesmo alimento
    }

    substituicoes.push({
      original: alimento,
      substituto: item.nome,
      similaridade: 0.8,
      razao: 'Similaridade nutricional'
    });

    if (substituicoes.length >= limite) break;
  }

  return substituicoes;
}

// Substituir um alimento em uma receita/cardápio
export function substituirAlimento(
  texto: string,
  original: string,
  substituto: string
): string {
  const regex = new RegExp(original, 'gi');
  return texto.replace(regex, substituto);
}

// IA para substituições personalizadas - ATUALIZADO
export async function sugerirSubstituicaoComIA(
  alimento: string,
  motivo: string,
  perfil_dieta: string,
  preferencias: string[],
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

  const response = await askAI({
    prompt,
    model: 'claude-3-5-sonnet',
    json: true
  });

  if (Array.isArray(response)) {
    return response;
  }

  return [];
}
