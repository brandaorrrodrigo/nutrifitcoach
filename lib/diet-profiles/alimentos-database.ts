// Biblioteca completa de alimentos categorizados
export const ALIMENTOS_DATABASE = {
  
  // PROTEÍNAS ANIMAIS
  CARNES: {
    frango_peito: { nome: 'Peito de Frango', proteina: 31, carbs: 0, gordura: 3.6, calorias: 165, perfis: ['FLEXITARIANA', 'LOW_CARB', 'CETOGENICA', 'PALEO', 'GANHO_MASSA', 'EMAGRECIMENTO'] },
    carne_vermelha_magra: { nome: 'Carne Vermelha Magra', proteina: 26, carbs: 0, gordura: 7, calorias: 180, perfis: ['FLEXITARIANA', 'LOW_CARB', 'CETOGENICA', 'PALEO'] },
    peixe_salmao: { nome: 'Salmão', proteina: 25, carbs: 0, gordura: 13, calorias: 230, perfis: ['FLEXITARIANA', 'CETOGENICA', 'PALEO', 'MEDITERRANEA', 'DASH'] },
    atum: { nome: 'Atum', proteina: 30, carbs: 0, gordura: 1, calorias: 130, perfis: ['FLEXITARIANA', 'PALEO', 'MEDITERRANEA', 'EMAGRECIMENTO'] },
    ovo: { nome: 'Ovo', proteina: 6, carbs: 0.6, gordura: 5, calorias: 70, perfis: ['FLEXITARIANA', 'VEGETARIANA', 'CETOGENICA', 'PALEO', 'LOW_CARB'] }
  },
  
  // PROTEÍNAS VEGETAIS
  PROTEINAS_VEGETAIS: {
    tofu: { nome: 'Tofu', proteina: 8, carbs: 2, gordura: 4, calorias: 80, perfis: ['VEGANA', 'VEGETARIANA', 'FLEXITARIANA'] },
    tempeh: { nome: 'Tempeh', proteina: 19, carbs: 9, gordura: 11, calorias: 195, perfis: ['VEGANA', 'VEGETARIANA'] },
    seitan: { nome: 'Seitan', proteina: 25, carbs: 4, gordura: 2, calorias: 140, perfis: ['VEGANA', 'VEGETARIANA'] },
    edamame: { nome: 'Edamame', proteina: 11, carbs: 10, gordura: 5, calorias: 120, perfis: ['VEGANA', 'VEGETARIANA', 'FLEXITARIANA'] },
    grao_de_bico: { nome: 'Grão de Bico', proteina: 9, carbs: 27, gordura: 3, calorias: 165, perfis: ['VEGANA', 'VEGETARIANA', 'MEDITERRANEA', 'DASH'] },
    lentilha: { nome: 'Lentilha', proteina: 9, carbs: 20, gordura: 0.4, calorias: 116, perfis: ['VEGANA', 'VEGETARIANA', 'MEDITERRANEA'] },
    feijao_preto: { nome: 'Feijão Preto', proteina: 8.9, carbs: 23.7, gordura: 0.5, calorias: 132, perfis: ['VEGANA', 'VEGETARIANA', 'FLEXITARIANA'] }
  },
  
  // LATICÍNIOS
  LATICINIOS: {
    iogurte_grego: { nome: 'Iogurte Grego', proteina: 10, carbs: 4, gordura: 0.4, calorias: 59, perfis: ['FLEXITARIANA', 'VEGETARIANA', 'DASH'] },
    queijo_cottage: { nome: 'Queijo Cottage', proteina: 11, carbs: 3, gordura: 4, calorias: 98, perfis: ['FLEXITARIANA', 'VEGETARIANA', 'CETOGENICA', 'LOW_CARB'] },
    leite_desnatado: { nome: 'Leite Desnatado', proteina: 3.4, carbs: 5, gordura: 0.1, calorias: 34, perfis: ['FLEXITARIANA', 'VEGETARIANA', 'DASH'] }
  },
  
  // CARBOIDRATOS COMPLEXOS
  CARBOIDRATOS: {
    arroz_integral: { nome: 'Arroz Integral', proteina: 2.6, carbs: 23, gordura: 0.9, calorias: 111, perfis: ['FLEXITARIANA', 'VEGETARIANA', 'VEGANA', 'MEDITERRANEA', 'DASH', 'GANHO_MASSA'] },
    batata_doce: { nome: 'Batata Doce', proteina: 2, carbs: 20, gordura: 0.1, calorias: 86, perfis: ['FLEXITARIANA', 'PALEO', 'GANHO_MASSA'] },
    quinoa: { nome: 'Quinoa', proteina: 4.4, carbs: 21, gordura: 1.9, calorias: 120, perfis: ['FLEXITARIANA', 'VEGANA', 'VEGETARIANA', 'MEDITERRANEA'] },
    aveia: { nome: 'Aveia', proteina: 2.5, carbs: 12, gordura: 1.4, calorias: 68, perfis: ['FLEXITARIANA', 'VEGETARIANA', 'VEGANA', 'DASH'] }
  },
  
  // VEGETAIS BAIXO CARB
  VEGETAIS_BAIXO_CARB: {
    brocolis: { nome: 'Brócolis', proteina: 2.8, carbs: 7, gordura: 0.4, calorias: 34, perfis: ['TODAS'] },
    espinafre: { nome: 'Espinafre', proteina: 2.9, carbs: 3.6, gordura: 0.4, calorias: 23, perfis: ['TODAS'] },
    couve_flor: { nome: 'Couve-flor', proteina: 1.9, carbs: 5, gordura: 0.3, calorias: 25, perfis: ['TODAS'] },
    abobrinha: { nome: 'Abobrinha', proteina: 1.2, carbs: 3.1, gordura: 0.3, calorias: 17, perfis: ['TODAS'] }
  },
  
  // GORDURAS BOAS
  GORDURAS: {
    abacate: { nome: 'Abacate', proteina: 2, carbs: 9, gordura: 15, calorias: 160, perfis: ['FLEXITARIANA', 'CETOGENICA', 'LOW_CARB', 'PALEO', 'VEGANA'] },
    azeite: { nome: 'Azeite Extra Virgem', proteina: 0, carbs: 0, gordura: 14, calorias: 120, perfis: ['TODAS'] },
    castanhas: { nome: 'Castanhas', proteina: 4, carbs: 3, gordura: 12, calorias: 130, perfis: ['FLEXITARIANA', 'CETOGENICA', 'PALEO', 'VEGANA', 'MEDITERRANEA'] },
    amendoim: { nome: 'Amendoim', proteina: 7, carbs: 5, gordura: 14, calorias: 166, perfis: ['FLEXITARIANA', 'VEGANA', 'VEGETARIANA'] }
  },
  
  // FRUTAS BAIXO IG
  FRUTAS: {
    morango: { nome: 'Morango', proteina: 0.7, carbs: 8, gordura: 0.3, calorias: 32, perfis: ['TODAS_EXCETO_CETOGENICA'] },
    mirtilo: { nome: 'Mirtilo', proteina: 0.7, carbs: 14, gordura: 0.3, calorias: 57, perfis: ['FLEXITARIANA', 'PALEO', 'MEDITERRANEA'] },
    maca: { nome: 'Maçã', proteina: 0.3, carbs: 14, gordura: 0.2, calorias: 52, perfis: ['FLEXITARIANA', 'PALEO', 'DASH'] }
  }
};

// Função para filtrar alimentos por perfil
export function filtrarAlimentosPorPerfil(perfil: string) {
  const alimentosFiltrados: any = {};
  
  Object.entries(ALIMENTOS_DATABASE).forEach(([categoria, alimentos]) => {
    alimentosFiltrados[categoria] = {};
    
    Object.entries(alimentos).forEach(([key, alimento]: [string, any]) => {
      if (alimento.perfis.includes(perfil) || alimento.perfis.includes('TODAS')) {
        alimentosFiltrados[categoria][key] = alimento;
      }
    });
  });
  
  return alimentosFiltrados;
}
