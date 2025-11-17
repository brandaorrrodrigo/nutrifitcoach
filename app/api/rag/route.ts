import { NextRequest, NextResponse } from "next/server";
import { searchEmbedding } from "@/lib/rag/search";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateRAGQuery } from "@/lib/security/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Carregar banco vetorial (JSON)
// NOTA: Este arquivo foi movido para data/legacy/ e será migrado para database posteriormente
const DB_PATH = process.env.NFC_VECTOR_DB || "data/legacy/library_vector_db.json";

let db: { text: string; embedding: number[] }[] = [];
try {
  const file = await import(`../../../${DB_PATH}`);
  db = file.default;
} catch {
  console.warn("⚠️ Vector DB não encontrado. Configure NFC_VECTOR_DB ou migre para database.");
}

export async function POST(req: NextRequest) {
  try {
    // 🔒 RATE LIMITING
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    const rateLimitResponse = checkRateLimit(req, 'rag', userEmail);
    if (rateLimitResponse) {
      return rateLimitResponse; // 429 Too Many Requests
    }

    const body = await req.json();
    const queryRaw = body.query;

    // 🔒 VALIDAÇÃO DE INPUT
    const validation = validateRAGQuery(queryRaw, 300);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const query = validation.sanitized!;

    const results = await searchEmbedding(query, db, 5);

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar no RAG." },
      { status: 500 }
    );
  }
}
