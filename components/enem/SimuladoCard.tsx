'use client';

import React from 'react';
import ProgressBar from './ProgressBar';

interface SimuladoCardProps {
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
  desempenhoPorArea?: {
    linguagens: number;
    matematica: number;
    ciencias_natureza: number;
    ciencias_humanas: number;
  };
  onClick?: () => void;
}

export default function SimuladoCard({
  nota_final,
  acertos,
  total_questoes,
  finished_at,
  comparacao,
  desempenhoPorArea,
  onClick
}: SimuladoCardProps) {
  const percentual = (acertos / total_questoes) * 100;
  const notaColor = nota_final >= 700 ? 'text-green-600' : nota_final >= 500 ? 'text-orange-600' : 'text-red-600';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white border rounded-lg p-5 shadow-sm
        hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📝</span>
            <h3 className="text-lg font-bold text-gray-900">
              Simulado ENEM
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(finished_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${notaColor}`}>
            {nota_final.toFixed(0)}
          </div>
          <p className="text-xs text-gray-500">pontos</p>
        </div>
      </div>

      {/* Acertos */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Acertos</span>
          <span className="text-sm font-bold text-gray-900">
            {acertos}/{total_questoes} ({percentual.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>

      {/* Comparação com nota de corte */}
      {comparacao && comparacao.nota_corte_curso && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <span className="text-lg">{comparacao.passou ? '✅' : '❌'}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {comparacao.nota_corte_curso}
              </p>
              <p className="text-xs text-gray-600">
                {comparacao.passou ? 'Você passou!' : 'Não atingiu a nota de corte'}
                {comparacao.diferenca_pontos !== undefined && (
                  <span className="ml-1">
                    ({comparacao.passou ? '+' : ''}{comparacao.diferenca_pontos.toFixed(0)} pts)
                  </span>
                )}
              </p>
              {comparacao.percentil !== undefined && (
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Top {(100 - comparacao.percentil).toFixed(0)}% dos alunos
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desempenho por área */}
      {desempenhoPorArea && (
        <div className="space-y-2 pt-3 border-t">
          <p className="text-xs font-semibold text-gray-600 mb-3">Desempenho por área</p>

          <ProgressBar
            label="Linguagens"
            value={desempenhoPorArea.linguagens}
            color="blue"
            height="sm"
            icon="📚"
          />

          <ProgressBar
            label="Matemática"
            value={desempenhoPorArea.matematica}
            color="purple"
            height="sm"
            icon="🔢"
          />

          <ProgressBar
            label="Ciências da Natureza"
            value={desempenhoPorArea.ciencias_natureza}
            color="green"
            height="sm"
            icon="🔬"
          />

          <ProgressBar
            label="Ciências Humanas"
            value={desempenhoPorArea.ciencias_humanas}
            color="orange"
            height="sm"
            icon="🌎"
          />
        </div>
      )}
    </div>
  );
}
