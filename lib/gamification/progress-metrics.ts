/**
 * 📊 PROGRESS METRICS - UTILITÁRIOS PARA GAMIFICAÇÃO
 *
 * Este arquivo contém funções para calcular métricas de consistência
 * e engajamento do usuário com o sistema de fotos de evolução.
 *
 * FUTURO: Estas métricas serão usadas para:
 * - Ranking global NutriFitCoach (NFC Score)
 * - Sistema de badges e conquistas
 * - Feed social interno (opt-in)
 * - Recompensas por consistência
 */

// ============================================================
// TIPOS E INTERFACES
// ============================================================

export interface ProgressSession {
  id: string;
  sessionDate: string;
  weightKg: number;
  heightCm: number;
  bodyFatPercent: number | null;
  isComplete: boolean;
  photosCount: number;
}

export interface ConsistencyMetrics {
  totalSessions: number;
  completeSessions: number;
  sessionsLast30Days: number;
  sessionsLast60Days: number;
  sessionsLast90Days: number;
  averageIntervalDays: number | null;
  longestStreakDays: number;
  currentStreakDays: number;
  daysSinceLastSession: number | null;
  consistencyScore: number; // 0-100
}

export interface ProgressMetrics {
  totalWeightChangeLbs: number;
  totalBodyFatChange: number | null;
  averageWeeklyProgress: number | null;
  daysTracking: number;
}

export interface GamificationData {
  consistency: ConsistencyMetrics;
  progress: ProgressMetrics;
  nextMilestone: string;
  motivationalMessage: string;
}

// ============================================================
// CÁLCULO DE CONSISTÊNCIA
// ============================================================

/**
 * Calcula métricas de consistência do usuário
 *
 * FUTURO: Esta pontuação será usada no ranking global
 * Fatores considerados:
 * - Frequência de registros (peso maior)
 * - Completude das sessões (4 fotos)
 * - Regularidade (intervalos consistentes)
 * - Streak (sequência sem quebras)
 */
export function calculateConsistencyMetrics(sessions: ProgressSession[]): ConsistencyMetrics {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      completeSessions: 0,
      sessionsLast30Days: 0,
      sessionsLast60Days: 0,
      sessionsLast90Days: 0,
      averageIntervalDays: null,
      longestStreakDays: 0,
      currentStreakDays: 0,
      daysSinceLastSession: null,
      consistencyScore: 0
    };
  }

  const now = new Date();
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
  );

  // Contadores básicos
  const totalSessions = sessions.length;
  const completeSessions = sessions.filter(s => s.isComplete).length;

  // Sessões nos últimos X dias
  const sessionsLast30Days = sessions.filter(s => {
    const daysDiff = (now.getTime() - new Date(s.sessionDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  }).length;

  const sessionsLast60Days = sessions.filter(s => {
    const daysDiff = (now.getTime() - new Date(s.sessionDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 60;
  }).length;

  const sessionsLast90Days = sessions.filter(s => {
    const daysDiff = (now.getTime() - new Date(s.sessionDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 90;
  }).length;

  // Intervalo médio entre sessões
  let averageIntervalDays: number | null = null;
  if (sortedSessions.length >= 2) {
    const intervals: number[] = [];
    for (let i = 0; i < sortedSessions.length - 1; i++) {
      const current = new Date(sortedSessions[i].sessionDate);
      const next = new Date(sortedSessions[i + 1].sessionDate);
      const intervalDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(intervalDays);
    }
    averageIntervalDays = Math.round(
      intervals.reduce((sum, val) => sum + val, 0) / intervals.length
    );
  }

  // Streak (sequência de registros regulares)
  const { longestStreak, currentStreak } = calculateStreaks(sortedSessions);

  // Dias desde última sessão
  const daysSinceLastSession = sortedSessions.length > 0
    ? Math.floor((now.getTime() - new Date(sortedSessions[0].sessionDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // PONTUAÇÃO DE CONSISTÊNCIA (0-100)
  // FUTURO: Ajustar pesos conforme feedback dos usuários
  const consistencyScore = calculateConsistencyScore({
    totalSessions,
    completeSessions,
    sessionsLast30Days,
    averageIntervalDays,
    currentStreak
  });

  return {
    totalSessions,
    completeSessions,
    sessionsLast30Days,
    sessionsLast60Days,
    sessionsLast90Days,
    averageIntervalDays,
    longestStreakDays: longestStreak,
    currentStreakDays: currentStreak,
    daysSinceLastSession,
    consistencyScore
  };
}

/**
 * Calcula streaks (sequências de registros regulares)
 * Considera "regular" se o intervalo for <= 45 dias
 *
 * FUTURO: Gamificar com badges:
 * - "Semana Dourada" (7 dias)
 * - "Mês Consistente" (30 dias)
 * - "Trimestre Disciplinado" (90 dias)
 */
function calculateStreaks(sortedSessions: ProgressSession[]): {
  longestStreak: number;
  currentStreak: number;
} {
  if (sortedSessions.length === 0) {
    return { longestStreak: 0, currentStreak: 0 };
  }

  const REGULAR_INTERVAL_DAYS = 45; // Considerar "streak" se <= 45 dias
  let currentStreak = 0;
  let longestStreak = 0;
  let streakCount = 0;

  const now = new Date();
  const firstSessionDate = new Date(sortedSessions[0].sessionDate);
  const daysSinceFirst = (now.getTime() - firstSessionDate.getTime()) / (1000 * 60 * 60 * 24);

  // Streak atual
  if (daysSinceFirst <= REGULAR_INTERVAL_DAYS) {
    streakCount = Math.floor(daysSinceFirst);
  }
  currentStreak = streakCount;

  // Calcular longest streak
  for (let i = 0; i < sortedSessions.length - 1; i++) {
    const current = new Date(sortedSessions[i].sessionDate);
    const next = new Date(sortedSessions[i + 1].sessionDate);
    const intervalDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

    if (intervalDays <= REGULAR_INTERVAL_DAYS) {
      streakCount += Math.floor(intervalDays);
      longestStreak = Math.max(longestStreak, streakCount);
    } else {
      streakCount = 0;
    }
  }

  return { longestStreak, currentStreak };
}

/**
 * Calcula pontuação de consistência (0-100)
 *
 * FUTURO: Esta fórmula alimentará o "NFC Score" no ranking
 * Componentes:
 * - 40 pontos: Frequência recente (sessões nos últimos 30 dias)
 * - 20 pontos: Completude (sessões com 4 fotos)
 * - 20 pontos: Regularidade (intervalo médio ideal ~30 dias)
 * - 20 pontos: Streak atual
 */
function calculateConsistencyScore(metrics: {
  totalSessions: number;
  completeSessions: number;
  sessionsLast30Days: number;
  averageIntervalDays: number | null;
  currentStreak: number;
}): number {
  let score = 0;

  // 1. Frequência recente (0-40 pontos)
  // Ideal: 1+ sessão nos últimos 30 dias
  const frequencyScore = Math.min(40, metrics.sessionsLast30Days * 20);
  score += frequencyScore;

  // 2. Completude (0-20 pontos)
  // % de sessões completas (4 fotos)
  if (metrics.totalSessions > 0) {
    const completenessRatio = metrics.completeSessions / metrics.totalSessions;
    score += completenessRatio * 20;
  }

  // 3. Regularidade (0-20 pontos)
  // Ideal: intervalo médio de ~30 dias (range 20-40 dias)
  if (metrics.averageIntervalDays !== null) {
    const idealInterval = 30;
    const tolerance = 15;
    const deviation = Math.abs(metrics.averageIntervalDays - idealInterval);
    const regularityScore = Math.max(0, 20 - (deviation / tolerance) * 20);
    score += regularityScore;
  }

  // 4. Streak atual (0-20 pontos)
  // Cada dia de streak = 0.5 ponto (max 40 dias = 20 pontos)
  const streakScore = Math.min(20, (metrics.currentStreak / 40) * 20);
  score += streakScore;

  return Math.round(Math.min(100, score));
}

// ============================================================
// CÁLCULO DE PROGRESSO
// ============================================================

/**
 * Calcula métricas de progresso físico
 *
 * FUTURO: Usar para rankings de "maior transformação":
 * - Maior perda de peso em 30/60/90 dias
 * - Maior redução de BF%
 * - Melhor evolução de composição corporal
 */
export function calculateProgressMetrics(sessions: ProgressSession[]): ProgressMetrics {
  if (!sessions || sessions.length === 0) {
    return {
      totalWeightChangeLbs: 0,
      totalBodyFatChange: null,
      averageWeeklyProgress: null,
      daysTracking: 0
    };
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
  );

  const firstSession = sortedSessions[0];
  const lastSession = sortedSessions[sortedSessions.length - 1];

  // Mudança total de peso
  const totalWeightChangeLbs = lastSession.weightKg - firstSession.weightKg;

  // Mudança total de % gordura
  let totalBodyFatChange: number | null = null;
  if (firstSession.bodyFatPercent !== null && lastSession.bodyFatPercent !== null) {
    totalBodyFatChange = lastSession.bodyFatPercent - firstSession.bodyFatPercent;
  }

  // Dias de tracking
  const daysTracking = Math.floor(
    (new Date(lastSession.sessionDate).getTime() - new Date(firstSession.sessionDate).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  // Progresso médio semanal
  let averageWeeklyProgress: number | null = null;
  if (daysTracking >= 7) {
    const weeks = daysTracking / 7;
    averageWeeklyProgress = totalWeightChangeLbs / weeks;
  }

  return {
    totalWeightChangeLbs,
    totalBodyFatChange,
    averageWeeklyProgress,
    daysTracking
  };
}

// ============================================================
// GAMIFICAÇÃO - MENSAGENS E MILESTONES
// ============================================================

/**
 * Gera mensagem motivacional baseada nas métricas
 *
 * FUTURO: Integrar com sistema de notificações push
 */
export function getMotivationalMessage(consistency: ConsistencyMetrics): string {
  const { totalSessions, daysSinceLastSession, consistencyScore, currentStreakDays } = consistency;

  // Primeira sessão
  if (totalSessions === 0) {
    return "Comece hoje sua jornada de transformação! 💪";
  }

  // Sem registros recentes
  if (daysSinceLastSession !== null && daysSinceLastSession > 60) {
    return "Sentimos sua falta! Que tal registrar sua evolução hoje? 📸";
  }

  // Streak ativo
  if (currentStreakDays >= 30) {
    return `Incrível! ${currentStreakDays} dias de consistência! Continue assim! 🔥`;
  }

  // Boa consistência
  if (consistencyScore >= 70) {
    return "Você está no caminho certo! Sua disciplina é inspiradora! ⭐";
  }

  // Consistência média
  if (consistencyScore >= 40) {
    return "Continue registrando sua evolução! Cada passo conta! 🎯";
  }

  // Começando
  return "Você está apenas começando. Vamos juntos nessa jornada! 🚀";
}

/**
 * Determina próximo milestone do usuário
 *
 * FUTURO: Gamificar com badges visuais:
 * - 🥉 Bronze: 3 sessões
 * - 🥈 Prata: 10 sessões
 * - 🥇 Ouro: 25 sessões
 * - 💎 Diamante: 50 sessões
 */
export function getNextMilestone(totalSessions: number): string {
  if (totalSessions === 0) {
    return "Primeira sessão - Comece sua jornada";
  }
  if (totalSessions < 3) {
    return `${3 - totalSessions} sessões até o Badge Bronze 🥉`;
  }
  if (totalSessions < 10) {
    return `${10 - totalSessions} sessões até o Badge Prata 🥈`;
  }
  if (totalSessions < 25) {
    return `${25 - totalSessions} sessões até o Badge Ouro 🥇`;
  }
  if (totalSessions < 50) {
    return `${50 - totalSessions} sessões até o Badge Diamante 💎`;
  }
  return "Você alcançou o nível máximo! Lendário! 👑";
}

/**
 * Calcula dados completos de gamificação
 *
 * FUTURO: Esta função será chamada por:
 * - Dashboard principal (widget de progresso)
 * - Página de ranking/leaderboard
 * - Sistema de notificações
 * - Feed social (se usuário optar por compartilhar)
 */
export function calculateGamificationData(sessions: ProgressSession[]): GamificationData {
  const consistency = calculateConsistencyMetrics(sessions);
  const progress = calculateProgressMetrics(sessions);
  const nextMilestone = getNextMilestone(consistency.totalSessions);
  const motivationalMessage = getMotivationalMessage(consistency);

  return {
    consistency,
    progress,
    nextMilestone,
    motivationalMessage
  };
}

// ============================================================
// UTILITÁRIOS DE FORMATAÇÃO
// ============================================================

/**
 * Formata mudança de peso com sinal e cor
 */
export function formatWeightChange(changeKg: number): {
  text: string;
  color: 'green' | 'red' | 'gray';
  icon: string;
} {
  if (changeKg === 0) {
    return { text: 'Sem mudança', color: 'gray', icon: '➖' };
  }
  if (changeKg < 0) {
    return {
      text: `${Math.abs(changeKg).toFixed(1)} kg perdidos`,
      color: 'green',
      icon: '📉'
    };
  }
  return {
    text: `+${changeKg.toFixed(1)} kg ganhos`,
    color: 'red',
    icon: '📈'
  };
}

/**
 * Formata mudança de % gordura com sinal e cor
 */
export function formatBodyFatChange(changeBF: number | null): {
  text: string;
  color: 'green' | 'red' | 'gray';
  icon: string;
} {
  if (changeBF === null) {
    return { text: 'Não informado', color: 'gray', icon: '❓' };
  }
  if (changeBF === 0) {
    return { text: 'Sem mudança', color: 'gray', icon: '➖' };
  }
  if (changeBF < 0) {
    return {
      text: `${Math.abs(changeBF).toFixed(1)}% reduzido`,
      color: 'green',
      icon: '🔥'
    };
  }
  return {
    text: `+${changeBF.toFixed(1)}%`,
    color: 'red',
    icon: '📊'
  };
}

/**
 * Retorna emoji baseado na pontuação de consistência
 *
 * FUTURO: Usar no perfil público do usuário (se opt-in)
 */
export function getConsistencyEmoji(score: number): string {
  if (score >= 90) return '🏆'; // Campeão
  if (score >= 70) return '🔥'; // Em chamas
  if (score >= 50) return '💪'; // Forte
  if (score >= 30) return '🎯'; // Focado
  return '🌱'; // Começando
}
