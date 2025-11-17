// Gerador de Lista de Compras

export interface ItemCompra {
  nome: string;
  quantidade: string;
  categoria: string;
  essencial: boolean;
  preco_medio?: number;
}

export interface ListaCompras {
  periodo: string; // 'semanal' ou 'mensal'
  categorias: Record<string, ItemCompra[]>;
  total_estimado: number;
  dicas_compra: string[];
}

// Gerar lista de compras a partir do cardápio
export function gerarListaCompras(
  cardapios: any[], // Array de cardápios da semana
  periodo: 'semanal' | 'mensal' = 'semanal'
): ListaCompras {
  
  const itens: Map<string, ItemCompra> = new Map();
  const multiplicador = periodo === 'mensal' ? 4 : 1;
  
  // Consolidar todos os alimentos
  cardapios.forEach(cardapio => {
    cardapio.refeicoes.forEach((refeicao: any) => {
      refeicao.alimentos.forEach((alimento: any) => {
        const key = alimento.nome.toLowerCase();
        
        if (itens.has(key)) {
          const item = itens.get(key)!;
          item.quantidade = somarQuantidades(
            item.quantidade,
            alimento.quantidade
          );
        } else {
          itens.set(key, {
            nome: alimento.nome,
            quantidade: alimento.quantidade,
            categoria: categorizarAlimento(alimento.nome),
            essencial: isAlimentoEssencial(alimento.nome)
          });
        }
      });
    });
  });
  
  // Multiplicar por período
  itens.forEach(item => {
    item.quantidade = multiplicarQuantidade(item.quantidade, multiplicador);
  });
  
  // Agrupar por categoria
  const categorias: Record<string, ItemCompra[]> = {};
  itens.forEach(item => {
    if (!categorias[item.categoria]) {
      categorias[item.categoria] = [];
    }
    categorias[item.categoria].push(item);
  });
  
  // Ordenar por categoria
  const ordem = [
    'Proteínas',
    'Carboidratos',
    'Vegetais',
    'Frutas',
    'Laticínios',
    'Gorduras',
    'Temperos',
    'Bebidas',
    'Outros'
  ];
  
  const categoriasOrdenadas: Record<string, ItemCompra[]> = {};
  ordem.forEach(cat => {
    if (categorias[cat]) {
      categoriasOrdenadas[cat] = categorias[cat].sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
    }
  });
  
  return {
    periodo,
    categorias: categoriasOrdenadas,
    total_estimado: estimarCusto(Array.from(itens.values())),
    dicas_compra: gerarDicasCompra(periodo)
  };
}

function categorizarAlimento(nome: string): string {
  const n = nome.toLowerCase();
  
  if (n.includes('frango') || n.includes('carne') || n.includes('peixe') || 
      n.includes('atum') || n.includes('salmão') || n.includes('ovo') ||
      n.includes('tofu') || n.includes('tempeh')) {
    return 'Proteínas';
  }
  
  if (n.includes('arroz') || n.includes('batata') || n.includes('pão') || 
      n.includes('macarrão') || n.includes('aveia') || n.includes('quinoa')) {
    return 'Carboidratos';
  }
  
  if (n.includes('brócolis') || n.includes('espinafre') || n.includes('couve') || 
      n.includes('tomate') || n.includes('alface') || n.includes('abobrinha')) {
    return 'Vegetais';
  }
  
  if (n.includes('banana') || n.includes('maçã') || n.includes('morango') || 
      n.includes('abacaxi') || n.includes('laranja')) {
    return 'Frutas';
  }
  
  if (n.includes('leite') || n.includes('iogurte') || n.includes('queijo')) {
    return 'Laticínios';
  }
  
  if (n.includes('azeite') || n.includes('abacate') || n.includes('castanha') || 
      n.includes('óleo') || n.includes('manteiga')) {
    return 'Gorduras';
  }
  
  if (n.includes('sal') || n.includes('pimenta') || n.includes('alho') || 
      n.includes('cebola') || n.includes('tempero')) {
    return 'Temperos';
  }
  
  if (n.includes('café') || n.includes('chá') || n.includes('água')) {
    return 'Bebidas';
  }
  
  return 'Outros';
}

function isAlimentoEssencial(nome: string): boolean {
  const essenciais = [
    'arroz', 'feijão', 'frango', 'ovo', 'batata',
    'carne', 'peixe', 'leite', 'pão', 'azeite'
  ];
  
  return essenciais.some(e => nome.toLowerCase().includes(e));
}

function somarQuantidades(q1: string, q2: string): string {
  const v1 = parseFloat(q1);
  const v2 = parseFloat(q2);
  const unidade = q1.replace(/[\d.]/g, '').trim();
  return `${v1 + v2}${unidade}`;
}

function multiplicarQuantidade(quantidade: string, multiplicador: number): string {
  const valor = parseFloat(quantidade);
  const unidade = quantidade.replace(/[\d.]/g, '').trim();
  
  // Converter para unidades práticas de supermercado
  let novoValor = valor * multiplicador;
  let novaUnidade = unidade;
  
  if (unidade === 'g') {
    if (novoValor >= 1000) {
      novoValor = Math.ceil(novoValor / 1000);
      novaUnidade = 'kg';
    } else {
      novoValor = Math.ceil(novoValor / 100) * 100; // Arredondar para 100g
    }
  } else if (unidade === 'ml') {
    if (novoValor >= 1000) {
      novoValor = Math.ceil(novoValor / 1000);
      novaUnidade = 'L';
    }
  } else if (unidade === 'unidade' || unidade === 'un') {
    novoValor = Math.ceil(novoValor);
  }
  
  return `${novoValor}${novaUnidade}`;
}

function estimarCusto(itens: ItemCompra[]): number {
  // Preços médios aproximados (Brasil, 2024)
  const precosBase: Record<string, number> = {
    'frango': 15, // R$/kg
    'carne': 35,
    'peixe': 30,
    'ovo': 12, // dúzia
    'arroz': 6, // kg
    'feijão': 8,
    'batata': 4,
    'azeite': 25, // litro
    'leite': 5,
    'iogurte': 8,
    'banana': 6,
    'maçã': 8
  };
  
  let total = 0;
  
  itens.forEach(item => {
    const nome = item.nome.toLowerCase();
    let preco = 5; // preço padrão
    
    for (const [key, value] of Object.entries(precosBase)) {
      if (nome.includes(key)) {
        preco = value;
        break;
      }
    }
    
    const quantidade = parseFloat(item.quantidade);
    total += preco * quantidade;
  });
  
  return Math.round(total);
}

function gerarDicasCompra(periodo: string): string[] {
  const dicasBase = [
    '🛒 Vá ao mercado com lista - evita compras desnecessárias',
    '💰 Compare preços entre marcas',
    '📅 Compre não-perecíveis em atacado',
    '❄️ Proteínas podem ser congeladas',
    '🥬 Vegetais da estação são mais baratos',
    '🍳 Ovos duram 4-5 semanas na geladeira',
    '🌾 Grãos integrais duram meses',
    '🥜 Oleaginosas compre a granel'
  ];
  
  if (periodo === 'mensal') {
    dicasBase.push(
      '📦 Divida compra: perecíveis semanalmente',
      '❄️ Congele porções de carne/frango',
      '🥦 Branqueie e congele vegetais'
    );
  }
  
  return dicasBase;
}

// Exportar lista para diferentes formatos
export function exportarListaTexto(lista: ListaCompras): string {
  let texto = `═══════════════════════════════════════\n`;
  texto += `📋 LISTA DE COMPRAS - ${lista.periodo.toUpperCase()}\n`;
  texto += `═══════════════════════════════════════\n\n`;
  
  Object.entries(lista.categorias).forEach(([categoria, itens]) => {
    texto += `\n▸ ${categoria.toUpperCase()}\n`;
    texto += `${'─'.repeat(40)}\n`;
    
    itens.forEach(item => {
      const essencial = item.essencial ? '⭐' : '  ';
      texto += `${essencial} [ ] ${item.nome} - ${item.quantidade}\n`;
    });
  });
  
  texto += `\n\n💰 CUSTO ESTIMADO: R$ ${lista.total_estimado}\n\n`;
  
  texto += `📌 DICAS:\n`;
  lista.dicas_compra.forEach(dica => {
    texto += `   ${dica}\n`;
  });
  
  return texto;
}

export function exportarListaPDF(lista: ListaCompras): Blob {
  // Implementar geração de PDF
  // Usar jsPDF ou similar
  const texto = exportarListaTexto(lista);
  return new Blob([texto], { type: 'text/plain' });
}
