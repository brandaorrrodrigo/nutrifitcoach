import { embedText } from "./embedder";
import cosineSimilarity from "compute-cosine-similarity";

export async function searchEmbedding(
  query: string,
  db: { text: string; embedding: number[] }[],
  limit = 5
) {
  const qEmb = await embedText(query);

  const scored = db.map((item) => ({
    text: item.text,
    score: cosineSimilarity(qEmb, item.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
