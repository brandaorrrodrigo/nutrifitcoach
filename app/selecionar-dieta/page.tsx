'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DIET_PROFILES } from '@/lib/diet-profiles/detector';

export default function SelecionarDietaPage() {
  const router = useRouter();
  const [anamnese, setAnamnese] = useState<any>(null);
  const [perfilDetectado, setPerfilDetectado] = useState<any>(null);
  const [perfilSelecionado, setPerfilSelecionado] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar anamnese
    const plano = JSON.parse(localStorage.getItem('plano') || '{}');
    if (plano.analises) {
      setAnamnese(plano);
      
      // Detectar perfil automaticamente
      const { detectarPerfilAlimentar } = require('@/lib/diet-profiles/detector');
      const resultado = detectarPerfilAlimentar(plano);
      
      setPerfilDetectado(resultado.perfil_principal);
      setPerfilSelecionado(resultado.perfil_principal.perfil);
    }
  }, []);

  const handleConfirmar = async () => {
    setLoading(true);
    
    try {
      // Gerar cardápio com o perfil selecionado
      const response = await fetch('/api/gerar-cardapio-por-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anamnese,
          perfilId: perfilSelecionado
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('plano', JSON.stringify(data));
        
        // Adicionar pontos
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.points = (userData.points || 0) + 50;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar cardápio');
    } finally {
      setLoading(false);
    }
  };

  if (!perfilDetectado) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          🎯 Selecione Seu Tipo de Dieta
        </h1>
        <p className="text-center text-xl text-gray-700 mb-12">
          Baseado na sua anamnese, recomendamos:
        </p>

        {/* PERFIL RECOMENDADO */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl shadow-2xl p-8 text-white mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{perfilDetectado.detalhes.emoji}</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Recomendado: {perfilDetectado.detalhes.nome}
              </h2>
              <p className="text-lg opacity-90">
                {perfilDetectado.detalhes.descricao}
              </p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-4xl font-bold">{perfilDetectado.score}%</div>
              <div className="text-sm opacity-90">Compatibilidade</div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Por que recomendamos esta dieta?</h3>
            <ul className="space-y-2">
              {perfilDetectado.score >= 100 && (
                <li>✅ Você marcou esta preferência na anamnese</li>
              )}
              {anamnese.doencasPreExistentes?.length > 0 && (
                <li>✅ Adequada para suas condições de saúde</li>
              )}
              {anamnese.objetivo && (
                <li>✅ Alinhada com seu objetivo: {anamnese.objetivo}</li>
              )}
              <li>✅ Consideramos suas preferências alimentares</li>
              <li>✅ Respeita suas restrições e intolerâncias</li>
            </ul>
          </div>
        </div>

        {/* TODOS OS PERFIS */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ou escolha outro tipo de dieta:
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(DIET_PROFILES).map(([key, perfil]) => {
            const isSelected = perfilSelecionado === key;
            const isRecommended = perfilDetectado.perfil === key;
            
            return (
              <div
                key={key}
                onClick={() => setPerfilSelecionado(key)}
                className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-4 border-purple-500 scale-105'
                    : 'border-2 border-gray-200 hover:border-purple-300'
                }`}
              >
                {isRecommended && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                    ⭐ Recomendado
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl">{perfil.emoji}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{perfil.nome}</h3>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{perfil.descricao}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-semibold">Macros:</span>
                    <span>P: {perfil.macros_padrao.proteina}%</span>
                    <span>C: {perfil.macros_padrao.carboidrato}%</span>
                    <span>G: {perfil.macros_padrao.gordura}%</span>
                  </div>
                  
                  {perfil.suplementos_obrigatorios && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <span className="text-red-700 font-semibold">⚠️ Suplemento obrigatório:</span>
                      <div className="text-red-600">{perfil.suplementos_obrigatorios.join(', ')}</div>
                    </div>
                  )}
                  
                  {perfil.suplementos_sugeridos && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <span className="text-blue-700 font-semibold">💊 Suplementos sugeridos:</span>
                      <div className="text-blue-600">{perfil.suplementos_sugeridos.join(', ')}</div>
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-center font-bold">
                    ✓ Selecionado
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTÃO CONFIRMAR */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300"
          >
            ← Voltar
          </button>
          
          <button
            onClick={handleConfirmar}
            disabled={loading || !perfilSelecionado}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl hover:shadow-xl disabled:opacity-50"
          >
            {loading ? '⏳ Gerando...' : '🎉 Confirmar e Gerar Cardápio'}
          </button>
        </div>
      </div>
    </div>
  );
}
