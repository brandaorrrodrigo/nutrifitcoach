import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/enem/simulados/answer
 * Registra a resposta de uma questão do simulado
 *
 * Body esperado:
 * {
 *   simulado_id: string,
 *   questao_id: string,
 *   resposta_user: string,  // "A", "B", "C", "D", "E"
 *   tempo_segundos?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { simulado_id, questao_id, resposta_user, tempo_segundos } = body;

    if (!simulado_id || !questao_id) {
      return NextResponse.json(
        { error: 'simulado_id e questao_id são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se simulado existe e está em andamento
    const simulado = await prisma.enemSimulado.findUnique({
      where: { id: simulado_id }
    });

    if (!simulado) {
      return NextResponse.json(
        { error: 'Simulado não encontrado' },
        { status: 404 }
      );
    }

    if (simulado.status !== 'em_andamento') {
      return NextResponse.json(
        { error: 'Simulado não está em andamento' },
        { status: 400 }
      );
    }

    // Buscar questão para verificar gabarito
    const questao = await prisma.enemQuestao.findUnique({
      where: { id: questao_id }
    });

    if (!questao) {
      return NextResponse.json(
        { error: 'Questão não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se a resposta está correta
    const correta = resposta_user === questao.gabarito;

    // Criar ou atualizar resposta
    const resposta = await prisma.enemResposta.upsert({
      where: {
        simulado_id_questao_id: {
          simulado_id,
          questao_id
        }
      },
      update: {
        resposta_user,
        correta,
        tempo_segundos,
        respondido_at: new Date()
      },
      create: {
        simulado_id,
        questao_id,
        resposta_user,
        correta,
        tempo_segundos
      }
    });

    return NextResponse.json({
      success: true,
      resposta_id: resposta.id,
      correta,
      gabarito: questao.gabarito
    });

  } catch (error) {
    console.error('Erro ao registrar resposta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
