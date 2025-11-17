'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MinhaAnamnesePage() {
  const [anamnese, setAnamnese] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar anamnese salva
    const plano = JSON.parse(localStorage.getItem('plano') || '{}');
    if (plano.analises) {
      setAnamnese(plano);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!anamnese || !anamnese.analises) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Sem Anamnese</h1>
          <p className="text-xl text-gray-700 mb-8">Você ainda não completou sua anamnese</p>
          <Link href="/anamnese" className="inline-block bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 text-white px-12 py-5 rounded-xl font-bold text-xl">
            Fazer Anamnese Completa
          </Link>
        </div>
      </div>
    );
  }

  const { analises, recomendacoes } = anamnese;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            NUTRIFITCOACH
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          🏥 Minha Anamnese Completa
        </h1>
        <p className="text-center text-xl text-gray-700 mb-12">
          Análise detalhada baseada em seus dados e exames
        </p>

        {/* ANÁLISE DE EXAMES LABORATORIAIS */}
        {analises.exames && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              🩸 Análise dos Exames Laboratoriais
              <span className={`px-4 py-2 rounded-full text-sm ${
                analises.exames.status === 'normal' 
                  ? 'bg-green-100 text-green-700' 
                  : analises.exames.status === 'atencao'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {analises.exames.status === 'normal' ? '✅ Tudo Normal' : 
                 analises.exames.status === 'atencao' ? '⚠️ Atenção' : '🚨 Alerta'}
              </span>
            </h2>

            {analises.exames.alertas && analises.exames.alertas.length > 0 && (
              <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-yellow-900 mb-3">Alertas Importantes:</h3>
                <ul className="space-y-2">
                  {analises.exames.alertas.map((alerta: string, idx: number) => (
                    <li key={idx} className="text-yellow-800 text-lg">{alerta}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(analises.exames.detalhes || {}).map(([exame, status]: [string, any]) => (
                <div key={exame} className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                    {exame.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <span className={`inline-block px-4 py-2 rounded-full font-bold ${
                    status === 'NORMAL' || status === 'DESEJÁVEL' || status === 'ÓTIMO' || status === 'ADEQUADO'
                      ? 'bg-green-100 text-green-700'
                      : status === 'LIMÍTROFE' || status === 'INSUFICIENTE' || status === 'BAIXO'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>

            {analises.exames.sugestoes && analises.exames.sugestoes.length > 0 && (
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Sugestões da IA:</h3>
                <ul className="space-y-2">
                  {analises.exames.sugestoes.map((sugestao: string, idx: number) => (
                    <li key={idx} className="text-blue-800 text-lg">{sugestao}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ANÁLISE ANTROPOMÉTRICA */}
        {analises.antropometria && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">📏 Análise Antropométrica</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Classificação IMC</h3>
                <p className="text-3xl font-bold text-purple-600">{analises.antropometria.classificacaoIMC}</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Risco de Saúde</h3>
                <p className={`text-3xl font-bold ${
                  analises.antropometria.riscoSaude === 'baixo' ? 'text-green-600' :
                  analises.antropometria.riscoSaude === 'moderado' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {analises.antropometria.riscoSaude.toUpperCase()}
                </p>
              </div>
            </div>

            {analises.antropometria.alertas && analises.antropometria.alertas.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-yellow-900 mb-3">Observações:</h3>
                <ul className="space-y-2">
                  {analises.antropometria.alertas.map((alerta: string, idx: number) => (
                    <li key={idx} className="text-yellow-800 text-lg">{alerta}</li>
                  ))}
                </ul>
              </div>
            )}

            {analises.antropometria.sugestoes && analises.antropometria.sugestoes.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Recomendações:</h3>
                <ul className="space-y-2">
                  {analises.antropometria.sugestoes.map((sugestao: string, idx: number) => (
                    <li key={idx} className="text-blue-800 text-lg">{sugestao}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ANÁLISE DE RISCO */}
        {analises.risco && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              ⚠️ Análise de Risco
              <span className={`px-4 py-2 rounded-full text-sm ${
                analises.risco.nivelRisco === 'baixo' 
                  ? 'bg-green-100 text-green-700' 
                  : analises.risco.nivelRisco === 'moderado'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                Risco {analises.risco.nivelRisco.toUpperCase()}
              </span>
            </h2>

            {analises.risco.alertas && analises.risco.alertas.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-red-900 mb-3">🚨 Fatores de Risco:</h3>
                <ul className="space-y-2">
                  {analises.risco.alertas.map((alerta: string, idx: number) => (
                    <li key={idx} className="text-red-800 text-lg">{alerta}</li>
                  ))}
                </ul>
              </div>
            )}

            {analises.risco.recomendacoes && analises.risco.recomendacoes.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ Ações Recomendadas:</h3>
                <ul className="space-y-2">
                  {analises.risco.recomendacoes.map((rec: string, idx: number) => (
                    <li key={idx} className="text-green-800 text-lg">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* RECOMENDAÇÕES GERAIS */}
        {recomendacoes && recomendacoes.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-6">🎯 Recomendações Personalizadas da IA</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recomendacoes.map((rec: string, idx: number) => (
                <div key={idx} className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <p className="text-lg font-semibold">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AÇÕES */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/dashboard" className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-xl hover:shadow-2xl">
            Ver Meu Cardápio
          </Link>
          <Link href="/anamnese" className="px-12 py-5 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-bold text-xl hover:border-purple-600">
            Atualizar Anamnese
          </Link>
        </div>
      </div>
    </div>
  );
}
