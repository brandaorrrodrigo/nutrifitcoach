'use client';

import { useState, useEffect } from 'react';

interface GamificationProps {
  onClose: () => void;
}

export default function GamificationPanel({ onClose }: GamificationProps) {
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    badges: [],
    nextLevelPoints: 100
  });

  const BADGES = {
    FIRST_PLAN: { nome: 'Primeiro Passo', icon: '🎯', descricao: 'Criou seu primeiro plano' },
    STREAK_7: { nome: 'Semana Forte', icon: '🔥', descricao: '7 dias consecutivos' },
    STREAK_30: { nome: 'Mestre da Consistência', icon: '💪', descricao: '30 dias consecutivos' },
    COMPLETE_PROFILE: { nome: 'Perfil Completo', icon: '👤', descricao: 'Completou todas informações' },
    SHARE: { nome: 'Influenciador', icon: '📢', descricao: 'Compartilhou progresso' },
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setStats({
      points: userData.points || 0,
      level: userData.level || 1,
      streak: userData.streak || 0,
      badges: userData.badges || [],
      nextLevelPoints: (userData.level || 1) * 100
    });
  }, []);

  const progressPercent = (stats.points % 100);

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-8 rounded-t-3xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">Suas Conquistas</h2>
              <p className="text-xl opacity-90">Continue assim! 🚀</p>
            </div>
            <button onClick={onClose} className="text-white text-4xl font-bold hover:scale-110 transition-all">
              ×
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-5xl font-bold mb-2">{stats.level}</div>
              <div className="text-sm opacity-90">Nível</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-5xl font-bold mb-2">{stats.points}</div>
              <div className="text-sm opacity-90">Pontos</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-5xl mb-2">🔥</div>
              <div className="text-2xl font-bold">{stats.streak} dias</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso para Nível {stats.level + 1}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-4">
              <div 
                className="bg-white h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">🏆 Badges Conquistadas</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {Object.entries(BADGES).map(([key, badge]: [string, any]) => {
              const unlocked = stats.badges.includes(key);
              return (
                <div 
                  key={key}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    unlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400' 
                      : 'bg-gray-100 border-gray-300 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900">{badge.nome}</h4>
                      <p className="text-gray-600">{badge.descricao}</p>
                    </div>
                    {unlocked && <div className="text-3xl">✓</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">💡 Como Ganhar Mais Pontos</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Check-in diário (+5 pontos)</p>
                  <p className="text-sm text-gray-600">Entre todo dia e mantenha seu streak</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Gerar novos planos (+10 pontos)</p>
                  <p className="text-sm text-gray-600">Crie cardápios personalizados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Registrar progresso (+15 pontos)</p>
                  <p className="text-sm text-gray-600">Acompanhe sua evolução</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Indicar amigos (+50 pontos cada)</p>
                  <p className="text-sm text-gray-600">Compartilhe com quem você ama</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
