'use client';

import { useState } from 'react';

export default function PlanosPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      
      if (!res.ok) throw new Error('Erro ao criar checkout');
      
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Comece com teste grátis • Cancele quando quiser
          </p>
          <p className="text-gray-500">
            Sem compromisso • Sem multa de cancelamento
          </p>
        </div>

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Mensal */}
          <div className="p-8 bg-white rounded-3xl border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mb-4">
                Flexível
              </span>
              <h3 className="text-3xl font-bold mb-2">Plano Mensal</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-purple-600">R$ 100</span>
                <span className="text-gray-500 text-xl">/mês</span>
              </div>
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold">
                🎁 15 dias GRÁTIS
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Plano alimentar personalizado por IA</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Treino personalizado</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Ajustes automáticos semanais</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Chat com IA 24/7</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Sistema de pontos e conquistas</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Acesso total: web, mobile, desktop</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Cancele quando quiser</span>
              </li>
            </ul>

            <button
              onClick={() => handleCheckout('price_1SMzQKIeJpmK2IsPRPdjq3eP')}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Começar Teste Grátis'}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Você não será cobrado durante o teste de 15 dias
            </p>
          </div>

          {/* Anual */}
          <div className="p-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl hover:shadow-2xl transition-all relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              ⭐ MELHOR VALOR
            </div>
            
            <div className="text-center mb-6 mt-4">
              <span className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm mb-4">
                Mais Popular
              </span>
              <h3 className="text-3xl font-bold text-white mb-2">Plano Anual</h3>
              <div className="mb-2">
                <span className="text-5xl font-bold text-white">R$ 1.000</span>
                <span className="text-purple-100 text-xl">/ano</span>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                R$ 83/mês • Economize 17%
              </p>
              <div className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-bold">
                🎁 30 dias GRÁTIS
              </div>
            </div>

            <ul className="space-y-4 mb-8 text-white">
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>Tudo do plano mensal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 text-xl">✓</span>
                <span className="font-bold">2 meses grátis no ano</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 text-xl">✓</span>
                <span className="font-bold">30 dias de teste (dobro!)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>Prioridade no suporte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>Economia de R$ 200/ano</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>Desconto em produtos parceiros</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>Acesso antecipado a novidades</span>
              </li>
            </ul>

            <button
              onClick={() => handleCheckout('price_1SMzQKIeJpmK2IsPghHic8vL')}
              disabled={loading}
              className="w-full py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Começar Teste Grátis'}
            </button>
            
            <p className="text-center text-xs text-purple-100 mt-4">
              Você não será cobrado durante o teste de 30 dias
            </p>
          </div>
        </div>

        {/* Comparação */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Por que o Anual?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">💰</div>
                <div className="font-bold text-purple-600">R$ 200</div>
                <div className="text-sm text-gray-600">Economia no ano</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🎁</div>
                <div className="font-bold text-purple-600">2 meses</div>
                <div className="text-sm text-gray-600">Grátis</div>
              </div>
              <div>
                <div className="text-4xl mb-2">⏰</div>
                <div className="font-bold text-purple-600">30 dias</div>
                <div className="text-sm text-gray-600">Teste grátis</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold cursor-pointer text-lg">
                Como funciona o teste grátis?
              </summary>
              <p className="mt-3 text-gray-600">
                Durante o período de teste (15 dias no mensal, 30 dias no anual), você tem acesso total a todas as funcionalidades. Se cancelar antes do fim do teste, não será cobrado nada.
              </p>
            </details>
            
            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold cursor-pointer text-lg">
                Posso cancelar a qualquer momento?
              </summary>
              <p className="mt-3 text-gray-600">
                Sim! Não há multas ou taxas de cancelamento. Você mantém acesso até o fim do período pago.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold cursor-pointer text-lg">
                Como são feitos os ajustes no plano?
              </summary>
              <p className="mt-3 text-gray-600">
                A IA monitora seu progresso e ajusta automaticamente seu plano alimentar e treino toda semana com base nos seus resultados e feedback.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold cursor-pointer text-lg">
                Posso mudar de plano depois?
              </summary>
              <p className="mt-3 text-gray-600">
                Sim! Você pode fazer upgrade do mensal para o anual a qualquer momento e aproveitamos o valor já pago.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-md">
              <summary className="font-semibold cursor-pointer text-lg">
                Quais formas de pagamento?
              </summary>
              <p className="mt-3 text-gray-600">
                Aceitamos cartão de crédito via Stripe (sistema seguro internacional). O pagamento é automático mensalmente ou anualmente.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
