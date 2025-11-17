'use client';

import Link from 'next/link';

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50">
      <div className="bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Escolha Seu Plano</h1>
          <p className="text-xl">Comece sua transformação hoje!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* MENSAL */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 hover:scale-105 transition-all">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-cyan-500 to-green-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                POPULAR
              </div>
              <h3 className="text-3xl font-bold mb-2">Plano Mensal</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent mb-2">
                R$ 100
              </div>
              <p className="text-gray-500">por mês</p>
            </div>
            
            <div className="space-y-3 mb-8">
              {['✓ 15 dias grátis', '✓ Planos personalizados', '✓ Chat IA 24/7', '✓ Receitas ilimitadas'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">{item.split(' ')[0]}</span>
                  <span className="text-gray-700">{item.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>

            <Link
              href="https://buy.stripe.com/test_14A00l3Y79j154L1y98Zq03"
              target="_blank"
              className="block w-full bg-gradient-to-r from-cyan-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all text-center"
            >
              Assinar Mensal
            </Link>
          </div>

          {/* ANUAL */}
          <div className="bg-gradient-to-br from-purple-600 to-cyan-600 rounded-3xl shadow-2xl p-8 text-white hover:scale-105 transition-all">
            <div className="text-center mb-8">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold mb-4">
                MELHOR VALOR
              </div>
              <h3 className="text-3xl font-bold mb-2">Plano Anual</h3>
              <div className="text-5xl font-bold mb-2">R$ 1.000</div>
              <p className="text-white/80">por ano</p>
            </div>

            <div className="space-y-3 mb-8">
              {['✓ 30 dias grátis', '✓ Tudo do plano mensal', '✓ Suporte prioritário', '✓ Economize R$ 200/ano'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-yellow-300 text-xl">{item.split(' ')[0]}</span>
                  <span>{item.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>

            <Link
              href="https://buy.stripe.com/test_cNiaEZamvgLt54Lb8J8Zq04"
              target="_blank"
              className="block w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all text-center"
            >
              Assinar Anual
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
