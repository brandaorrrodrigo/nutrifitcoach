'use client';

import { useState, useEffect } from 'react';
import { PROTOCOLOS_JEJUM, recomendarProtocoloJejum } from '@/lib/jejum-intermitente/protocolos';
import { TrackerJejum } from '@/lib/jejum-intermitente/tracker';

export default function JejumIntermitentePage() {
  const [etapa, setEtapa] = useState<'selecao' | 'ativo' | 'historico'>('selecao');
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string>('');
  const [sessaoAtiva, setSessaoAtiva] = useState<any>(null);
  const [progresso, setProgresso] = useState<any>(null);
  const [estatisticas, setEstatisticas] = useState<any>(null);

  useEffect(() => {
    // Verificar se há jejum em andamento
    const historico = TrackerJejum.buscarHistorico('user');
    const emAndamento = historico.find(s => s.status === 'em_andamento');
    
    if (emAndamento) {
      setSessaoAtiva(emAndamento);
      setEtapa('ativo');
    }
    
    // Carregar estatísticas
    const stats = TrackerJejum.calcularEstatisticas('user');
    setEstatisticas(stats);
  }, []);

  useEffect(() => {
    if (sessaoAtiva) {
      const interval = setInterval(() => {
        const prog = TrackerJejum.calcularProgresso(sessaoAtiva);
        setProgresso(prog);
        
        // Verificar se completou
        if (prog.horas_restantes <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [sessaoAtiva]);

  const iniciarJejum = (protocoloId: string) => {
    const sessao = TrackerJejum.iniciarJejum('user', protocoloId);
    setSessaoAtiva(sessao);
    setEtapa('ativo');
  };

  const finalizarJejum = (comoSeSentiu: any) => {
    if (sessaoAtiva) {
      TrackerJejum.finalizarJejum(sessaoAtiva.id, comoSeSentiu);
      setSessaoAtiva(null);
      setEtapa('selecao');
      
      // Atualizar estatísticas
      const stats = TrackerJejum.calcularEstatisticas('user');
      setEstatisticas(stats);
    }
  };

  const cancelarJejum = () => {
    if (sessaoAtiva) {
      TrackerJejum.cancelarJejum(sessaoAtiva.id);
      setSessaoAtiva(null);
      setEtapa('selecao');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ⏰ Jejum Intermitente
          </h1>
          <p className="text-2xl text-gray-700">
            {etapa === 'selecao' && 'Escolha seu protocolo e comece agora!'}
            {etapa === 'ativo' && 'Jejum em andamento - Você consegue!'}
            {etapa === 'historico' && 'Seu histórico de jejuns'}
          </p>
        </div>

        {/* ESTATÍSTICAS */}
        {estatisticas && estatisticas.total_jejuns > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-purple-600">{estatisticas.total_jejuns}</div>
              <div className="text-sm text-gray-600">Total de Jejuns</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-600">{estatisticas.horas_totais}h</div>
              <div className="text-sm text-gray-600">Horas Totais</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-cyan-600">{estatisticas.maior_jejum}h</div>
              <div className="text-sm text-gray-600">Maior Jejum</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-600">{estatisticas.sequencia_atual}</div>
              <div className="text-sm text-gray-600">Dias Seguidos</div>
            </div>
          </div>
        )}

        {/* NAVEGAÇÃO */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setEtapa('selecao')}
            className={`px-6 py-3 rounded-xl font-bold ${
              etapa === 'selecao'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            🎯 Protocolos
          </button>
          <button
            onClick={() => setEtapa('historico')}
            className={`px-6 py-3 rounded-xl font-bold ${
              etapa === 'historico'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            📊 Histórico
          </button>
        </div>

        {/* SELEÇÃO DE PROTOCOLO */}
        {etapa === 'selecao' && !sessaoAtiva && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PROTOCOLOS_JEJUM).map(([key, protocolo]) => (
              <div
                key={key}
                className="bg-white rounded-3xl shadow-2xl p-8 hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-purple-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{protocolo.nome}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    protocolo.nivel_dificuldade === 'iniciante' ? 'bg-green-100 text-green-700' :
                    protocolo.nivel_dificuldade === 'intermediario' ? 'bg-blue-100 text-blue-700' :
                    protocolo.nivel_dificuldade === 'avancado' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {protocolo.nivel_dificuldade}
                  </span>
                </div>

                <p className="text-gray-700 mb-6">{protocolo.descricao}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">⏱️</span>
                    <div>
                      <div className="font-bold text-gray-900">Jejum: {protocolo.horas_jejum}h</div>
                      <div className="text-sm text-gray-600">Alimentação: {protocolo.horas_alimentacao}h</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🍽️</span>
                    <div className="text-gray-700">{protocolo.refeicoes_sugeridas} refeições</div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="font-bold text-green-800 mb-2">✅ Benefícios:</div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {protocolo.beneficios.slice(0, 3).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {protocolo.contraindicacoes.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="font-bold text-red-800 mb-2">⚠️ Contraindicações:</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {protocolo.contraindicacoes.slice(0, 2).map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => iniciarJejum(key)}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:shadow-xl"
                >
                  🚀 Iniciar Jejum
                </button>
              </div>
            ))}
          </div>
        )}

        {/* JEJUM ATIVO */}
        {etapa === 'ativo' && sessaoAtiva && progresso && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              
              {/* CRONÔMETRO CIRCULAR */}
              <div className="flex flex-col items-center mb-12">
                <div className="relative w-80 h-80">
                  <svg className="transform -rotate-90 w-80 h-80">
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      fill="none"
                    />
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke="url(#gradient)"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 140}`}
                      strokeDashoffset={`${2 * Math.PI * 140 * (1 - progresso.percentual / 100)}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                      {progresso.percentual}%
                    </div>
                    <div className="text-xl text-gray-700 font-bold">
                      {Math.floor(progresso.horas_restantes)}h {Math.floor((progresso.horas_restantes % 1) * 60)}min
                    </div>
                    <div className="text-sm text-gray-500">restantes</div>
                  </div>
                </div>
              </div>

              {/* INFORMAÇÕES */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                  <div className="text-4xl mb-2">⏰</div>
                  <div className="text-sm text-gray-600">Tempo em jejum</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {Math.floor(progresso.horas_passadas)}h {Math.floor((progresso.horas_passadas % 1) * 60)}min
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-green-50 rounded-2xl p-6">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-sm text-gray-600">Fase atual</div>
                  <div className="text-xl font-bold text-gray-900">{progresso.fase_atual}</div>
                </div>
              </div>

              {progresso.proxima_fase && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <div className="font-bold text-blue-900">Próxima fase:</div>
                      <div className="text-blue-700">
                        {progresso.proxima_fase.nome} em {Math.floor(progresso.proxima_fase.em_horas)}h
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DICAS */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                <div className="font-bold text-green-900 mb-3">💡 Dicas durante o jejum:</div>
                <ul className="space-y-2 text-green-800">
                  <li>💧 Beba muita água</li>
                  <li>☕ Café e chá sem açúcar são permitidos</li>
                  <li>🚶 Caminhe se sentir fome</li>
                  <li>😴 Descanse se necessário</li>
                  <li>🧘 Respire fundo se sentir ansiedade</li>
                </ul>
              </div>

              {/* BOTÕES */}
              <div className="flex gap-4">
                <button
                  onClick={() => finalizarJejum('bom')}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-xl"
                >
                  ✅ Finalizar Jejum
                </button>
                <button
                  onClick={cancelarJejum}
                  className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HISTÓRICO */}
        {etapa === 'historico' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">📊 Seu Histórico</h2>
              
              {estatisticas && estatisticas.total_jejuns > 0 ? (
                <div className="space-y-4">
                  {TrackerJejum.buscarHistorico('user').reverse().map((sessao, i) => (
                    <div key={i} className={`border-2 rounded-2xl p-6 ${
                      sessao.status === 'concluido' ? 'border-green-200 bg-green-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">
                            {PROTOCOLOS_JEJUM[sessao.protocolo_id]?.nome || 'Protocolo'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(sessao.inicio).toLocaleDateString('pt-BR')} - 
                            {sessao.duracao_horas}h
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold ${
                          sessao.status === 'concluido' ? 'bg-green-200 text-green-800' :
                          sessao.status === 'cancelado' ? 'bg-red-200 text-red-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {sessao.status === 'concluido' ? '✅ Completo' :
                           sessao.status === 'cancelado' ? '❌ Cancelado' :
                           '🔄 Em andamento'}
                        </div>
                      </div>
                      
                      {sessao.como_se_sentiu && (
                        <div className="mt-4 text-sm text-gray-700">
                          Como se sentiu: <span className="font-bold">{sessao.como_se_sentiu}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏁</div>
                  <div className="text-xl text-gray-700">Ainda não há histórico</div>
                  <div className="text-gray-600">Comece seu primeiro jejum agora!</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
