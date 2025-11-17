import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/enem/simulados/[id]
 * Busca detalhes de um simulado específico
 *
 * Retorna informações do simulado e suas questões
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const simuladoId = params.id;

    // Buscar simulado com questões e respostas
    const simulado = await prisma.enemSimulado.findUnique({
      where: { id: simuladoId },
      include: {
        respostas: {
          include: {
            questao: true
          }
        }
      }
    });

    if (!simulado) {
      return NextResponse.json(
        { error: 'Simulado não encontrado' },
        { status: 404 }
      );
    }

    // Se o simulado está em andamento, buscar questões ainda não respondidas
    let questoes = [];
    if (simulado.status === 'em_andamento') {
      // Buscar todas as questões (em produção, seria um subset pré-selecionado)
      const todasQuestoes = await prisma.enemQuestao.findMany({
        take: simulado.total_questions,
        orderBy: { id: 'asc' }
      });

      questoes = todasQuestoes.map(q => ({
        id: q.id,
        numero: q.numero,
        area: q.area,
        disciplina: q.disciplina,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        gabarito: q.gabarito, // Incluído apenas para debug, não exibir ao usuário
        // Verificar se já foi respondida
        respondida: simulado.respostas.some(r => r.questao_id === q.id),
        resposta_user: simulado.respostas.find(r => r.questao_id === q.id)?.resposta_user
      }));
    }

    return NextResponse.json({
      success: true,
      simulado: {
        id: simulado.id,
        user_id: simulado.user_id,
        total_questions: simulado.total_questions,
        status: simulado.status,
        nota_final: simulado.nota_final?.toNumber(),
        started_at: simulado.started_at,
        finished_at: simulado.finished_at,
        tempo_total_minutos: simulado.tempo_total_minutos,
        questoes,
        respostas: simulado.respostas.map(r => ({
          questao_id: r.questao_id,
          questao_numero: r.questao.numero,
          resposta_user: r.resposta_user,
          correta: r.correta,
          gabarito: r.questao.gabarito,
          area: r.questao.area,
          disciplina: r.questao.disciplina,
          tempo_segundos: r.tempo_segundos
        })),
        total_respostas: simulado.respostas.length,
        acertos: simulado.respostas.filter(r => r.correta).length
      }
    });

  } catch (error) {
    console.error('Erro ao buscar simulado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
