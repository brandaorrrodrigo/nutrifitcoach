import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface DadosUsuario {
  nome: string;
  email: string;
  idade: string;
  sexo: string;
  peso: string;
  altura: string;
  objetivo: string;
  nivelAtividade: string;
  restricoes: string;
  alergias: string;
  alimentosQueNaoGosta: string;
  quantidadeRefeicoes: string;
  doencas: string;
  medicamentos: string;
}

export async function POST(request: Request) {
  try {
    const dados: DadosUsuario = await request.json();
    console.log('🤖 Gerando e salvando plano para:', dados.nome);

    const macros = calcularMacros(dados);
    let cardapioIA = null;
    let usouOllama = false;

    try {
      cardapioIA = await gerarCardapioComOllama(dados, macros);
      usouOllama = true;
    } catch (error) {
      cardapioIA = gerarCardapioPadrao(macros, dados);
    }

    const plano = {
      usuario: {
        nome: dados.nome,
        peso: parseFloat(dados.peso),
        altura: parseFloat(dados.altura),
        objetivo: dados.objetivo,
        nivelAtividade: dados.nivelAtividade,
        sexo: dados.sexo
      },
      calorias: macros.calorias,
      macros: {
        proteina: macros.proteina,
        carboidrato: macros.carboidrato,
        gordura: macros.gordura
      },
      refeicoes: cardapioIA,
      geradoComIA: usouOllama
    };

    // SALVAR NO BANCO
    try {
      const user = await prisma.user.findUnique({
        where: { email: dados.email }
      });

      if (user) {
        await prisma.plano.create({
          data: {
            userId: user.id,
            calorias: macros.calorias,
            proteina: macros.proteina,
            carboidrato: macros.carboidrato,
            gordura: macros.gordura,
            refeicoes: plano.refeicoes as any,
            objetivo: dados.objetivo
          }
        });
        console.log('💾 Plano salvo no banco!');
      }
    } catch (dbError) {
      console.log('⚠️ Erro ao salvar no banco (continuando):', dbError);
    }

    return NextResponse.json({ plano });

  } catch (error: any) {
    console.error('❌ Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function calcularMacros(dados: DadosUsuario) {
  const peso = parseFloat(dados.peso);
  const altura = parseFloat(dados.altura);
  const idade = parseFloat(dados.idade);
  
  let tmb;
  if (dados.sexo === 'masculino') {
    tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
  } else {
    tmb = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
  }

  const fatores: any = {
    'sedentario': 1.2,
    'leve': 1.375,
    'moderado': 1.55,
    'intenso': 1.725,
  };
  
  let calorias = Math.round(tmb * (fatores[dados.nivelAtividade] || 1.2));

  if (dados.objetivo === 'perda de peso') {
    calorias = Math.round(calorias * 0.80);
  } else if (dados.objetivo === 'ganho de massa') {
    calorias = Math.round(calorias * 1.15);
  }

  const proteina = Math.round(peso * 2.0);
  const proteinaCalorias = proteina * 4;
  
  let carboidrato, gordura;
  if (dados.objetivo === 'perda de peso') {
    carboidrato = Math.round((calorias * 0.30) / 4);
    gordura = Math.round((calorias - proteinaCalorias - (carboidrato * 4)) / 9);
  } else if (dados.objetivo === 'ganho de massa') {
    carboidrato = Math.round((calorias * 0.50) / 4);
    gordura = Math.round((calorias - proteinaCalorias - (carboidrato * 4)) / 9);
  } else {
    carboidrato = Math.round((calorias * 0.40) / 4);
    gordura = Math.round((calorias - proteinaCalorias - (carboidrato * 4)) / 9);
  }

  return { calorias, proteina, carboidrato, gordura };
}

async function gerarCardapioComOllama(dados: DadosUsuario, macros: any) {
  const prompt = `Crie um cardápio JSON com ${dados.quantidadeRefeicoes} refeições.
META: ${macros.calorias}kcal, ${macros.proteina}g prot, ${macros.carboidrato}g carb, ${macros.gordura}g gord
OBJETIVO: ${dados.objetivo}
RESTRIÇÕES: ${dados.restricoes || 'nenhuma'}

Formato JSON com: cafeDaManha, lancheManha, almoco, lancheTarde, jantar
Cada refeição: {horario, nome, alimentos: [{nome, quantidade, calorias}], macros}`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1:8b',
      prompt: prompt,
      stream: false,
      options: { temperature: 0.7 }
    }),
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) throw new Error('Ollama error');

  const data = await response.json();
  let jsonText = data.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('Invalid JSON');
}

function gerarCardapioPadrao(macros: any, dados: DadosUsuario) {
  const numRefeicoes = parseInt(dados.quantidadeRefeicoes) || 5;
  const calPorRefeicao = Math.round(macros.calorias / numRefeicoes);
  const protPorRefeicao = Math.round(macros.proteina / numRefeicoes);

  return {
    cafeDaManha: {
      horario: '07:00',
      nome: 'Café da Manhã',
      alimentos: [
        { nome: 'Ovos mexidos', quantidade: '3 unidades', calorias: 210, proteina: 18 },
        { nome: 'Pão integral', quantidade: '2 fatias', calorias: 140 },
        { nome: 'Abacate', quantidade: '1/2 unidade', calorias: 120 }
      ],
      macros: { calorias: calPorRefeicao, proteina: protPorRefeicao, carboidrato: 30, gordura: 15 }
    },
    lancheManha: {
      horario: '10:00',
      nome: 'Lanche da Manhã',
      alimentos: [
        { nome: 'Iogurte grego', quantidade: '150g', calorias: 150, proteina: 15 },
        { nome: 'Granola', quantidade: '30g', calorias: 120 }
      ],
      macros: { calorias: calPorRefeicao, proteina: protPorRefeicao, carboidrato: 25, gordura: 8 }
    },
    almoco: {
      horario: '12:30',
      nome: 'Almoço',
      alimentos: [
        { nome: 'Frango grelhado', quantidade: '150g', calorias: 250, proteina: 40 },
        { nome: 'Arroz integral', quantidade: '150g', calorias: 200 },
        { nome: 'Brócolis', quantidade: '100g', calorias: 35 }
      ],
      macros: { calorias: calPorRefeicao, proteina: protPorRefeicao, carboidrato: 45, gordura: 10 }
    },
    lancheTarde: {
      horario: '16:00',
      nome: 'Lanche da Tarde',
      alimentos: [
        { nome: 'Whey protein', quantidade: '30g', calorias: 120, proteina: 24 },
        { nome: 'Banana', quantidade: '1 unidade', calorias: 105 }
      ],
      macros: { calorias: calPorRefeicao, proteina: protPorRefeicao, carboidrato: 28, gordura: 2 }
    },
    jantar: {
      horario: '19:30',
      nome: 'Jantar',
      alimentos: [
        { nome: 'Salmão grelhado', quantidade: '150g', calorias: 280, proteina: 35 },
        { nome: 'Batata doce', quantidade: '150g', calorias: 130 },
        { nome: 'Salada', quantidade: '100g', calorias: 25 }
      ],
      macros: { calorias: calPorRefeicao, proteina: protPorRefeicao, carboidrato: 35, gordura: 12 }
    }
  };
}
