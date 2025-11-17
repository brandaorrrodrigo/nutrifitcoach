'use client';

import { useState, useEffect } from 'react';
import { deveRecomendarCleanFree, gerarCalendarioCleanFreeCiclo } from '@/lib/protocolo-clean-free/integracao-ciclo';

export default function EscolherProtocoloPage() {
  const [perfil, setPerfil] = useState<any>(null);
  const [recomendacao, setRecomendacao] = useState<any>(null);
  const [calendario, setCalendario] = useState<any[]>([]);
  const [dataUltimaMenstruacao, setDataUltimaMenstruacao] = useState('');

  const analisarProtocolo = () => {
    if (!dataUltimaMenstruacao) return;
    
    const data = new Date(dataUltimaMenstruacao);
    const rec = deveRecomendarCleanFree(data, 28, false, false);
    const cal = gerarCalendarioCleanFreeCiclo(data, 28);
    
    setRecomendacao(rec);
    setCalendario(cal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            💝 Escolha Seu Protocolo
          </h1>
          <p className="text-2xl text-gray-700">
            Encontre o plano perfeito para VOCÊ!
          </p>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">🌸 Informações do Ciclo</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold mb-2">
                Data da última menstruação:
              </label>
              <input
                type="date"
                value={dataUltimaMenstruacao}
                onChange={(e) => setDataUltimaMenstruacao(e.target.value)}
                className="w-full p-4 border-2 border-purple-300 rounded-xl text-lg"
              />
            </div>

            <button
              onClick={analisarProtocolo}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-xl hover:shadow-xl"
            >
              ✨ Analisar Melhor Protocolo
            </button>
          </div>
        </div>

        {/* RECOMENDAÇÃO */}
        {recomendacao && (
          <div className={`rounded-3xl shadow-2xl p-8 mb-8 ${
            recomendacao.intensidade === 'muito_alta' ? 'bg-gradient-to-br from-pink-100 to-purple-100' :
            recomendacao.intensidade === 'alta' ? 'bg-gradient-to-br from-purple-100 to-blue-100' :
            recomendacao.intensidade === 'media' ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
            'bg-gradient-to-br from-green-100 to-teal-100'
          }`}>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">
                {recomendacao.recomendar ? '✅ RECOMENDADO' : 'ℹ️ ANÁLISE'}
              </h2>
              <span className={`px-6 py-3 rounded-full font-bold text-lg ${
                recomendacao.intensidade === 'muito_alta' ? 'bg-pink-500 text-white' :
                recomendacao.intensidade === 'alta' ? 'bg-purple-500 text-white' :
                recomendacao.intensidade === 'media' ? 'bg-blue-500 text-white' :
                'bg-green-500 text-white'
              }`}>
                {recomendacao.intensidade === 'muito_alta' ? '🔥 PERFEITO PARA VOCÊ!' :
                 recomendacao.intensidade === 'alta' ? '⭐ MUITO INDICADO' :
                 recomendacao.intensidade === 'media' ? '👍 INDICADO' :
                 '✓ PODE FUNCIONAR'}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">{recomendacao.razao}</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {recomendacao.mensagem}
                </pre>
              </div>
            </div>

            {recomendacao.recomendar && (
              <button className="w-full py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl font-bold text-2xl hover:shadow-2xl">
                💝 ESCOLHER PROTOCOLO CLEAN & FREE
              </button>
            )}
          </div>
        )}

        {/* CALENDÁRIO */}
        {calendario.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">
              📅 Seu Calendário Clean & Free
            </h2>
            
            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                <div key={dia} className="text-center font-bold text-gray-600 py-2">
                  {dia}
                </div>
              ))}
              
              {calendario.map((dia, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-2 ${
                    dia.tipo_dia.includes('FREE') ? 'bg-pink-100 border-pink-500' :
                    dia.tipo_dia.includes('TRANSIÇÃO') ? 'bg-purple-100 border-purple-500' :
                    'bg-green-100 border-green-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold">{dia.dia_semana}</div>
                    <div className="text-xs text-gray-600">Dia {dia.dia_ciclo}</div>
                    <div className="text-xs font-bold mt-1">{dia.tipo_dia}</div>
                    <div className="text-xs mt-1">{dia.fase_ciclo}</div>
                    {dia.vontade_doces.includes('MUITO') && (
                      <div className="text-lg mt-1">🍫</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4">
                <div className="font-bold text-green-800 mb-2">💪 CLEAN DAY</div>
                <div className="text-sm text-green-700">Alimentação limpa e nutritiva</div>
              </div>
              <div className="bg-pink-100 border-2 border-pink-500 rounded-xl p-4">
                <div className="font-bold text-pink-800 mb-2">🎉 FREE DAY</div>
                <div className="text-sm text-pink-700">LIBERDADE TOTAL por 4h!</div>
              </div>
              <div className="bg-purple-100 border-2 border-purple-500 rounded-xl p-4">
                <div className="font-bold text-purple-800 mb-2">🌈 TRANSIÇÃO</div>
                <div className="text-sm text-purple-700">Livre mas mais leve</div>
              </div>
            </div>
          </div>
        )}

        {/* CARD CLEAN & FREE */}
        <div className="mt-8 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold mb-6 text-center">
            💝 Protocolo Clean & Free
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">🗓️ Estrutura</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <div className="font-bold">Seg-Sex (5 dias)</div>
                    <div className="text-sm text-gray-600">Alimentação limpa</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <div className="font-bold">Sábado (4h)</div>
                    <div className="text-sm text-gray-600">LIBERDADE TOTAL!</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🌈</span>
                  <div>
                    <div className="font-bold">Domingo (6h)</div>
                    <div className="text-sm text-gray-600">Transição</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">✨ Benefícios</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Come doces que ama</li>
                <li>✅ Sem culpa</li>
                <li>✅ Respeita ciclo hormonal</li>
                <li>✅ Perfeito para TPM</li>
                <li>✅ Sustentável sempre</li>
                <li>✅ Resultados reais</li>
              </ul>
            </div>
          </div>

          <div className="bg-pink-200 border-2 border-pink-500 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-3">🍫 Perfeito para TPM!</h3>
            <p className="text-lg">
              Na fase lútea/TPM quando a vontade de doces está NO MÁXIMO, 
              o Clean & Free permite que você coma TUDO que quiser no sábado!
              Sem culpa, faz parte do plano! 💝
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
