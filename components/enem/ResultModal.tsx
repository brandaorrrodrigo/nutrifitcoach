'use client';

import React, { useState, useEffect } from 'react';

interface Achievement {
  code: string;
  title: string;
  description: string;
  unlocked_at: string;
}

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  simuladoId: string;
  notaFinal: number;
  acertos: number;
  totalQuestoes: number;
  percentual: number;
  userId?: string;
  onCompareScore?: (curso: string, instituicao: string, ano: number, notaCorte: number) => void;
}

export default function ResultModal({
  isOpen,
  onClose,
  simuladoId,
  notaFinal,
  acertos,
  totalQuestoes,
  percentual,
  userId,
  onCompareScore
}: ResultModalProps) {
  const [showCompare, setShowCompare] = useState(false);
  const [curso, setCurso] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [ano, setAno] = useState(2024);
  const [notaCorte, setNotaCorte] = useState(700);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [fpGained, setFpGained] = useState(0);

  // Buscar conquistas recém-desbloqueadas
  useEffect(() => {
    if (isOpen && userId) {
      fetchRecentAchievements();
    }
  }, [isOpen, userId]);

  const fetchRecentAchievements = async () => {
    try {
      const response = await fetch(`/api/enem/gamificacao/status?user_id=${userId}`);
      const data = await response.json();

      if (data.success && data.gamification.achievements.length > 0) {
        // Pegar conquistas desbloqueadas nos últimos 30 segundos
        const recentTime = new Date(Date.now() - 30000); // 30 segundos atrás
        const recent = data.gamification.achievements.filter((a: Achievement) =>
          new Date(a.unlocked_at) >= recentTime
        );
        setNewAchievements(recent);
      }

      // Calcular FP ganho
      if (data.gamification.recent_fp_history.length > 0) {
        const recentFP = data.gamification.recent_fp_history[0];
        if (recentFP.motivo.includes('Simulado concluído')) {
          setFpGained(recentFP.fp_amount);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar conquistas:', error);
    }
  };

  if (!isOpen) return null;

  const passou = notaFinal >= 700; // Nota mínima considerada "boa"

  const handleCompareScore = async () => {
    if (!curso || !instituicao) {
      alert('Preencha curso e instituição');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/enem/simulados/compare-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulado_id: simuladoId,
          nota_corte_curso: `${curso} - ${instituicao} (${ano})`,
          nota_corte_valor: notaCorte
        })
      });

      const data = await response.json();

      if (data.success) {
        setCompareResult(data.comparacao);
        if (onCompareScore) {
          onCompareScore(curso, instituicao, ano, notaCorte);
        }
      } else {
        alert(data.error || 'Erro ao comparar nota');
      }
    } catch (error) {
      console.error('Erro ao comparar nota:', error);
      alert('Erro ao comparar nota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`
          p-6 rounded-t-2xl
          ${passou
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-orange-500 to-amber-600'
          }
        `}>
          <div className="flex items-center justify-between text-white mb-4">
            <h2 className="text-2xl font-bold">
              {passou ? '🎉 Parabéns!' : '📚 Continue Estudando!'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-white/90">
            {passou
              ? 'Você atingiu uma nota excelente!'
              : 'Não desanime! Cada simulado é um aprendizado.'
            }
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4 text-center border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Nota Final</p>
              <p className="text-3xl font-bold text-purple-600">
                {notaFinal.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">pontos</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Acertos</p>
              <p className="text-3xl font-bold text-blue-600">
                {acertos}/{totalQuestoes}
              </p>
              <p className="text-xs text-gray-500">{percentual.toFixed(1)}%</p>
            </div>
          </div>

          {/* Performance */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Desempenho</span>
              <span className="text-sm text-gray-600">{percentual.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  percentual >= 80 ? 'bg-green-500' :
                  percentual >= 60 ? 'bg-blue-500' :
                  percentual >= 40 ? 'bg-yellow-500' :
                  'bg-orange-500'
                }`}
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>

          {/* Mensagem Motivacional */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-100">
            <p className="text-sm text-gray-700 text-center font-medium">
              {percentual >= 90 ? '🌟 Desempenho excepcional! Você está pronto!' :
               percentual >= 80 ? '🎯 Muito bem! Continue assim!' :
               percentual >= 70 ? '💪 Bom trabalho! Está no caminho certo!' :
               percentual >= 60 ? '📖 Estude mais um pouco e você consegue!' :
               '🔥 Não desista! A prática leva à perfeição!'}
            </p>
          </div>

          {/* FP Ganhos */}
          {fpGained > 0 && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 mb-6 text-white animate-bounceIn">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">⭐</span>
                <div className="text-center">
                  <p className="text-2xl font-bold">+{fpGained} FP</p>
                  <p className="text-sm text-white/90">Focus Points Ganhos!</p>
                </div>
              </div>
            </div>
          )}

          {/* Conquistas Desbloqueadas */}
          {newAchievements.length > 0 && (
            <div className="mb-6 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>🏆</span>
                Novas Conquistas Desbloqueadas!
              </h3>
              {newAchievements.map((achievement) => (
                <div
                  key={achievement.code}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 animate-slideInUp"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🏆</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-700">{achievement.description}</p>
                      <p className="text-xs text-purple-600 font-semibold mt-1">+50 FP Bônus</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comparação com Nota de Corte */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="font-semibold text-gray-900">
                📊 Comparar com Nota de Corte
              </span>
              <span className="text-gray-500">
                {showCompare ? '▼' : '▶'}
              </span>
            </button>

            {showCompare && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curso
                    </label>
                    <input
                      type="text"
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                      placeholder="Ex: Medicina"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instituição
                    </label>
                    <input
                      type="text"
                      value={instituicao}
                      onChange={(e) => setInstituicao(e.target.value)}
                      placeholder="Ex: UFMG"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <input
                      type="number"
                      value={ano}
                      onChange={(e) => setAno(Number(e.target.value))}
                      min="2020"
                      max="2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nota de Corte
                    </label>
                    <input
                      type="number"
                      value={notaCorte}
                      onChange={(e) => setNotaCorte(Number(e.target.value))}
                      min="400"
                      max="1000"
                      step="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCompareScore}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Comparando...' : 'Comparar Resultado'}
                </button>

                {compareResult && (
                  <div className={`
                    p-4 rounded-lg border-2
                    ${compareResult.passou
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                    }
                  `}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {compareResult.passou ? '✅' : '⚠️'}
                      </span>
                      <div className="flex-1">
                        <p className={`font-semibold mb-1 ${
                          compareResult.passou ? 'text-green-800' : 'text-orange-800'
                        }`}>
                          {compareResult.passou ? 'Você passou!' : 'Não atingiu a nota'}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          {compareResult.mensagem}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white/50 rounded px-2 py-1">
                            <span className="text-gray-600">Sua nota: </span>
                            <span className="font-bold">{compareResult.nota_usuario.toFixed(0)}</span>
                          </div>
                          <div className="bg-white/50 rounded px-2 py-1">
                            <span className="text-gray-600">Diferença: </span>
                            <span className={`font-bold ${
                              compareResult.passou ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {compareResult.diferenca_pontos > 0 ? '+' : ''}
                              {compareResult.diferenca_pontos.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Ver Revisão
            </button>
            <button
              onClick={() => window.location.href = '/enem/dashboard'}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
