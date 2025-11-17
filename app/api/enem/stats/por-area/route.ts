import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/enem/stats/por-area?user_id=xxx
 * Retorna estatísticas de desempenho por área do conhecimento
 * Cache: 120 segundos (dados mais estáveis)
 */
export const revalidate = 120; // Revalidar a cada 120 segundos

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

    // Buscar todos os simulados finalizados do usuário
    const simulados = await prisma.enemSimulado.findMany({
      where: {
        user_id: userId,
        status: 'finalizado'
      },
      include: {
        respostas: {
          include: {
            questao: true
          }
        }
      }
    });

    if (simulados.length === 0) {
      return NextResponse.json({
        success: true,
        stats_por_area: {
          linguagens: { total: 0, acertos: 0, percentual: 0 },
          matematica: { total: 0, acertos: 0, percentual: 0 },
          ciencias_natureza: { total: 0, acertos: 0, percentual: 0 },
          ciencias_humanas: { total: 0, acertos: 0, percentual: 0 }
        },
        total_questoes: 0,
        total_acertos: 0,
        media_geral: 0,
        areas_mais_fortes: [],
        areas_mais_fracas: [],
        total_simulados: 0
      });
    }

    // Inicializar contadores por área
    const statsPorArea: Record<string, { total: number; acertos: number; percentual: number }> = {
      linguagens: { total: 0, acertos: 0, percentual: 0 },
      matematica: { total: 0, acertos: 0, percentual: 0 },
      ciencias_natureza: { total: 0, acertos: 0, percentual: 0 },
      ciencias_humanas: { total: 0, acertos: 0, percentual: 0 }
    };

    let totalQuestoes = 0;
    let totalAcertos = 0;

    // Processar todas as respostas
    for (const simulado of simulados) {
      for (const resposta of simulado.respostas) {
        const area = resposta.questao.area;

        if (statsPorArea[area]) {
          statsPorArea[area].total++;
          if (resposta.correta) {
            statsPorArea[area].acertos++;
          }
        }

        totalQuestoes++;
        if (resposta.correta) {
          totalAcertos++;
        }
      }
    }

    // Calcular percentuais
    for (const area in statsPorArea) {
      if (statsPorArea[area].total > 0) {
        statsPorArea[area].percentual =
          (statsPorArea[area].acertos / statsPorArea[area].total) * 100;
      }
    }

    const mediaGeral = totalQuestoes > 0 ? (totalAcertos / totalQuestoes) * 100 : 0;

    // Identificar áreas mais fortes e mais fracas
    const areasComDados = Object.entries(statsPorArea)
      .filter(([_, stats]) => stats.total > 0)
      .map(([area, stats]) => ({ area, ...stats }));

    const areasOrdenadas = [...areasComDados].sort((a, b) => b.percentual - a.percentual);

    const areasMaisFortes = areasOrdenadas.slice(0, 2);
    const areasMaisFracas = areasOrdenadas.slice(-2).reverse();

    return NextResponse.json({
      success: true,
      stats_por_area: statsPorArea,
      total_questoes: totalQuestoes,
      total_acertos: totalAcertos,
      media_geral: mediaGeral,
      areas_mais_fortes: areasMaisFortes,
      areas_mais_fracas: areasMaisFracas,
      total_simulados: simulados.length
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas por área:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
