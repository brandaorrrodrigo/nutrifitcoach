# 📘 EXEMPLOS DE USO - Progress Metrics

Guia prático para usar a biblioteca de gamificação.

---

## 🚀 IMPORTAÇÃO

```typescript
import {
  calculateGamificationData,
  calculateConsistencyMetrics,
  calculateProgressMetrics,
  getMotivationalMessage,
  getNextMilestone,
  getConsistencyEmoji,
  formatWeightChange,
  formatBodyFatChange
} from '@/lib/gamification/progress-metrics';
```

---

## 📊 EXEMPLO 1: Calcular Métricas Completas

```typescript
// Em um componente React
const [sessions, setSessions] = useState<ProgressSession[]>([]);

useEffect(() => {
  // Buscar sessões do usuário
  fetch('/api/progress-photos/sessions')
    .then(res => res.json())
    .then(data => setSessions(data.sessions));
}, []);

// Calcular gamificação
const gamification = calculateGamificationData(sessions);

console.log(gamification);
/* Retorna:
{
  consistency: {
    totalSessions: 5,
    completeSessions: 4,
    sessionsLast30Days: 2,
    sessionsLast60Days: 3,
    sessionsLast90Days: 5,
    averageIntervalDays: 28,
    longestStreakDays: 45,
    currentStreakDays: 30,
    daysSinceLastSession: 12,
    consistencyScore: 75
  },
  progress: {
    totalWeightChangeLbs: -3.5,
    totalBodyFatChange: -2.3,
    averageWeeklyProgress: -0.5,
    daysTracking: 120
  },
  nextMilestone: "5 sessões até o Badge Prata 🥈",
  motivationalMessage: "Você está no caminho certo! Sua disciplina é inspiradora! ⭐"
}
*/
```

---

## 🏆 EXEMPLO 2: Exibir Card de Gamificação

```typescript
function GamificationCard({ sessions }: { sessions: ProgressSession[] }) {
  const gamification = calculateGamificationData(sessions);
  const { consistency, progress, nextMilestone, motivationalMessage } = gamification;
  const emoji = getConsistencyEmoji(consistency.consistencyScore);

  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{emoji}</div>
          <div>
            <h3 className="text-white font-bold text-xl">Sua Jornada</h3>
            <p className="text-purple-300 text-sm">Continue assim!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-purple-300 text-xs">Consistência</div>
          <div className="text-3xl font-bold text-white">
            {consistency.consistencyScore}
          </div>
          <div className="text-purple-400 text-xs">/ 100</div>
        </div>
      </div>

      {/* Mensagem */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6">
        <p className="text-white text-center">{motivationalMessage}</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

        {/* Total de sessões */}
        <MetricCard
          icon="📊"
          value={consistency.totalSessions}
          label="Sessões"
        />

        {/* Dias desde última */}
        <MetricCard
          icon="📅"
          value={consistency.daysSinceLastSession ?? '-'}
          label="Dias atrás"
        />

        {/* Streak */}
        <MetricCard
          icon="🔥"
          value={consistency.currentStreakDays}
          label="Dias seguidos"
        />

        {/* Progresso de peso */}
        <WeightMetricCard progress={progress.totalWeightChangeLbs} />

      </div>

      {/* Próximo milestone */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🏆</span>
          <span className="text-yellow-400 font-semibold text-sm">
            Próximo Badge
          </span>
        </div>
        <p className="text-white text-sm">{nextMilestone}</p>
      </div>

    </div>
  );
}
```

---

## 📈 EXEMPLO 3: Widget de Progresso no Dashboard

```typescript
function ProgressWidget({ sessions }: { sessions: ProgressSession[] }) {
  const { progress } = calculateGamificationData(sessions);
  const weightChange = formatWeightChange(progress.totalWeightChangeLbs);
  const bfChange = formatBodyFatChange(progress.totalBodyFatChange);

  return (
    <div className="bg-slate-900 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-4">Seu Progresso</h3>

      {/* Peso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Peso</span>
          <span className="text-2xl">{weightChange.icon}</span>
        </div>
        <div className={`text-xl font-bold text-${weightChange.color}-400`}>
          {weightChange.text}
        </div>
      </div>

      {/* BF% */}
      {bfChange.text !== 'Não informado' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Gordura Corporal</span>
            <span className="text-2xl">{bfChange.icon}</span>
          </div>
          <div className={`text-xl font-bold text-${bfChange.color}-400`}>
            {bfChange.text}
          </div>
        </div>
      )}

      {/* Dias tracking */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-slate-400 text-sm">Acompanhando por</div>
        <div className="text-lg font-bold text-white">
          {progress.daysTracking} dias
        </div>
      </div>

    </div>
  );
}
```

---

## 🎯 EXEMPLO 4: Sistema de Notificações

```typescript
function useGamificationNotifications(sessions: ProgressSession[]) {
  const { consistency } = calculateGamificationData(sessions);

  useEffect(() => {
    // Notificar quando atingir novo milestone
    const previousTotal = localStorage.getItem('previousSessionCount');
    const currentTotal = consistency.totalSessions;

    if (previousTotal && parseInt(previousTotal) < currentTotal) {
      // Novo registro adicionado
      const milestone = getNextMilestone(currentTotal);

      // Verificar se atingiu um badge
      if ([3, 10, 25, 50, 100].includes(currentTotal)) {
        showBadgeNotification(currentTotal);
      }
    }

    localStorage.setItem('previousSessionCount', currentTotal.toString());
  }, [consistency.totalSessions]);

  // Notificar sobre inatividade
  useEffect(() => {
    if (consistency.daysSinceLastSession !== null &&
        consistency.daysSinceLastSession >= 30) {
      showInactivityReminder(consistency.daysSinceLastSession);
    }
  }, [consistency.daysSinceLastSession]);
}

function showBadgeNotification(totalSessions: number) {
  const badges = {
    3: { name: 'Bronze', emoji: '🥉' },
    10: { name: 'Prata', emoji: '🥈' },
    25: { name: 'Ouro', emoji: '🥇' },
    50: { name: 'Diamante', emoji: '💎' },
    100: { name: 'Lendário', emoji: '👑' }
  };

  const badge = badges[totalSessions as keyof typeof badges];

  toast.success(
    `🎉 Parabéns! Você conquistou o Badge ${badge.name} ${badge.emoji}`,
    { duration: 5000 }
  );
}

function showInactivityReminder(days: number) {
  toast(
    `📸 Sentimos sua falta! Já se passaram ${days} dias desde seu último registro.`,
    { icon: '⏰', duration: 10000 }
  );
}
```

---

## 🏅 EXEMPLO 5: Página de Ranking

```typescript
// API Route: app/api/ranking/route.ts
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Buscar todos os usuários com suas sessões
  const users = await prisma.appUser.findMany({
    include: {
      ProgressSession: {
        orderBy: { session_date: 'desc' }
      }
    },
    where: {
      // Apenas usuários que optaram por aparecer no ranking (FUTURO)
      // profile_visibility: 'public'
    }
  });

  // Calcular score de cada usuário
  const ranking = users.map(user => {
    const gamification = calculateGamificationData(user.ProgressSession);
    return {
      userId: user.id,
      name: user.name,
      profilePhoto: user.profile_photo,
      consistencyScore: gamification.consistency.consistencyScore,
      totalSessions: gamification.consistency.totalSessions,
      currentStreak: gamification.consistency.currentStreakDays,
      emoji: getConsistencyEmoji(gamification.consistency.consistencyScore)
    };
  });

  // Ordenar por score
  ranking.sort((a, b) => b.consistencyScore - a.consistencyScore);

  return NextResponse.json({ ranking });
}

// Componente: app/ranking/page.tsx
function RankingPage() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => setRanking(data.ranking));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        🏆 Ranking NutriFitCoach
      </h1>

      <div className="space-y-4">
        {ranking.map((user, index) => (
          <RankingCard
            key={user.userId}
            position={index + 1}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}

function RankingCard({ position, user }) {
  const medalEmoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';

  return (
    <div className={`
      bg-slate-900 rounded-2xl p-6 border
      ${position <= 3 ? 'border-yellow-500/30 shadow-lg shadow-yellow-500/10' : 'border-slate-800'}
    `}>
      <div className="flex items-center gap-4">

        {/* Posição */}
        <div className="text-4xl font-bold text-white w-12">
          {medalEmoji || `#${position}`}
        </div>

        {/* Foto */}
        <img
          src={user.profilePhoto || '/default-avatar.png'}
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{user.name}</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-slate-400 text-sm">
              {user.totalSessions} sessões
            </span>
            <span className="text-slate-400 text-sm">
              🔥 {user.currentStreak} dias
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="text-3xl mb-1">{user.emoji}</div>
          <div className="text-2xl font-bold text-white">
            {user.consistencyScore}
          </div>
          <div className="text-slate-400 text-xs">pontos</div>
        </div>

      </div>
    </div>
  );
}
```

---

## 📱 EXEMPLO 6: Mensagens Dinâmicas

```typescript
function DynamicMessage({ sessions }: { sessions: ProgressSession[] }) {
  const { consistency } = calculateGamificationData(sessions);
  const message = getMotivationalMessage(consistency);
  const emoji = getConsistencyEmoji(consistency.consistencyScore);

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center gap-3">
        <div className="text-4xl">{emoji}</div>
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
}

// Exemplos de mensagens geradas:
// - "Comece hoje sua jornada de transformação! 💪"
// - "Sentimos sua falta! Que tal registrar sua evolução hoje? 📸"
// - "Incrível! 30 dias de consistência! Continue assim! 🔥"
// - "Você está no caminho certo! Sua disciplina é inspiradora! ⭐"
// - "Continue registrando sua evolução! Cada passo conta! 🎯"
```

---

## 🎨 EXEMPLO 7: Badge System (Futuro)

```typescript
// Quando implementar sistema de badges
interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requiredSessions: number;
}

const BADGES: Badge[] = [
  { id: 'bronze', name: 'Bronze', emoji: '🥉', description: 'Primeiras 3 sessões', requiredSessions: 3 },
  { id: 'silver', name: 'Prata', emoji: '🥈', description: '10 sessões registradas', requiredSessions: 10 },
  { id: 'gold', name: 'Ouro', emoji: '🥇', description: '25 sessões registradas', requiredSessions: 25 },
  { id: 'diamond', name: 'Diamante', emoji: '💎', description: '50 sessões registradas', requiredSessions: 50 },
  { id: 'legendary', name: 'Lendário', emoji: '👑', description: '100 sessões registradas', requiredSessions: 100 }
];

function BadgeDisplay({ sessions }: { sessions: ProgressSession[] }) {
  const totalSessions = sessions.length;

  const earnedBadges = BADGES.filter(badge => totalSessions >= badge.requiredSessions);
  const nextBadge = BADGES.find(badge => totalSessions < badge.requiredSessions);

  return (
    <div className="bg-slate-900 rounded-2xl p-6">
      <h3 className="text-white font-bold mb-4">Seus Badges</h3>

      {/* Badges conquistados */}
      <div className="flex gap-4 mb-6">
        {earnedBadges.map(badge => (
          <div key={badge.id} className="text-center">
            <div className="text-5xl mb-2">{badge.emoji}</div>
            <div className="text-white text-sm font-semibold">{badge.name}</div>
          </div>
        ))}
      </div>

      {/* Próximo badge */}
      {nextBadge && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Próximo:</div>
          <div className="flex items-center gap-3">
            <div className="text-3xl opacity-50">{nextBadge.emoji}</div>
            <div>
              <div className="text-white font-semibold">{nextBadge.name}</div>
              <div className="text-slate-400 text-sm">
                {nextBadge.requiredSessions - totalSessions} sessões restantes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 EXEMPLO 8: Recalcular em Tempo Real

```typescript
function LiveGamificationUpdate() {
  const [sessions, setSessions] = useState<ProgressSession[]>([]);
  const [gamification, setGamification] = useState(null);

  // Recalcular sempre que sessions mudar
  useEffect(() => {
    if (sessions.length > 0) {
      const data = calculateGamificationData(sessions);
      setGamification(data);
    }
  }, [sessions]);

  const handleNewSession = async () => {
    // Upload de nova sessão...
    // Recarregar sessões
    const response = await fetch('/api/progress-photos/sessions');
    const data = await response.json();
    setSessions(data.sessions);
    // Gamificação será recalculada automaticamente pelo useEffect
  };

  return (
    <div>
      {gamification && (
        <GamificationCard gamification={gamification} />
      )}
      <button onClick={handleNewSession}>Nova Sessão</button>
    </div>
  );
}
```

---

## ✅ RESUMO

Todos os exemplos acima demonstram como usar a biblioteca de gamificação:

1. ✅ Calcular métricas completas
2. ✅ Exibir cards visuais
3. ✅ Widgets de progresso
4. ✅ Sistema de notificações
5. ✅ Página de ranking
6. ✅ Mensagens dinâmicas
7. ✅ Sistema de badges (preparado)
8. ✅ Recálculo em tempo real

**Biblioteca pronta para uso imediato! 🚀**
