import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/enem/simulados/compare-score
 * Compara a nota do simulado com uma nota de corte
 *
 * Body esperado:
 * {
 *   simulado_id: string,
 *   nota_corte_curso: string,  // ex: "Medicina - UFMG"
 *   nota_corte_valor: number   // ex: 750
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { simulado_id, nota_corte_curso, nota_corte_valor } = body;

    if (!simulado_id || !nota_corte_curso || nota_corte_valor === undefined) {
      return NextResponse.json(
        { error: 'simulado_id, nota_corte_curso e nota_corte_valor são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar simulado
    const simulado = await prisma.enemSimulado.findUnique({
      where: { id: simulado_id }
    });

    if (!simulado) {
      return NextResponse.json(
        { error: 'Simulado não encontrado' },
        { status: 404 }
      );
    }

    if (!simulado.nota_final) {
      return NextResponse.json(
        { error: 'Simulado ainda não foi finalizado' },
        { status: 400 }
      );
    }

    const notaUsuario = simulado.nota_final.toNumber();
    const passou = notaUsuario >= nota_corte_valor;
    const diferencaPontos = new Decimal(notaUsuario - nota_corte_valor);

    // Calcular percentil (posição em relação a outros usuários)
    const totalSimulados = await prisma.enemSimulado.count({
      where: {
        status: 'finalizado',
        nota_final: { not: null }
      }
    });

    const simuladosAbaixo = await prisma.enemSimulado.count({
      where: {
        status: 'finalizado',
        nota_final: {
          lt: simulado.nota_final
        }
      }
    });

    const percentil = totalSimulados > 0
      ? new Decimal((simuladosAbaixo / totalSimulados) * 100)
      : new Decimal(0);

    // Criar ou atualizar comparação
    const comparacao = await prisma.enemComparacao.upsert({
      where: { simulado_id },
      update: {
        nota_corte_curso,
        nota_corte_valor: new Decimal(nota_corte_valor),
        passou,
        diferenca_pontos: diferencaPontos,
        percentil
      },
      create: {
        simulado_id,
        nota_corte_curso,
        nota_corte_valor: new Decimal(nota_corte_valor),
        passou,
        diferenca_pontos: diferencaPontos,
        percentil
      }
    });

    // Se passou na nota de corte, desbloquear conquista
    if (passou) {
      await unlockAchievementNotaCorte(simulado.user_id);
    }

    return NextResponse.json({
      success: true,
      comparacao: {
        nota_usuario: notaUsuario,
        nota_corte_curso,
        nota_corte_valor,
        passou,
        diferenca_pontos: diferencaPontos.toNumber(),
        percentil: percentil.toNumber(),
        mensagem: passou
          ? `Parabéns! Você passou na nota de corte de ${nota_corte_curso} com ${diferencaPontos.toNumber().toFixed(1)} pontos de vantagem!`
          : `Faltaram ${Math.abs(diferencaPontos.toNumber()).toFixed(1)} pontos para atingir a nota de corte de ${nota_corte_curso}. Continue estudando!`
      }
    });

  } catch (error) {
    console.error('Erro ao comparar nota:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * Desbloqueia conquista de nota de corte
 */
async function unlockAchievementNotaCorte(userId: string) {
  try {
    const gamification = await prisma.userGamificationEnem.findUnique({
      where: { user_id: userId },
      include: { achievements: true }
    });

    if (!gamification) return;

    const hasAchievement = gamification.achievements.some(a => a.code === 'BATEU_NOTA_CORTE');

    if (!hasAchievement) {
      await prisma.userAchievementEnem.create({
        data: {
          gamification_id: gamification.id,
          code: 'BATEU_NOTA_CORTE',
          title: 'Acima da Nota de Corte',
          description: 'Atingiu a nota de corte do curso desejado!'
        }
      });
    }
  } catch (error) {
    console.error('Erro ao desbloquear conquista:', error);
  }
}
