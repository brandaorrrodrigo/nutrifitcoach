import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/enem/ranking/global?user_id=xxx
 * Retorna o ranking global dos usuários baseado em total_fp
 * - Top 50 usuários
 * - Posição do usuário atual (mesmo que não esteja no top 50)
 * Cache: 60 segundos
 */
export const revalidate = 60; // Revalidar a cada 60 segundos

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

    // Buscar top 50 usuários ordenados por total_fp
    const topUsers = await prisma.userGamificationEnem.findMany({
      where: {
        total_fp: {
          gt: 0 // Apenas usuários com FP > 0
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            display_name: true,
            avatar_url: true,
            is_founder: true
          }
        }
      },
      orderBy: {
        total_fp: 'desc'
      },
      take: 50
    });

    // Mapear usuários para o formato de resposta
    const rankingList = topUsers.map((gamification, index) => ({
      position: index + 1,
      user_id: gamification.user_id,
      display_name: gamification.user.display_name || gamification.user.email.split('@')[0],
      avatar_url: gamification.user.avatar_url,
      is_founder: gamification.user.is_founder,
      total_fp: gamification.total_fp,
      current_streak: gamification.current_streak,
      best_streak: gamification.best_streak,
      level: getLevelByFP(gamification.total_fp)
    }));

    // Verificar se o usuário atual está no top 50
    const currentUserInTop50 = rankingList.find(u => u.user_id === userId);

    let currentUserPosition = null;

    // Se o usuário não está no top 50, buscar sua posição
    if (!currentUserInTop50) {
      const currentUserGamification = await prisma.userGamificationEnem.findUnique({
        where: { user_id: userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              display_name: true,
              avatar_url: true,
              is_founder: true
            }
          }
        }
      });

      if (currentUserGamification) {
        // Contar quantos usuários têm mais FP que o usuário atual
        const usersAbove = await prisma.userGamificationEnem.count({
          where: {
            total_fp: {
              gt: currentUserGamification.total_fp
            }
          }
        });

        currentUserPosition = {
          position: usersAbove + 1,
          user_id: currentUserGamification.user_id,
          display_name: currentUserGamification.user.display_name || currentUserGamification.user.email.split('@')[0],
          avatar_url: currentUserGamification.user.avatar_url,
          is_founder: currentUserGamification.user.is_founder,
          total_fp: currentUserGamification.total_fp,
          current_streak: currentUserGamification.current_streak,
          best_streak: currentUserGamification.best_streak,
          level: getLevelByFP(currentUserGamification.total_fp)
        };
      } else {
        // Usuário não tem gamificação ainda
        const user = await prisma.appUser.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            display_name: true,
            avatar_url: true,
            is_founder: true
          }
        });

        if (user) {
          // Contar total de usuários com gamificação
          const totalUsers = await prisma.userGamificationEnem.count();

          currentUserPosition = {
            position: totalUsers + 1,
            user_id: user.id,
            display_name: user.display_name || user.email.split('@')[0],
            avatar_url: user.avatar_url,
            is_founder: user.is_founder,
            total_fp: 0,
            current_streak: 0,
            best_streak: 0,
            level: getLevelByFP(0)
          };
        }
      }
    } else {
      currentUserPosition = currentUserInTop50;
    }

    // Estatísticas gerais
    const totalUsers = await prisma.userGamificationEnem.count({
      where: {
        total_fp: {
          gt: 0
        }
      }
    });

    return NextResponse.json({
      success: true,
      ranking: rankingList,
      current_user: currentUserPosition,
      total_users: totalUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar ranking global:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * Determina o nível do usuário baseado no total de FP
 */
function getLevelByFP(totalFP: number): {
  name: string;
  color: string;
  icon: string;
  min_fp: number;
  max_fp: number | null;
} {
  if (totalFP >= 10000) {
    return {
      name: 'Diamond',
      color: 'cyan',
      icon: '💎',
      min_fp: 10000,
      max_fp: null
    };
  } else if (totalFP >= 5000) {
    return {
      name: 'Platinum',
      color: 'gray',
      icon: '🏆',
      min_fp: 5000,
      max_fp: 9999
    };
  } else if (totalFP >= 2000) {
    return {
      name: 'Gold',
      color: 'yellow',
      icon: '🥇',
      min_fp: 2000,
      max_fp: 4999
    };
  } else if (totalFP >= 500) {
    return {
      name: 'Silver',
      color: 'gray',
      icon: '🥈',
      min_fp: 500,
      max_fp: 1999
    };
  } else {
    return {
      name: 'Bronze',
      color: 'orange',
      icon: '🥉',
      min_fp: 0,
      max_fp: 499
    };
  }
}
