'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function PrecosPage() {
  const sp = useSearchParams();
  const refSlug = sp.get('ref') || '';

  const hasReferral = useMemo(() => !!refSlug, [refSlug]);

  // Preços-base
  const MONTHLY_BASE = 100;
  const ANNUAL_BASE = 1000;

  // Cálculo do desconto de indicação (5% OFF na 1ª cobrança)
  const monthlyFirstChargeWithRef = MONTHLY_BASE * 0.95; // 95,00
  const annualFirstChargeWithRef = ANNUAL_BASE * 0.95;   // 950,00

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            💎 Planos e Preços
          </h1>
          <p className="text-2xl text-gray-700">
            Escolha o plano perfeito para transformar sua alimentação
          </p>

          {/* Aviso de indicação ativa (5% OFF na 1ª cobrança) */}
          {hasReferral && (
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-100 text-emerald-800 font-semibold shadow">
              <span>🎁 Indicação ativa: <strong>5% OFF</strong> na 1ª cobrança</span>
              <span className="text-sm opacity-80">ref: {refSlug}</span>
            </div>
          )}
        </div>

        {/* PLANOS */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* PLANO MENSAL */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 hover:scale-105 transition-all">
            <div className="text-center mb-8">
              <div className="inline-block bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full font-bold mb-4">
                15 DIAS GRÁTIS
              </div>
              <h2 className="text-3xl font-bold mb-2">Mensal</h2>
              <div className="text-6xl font-bold text-cyan-600 mb-2">
                R$ {MONTHLY_BASE}
                <span className="text-2xl text-gray-600">/mês</span>
              </div>
              <p className="text-gray-600">Cancele quando quiser</p>

              {/* Linha de preço com indicação (5% OFF na primeira cobrança) */}
              {hasReferral && (
                <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                  Via indicação: 1ª cobrança por <strong>R$ {monthlyFirstChargeWithRef.toFixed(2).replace('.', ',')}</strong>
                </p>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>Cardápios personalizados</strong> ilimitados</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>11 tipos de dietas</strong> diferentes</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>IA para ajustes</strong> inteligentes</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>Jejum Intermitente</strong> (7 protocolos)</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>Periodização Menstrual</strong> completa</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>Ciclo de Carboidratos</strong> (5 protocolos)</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>CKD Dan Duchaine</strong> completo</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>Clean &amp; Free</strong> para mulheres</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>Lista de compras</strong> automática</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>Substituições</strong> automáticas</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span>Suporte prioritário</span></li>
            </ul>

            <form action="/api/create-checkout-session" method="POST">
              <input type="hidden" name="priceId" value="price_1SPB0ORDXdPv3IndFDjlqWa4" />
              {/* Propaga a indicação, se existir */}
              {hasReferral && <input type="hidden" name="ref" value={refSlug} />}
              <button
                type="submit"
                className="block w-full py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-center rounded-xl font-bold text-xl hover:shadow-2xl transition-all"
              >
                🚀 Começar 15 Dias Grátis
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Sem compromisso • Cancele quando quiser
            </p>
          </div>

          {/* PLANO ANUAL */}
          <div className="bg-gradient-to-br from-purple-600 to-cyan-600 rounded-3xl shadow-2xl p-10 relative overflow-hidden transform scale-105">
            
            {/* Badge de Destaque */}
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-sm rotate-12 shadow-xl">
              ⭐ MAIS POPULAR
            </div>

            <div className="text-center mb-8 text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold mb-4">
                30 DIAS GRÁTIS
              </div>
              <h2 className="text-3xl font-bold mb-2">Anual</h2>
              <div className="text-6xl font-bold mb-2">
                R$ {ANNUAL_BASE}
                <span className="text-2xl">/ano</span>
              </div>
              <div className="text-xl opacity-90 mb-4">
                Apenas R$ {(ANNUAL_BASE/12).toFixed(2).replace('.', ',')}/mês
              </div>

              {/* Box de economia + selo Fundadores */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 space-y-2">
                <p className="font-bold text-lg">💰 Economize R$ {(12*MONTHLY_BASE - ANNUAL_BASE).toFixed(0)} por ano!</p>
                <p className="text-sm opacity-90">(Comparado ao plano mensal)</p>
                <p className="text-sm opacity-90">
                  💎 <strong>Fundadores:</strong> benefícios exclusivos para quem mantém o anual após o teste.
                </p>
              </div>

              {/* Linha de preço com indicação (5% OFF na primeira cobrança) */}
              {hasReferral && (
                <p className="mt-3 text-sm text-emerald-100 bg-white/20 inline-block px-3 py-1 rounded-full">
                  Via indicação: 1ª cobrança por <strong>R$ {annualFirstChargeWithRef.toFixed(2).replace('.', ',')}</strong>
                </p>
              )}
            </div>

            <ul className="space-y-4 mb-8 text-white">
              <li className="flex items-start gap-3"><span className="text-2xl">✅</span><span><strong>TUDO</strong> do plano mensal</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">⭐</span><span className="font-bold">30 DIAS de teste grátis (o dobro!)</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">⭐</span><span className="font-bold">Suporte VIP prioritário</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">⭐</span><span className="font-bold">Materiais exclusivos</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">⭐</span><span className="font-bold">Grupo exclusivo de membros</span></li>
              <li className="flex items-start gap-3"><span className="text-2xl">💎</span><span className="font-bold text-yellow-300">Benefícios de Fundador após o teste</span></li>
            </ul>

            <form action="/api/create-checkout-session" method="POST">
              <input type="hidden" name="priceId" value="price_1SPB1MRDXdPv3IndaW0AKyWe" />
              {/* Propaga a indicação, se existir */}
              {hasReferral && <input type="hidden" name="ref" value={refSlug} />}
              <button
                type="submit"
                className="block w-full py-5 bg-white text-purple-600 text-center rounded-xl font-bold text-xl hover:shadow-2xl transition-all"
              >
                💎 Começar 30 Dias Grátis
              </button>
            </form>
            
            <p className="text-center text-sm text-white/80 mt-4">
              Melhor custo-benefício • Cancele quando quiser
            </p>
          </div>

        </div>

        {/* COMPARAÇÃO */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">📊 Comparação de Planos</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4">Funcionalidade</th>
                    <th className="text-center py-4 px-4">Mensal</th>
                    <th className="text-center py-4 px-4 bg-purple-50">Anual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 px-4">Teste grátis</td>
                    <td className="text-center py-4 px-4">15 dias</td>
                    <td className="text-center py-4 px-4 bg-purple-50 font-bold">30 dias</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Valor mensal</td>
                    <td className="text-center py-4 px-4">R$ {MONTHLY_BASE}</td>
                    <td className="text-center py-4 px-4 bg-purple-50 font-bold">R$ {(ANNUAL_BASE/12).toFixed(2).replace('.', ',')}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">1ª cobrança com indicação (5%)</td>
                    <td className="text-center py-4 px-4">R$ {monthlyFirstChargeWithRef.toFixed(2).replace('.', ',')}</td>
                    <td className="text-center py-4 px-4 bg-purple-50">R$ {annualFirstChargeWithRef.toFixed(2).replace('.', ',')}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Cardápios ilimitados</td>
                    <td className="text-center py-4 px-4">✅</td>
                    <td className="text-center py-4 px-4 bg-purple-50">✅</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Jejum Intermitente</td>
                    <td className="text-center py-4 px-4">✅</td>
                    <td className="text-center py-4 px-4 bg-purple-50">✅</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Suporte VIP</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4 bg-purple-50">⭐</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Grupo exclusivo</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4 bg-purple-50">⭐</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Economia anual</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4 bg-purple-50 font-bold text-green-600">
                      R$ {(12*MONTHLY_BASE - ANNUAL_BASE).toFixed(0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Observação de Fundadores e comissão (sem detalhes técnicos) */}
            <div className="mt-6 text-sm text-gray-600">
              <p>💎 <strong>Fundadores:</strong> status e benefícios exclusivos para quem mantém o plano anual após os 30 dias de teste, enquanto houver vagas.</p>
              <p>🎁 <strong>Indicação (Fundador):</strong> 5% OFF na primeira cobrança do indicado. Comissão do Fundador: 20% no mensal (1ª cobrança) e 15% no anual (1ª cobrança, teto R$ 150). Cancelamentos/refundos durante o teste anulam a comissão.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">❓ Perguntas Frequentes</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">📱 Como funciona o teste grátis?</h3>
              <p className="text-gray-700">
                <strong>Plano Mensal:</strong> 15 dias totalmente grátis (cartão obrigatório).<br />
                <strong>Plano Anual:</strong> 30 dias totalmente grátis (cartão obrigatório).<br /><br />
                Se não gostar, basta cancelar antes do fim do período grátis que nada será cobrado.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">🎁 Como funciona o desconto por indicação?</h3>
              <p className="text-gray-700">
                Se você chegou por um link/cupom de um Fundador, ganha <strong>5% OFF na 1ª cobrança</strong>. 
                Isso vale para o primeiro mês (plano mensal) ou para o primeiro ano (plano anual). Renovações seguem sem esse desconto.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">💳 Como funciona o pagamento?</h3>
              <p className="text-gray-700">
                Pagamento 100% seguro via <strong>Stripe</strong>. Aceitamos cartões de crédito e débito. 
                Você pode cancelar quando quiser, sem multas.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">💎 Quem é Fundador?</h3>
              <p className="text-gray-700">
                Quem inicia o teste do <strong>plano anual (30 dias)</strong> e mantém a assinatura no primeiro pagamento, 
                enquanto houver vagas. Fundadores têm benefícios exclusivos e insígnia no perfil.
              </p>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-12">
            <h2 className="text-5xl font-bold text-white mb-4">
              🚀 Pronto para transformar sua alimentação?
            </h2>
            <p className="text-2xl text-white/90 mb-8">
              Junte-se a milhares de pessoas que já estão tendo resultados incríveis!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <form action="/api/create-checkout-session" method="POST" className="inline-block">
                <input type="hidden" name="priceId" value="price_1SPB0ORDXdPv3IndFDjlqWa4" />
                {hasReferral && <input type="hidden" name="ref" value={refSlug} />}
                <button
                  type="submit"
                  className="px-10 py-5 bg-white text-cyan-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all"
                >
                  Plano Mensal - 15 Dias Grátis
                </button>
              </form>
              <form action="/api/create-checkout-session" method="POST" className="inline-block">
                <input type="hidden" name="priceId" value="price_1SPB1MRDXdPv3IndaW0AKyWe" />
                {hasReferral && <input type="hidden" name="ref" value={refSlug} />}
                <button
                  type="submit"
                  className="px-10 py-5 bg-yellow-400 text-purple-900 rounded-xl font-bold text-xl hover:shadow-2xl transition-all"
                >
                  💎 Plano Anual - 30 Dias Grátis
                </button>
              </form>
            </div>
            <p className="text-white/80 mt-6 text-lg">
              Sem compromisso • Cancele quando quiser • 100% Seguro
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
