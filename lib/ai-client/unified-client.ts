// Unified AI Client – NutriFitCoach
// Motor unificado de IA: Claude (principal) + Ollama (fallback)

import Anthropic from "@anthropic-ai/sdk";

export type AIModel =
  | "claude-3-5-sonnet"
  | "claude-3-5-haiku"
  | "llama3"
  | "qwen2"
  | "phi3"
  | "deepseek";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/**
 * Função base: envia prompt para a IA.
 * - Se modelo começar com "claude" e houver chave Anthropic → usa Claude
 * - Caso contrário → usa Ollama como engine local
 * - Se json = true → tenta parsear resposta como JSON
 */
export async function askAI({
  prompt,
  model = "claude-3-5-sonnet",
  json = false,
}: {
  prompt: string;
  model?: AIModel;
  json?: boolean;
}): Promise<any> {
  try {
    // 1️⃣ IA principal: Claude
    if (model.startsWith("claude") && anthropic) {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 4096,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const text =
        (response.content &&
          response.content[0] &&
          "text" in response.content[0] &&
          // @ts-expect-error - Anthropic types not perfectly narrowed
          response.content[0].text) ||
        "";

      if (json) {
        try {
          return JSON.parse(text);
        } catch {
          return { error: "JSON inválido retornado pela IA", raw: text };
        }
      }

      return text;
    }

    // 2️⃣ Fallback: Ollama (local)
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    const data = await res.json();

    if (json) {
      try {
        return JSON.parse(data.response);
      } catch {
        return { error: "JSON inválido vindo do Ollama", raw: data.response };
      }
    }

    return data.response;
  } catch (err: any) {
    return {
      error: "Falha no unified-client",
      detail: err?.message || String(err),
    };
  }
}

/**
 * IA especializada em nutrição (texto livre)
 */
export async function askNutritionAI(prompt: string): Promise<string | any> {
  return await askAI({
    prompt: `
Você é a IA NutriFitCoach, especialista em:

- Nutrição esportiva
- Emagrecimento
- Hipertrofia
- Endurance
- Dietas especiais (keto, low-carb, jejum, CKD, FMD)
- Planejamento alimentar com foco em adesão

Responda de forma clara, objetiva e técnica, sempre pensando em segurança e aderência.

Tarefa:
${prompt}
`,
    model: "claude-3-5-sonnet",
    json: false,
  });
}

/**
 * IA especializada em PORÇÕES (resposta em JSON)
 */
export async function askPortionsAI(prompt: string): Promise<any> {
  return await askAI({
    prompt: `
Você é a IA de PORÇÕES da NutriFitCoach.

IMPORTANTE:
- Responda EXCLUSIVAMENTE em JSON válido.
- Não use comentários, markdown ou texto fora do JSON.

Tarefa:
${prompt}

Formato de retorno:
{
  "porcoes": [
    { "item": "nome do alimento", "quantidade": "xx g", "kcal": 0 }
  ],
  "total_kcal": 0
}
`,
    model: "claude-3-5-sonnet",
    json: true,
  });
}

const unifiedClient = {
  askAI,
  askNutritionAI,
  askPortionsAI,
};

/**
 * Retorna a instância do unified client
 */
export function getAIClient() {
  return unifiedClient;
}

export default unifiedClient;
