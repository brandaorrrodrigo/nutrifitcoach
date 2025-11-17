import fs from "fs";
import path from "path";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const EMBED_MODEL = "nomic-embed-text";

export async function embedText(text: string): Promise<number[]> {
  const resp = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: EMBED_MODEL,
      prompt: text
    })
  });

  if (!resp.ok) throw new Error("Falha no embedding");

  const data = await resp.json();
  return data.embedding;
}
