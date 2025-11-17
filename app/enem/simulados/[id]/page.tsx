'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResultModal from '@/components/enem/ResultModal';

interface Questao {
  id: string;
  numero: number;
  area: string;
  disciplina: string;
  enunciado: string;
  alternativas: any;
  gabarito?: string;
  respondida?: boolean;
  resposta_user?: string;
}

interface Simulado {
  id: string;
  user_id: string;
  total_questions: number;
  status: string;
  nota_final?: number;
  started_at: string;
  finished_at?: string;
  questoes: Questao[];
  respostas: any[];
  total_respostas: number;
  acertos: number;
}

export default function SimuladoPage() {
  const params = useParams();
  const router = useRouter();
  const simuladoId = params.id as string;
  const userId = 'user-123'; // Em produção, pegar do contexto/auth

  const [simulado, setSimulado] = useState<Simulado | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    loadSimulado();
  }, [simuladoId]);

  useEffect(() => {
    // Reset timer quando muda de questão
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const loadSimulado = async () => {
    try {
      const response = await fetch(`/api/enem/simulados/${simuladoId}`);
      const data = await response.json();

      if (data.success) {
        setSimulado(data.simulado);

        // Se já está finalizado, mostrar resultado
        if (data.simulado.status === 'finalizado') {
          setResultData({
            notaFinal: data.simulado.nota_final,
            acertos: data.simulado.acertos,
            totalQuestoes: data.simulado.total_questions,
            percentual: (data.simulado.acertos / data.simulado.total_questions) * 100
          });
          setShowResult(true);
        }
      } else {
        alert(data.error || 'Erro ao carregar simulado');
        router.push('/enem/dashboard');
      }
    } catch (error) {
      console.error('Erro ao carregar simulado:', error);
      alert('Erro ao carregar simulado');
      router.push('/enem/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (alternativa: string) => {
    setSelectedAnswer(alternativa);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !simulado) return;

    setSubmitting(true);
    const currentQuestion = simulado.questoes[currentQuestionIndex];
    const tempoSegundos = Math.floor((Date.now() - questionStartTime) / 1000);

    try {
      const response = await fetch('/api/enem/simulados/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulado_id: simuladoId,
          questao_id: currentQuestion.id,
          resposta_user: selectedAnswer,
          tempo_segundos: tempoSegundos
        })
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar o simulado local
        const updatedSimulado = { ...simulado };
        updatedSimulado.questoes[currentQuestionIndex].respondida = true;
        updatedSimulado.questoes[currentQuestionIndex].resposta_user = selectedAnswer;
        setSimulado(updatedSimulado);

        // Verificar se é a última questão
        if (currentQuestionIndex === simulado.questoes.length - 1) {
          // Finalizar simulado
          await finishSimulado();
        } else {
          // Avançar para próxima questão
          setSelectedAnswer(null);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } else {
        alert(data.error || 'Erro ao enviar resposta');
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta');
    } finally {
      setSubmitting(false);
    }
  };

  const finishSimulado = async () => {
    try {
      const tempoTotalMinutos = Math.floor((Date.now() - new Date(simulado!.started_at).getTime()) / 1000 / 60);

      const response = await fetch('/api/enem/simulados/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulado_id: simuladoId,
          tempo_total_minutos: tempoTotalMinutos
        })
      });

      const data = await response.json();

      if (data.success) {
        setResultData({
          notaFinal: data.nota_final,
          acertos: data.acertos,
          totalQuestoes: data.total_questoes,
          percentual: data.percentual
        });
        setShowResult(true);
      } else {
        alert(data.error || 'Erro ao finalizar simulado');
      }
    } catch (error) {
      console.error('Erro ao finalizar simulado:', error);
      alert('Erro ao finalizar simulado');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestion = simulado!.questoes[currentQuestionIndex - 1];
      setSelectedAnswer(prevQuestion.resposta_user || null);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
    const question = simulado!.questoes[index];
    setSelectedAnswer(question.resposta_user || null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando simulado...</p>
        </div>
      </div>
    );
  }

  if (!simulado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Simulado não encontrado</p>
        </div>
      </div>
    );
  }

  const currentQuestion = simulado.questoes[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / simulado.questoes.length) * 100;

  // Parse alternativas (assumindo que está em formato JSON)
  let alternativas: { [key: string]: string } = {};
  try {
    alternativas = typeof currentQuestion.alternativas === 'string'
      ? JSON.parse(currentQuestion.alternativas)
      : currentQuestion.alternativas;
  } catch (e) {
    console.error('Erro ao parsear alternativas:', e);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Simulado ENEM
              </h1>
              <p className="text-sm text-gray-500">
                Questão {currentQuestionIndex + 1} de {simulado.questoes.length}
              </p>
            </div>
            <button
              onClick={() => router.push('/enem/dashboard')}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Voltar
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {Math.round(progress)}% completo
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              {/* Question Header */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    {currentQuestion.area}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {currentQuestion.disciplina}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Questão {currentQuestion.numero}
                </h2>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <div
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.enunciado }}
                />
              </div>

              {/* Alternatives */}
              <div className="space-y-3">
                {Object.entries(alternativas).map(([letra, texto]) => (
                  <button
                    key={letra}
                    onClick={() => handleAnswerSelect(letra)}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${selectedAnswer === letra
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${selectedAnswer === letra
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}>
                        {letra}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-800">{texto}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || submitting}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting
                  ? 'Enviando...'
                  : currentQuestionIndex === simulado.questoes.length - 1
                  ? 'Finalizar Simulado'
                  : 'Próxima →'
                }
              </button>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Navegação
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {simulado.questoes.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`
                      aspect-square rounded-lg text-sm font-semibold transition-all
                      ${index === currentQuestionIndex
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                        : q.respondida
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-600"></div>
                  <span className="text-gray-600">Atual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100"></div>
                  <span className="text-gray-600">Respondida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100"></div>
                  <span className="text-gray-600">Não respondida</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-1">Estatísticas</p>
                  <p>Respondidas: {simulado.questoes.filter(q => q.respondida).length}</p>
                  <p>Faltam: {simulado.questoes.filter(q => !q.respondida).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Result Modal */}
      {showResult && resultData && (
        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          simuladoId={simuladoId}
          userId={userId}
          notaFinal={resultData.notaFinal}
          acertos={resultData.acertos}
          totalQuestoes={resultData.totalQuestoes}
          percentual={resultData.percentual}
          onCompareScore={(curso, instituicao, ano, notaCorte) => {
            console.log('Comparando com:', { curso, instituicao, ano, notaCorte });
          }}
        />
      )}
    </div>
  );
}
