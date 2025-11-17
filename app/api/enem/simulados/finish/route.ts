import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/enem/simulados/finish
 * Finaliza um simulado e calcula a nota
 *
 * Body esperado:
 * {
 *   simulado_id: string,
 *   tempo_total_minutos?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { simulado_id, tempo_total_minutos } = body;

    if (!simulado_id) {
      return NextResponse.json(
        { error: 'simulado_id é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar simulado com respostas
    const simulado = await prisma.enemSimulado.findUnique({
      where: { id: simulado_id },
      include: {
        respostas: true
      }
    });

    if (!simulado) {
      return NextResponse.json(
        { error: 'Simulado não encontrado' },
        { status: 404 }
      );
    }

    if (simulado.status === 'finalizado') {
      return NextResponse.json(
        { error: 'Simulado já foi finalizado' },
        { status: 400 }
      );
    }

    // Calcular nota (pontuação simples: 1000 pontos / total de questões)
    const totalQuestoes = simulado.total_questions;
    const acertos = simulado.respostas.filter(r => r.correta).length;
    const notaFinal = new Decimal((acertos / totalQuestoes) * 1000);

    // Atualizar simulado
    const simuladoAtualizado = await prisma.enemSimulado.update({
      where: { id: simulado_id },
      data: {
        status: 'finalizado',
        finished_at: new Date(),
        nota_final: notaFinal,
        tempo_total_minutos
      },
      include: {
        respostas: {
          include: {
            questao: true
          }
        }
      }
    });

    // Adicionar FP pela conclusão do simulado
    await addFPForSimulado(simulado.user_id, simulado_id, notaFinal.toNumber());

    // Verificar conquistas
    await checkAndUnlockAchievements(simulado.user_id, simulado_id, notaFinal.toNumber(), acertos);

    return NextResponse.json({
      success: true,
      simulado_id: simulado.id,
      nota_final: notaFinal.toNumber(),
      acertos,
      total_questoes: totalQuestoes,
      percentual: (acertos / totalQuestoes) * 100,
      finished_at: simuladoAtualizado.finished_at,
      respostas: simuladoAtualizado.respostas.map(r => ({
        questao_numero: r.questao.numero,
        resposta_user: r.resposta_user,
        gabarito: r.questao.gabarito,
        correta: r.correta,
        area: r.questao.area,
        disciplina: r.questao.disciplina
      }))
    });

  } catch (error) {
    console.error('Erro ao finalizar simulado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * Adiciona FP ao usuário pela conclusão do simulado
 */
async function addFPForSimulado(userId: string, simuladoId: string, nota: number) {
  try {
    // Buscar ou criar gamificação do usuário
    let gamification = await prisma.userGamificationEnem.findUnique({
      where: { user_id: userId }
    });

    if (!gamification) {
      gamification = await prisma.userGamificationEnem.create({
        data: {
          user_id: userId,
          total_fp: 0,
          current_streak: 0,
          best_streak: 0
        }
      });
    }

    // Calcular FP (base 100 + bônus por nota)
    const fpBase = 100;
    const fpBonus = Math.floor(nota / 10); // 1 FP a cada 10 pontos de nota
    const fpTotal = fpBase + fpBonus;

    // Atualizar streak
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

    // Atualizar gamificação
    await prisma.userGamificationEnem.update({
      where: { id: gamification.id },
      data: {
        total_fp: gamification.total_fp + fpTotal,
        current_streak: newStreak,
        best_streak: newBestStreak,
        last_activity: new Date()
      }
    });

    // Registrar no histórico
    await prisma.fPHistoryEnem.create({
      data: {
        gamification_id: gamification.id,
        fp_amount: fpTotal,
        motivo: `Simulado concluído - Nota: ${nota.toFixed(0)}`,
        simulado_id: simuladoId
      }
    });

  } catch (error) {
    console.error('Erro ao adicionar FP:', error);
  }
}

/**
 * Verifica e desbloqueia conquistas
 */
async function checkAndUnlockAchievements(userId: string, simuladoId: string, nota: number, acertos: number) {
  try {
    const gamification = await prisma.userGamificationEnem.findUnique({
      where: { user_id: userId },
      include: {
        achievements: true
      }
    });

    if (!gamification) return;

    // Contar total de simulados finalizados
    const totalSimulados = await prisma.enemSimulado.count({
      where: {
        user_id: userId,
        status: 'finalizado'
      }
    });

    const achievements: { code: string; title: string; description: string }[] = [];

    // Conquista: Primeiro Simulado
    const hasFirstSimulado = gamification.achievements.some(a => a.code === 'PRIMEIRO_SIMULADO');
    if (!hasFirstSimulado) {
      achievements.push({
        code: 'PRIMEIRO_SIMULADO',
        title: 'Primeira Jornada',
        description: 'Completou seu primeiro simulado!'
      });
    }

    // Conquista: 5 Simulados
    const has5Simulados = gamification.achievements.some(a => a.code === '5_SIMULADOS');
    if (!has5Simulados && totalSimulados >= 5) {
      achievements.push({
        code: '5_SIMULADOS',
        title: 'Estudante Dedicado',
        description: 'Completou 5 simulados!'
      });
    }

    // Conquista: 10 Simulados
    const has10Simulados = gamification.achievements.some(a => a.code === '10_SIMULADOS');
    if (!has10Simulados && totalSimulados >= 10) {
      achievements.push({
        code: '10_SIMULADOS',
        title: 'Veterano',
        description: 'Completou 10 simulados!'
      });
    }

    // Conquista: 25 Simulados
    const has25Simulados = gamification.achievements.some(a => a.code === '25_SIMULADOS');
    if (!has25Simulados && totalSimulados >= 25) {
      achievements.push({
        code: '25_SIMULADOS',
        title: 'Expert em Simulados',
        description: 'Completou 25 simulados!'
      });
    }

    // Conquista: 50 Simulados
    const has50Simulados = gamification.achievements.some(a => a.code === '50_SIMULADOS');
    if (!has50Simulados && totalSimulados >= 50) {
      achievements.push({
        code: '50_SIMULADOS',
        title: 'Mestre dos Simulados',
        description: 'Completou 50 simulados!'
      });
    }

    // Conquista: Bateu nota de corte (700 pontos)
    const hasNotaCorte = gamification.achievements.some(a => a.code === 'BATEU_NOTA_CORTE');
    if (!hasNotaCorte && nota >= 700) {
      achievements.push({
        code: 'BATEU_NOTA_CORTE',
        title: 'Acima da Média',
        description: 'Atingiu nota acima de 700 pontos!'
      });
    }

    // Conquista: Nota 800+
    const hasNota800 = gamification.achievements.some(a => a.code === 'NOTA_800');
    if (!hasNota800 && nota >= 800) {
      achievements.push({
        code: 'NOTA_800',
        title: 'Destaque Nacional',
        description: 'Atingiu nota acima de 800 pontos!'
      });
    }

    // Conquista: Nota 900+
    const hasNota900 = gamification.achievements.some(a => a.code === 'NOTA_900');
    if (!hasNota900 && nota >= 900) {
      achievements.push({
        code: 'NOTA_900',
        title: 'Elite Acadêmica',
        description: 'Atingiu nota acima de 900 pontos!'
      });
    }

    // Conquista: Nota máxima (950+)
    const hasNotaMaxima = gamification.achievements.some(a => a.code === 'NOTA_MAXIMA');
    if (!hasNotaMaxima && nota >= 950) {
      achievements.push({
        code: 'NOTA_MAXIMA',
        title: 'Excelência Total',
        description: 'Nota acima de 950 pontos! Perfeição!'
      });
    }

    // Conquista: Gabaritou (100% de acertos)
    const percentual = (acertos / 45) * 100;
    const hasGabarito = gamification.achievements.some(a => a.code === 'GABARITO');
    if (!hasGabarito && percentual === 100) {
      achievements.push({
        code: 'GABARITO',
        title: 'Gabaritou!',
        description: '100% de acertos! Parabéns!'
      });
    }

    // Conquista: Quase Perfeito (95%+)
    const hasQuasePerfeito = gamification.achievements.some(a => a.code === 'QUASE_PERFEITO');
    if (!hasQuasePerfeito && percentual >= 95 && percentual < 100) {
      achievements.push({
        code: 'QUASE_PERFEITO',
        title: 'Quase Perfeito',
        description: 'Mais de 95% de acertos!'
      });
    }

    // Conquista: Sequência de 7 dias
    const hasSequencia7 = gamification.achievements.some(a => a.code === 'SEQUENCIA_7_DIAS');
    if (!hasSequencia7 && gamification.current_streak >= 7) {
      achievements.push({
        code: 'SEQUENCIA_7_DIAS',
        title: 'Persistente',
        description: 'Estudou por 7 dias seguidos!'
      });
    }

    // Conquista: Sequência de 30 dias
    const hasSequencia30 = gamification.achievements.some(a => a.code === 'SEQUENCIA_30_DIAS');
    if (!hasSequencia30 && gamification.current_streak >= 30) {
      achievements.push({
        code: 'SEQUENCIA_30_DIAS',
        title: 'Dedicado',
        description: 'Estudou por 30 dias seguidos!'
      });
    }

    // Conquista: Sequência de 100 dias
    const hasSequencia100 = gamification.achievements.some(a => a.code === 'SEQUENCIA_100_DIAS');
    if (!hasSequencia100 && gamification.current_streak >= 100) {
      achievements.push({
        code: 'SEQUENCIA_100_DIAS',
        title: 'Lenda dos Estudos',
        description: 'Estudou por 100 dias seguidos!'
      });
    }

    // Inserir conquistas
    for (const achievement of achievements) {
      await prisma.userAchievementEnem.create({
        data: {
          gamification_id: gamification.id,
          ...achievement
        }
      });
    }

  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
  }
}
