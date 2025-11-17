/**
 * Sistema de Níveis ENEM - Baseado em Focus Points (FP)
 *
 * Níveis:
 * - Bronze:    0 - 499 FP
 * - Silver:    500 - 1,999 FP
 * - Gold:      2,000 - 4,999 FP
 * - Platinum:  5,000 - 9,999 FP
 * - Diamond:   10,000+ FP
 */

export type Level = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface LevelInfo {
  level: Level;
  minFP: number;
  maxFP: number | null; // null = sem limite superior
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
  nextLevel: Level | null;
  nextLevelFP: number | null;
  progressToNext: number; // 0-100
}

const LEVEL_THRESHOLDS: Record<Level, { min: number; max: number | null }> = {
  Bronze: { min: 0, max: 499 },
  Silver: { min: 500, max: 1999 },
  Gold: { min: 2000, max: 4999 },
  Platinum: { min: 5000, max: 9999 },
  Diamond: { min: 10000, max: null }
};

const LEVEL_COLORS: Record<Level, {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
}> = {
  Bronze: {
    color: 'amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-800',
    icon: '🥉'
  },
  Silver: {
    color: 'slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-800',
    icon: '🥈'
  },
  Gold: {
    color: 'yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-900',
    icon: '🥇'
  },
  Platinum: {
    color: 'cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-900',
    icon: '💎'
  },
  Diamond: {
    color: 'violet-600',
    bgColor: 'bg-violet-100',
    borderColor: 'border-violet-400',
    textColor: 'text-violet-900',
    icon: '👑'
  }
};

/**
 * Retorna o nível baseado no FP total
 */
export function getLevelFromFP(totalFP: number): Level {
  if (totalFP >= LEVEL_THRESHOLDS.Diamond.min) return 'Diamond';
  if (totalFP >= LEVEL_THRESHOLDS.Platinum.min) return 'Platinum';
  if (totalFP >= LEVEL_THRESHOLDS.Gold.min) return 'Gold';
  if (totalFP >= LEVEL_THRESHOLDS.Silver.min) return 'Silver';
  return 'Bronze';
}

/**
 * Retorna informações completas sobre o nível atual
 */
export function getLevelInfo(totalFP: number): LevelInfo {
  const level = getLevelFromFP(totalFP);
  const threshold = LEVEL_THRESHOLDS[level];
  const colors = LEVEL_COLORS[level];

  // Determinar próximo nível
  let nextLevel: Level | null = null;
  let nextLevelFP: number | null = null;

  const levels: Level[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentIndex = levels.indexOf(level);

  if (currentIndex < levels.length - 1) {
    nextLevel = levels[currentIndex + 1];
    nextLevelFP = LEVEL_THRESHOLDS[nextLevel].min;
  }

  // Calcular progresso para o próximo nível
  let progressToNext = 0;
  if (nextLevelFP !== null) {
    const currentLevelMin = threshold.min;
    const fpInCurrentLevel = totalFP - currentLevelMin;
    const fpNeededForNext = nextLevelFP - currentLevelMin;
    progressToNext = Math.min(100, (fpInCurrentLevel / fpNeededForNext) * 100);
  } else {
    // Já está no nível máximo
    progressToNext = 100;
  }

  return {
    level,
    minFP: threshold.min,
    maxFP: threshold.max,
    color: colors.color,
    bgColor: colors.bgColor,
    borderColor: colors.borderColor,
    textColor: colors.textColor,
    icon: colors.icon,
    nextLevel,
    nextLevelFP,
    progressToNext
  };
}

/**
 * Retorna as cores de um nível específico
 */
export function getLevelColors(level: Level) {
  return LEVEL_COLORS[level];
}

/**
 * Retorna o ícone de um nível
 */
export function getLevelIcon(level: Level): string {
  return LEVEL_COLORS[level].icon;
}

/**
 * Retorna o nome em português do nível
 */
export function getLevelNamePtBR(level: Level): string {
  const names: Record<Level, string> = {
    Bronze: 'Bronze',
    Silver: 'Prata',
    Gold: 'Ouro',
    Platinum: 'Platina',
    Diamond: 'Diamante'
  };
  return names[level];
}

/**
 * Retorna quantos FP faltam para o próximo nível
 */
export function getFPToNextLevel(totalFP: number): number | null {
  const info = getLevelInfo(totalFP);
  if (info.nextLevelFP === null) return null;
  return Math.max(0, info.nextLevelFP - totalFP);
}

/**
 * Verifica se o usuário subiu de nível
 */
export function checkLevelUp(oldFP: number, newFP: number): {
  leveledUp: boolean;
  oldLevel: Level;
  newLevel: Level;
} {
  const oldLevel = getLevelFromFP(oldFP);
  const newLevel = getLevelFromFP(newFP);

  return {
    leveledUp: oldLevel !== newLevel,
    oldLevel,
    newLevel
  };
}

/**
 * Retorna todos os níveis disponíveis
 */
export function getAllLevels(): Level[] {
  return ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
}

/**
 * Retorna estatísticas de um nível
 */
export function getLevelStats(level: Level) {
  const threshold = LEVEL_THRESHOLDS[level];
  const colors = LEVEL_COLORS[level];

  return {
    level,
    minFP: threshold.min,
    maxFP: threshold.max,
    ...colors
  };
}
