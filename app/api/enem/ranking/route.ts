import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/enem/ranking
 * Retorna ranking global de usuários por FP
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Buscar usuários com gamificação, ordenados por FP
    const rankings = await prisma.userGamificationEnem.findMany({
      include: {
        user: {
          select: {
            id: true,
            display_name: true,
            avatar_url: true,
            email: true
          }
        }
      },
      orderBy: {
        total_fp: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Contar total de usuários no ranking
    const total = await prisma.userGamificationEnem.count();

    // Formatar dados
    const rankingFormatado = rankings.map((entry, index) => ({
      posicao: offset + index + 1,
      user_id: entry.user_id,
      nome: entry.user.display_name || entry.user.email.split('@')[0],
      avatar_url: entry.user.avatar_url,
      total_fp: entry.total_fp,
      current_streak: entry.current_streak,
      best_streak: entry.best_streak
    }));

    return NextResponse.json({
      success: true,
      ranking: rankingFormatado,
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
