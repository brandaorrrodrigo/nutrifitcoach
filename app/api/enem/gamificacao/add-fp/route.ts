import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/enem/gamificacao/add-fp
 * Adiciona FP (Focus Points) ao usuário
 *
 * Body esperado:
 * {
 *   user_id: string,
 *   fp: number,
 *   motivo: string,
 *   simulado_id?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, fp, motivo, simulado_id } = body;

    if (!user_id || fp === undefined || !motivo) {
      return NextResponse.json(
        { error: 'user_id, fp e motivo são obrigatórios' },
        { status: 400 }
      );
    }

    if (fp <= 0) {
      return NextResponse.json(
        { error: 'FP deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Buscar ou criar gamificação do usuário
    let gamification = await prisma.userGamificationEnem.findUnique({
      where: { user_id }
    });

    if (!gamification) {
      gamification = await prisma.userGamificationEnem.create({
        data: {
          user_id,
          total_fp: 0,
          current_streak: 0,
          best_streak: 0
        }
      });
    }

    // Atualizar streak diário
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let newStreak = 1;
    if (gamification.last_activity) {
      const lastActivity = new Date(gamification.last_activity);
      lastActivity.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((hoje.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Continuou a sequência
        newStreak = gamification.current_streak + 1;
      } else if (diffDays === 0) {
        // Mesmo dia, mantém streak
        newStreak = gamification.current_streak;
      }
      // Se diffDays > 1, perdeu o streak, volta para 1
    }

    const newBestStreak = Math.max(newStreak, gamification.best_streak);
    const newTotalFP = gamification.total_fp + fp;

    // Atualizar gamificação
    const updatedGamification = await prisma.userGamificationEnem.update({
      where: { id: gamification.id },
      data: {
        total_fp: newTotalFP,
        current_streak: newStreak,
        best_streak: newBestStreak,
        last_activity: new Date()
      }
    });

    // Registrar no histórico
    await prisma.fPHistoryEnem.create({
      data: {
        gamification_id: gamification.id,
        fp_amount: fp,
        motivo,
        simulado_id
      }
    });

    return NextResponse.json({
      success: true,
      gamification: {
        total_fp: updatedGamification.total_fp,
        current_streak: updatedGamification.current_streak,
        best_streak: updatedGamification.best_streak,
        fp_adicionado: fp
      }
    });

  } catch (error) {
    console.error('Erro ao adicionar FP:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
