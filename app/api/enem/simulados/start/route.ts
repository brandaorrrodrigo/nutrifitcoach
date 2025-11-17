import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/enem/simulados/start
 * Inicia um novo simulado ENEM
 *
 * Body esperado:
 * {
 *   user_id: string,
 *   total_questions?: number  // padrão: 45
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, total_questions = 45 } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const user = await prisma.appUser.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Buscar questões aleatórias do banco
    // Por enquanto, vamos apenas criar o simulado
    // Em produção, você deve selecionar questões aleatórias da tabela EnemQuestao
    const questoes = await prisma.enemQuestao.findMany({
      take: total_questions,
      orderBy: {
        id: 'asc' // Em produção, usar random() do banco
      }
    });

    if (questoes.length === 0) {
      return NextResponse.json(
        {
          error: 'Nenhuma questão encontrada no banco. Importe questões primeiro.',
          simulado_id: null
        },
        { status: 400 }
      );
    }

    // Criar o simulado
    const simulado = await prisma.enemSimulado.create({
      data: {
        user_id,
        total_questions: Math.min(total_questions, questoes.length),
        status: 'em_andamento'
      }
    });

    return NextResponse.json({
      success: true,
      simulado_id: simulado.id,
      total_questions: simulado.total_questions,
      started_at: simulado.started_at,
      questoes: questoes.map(q => ({
        id: q.id,
        numero: q.numero,
        area: q.area,
        disciplina: q.disciplina,
        enunciado: q.enunciado,
        alternativas: q.alternativas
      }))
    });

  } catch (error) {
    console.error('Erro ao iniciar simulado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
