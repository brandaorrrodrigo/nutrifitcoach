import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/enem/gamificacao/unlock-achievement
 * Desbloqueia uma conquista para o usuário
 *
 * Body esperado:
 * {
 *   user_id: string,
 *   code: string,        // ex: "PRIMEIRO_SIMULADO"
 *   title?: string,      // opcional, será usado se fornecido
 *   description?: string // opcional, será usado se fornecido
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, code, title, description } = body;

    if (!user_id || !code) {
      return NextResponse.json(
        { error: 'user_id e code são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar ou criar gamificação do usuário
    let gamification = await prisma.userGamificationEnem.findUnique({
      where: { user_id },
      include: {
        achievements: true
      }
    });

    if (!gamification) {
      gamification = await prisma.userGamificationEnem.create({
        data: {
          user_id,
          total_fp: 0,
          current_streak: 0,
          best_streak: 0
        },
        include: {
          achievements: true
        }
      });
    }

    // Verificar se conquista já foi desbloqueada
    const existingAchievement = gamification.achievements.find(a => a.code === code);

    if (existingAchievement) {
      return NextResponse.json({
        success: false,
        message: 'Conquista já desbloqueada anteriormente',
        achievement: {
          code: existingAchievement.code,
          title: existingAchievement.title,
          description: existingAchievement.description,
          unlocked_at: existingAchievement.unlocked_at
        }
      });
    }

    // Definir títulos e descrições padrão
    const achievementData = getAchievementData(code, title, description);

    // Criar conquista
    const achievement = await prisma.userAchievementEnem.create({
      data: {
        gamification_id: gamification.id,
        code,
        title: achievementData.title,
        description: achievementData.description
      }
    });

    // Adicionar FP bônus por conquista desbloqueada
    await prisma.userGamificationEnem.update({
      where: { id: gamification.id },
      data: {
        total_fp: gamification.total_fp + 50 // 50 FP por conquista
      }
    });

    await prisma.fPHistoryEnem.create({
      data: {
        gamification_id: gamification.id,
        fp_amount: 50,
        motivo: `Conquista desbloqueada: ${achievementData.title}`
      }
    });

    return NextResponse.json({
      success: true,
      new_achievement: true,
      achievement: {
        code: achievement.code,
        title: achievement.title,
        description: achievement.description,
        unlocked_at: achievement.unlocked_at
      },
      fp_bonus: 50
    });

  } catch (error) {
    console.error('Erro ao desbloquear conquista:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * Retorna dados padrão de conquistas
 */
function getAchievementData(code: string, customTitle?: string, customDescription?: string) {
  const defaults: Record<string, { title: string; description: string }> = {
    'PRIMEIRO_SIMULADO': {
      title: 'Primeira Jornada',
      description: 'Completou seu primeiro simulado!'
    },
    'BATEU_NOTA_CORTE': {
      title: 'Acima da Média',
      description: 'Atingiu a nota de corte do curso desejado!'
    },
    'NOTA_MAXIMA': {
      title: 'Excelência Total',
      description: 'Nota acima de 950 pontos!'
    },
    'SEQUENCIA_7_DIAS': {
      title: 'Persistente',
      description: 'Estudou por 7 dias seguidos!'
    },
    'SEQUENCIA_30_DIAS': {
      title: 'Dedicado',
      description: 'Estudou por 30 dias seguidos!'
    },
    '10_SIMULADOS': {
      title: 'Veterano',
      description: 'Completou 10 simulados!'
    },
    '50_SIMULADOS': {
      title: 'Mestre dos Simulados',
      description: 'Completou 50 simulados!'
    }
  };

  const defaultData = defaults[code] || {
    title: 'Conquista Desbloqueada',
    description: 'Você alcançou um novo objetivo!'
  };

  return {
    title: customTitle || defaultData.title,
    description: customDescription || defaultData.description
  };
}
