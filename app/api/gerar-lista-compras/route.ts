import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { plano } = await request.json();
    
    const lista = gerarListaCompras(plano);
    
    return NextResponse.json({ lista, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function gerarListaCompras(plano: any) {
  const ingredientes = new Map();

  Object.values(plano.refeicoes).forEach((refeicao: any) => {
    refeicao.alimentos.forEach((alimento: any) => {
      const nome = alimento.nome.toLowerCase();
      if (ingredientes.has(nome)) {
        ingredientes.set(nome, {
          nome: alimento.nome,
          quantidade: ingredientes.get(nome).quantidade + 1
        });
      } else {
        ingredientes.set(nome, {
          nome: alimento.nome,
          quantidade: 1
        });
      }
    });
  });

  const categorias = {
    'Proteínas': ['frango', 'carne', 'peixe', 'salmão', 'atum', 'ovo', 'whey'],
    'Carboidratos': ['arroz', 'batata', 'pão', 'macarrão', 'aveia', 'tapioca', 'banana'],
    'Vegetais': ['brócolis', 'couve', 'alface', 'tomate', 'cenoura', 'abobrinha'],
    'Gorduras': ['abacate', 'azeite', 'castanha', 'amendoim', 'óleo'],
    'Laticínios': ['iogurte', 'queijo', 'leite', 'requeijão'],
    'Outros': []
  };

  const listaOrganizada: any = {
    'Proteínas': [],
    'Carboidratos': [],
    'Vegetais': [],
    'Gorduras': [],
    'Laticínios': [],
    'Outros': []
  };

  ingredientes.forEach((item) => {
    let encontrou = false;
    for (const [categoria, palavras] of Object.entries(categorias)) {
      if (palavras.some(p => item.nome.toLowerCase().includes(p))) {
        listaOrganizada[categoria].push(item);
        encontrou = true;
        break;
      }
    }
    if (!encontrou) {
      listaOrganizada['Outros'].push(item);
    }
  });

  return listaOrganizada;
}
