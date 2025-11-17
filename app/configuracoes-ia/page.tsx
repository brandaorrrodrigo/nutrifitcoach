'use client';

import { useState, useEffect } from 'react';

export default function ConfiguracoesIAPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarStatus();
  }, []);

  const carregarStatus = async () => {
    try {
      const response = await fetch('/api/ai-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🤖 Configurações de IA
          </h1>
          <p className="text-xl text-gray-700">
            Status e configuração dos modelos de IA
          </p>
        </div>

        {/* STATUS DOS PROVEDORES */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* CLAUDE */}
          <div className={`rounded-3xl shadow-2xl p-8 ${
            status?.providers?.claude 
              ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
              : 'bg-gradient-to-br from-red-100 to-pink-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Claude (Anthropic)</h2>
              <span className={`text-5xl ${status?.providers?.claude ? '✅' : '❌'}`}>
                {status?.providers?.claude ? '✅' : '❌'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">Status</div>
                <div className={`text-lg font-bold ${
                  status?.providers?.claude ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status?.providers?.claude ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">Modelo</div>
                <div className="text-lg font-bold">Claude Sonnet 4.5</div>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">API Key</div>
                <div className="text-lg font-bold">
                  {status?.providers?.claude ? '✅ Configurada' : '❌ Não configurada'}
                </div>
              </div>
            </div>
          </div>

          {/* OLLAMA */}
          <div className={`rounded-3xl shadow-2xl p-8 ${
            status?.providers?.ollama 
              ? 'bg-gradient-to-br from-blue-100 to-cyan-100' 
              : 'bg-gradient-to-br from-yellow-100 to-orange-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">🦙 Ollama (Llama)</h2>
              <span className={`text-5xl ${status?.providers?.ollama ? '✅' : '❌'}`}>
                {status?.providers?.ollama ? '✅' : '❌'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">Status</div>
                <div className={`text-lg font-bold ${
                  status?.providers?.ollama ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status?.providers?.ollama ? 'RODANDO' : 'NÃO DETECTADO'}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">URL</div>
                <div className="text-sm font-mono">
                  {status?.config?.ollamaUrl || 'http://localhost:11434'}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-600">Modelo Padrão</div>
                <div className="text-lg font-bold">
                  {status?.config?.ollamaModel || 'llama3.1:8b'}
                </div>
              </div>
              
              {status?.ollamaModels && status.ollamaModels.length > 0 && (
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-2">Modelos Disponíveis</div>
                  <div className="space-y-1">
                    {status.ollamaModels.map((model: string, i: number) => (
                      <div key={i} className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                        {model}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CONFIGURAÇÃO ATUAL */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">⚙️ Configuração Atual</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
              <div className="text-lg text-gray-600 mb-2">Provedor Padrão</div>
              <div className="text-3xl font-bold">
                {status?.defaultProvider === 'claude' ? '🤖 Claude' : '🦙 Ollama'}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <div className="text-lg text-gray-600 mb-2">Fallback Automático</div>
              <div className="text-3xl font-bold">
                {status?.fallbackEnabled ? '✅ ATIVADO' : '❌ DESATIVADO'}
              </div>
            </div>
          </div>
        </div>

        {/* COMO FUNCIONA */}
        <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-6">💡 Como Funciona</h2>
          
          <div className="space-y-4 text-lg">
            <div className="bg-white rounded-xl p-4">
              <div className="font-bold mb-2">1️⃣ Provedor Padrão</div>
              <p className="text-gray-700">
                O sistema usa <strong>{status?.defaultProvider === 'claude' ? 'Claude' : 'Ollama'}</strong> como
                provedor principal para todas as funcionalidades de IA.
              </p>
            </div>
            
            {status?.fallbackEnabled && (
              <div className="bg-white rounded-xl p-4">
                <div className="font-bold mb-2">2️⃣ Fallback Automático</div>
                <p className="text-gray-700">
                  Se o provedor principal falhar, o sistema automaticamente tenta usar o outro
                  provedor disponível. Isso garante que o sistema sempre funcione!
                </p>
              </div>
            )}
            
            <div className="bg-white rounded-xl p-4">
              <div className="font-bold mb-2">3️⃣ Ollama Local</div>
              <p className="text-gray-700">
                Ollama roda <strong>localmente</strong> na sua máquina, usando suas GPUs RTX 3090.
                Mais rápido, mais privado, sem custos de API!
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <div className="font-bold mb-2">4️⃣ Claude na Nuvem</div>
              <p className="text-gray-700">
                Claude roda na nuvem da Anthropic. Mais poderoso para tarefas complexas,
                mas consome créditos de API.
              </p>
            </div>
          </div>
        </div>

        {/* INSTRUÇÕES */}
        {!status?.providers?.ollama && (
          <div className="mt-8 bg-yellow-100 border-2 border-yellow-400 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4">⚠️ Ollama Não Detectado</h3>
            <div className="space-y-3 text-lg">
              <p>Para ativar o Ollama local:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Certifique-se que o Ollama está rodando</li>
                <li>Verifique se está em <code className="bg-white px-2 py-1 rounded">http://localhost:11434</code></li>
                <li>Execute: <code className="bg-white px-2 py-1 rounded">ollama serve</code></li>
                <li>Recarregue esta página</li>
              </ol>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
