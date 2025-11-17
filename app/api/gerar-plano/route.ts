import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { objetivo, peso, altura, idade, sexo, restricoes, nivelAtividade } = await request.json();

    console.log('🍽️ Gerando plano alimentar...');

    // Plano básico de exemplo (em produção, usar IA)
    const plano = {
      calorias: 2000,
      macros: {
        proteina: 150,
        carboidrato: 200,
        gordura: 67
      },
      refeicoes: {
        cafeDaManha: {
          horario: "07:00",
          alimentos: [
            { nome: "Ovos mexidos", quantidade: "3 unidades", calorias: 200 },
            { nome: "Pão integral", quantidade: "2 fatias", calorias: 140 },
            { nome: "Abacate", quantidade: "1/2 unidade", calorias: 120 }
          ]
        },
        lancheManha: {
          horario: "10:00",
          alimentos: [
            { nome: "Whey protein", quantidade: "30g", calorias: 120 },
            { nome: "Banana", quantidade: "1 unidade", calorias: 100 }
          ]
        },
        almoco: {
          horario: "12:30",
          alimentos: [
            { nome: "Frango grelhado", quantidade: "150g", calorias: 250 },
            { nome: "Arroz integral", quantidade: "4 colheres", calorias: 160 },
            { nome: "Feijão", quantidade: "2 conchas", calorias: 140 },
            { nome: "Salada", quantidade: "à vontade", calorias: 50 }
          ]
        },
        lancheTarde: {
          horario: "16:00",
          alimentos: [
            { nome: "Iogurte natural", quantidade: "200ml", calorias: 120 },
            { nome: "Granola", quantidade: "30g", calorias: 130 }
          ]
        },
        jantar: {
          horario: "19:30",
          alimentos: [
            { nome: "Salmão grelhado", quantidade: "150g", calorias: 280 },
            { nome: "Batata doce", quantidade: "150g", calorias: 130 },
            { nome: "Brócolis", quantidade: "100g", calorias: 35 }
          ]
        }
      },
      observacoes: [
        "Beba pelo menos 2L de água por dia",
        "Ajuste as porções conforme sua fome e resultados",
        "Consulte um nutricionista para personalização avançada"
      ]
    };

    console.log('✅ Plano gerado!');
    
    return NextResponse.json({ plano });

  } catch (error: any) {
    console.error('❌ Erro ao gerar plano:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano alimentar.' },
      { status: 500 }
    );
  }
}
