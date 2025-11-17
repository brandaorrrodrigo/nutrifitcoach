import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateImageBase64 } from "@/lib/security/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const OLLAMA = "http://127.0.0.1:11434/api/generate";
const VISION_MODEL = process.env.OLLAMA_VISION_MODEL || "llava:latest";

export async function POST(req: NextRequest) {
  try {
    // 🔒 RATE LIMITING
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    const rateLimitResponse = checkRateLimit(req, 'vision', userEmail);
    if (rateLimitResponse) {
      return rateLimitResponse; // 429 Too Many Requests
    }

    const body = await req.json();
    const { imageBase64, language = "pt-BR" } = body || {};

    // 🔒 VALIDAÇÃO DE INPUT
    const validation = validateImageBase64(imageBase64, 5);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const prompt =
`Você é um avaliador nutricional.
Objetivo:
1) Identifique os itens do prato pela foto.
2) Estime macros aproximados (proteína, carboidrato, gordura) e kcal da refeição (faixa).
3) Classifique aderência ao plano (OK | parcial | furou) e diga o porquê.
4) Sugira até 3 substituições equivalentes (em 1 frase curta cada).
Responda em ${language}.`;

    let responseText = "";
    try {
      const r = await fetch(OLLAMA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: VISION_MODEL,
          prompt,
          images: [imageBase64],
          stream: false
        })
      });
      if (!r.ok) throw new Error("Vision model not available");
      const data = await r.json();
      responseText = data?.response || "";
    } catch {
      responseText = "Não consegui usar o modelo de visão agora. Envie a foto novamente ou descreva sua refeição que eu avalio por texto.";
    }

    return NextResponse.json({ analysis: responseText });
  } catch (e) {
    return NextResponse.json({ error: "Erro interno em /api/vision" }, { status: 500 });
  }
}
