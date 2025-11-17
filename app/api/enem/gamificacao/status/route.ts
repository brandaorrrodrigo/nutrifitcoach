import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/enem/gamificacao/status?user_id=xxx
 * Retorna o status de gamificação do usuário
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

    // Buscar gamificação com conquistas e histórico
    const gamification = await prisma.userGamificationEnem.findUnique({
      where: { user_id: userId },
      include: {
        achievements: {
          orderBy: {
            unlocked_at: 'desc'
          }
        },
        fp_history: {
          orderBy: {
            created_at: 'desc'
          },
          take: 10 // últimas 10 atividades
        }
      }
    });

    if (!gamification) {
      return NextResponse.json({
        success: true,
        gamification: {
          total_fp: 0,
          current_streak: 0,
          best_streak: 0,
          last_activity: null,
          achievements: [],
          recent_fp_history: []
        }
      });
    }

    return NextResponse.json({
      success: true,
      gamification: {
        total_fp: gamification.total_fp,
        current_streak: gamification.current_streak,
        best_streak: gamification.best_streak,
        last_activity: gamification.last_activity,
        achievements: gamification.achievements.map(a => ({
          code: a.code,
          title: a.title,
          description: a.description,
          unlocked_at: a.unlocked_at
        })),
        recent_fp_history: gamification.fp_history.map(h => ({
          fp_amount: h.fp_amount,
          motivo: h.motivo,
          created_at: h.created_at
        }))
      }
    });

  } catch (error) {
    console.error('Erro ao buscar status de gamificação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
