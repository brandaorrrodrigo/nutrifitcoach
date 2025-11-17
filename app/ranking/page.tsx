'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RankingUser {
  nome: string;
  points: number;
  level: number;
  streak: number;
  badges: number;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [filter, setFilter] = useState<'points' | 'level' | 'streak'>('points');

  useEffect(() => {
    // Simular dados (conectar com API real depois)
    const mockRanking: RankingUser[] = [
      { nome: 'João S.', points: 850, level: 9, streak: 45, badges: 12 },
      { nome: 'Maria P.', points: 720, level: 8, streak: 30, badges: 10 },
      { nome: 'Pedro L.', points: 680, level: 7, streak: 28, badges: 9 },
      { nome: 'Ana C.', points: 550, level: 6, streak: 22, badges: 8 },
      { nome: 'Carlos M.', points: 480, level: 5, streak: 18, badges: 7 },
      { nome: 'Juliana R.', points: 420, level: 5, streak: 15, badges: 6 },
      { nome: 'Felipe T.', points: 380, level: 4, streak: 12, badges: 5 },
      { nome: 'Beatriz S.', points: 320, level: 4, streak: 10, badges: 4 },
      { nome: 'Ricardo F.', points: 280, level: 3, streak: 8, badges: 3 },
      { nome: 'Camila N.', points: 240, level: 3, streak: 6, badges: 2 }
    ];

    const sorted = [...mockRanking].sort((a, b) => {
      if (filter === 'points') return b.points - a.points;
      if (filter === 'level') return b.level - a.level;
      return b.streak - a.streak;
    });

    setRanking(sorted);
  }, [filter]);

  const getMedalEmoji = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `${position + 1}º`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            NUTRIFITCOACH
          </Link>
          <Link href="/dashboard" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
          🏆 Ranking Geral
        </h1>
        <p className="text-center text-xl text-gray-700 mb-12">
          Veja quem está arrasando na comunidade!
        </p>

        {/* FILTROS */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <button
            onClick={() => setFilter('points')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              filter === 'points'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            Por Pontos
          </button>
          <button
            onClick={() => setFilter('level')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              filter === 'level'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            Por Nível
          </button>
          <button
            onClick={() => setFilter('streak')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              filter === 'streak'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            Por Sequência 🔥
          </button>
        </div>

        {/* PÓDIO TOP 3 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {ranking.slice(0, 3).map((user, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl text-center transform transition-all hover:scale-105 ${
                idx === 0
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 md:scale-110 md:-mt-4'
                  : idx === 1
                  ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                  : 'bg-gradient-to-br from-orange-300 to-orange-500'
              } text-white shadow-2xl`}
            >
              <div className="text-6xl mb-4">{getMedalEmoji(idx)}</div>
              <h3 className="text-2xl font-bold mb-2">{user.nome}</h3>
              <div className="text-4xl font-bold mb-4">{user.points} pts</div>
              <div className="flex justify-center gap-4 text-sm">
                <span>Nível {user.level}</span>
                <span>🔥 {user.streak}</span>
                <span>🏆 {user.badges}</span>
              </div>
            </div>
          ))}
        </div>

        {/* RESTANTE DO RANKING */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="space-y-4">
            {ranking.slice(3).map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="text-3xl font-bold text-gray-700 w-12">
                    {idx + 4}º
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{user.nome}</h4>
                    <div className="flex gap-4 text-gray-600 mt-1">
                      <span>Nível {user.level}</span>
                      <span>🔥 {user.streak} dias</span>
                      <span>🏆 {user.badges} badges</span>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {user.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Quer aparecer no ranking?
          </h3>
          <p className="text-xl text-gray-700 mb-6">
            Entre todos os dias, complete desafios e ganhe pontos!
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-xl hover:shadow-xl"
          >
            Ver Meu Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
