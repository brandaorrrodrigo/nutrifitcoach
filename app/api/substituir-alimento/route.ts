import { NextResponse } from 'next/server';

const SUBSTITUICOES: any = {
  'frango': [
    { nome: 'Peito de peru', proteina: 30, calorias: 150 },
    { nome: 'Carne moída magra', proteina: 26, calorias: 180 },
    { nome: 'Atum', proteina: 28, calorias: 140 },
    { nome: 'Tilápia', proteina: 26, calorias: 130 }
  ],
  'arroz': [
    { nome: 'Batata doce', carboidrato: 28, calorias: 120 },
    { nome: 'Quinoa', carboidrato: 25, calorias: 130 },
    { nome: 'Macarrão integral', carboidrato: 30, calorias: 140 },
    { nome: 'Mandioca', carboidrato: 32, calorias: 135 }
  ],
  'ovo': [
    { nome: 'Clara de ovo (3 unidades)', proteina: 11, calorias: 50 },
    { nome: 'Cottage', proteina: 12, calorias: 80 },
    { nome: 'Iogurte grego', proteina: 10, calorias: 90 }
  ],
  'batata doce': [
    { nome: 'Arroz integral', carboidrato: 28, calorias: 125 },
    { nome: 'Aveia', carboidrato: 30, calorias: 140 },
    { nome: 'Mandioca', carboidrato: 32, calorias: 135 },
    { nome: 'Inhame', carboidrato: 27, calorias: 118 }
  ],
  'abacate': [
    { nome: 'Azeite (1 colher)', gordura: 14, calorias: 120 },
    { nome: 'Castanhas (30g)', gordura: 15, calorias: 180 },
    { nome: 'Pasta de amendoim (20g)', gordura: 10, calorias: 120 }
  ],
  'banana': [
    { nome: 'Maçã', carboidrato: 25, calorias: 95 },
    { nome: 'Mamão', carboidrato: 20, calorias: 80 },
    { nome: 'Aveia (50g)', carboidrato: 30, calorias: 140 }
  ],
  'brócolis': [
    { nome: 'Couve-flor', carboidrato: 5, calorias: 35 },
    { nome: 'Abobrinha', carboidrato: 4, calorias: 30 },
    { nome: 'Couve', carboidrato: 6, calorias: 40 }
  ]
};

export async function POST(request: Request) {
  try {
    const { alimento } = await request.json();
    
    const alimentoLower = alimento.toLowerCase();
    let substituicoes: any[] = [];
    
    // Buscar substituições
    for (const [key, values] of Object.entries(SUBSTITUICOES)) {
      if (alimentoLower.includes(key)) {
        substituicoes = values as any[];
        break;
      }
    }
    
    // Se não encontrou, sugerir genéricas
    if (substituicoes.length === 0) {
      substituicoes = [
        { nome: 'Consulte um nutricionista', proteina: 0, calorias: 0 }
      ];
    }
    
    return NextResponse.json({ substituicoes, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
