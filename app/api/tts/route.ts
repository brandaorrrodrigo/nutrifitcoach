import { NextRequest, NextResponse } from "next/server";

// Endpoint local de voz neural via Ollama
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Texto ausente" }, { status: 400 });

    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        prompt: text,
        stream: false
      })
    });

    if (!res.ok) throw new Error("Falha na geração do TTS");
    const data = await res.json();
    return NextResponse.json({ result: data.response });
  } catch (err) {
    console.error("Erro no TTS:", err);
    return NextResponse.json({ error: "Erro interno no TTS" }, { status: 500 });
  }
}
