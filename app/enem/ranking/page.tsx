'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LevelBadge from '@/components/enem/LevelBadge';

interface LevelInfo {
  name: string;
  color: string;
  icon: string;
  min_fp: number;
  max_fp: number | null;
}

interface RankingUser {
  position: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  is_founder: boolean;
  total_fp: number;
  current_streak: number;
  best_streak: number;
  level: LevelInfo;
}

interface RankingResponse {
  success: boolean;
  ranking: RankingUser[];
  current_user: RankingUser | null;
  total_users: number;
  timestamp: string;
}

export default function RankingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('user-123'); // Em produção, pegar do contexto/auth
  const [rankingData, setRankingData] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await fetch(`/api/enem/ranking/global?user_id=${userId}`);
      const data = await response.json();

      if (data.success) {
        setRankingData(data);
      }
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position: number): string => {
    if (position === 1) return 'text-yellow-500';
    if (position === 2) return 'text-gray-400';
    if (position === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getPositionIcon = (position: number): string => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const UserAvatar = ({ user }: { user: RankingUser }) => (
    <div className="relative">
      {user.avatar_url ? (
        <div className="relative w-10 h-10 border-2 border-gray-300 rounded-full overflow-hidden">
          <Image
            src={user.avatar_url}
            alt={user.display_name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-gray-300">
          {user.display_name.charAt(0).toUpperCase()}
        </div>
      )}
      {user.is_founder && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
          <span className="text-xs">👑</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  if (!rankingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <p className="text-gray-600">Erro ao carregar ranking</p>
        </div>
      </div>
    );
  }

  const top10 = rankingData.ranking.slice(0, 10);
  const rest = rankingData.ranking.slice(10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ranking Global ENEM
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {rankingData.total_users} estudantes competindo
              </p>
            </div>
            <button
              onClick={() => router.push('/enem/dashboard')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Voltar ao Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sua Posição */}
        {rankingData.current_user && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sua Posição</h2>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">
                    #{rankingData.current_user.position}
                  </div>
                  <UserAvatar user={rankingData.current_user} />
                  <div>
                    <p className="font-semibold text-lg">
                      {rankingData.current_user.display_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm opacity-90">
                        🔥 {rankingData.current_user.current_streak} dias
                      </span>
                      <span className="text-sm opacity-90">•</span>
                      <span className="text-sm opacity-90">
                        ⭐ {rankingData.current_user.best_streak} melhor
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-2">
                    {rankingData.current_user.total_fp.toLocaleString()} FP
                  </div>
                  <LevelBadge level={rankingData.current_user.level} size="lg" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 - Destacado */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            🏆 Top 10 Campeões
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {top10.map((user) => (
              <div
                key={user.user_id}
                className={`
                  bg-white rounded-lg shadow-md p-5 border-2
                  ${user.position <= 3 ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200'}
                  hover:shadow-lg transition-all duration-200
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Posição */}
                    <div className={`text-4xl font-bold ${getPositionColor(user.position)} min-w-[60px] text-center`}>
                      {user.position <= 3 ? getPositionIcon(user.position) : `#${user.position}`}
                    </div>

                    {/* Avatar e Info */}
                    <UserAvatar user={user} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-lg">
                          {user.display_name}
                        </p>
                        {user.is_founder && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                            Fundador
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                        <span>🔥 {user.current_streak} dias</span>
                        <span>⭐ {user.best_streak} melhor</span>
                      </div>
                    </div>
                  </div>

                  {/* FP e Level */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {user.total_fp.toLocaleString()} FP
                    </div>
                    <LevelBadge level={user.level} size="md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posições 11-50 */}
        {rest.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              📊 Posições 11-50
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="divide-y">
                {rest.map((user) => (
                  <div
                    key={user.user_id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Posição */}
                        <div className="text-lg font-semibold text-gray-600 min-w-[50px]">
                          #{user.position}
                        </div>

                        {/* Avatar e Info */}
                        <UserAvatar user={user} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {user.display_name}
                            </p>
                            {user.is_founder && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                                Fundador
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <span>🔥 {user.current_streak}</span>
                            <span>⭐ {user.best_streak}</span>
                          </div>
                        </div>
                      </div>

                      {/* FP e Level */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            {user.total_fp.toLocaleString()} FP
                          </div>
                        </div>
                        <LevelBadge level={user.level} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legenda de Níveis */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📈 Sistema de Níveis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
              <div className="text-3xl mb-2">🥉</div>
              <div className="font-bold text-gray-900">Bronze</div>
              <div className="text-xs text-gray-600 mt-1">0 - 499 FP</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
              <div className="text-3xl mb-2">🥈</div>
              <div className="font-bold text-gray-900">Silver</div>
              <div className="text-xs text-gray-600 mt-1">500 - 1,999 FP</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200">
              <div className="text-3xl mb-2">🥇</div>
              <div className="font-bold text-gray-900">Gold</div>
              <div className="text-xs text-gray-600 mt-1">2,000 - 4,999 FP</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold text-gray-900">Platinum</div>
              <div className="text-xs text-gray-600 mt-1">5,000 - 9,999 FP</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-lg border-2 border-cyan-300">
              <div className="text-3xl mb-2">💎</div>
              <div className="font-bold text-gray-900">Diamond</div>
              <div className="text-xs text-gray-600 mt-1">10,000+ FP</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Dica:</span> Ganhe FP completando simulados,
              mantendo sequências (streaks), desbloqueando conquistas e superando suas metas!
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Última atualização: {new Date(rankingData.timestamp).toLocaleString('pt-BR')}
        </div>
      </main>
    </div>
  );
}
