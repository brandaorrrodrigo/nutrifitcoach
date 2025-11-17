import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/enem/simulados/history?user_id=xxx
 * Retorna o histórico de simulados do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar simulados do usuário
    const simulados = await prisma.enemSimulado.findMany({
      where: {
        user_id: userId,
        status: 'finalizado'
      },
      include: {
        respostas: true,
        comparacao: true
      },
      orderBy: {
        finished_at: 'desc'
      }
    });

    const historico = simulados.map(s => {
      const acertos = s.respostas.filter(r => r.correta).length;
      return {
        id: s.id,
        started_at: s.started_at,
        finished_at: s.finished_at,
        nota_final: s.nota_final?.toNumber() || 0,
        acertos,
        total_questoes: s.total_questions,
        percentual: (acertos / s.total_questions) * 100,
        tempo_total_minutos: s.tempo_total_minutos,
        comparacao: s.comparacao ? {
          nota_corte_curso: s.comparacao.nota_corte_curso,
          nota_corte_valor: s.comparacao.nota_corte_valor?.toNumber(),
          passou: s.comparacao.passou,
          diferenca_pontos: s.comparacao.diferenca_pontos?.toNumber(),
          percentil: s.comparacao.percentil?.toNumber()
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      total: historico.length,
      simulados: historico
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
