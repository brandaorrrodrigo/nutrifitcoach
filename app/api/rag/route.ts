import { NextRequest, NextResponse } from "next/server";
import { searchEmbedding } from "@/lib/rag/search";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateRAGQuery } from "@/lib/security/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs"; // garante que podemos usar fs

// Caminho do banco vetorial
const DB_PATH = process.env.NFC_VECTOR_DB || "data/legacy/library_vector_db.json";

type VectorRow = { text: string; embedding: number[] };

let cachedDb: VectorRow[] | null = null;

async function loadVectorDB(): Promise<VectorRow[]> {
  if (cachedDb) return cachedDb;

  try {
    const absolutePath = path.join(process.cwd(), DB_PATH);
    const fileContent = await fs.readFile(absolutePath, "utf-8");
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      console.warn("⚠️ Vector DB inválido: esperado array.");
      cachedDb = [];
      return cachedDb;
    }

    cachedDb = data;
    return cachedDb;
  } catch (err) {
    console.warn("⚠️ Vector DB não encontrado ou inválido. Configure NFC_VECTOR_DB ou verifique o arquivo.", err);
    cachedDb = [];
    return cachedDb;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 🔒 RATE LIMITING
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || undefined;

    const rateLimitResponse = checkRateLimit(req, "rag", userEmail);
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

    // 🔍 Carrega o banco vetorial a partir do JSON
    const db = await loadVectorDB();

    const results = await searchEmbedding(query, db, 5);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Erro ao buscar no RAG:", err);
    return NextResponse.json(
      { error: "Erro ao buscar no RAG." },
      { status: 500 }
    );
  }
}

