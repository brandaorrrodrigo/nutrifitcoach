import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateChatMessage } from "@/lib/security/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3:latest";

/**
 * Sistema: instruções fixas — foco em Nutrição
 */
const SYSTEM_PROMPT = `
Você é o assistente NutriFitCoach. Responda SOMENTE sobre:
- nutrição, cardápios, substituições alimentares, pré/pós-treino,
- macros (P/C/G), IG/CG, ajustes finos do plano,
- estratégias de saciedade, adesão, e recomendações práticas.

Regras:
1) Nunca desvie para matérias escolares, tecnologia, política ou outros temas.
2) Seja breve, claro e direto, em português do Brasil (pt-BR) por padrão.
3) Se o usuário pedir substituição "A por B", forneça a troca e ajuste de porção quando possível.
4) Se houver restrições (lactose, glúten, vegetariano), respeite e proponha equivalentes.
5) Se mencionar gráficos, IG/CG ou macros, descreva de forma objetiva.
6) Evite respostas genéricas (ex.: "posso ajudar com vários assuntos"). Mantenha-se em Nutrição.
7) Se o pedido for amplo/ambíguo, ofereça 2–4 opções diretas (ex.: "Revisar substituições", "Pré-treino", "Incluir frutas", "Ver gráfico de macros").
`;

/**
 * Sanitiza e força o escopo nutricional
 */
function sanitize(text: string): string {
  if (!text) return "";
  let t = text;

  // Remover derivações explícitas
  t = t.replace(/matérias escolares|assuntos gerais|variedade de tópicos/gi, "");

  // Evitar "posso falar de qualquer assunto"
  t = t.replace(/(posso ajudar com .*?assuntos).*$/gi, "");

  // Aparar e limitar tamanho
  t = t.trim();
  if (t.length > 8000) t = t.slice(0, 8000);

  return t || "Vamos focar na sua nutrição: cardápio, substituições, pré/pós-treino, macros e IG/CG. O que você quer ajustar agora? 💚";
}

/**
 * GET opcional (healthcheck)
 */
export async function GET() {
  return NextResponse.json({ ok: true, model: OLLAMA_MODEL, url: OLLAMA_URL });
}

/**
 * POST /api/chat
 * body: { message: string, context?: any }
 */
export async function POST(req: NextRequest) {
  try {
    // 🔒 RATE LIMITING
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || undefined;

    const rateLimitResponse = checkRateLimit(req, 'chat', userEmail);
    if (rateLimitResponse) {
      return rateLimitResponse; // 429 Too Many Requests
    }

    const body = await req.json();
    const userRaw = body?.message;

    // 🔒 VALIDAÇÃO DE INPUT
    const validation = validateChatMessage(userRaw, 4000);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const user = validation.sanitized!;
    const context = body?.context ?? {};

    const prompt = `
${SYSTEM_PROMPT}

[Contexto opcional do plano/usuário]
${JSON.stringify(context, null, 2)}

[PERGUNTA DO USUÁRIO]
${user}
`;

    // Chamada ao Ollama
    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.4,
          top_p: 0.9,
          repeat_penalty: 1.05,
          stop: ["</fim>", "<|eot_id|>"]
        }
      })
    });

    if (!r.ok) {
      const errTxt = await r.text().catch(() => "Erro desconhecido");
      throw new Error(`Ollama HTTP ${r.status}: ${errTxt}`);
    }

    const data = await r.json();
    let text = sanitize(data?.response || "");

    // Fallback de segurança (caso ainda escape)
    if (!text || text.length < 2) {
      text = "Estou focado na sua NUTRIÇÃO: revisão do cardápio, substituições, pré/pós-treino e gráficos de macros/IG/CG. O que quer ajustar agora?";
    }

    return NextResponse.json({ message: text });
  } catch (e: any) {
    // Fallback sem erro 500: mantemos a UX estável no chat
    const safe = "Estou disponível para sua NUTRIÇÃO: revisão do cardápio, substituições, pré/pós-treino e gráficos. Vamos focar nisso! 💚";
    return NextResponse.json({ message: safe }, { status: 200 });
  }
}
