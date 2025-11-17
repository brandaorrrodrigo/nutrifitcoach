import { NextRequest, NextResponse } from "next/server";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      planoAtual = { calorias: 2000, macros: { proteina: 120, carboidrato: 220, gordura: 60 } },
      historico = {
        adesao7d: [0.8, 0.7, 0.9, 1.0, 0.6, 0.85, 0.7],
        fome: 0.5,
        treino: 0.5,
        perdaPesoSem2: 0.6
      },
      objetivo = "hipertrofia"
    } = body || {};

    const mediaAdesao = historico.adesao7d.reduce((a:number,b:number)=>a+b,0)/Math.max(historico.adesao7d.length,1);
    let ajusteCal = 0;

    if (objetivo === "perda de gordura") {
      if (historico.fome > 0.7 && mediaAdesao < 0.75) ajusteCal += 120;
      if (historico.perdaPesoSem2 > 1.2) ajusteCal += 150;
      if (historico.treino > 0.7) ajusteCal += 80;
      if (mediaAdesao > 0.9 && historico.fome < 0.3) ajusteCal -= 100;
    } else if (objetivo === "hipertrofia") {
      if (mediaAdesao < 0.7 && historico.fome < 0.3) ajusteCal -= 120;
      if (historico.treino > 0.7 && mediaAdesao >= 0.75) ajusteCal += 150;
    } else {
      if (historico.fome > 0.7) ajusteCal += 80;
      if (historico.fome < 0.2 && mediaAdesao > 0.9) ajusteCal -= 80;
    }

    ajusteCal = clamp(ajusteCal, -200, 200);
    const novasCalorias = clamp(planoAtual.calorias + ajusteCal, 1000, 6000);

    const fator = novasCalorias / Math.max(planoAtual.calorias, 1);
    const novosMacros = {
      proteina: Math.round(planoAtual.macros.proteina * (objetivo==="hipertrofia" ? Math.max(1.0,fator) : fator)),
      carboidrato: Math.round(planoAtual.macros.carboidrato * fator),
      gordura: Math.round(planoAtual.macros.gordura * fator),
    };

    const justificativa =
`Baseado em: adesão média ${(mediaAdesao*100).toFixed(0)}%, fome ${(historico.fome*100).toFixed(0)}%, treino ${(historico.treino*100).toFixed(0)}% e variação de peso ~${historico.perdaPesoSem2} kg/14d.
Ajuste de ${ajusteCal} kcal aplicado.`;

    return NextResponse.json({ novasCalorias, novosMacros, justificativa });
  } catch (e) {
    return NextResponse.json({ error: "Erro interno em /api/adi" }, { status: 500 });
  }
}
