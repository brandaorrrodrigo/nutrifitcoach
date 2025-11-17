'use client';

import React, { useEffect, useState } from 'react';
import FPBadge from '@/components/enem/FPBadge';
import StreakIndicator from '@/components/enem/StreakIndicator';
import AchievementPopup from '@/components/enem/AchievementPopup';
import SimuladoCard from '@/components/enem/SimuladoCard';
import ProgressBar from '@/components/enem/ProgressBar';
import LevelProgress from '@/components/enem/LevelProgress';
import { useRouter } from 'next/navigation';

interface Achievement {
  code: string;
  title: string;
  description: string;
  unlocked_at: string;
}

interface Simulado {
  id: string;
  nota_final: number;
  acertos: number;
  total_questoes: number;
  finished_at: string;
  comparacao?: {
    nota_corte_curso?: string;
    passou?: boolean;
    diferenca_pontos?: number;
    percentil?: number;
  } | null;
}

interface AreaStats {
  total: number;
  acertos: number;
  percentual: number;
}

interface StatsResponse {
  stats_por_area: {
    linguagens: AreaStats;
    matematica: AreaStats;
    ciencias_natureza: AreaStats;
    ciencias_humanas: AreaStats;
  };
  total_questoes: number;
  total_acertos: number;
  media_geral: number;
  areas_mais_fortes: Array<{ area: string } & AreaStats>;
  areas_mais_fracas: Array<{ area: string } & AreaStats>;
  total_simulados: number;
}

export default function EnemDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState('user-123'); // Em produção, pegar do contexto/auth
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalFP, setTotalFP] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar status de gamificação
      const gamificationRes = await fetch(`/api/enem/gamificacao/status?user_id=${userId}`);
      const gamificationData = await gamificationRes.json();

      if (gamificationData.success) {
        setAchievements(gamificationData.gamification.achievements);
        setTotalFP(gamificationData.gamification.total_fp);
      }

      // Buscar histórico de simulados
      const simuladosRes = await fetch(`/api/enem/simulados/history?user_id=${userId}`);
      const simuladosData = await simuladosRes.json();

      if (simuladosData.success) {
        setSimulados(simuladosData.simulados);
      }

      // Buscar estatísticas por área
      const statsRes = await fetch(`/api/enem/stats/por-area?user_id=${userId}`);
      const statsData = await statsRes.json();

      if (statsData.success) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulado = async () => {
    try {
      const response = await fetch('/api/enem/simulados/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, total_questions: 45 })
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/enem/simulados/${data.simulado_id}`);
      } else {
        alert(data.error || 'Erro ao iniciar simulado');
      }
    } catch (error) {
      console.error('Erro ao iniciar simulado:', error);
      alert('Erro ao iniciar simulado');
    }
  };

  const getNomeAreaFormatado = (area: string): string => {
    const nomes: Record<string, string> = {
      linguagens: 'Linguagens',
      matematica: 'Matemática',
      ciencias_natureza: 'Ciências da Natureza',
      ciencias_humanas: 'Ciências Humanas'
    };
    return nomes[area] || area;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard ENEM
            </h1>
            <div className="flex items-center gap-4">
              <FPBadge userId={userId} size="md" />
              <StreakIndicator userId={userId} variant="compact" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Simulados Realizados
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {simulados.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Média de Acertos
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats?.media_geral.toFixed(0) || 0}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Total de Questões
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.total_questoes || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Conquistas
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {achievements.length}
            </p>
          </div>
        </div>

        {/* Sistema de Níveis */}
        <div className="mb-8">
          <LevelProgress totalFP={totalFP} variant="detailed" />
        </div>

        {/* Ação Principal */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para um novo desafio?
          </h2>
          <p className="text-white/90 mb-6">
            Teste seus conhecimentos com um simulado completo do ENEM
          </p>
          <button
            onClick={handleStartSimulado}
            className="
              bg-white text-purple-600 font-semibold
              px-8 py-3 rounded-lg
              hover:bg-gray-100 transition-colors
              shadow-lg hover:shadow-xl
            "
          >
            Iniciar Novo Simulado
          </button>
        </div>

        {/* Análise de Desempenho por Área */}
        {stats && stats.total_questoes > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Progresso por Área */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Progresso por Área
              </h2>
              <div className="space-y-5">
                <ProgressBar
                  label="Linguagens"
                  value={stats.stats_por_area.linguagens.percentual}
                  color="blue"
                  height="md"
                  icon="📚"
                />

                <ProgressBar
                  label="Matemática"
                  value={stats.stats_por_area.matematica.percentual}
                  color="purple"
                  height="md"
                  icon="🔢"
                />

                <ProgressBar
                  label="Ciências da Natureza"
                  value={stats.stats_por_area.ciencias_natureza.percentual}
                  color="green"
                  height="md"
                  icon="🔬"
                />

                <ProgressBar
                  label="Ciências Humanas"
                  value={stats.stats_por_area.ciencias_humanas.percentual}
                  color="orange"
                  height="md"
                  icon="🌎"
                />
              </div>
            </div>

            {/* Áreas Fortes e Fracas */}
            <div className="space-y-6">
              {/* Áreas Mais Fortes */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💪</span>
                  <h3 className="text-lg font-bold text-gray-900">
                    Áreas Mais Fortes
                  </h3>
                </div>
                {stats.areas_mais_fortes.length > 0 ? (
                  <div className="space-y-3">
                    {stats.areas_mais_fortes.map((area) => (
                      <div key={area.area} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {getNomeAreaFormatado(area.area)}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-700">
                            {area.percentual.toFixed(0)}%
                          </span>
                          <p className="text-xs text-gray-500">
                            {area.acertos}/{area.total} acertos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Faça mais simulados para descobrir suas áreas fortes!
                  </p>
                )}
              </div>

              {/* Áreas para Melhorar */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow p-6 border border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-bold text-gray-900">
                    Áreas para Melhorar
                  </h3>
                </div>
                {stats.areas_mais_fracas.length > 0 ? (
                  <div className="space-y-3">
                    {stats.areas_mais_fracas.map((area) => (
                      <div key={area.area} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {getNomeAreaFormatado(area.area)}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-orange-700">
                            {area.percentual.toFixed(0)}%
                          </span>
                          <p className="text-xs text-gray-500">
                            {area.acertos}/{area.total} acertos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Faça mais simulados para identificar áreas para melhorar!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Últimos Simulados */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Últimos Simulados
            </h2>
          </div>
          <div className="p-6">
            {simulados.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📝</span>
                <p className="text-gray-500 text-lg mb-2">
                  Você ainda não fez nenhum simulado
                </p>
                <p className="text-gray-400 text-sm">
                  Comece agora e acompanhe seu progresso!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {simulados.slice(0, 6).map((simulado) => (
                  <SimuladoCard
                    key={simulado.id}
                    id={simulado.id}
                    nota_final={simulado.nota_final}
                    acertos={simulado.acertos}
                    total_questoes={simulado.total_questoes}
                    finished_at={simulado.finished_at}
                    comparacao={simulado.comparacao}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conquistas Recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Conquistas Recentes
            </h2>
          </div>
          <div className="p-6">
            {achievements.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🏆</span>
                <p className="text-gray-500 text-lg mb-2">
                  Nenhuma conquista ainda
                </p>
                <p className="text-gray-400 text-sm">
                  Complete desafios para desbloquear conquistas!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.code}
                    className="flex items-start gap-4 p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md transition-shadow"
                  >
                    <span className="text-4xl">🏆</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Popup de conquista */}
      <AchievementPopup
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
        fpBonus={50}
      />
    </div>
  );
}
