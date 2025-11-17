import { NextRequest, NextResponse } from "next/server";

const SUGESTOES = [
  { title: "Pré-treino: iogurte + banana + aveia", motivo: "rápida digestão e energia", alvo: "hipertrofia" },
  { title: "Almoço: frango grelhado + arroz integral + legumes", motivo: "equilíbrio P/C/F", alvo: "perda de gordura" },
  { title: "Lanche: whey + pasta de amendoim", motivo: "proteína prática", alvo: "hipertrofia" },
  { title: "Jantar: omelete de claras + salada + azeite", motivo: "saciedade com baixo carbo", alvo: "perda de gordura" },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { objetivo = "manutenção" } = body || {};
    const out = SUGESTOES.filter(s => s.alvo === objetivo || objetivo === "manutenção").slice(0,3);
    return NextResponse.json({ recomendacoes: out });
  } catch (e) {
    return NextResponse.json({ error: "Erro interno em /api/recommend" }, { status: 500 });
  }
}
