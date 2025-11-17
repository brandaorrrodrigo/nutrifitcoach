'use client';

import { useState } from 'react';

export default function LojaPage() {
  const [carrinho, setCarrinho] = useState<number[]>([]);

  const produtos = [
    {
      id: 1,
      nome: 'Whey Protein',
      preco: 120,
      desconto: 10,
      emoji: '🥤',
      descricao: 'Proteína de alta qualidade',
      categoria: 'Proteína',
    },
    {
      id: 2,
      nome: 'Creatina',
      preco: 80,
      desconto: 0,
      emoji: '💪',
      descricao: 'Ganho de força e massa',
      categoria: 'Performance',
    },
    {
      id: 3,
      nome: 'BCAA',
      preco: 65,
      desconto: 15,
      emoji: '⚡',
      descricao: 'Recuperação muscular',
      categoria: 'Recuperação',
    },
    {
      id: 4,
      nome: 'Ômega 3',
      preco: 45,
      desconto: 0,
      emoji: '🐟',
      descricao: 'Saúde cardiovascular',
      categoria: 'Saúde',
    },
    {
      id: 5,
      nome: 'Multivitamínico',
      preco: 55,
      desconto: 5,
      emoji: '💊',
      descricao: 'Vitaminas essenciais',
      categoria: 'Saúde',
    },
    {
      id: 6,
      nome: 'Pré-Treino',
      preco: 95,
      desconto: 20,
      emoji: '🔥',
      descricao: 'Energia e foco',
      categoria: 'Performance',
    },
  ];

  const adicionarCarrinho = (id: number) => {
    setCarrinho([...carrinho, id]);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, id) => {
      const produto = produtos.find((p) => p.id === id);
      if (produto) {
        const precoFinal = produto.preco * (1 - produto.desconto / 100);
        return total + precoFinal;
      }
      return total;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Loja de Suplementos
          </h1>
          <p className="text-xl text-gray-600">
            Produtos de qualidade para potencializar seus resultados
          </p>
        </div>

        {/* Carrinho Flutuante */}
        {carrinho.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 z-40 border-2 border-purple-500">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🛒</div>
              <div>
                <div className="font-bold text-gray-800">
                  {carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'}
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  R$ {calcularTotal().toFixed(2)}
                </div>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
                Finalizar
              </button>
            </div>
          </div>
        )}

        {/* Grade de Produtos */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {produtos.map((produto) => {
            const precoFinal = produto.preco * (1 - produto.desconto / 100);

            return (
              <div
                key={produto.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105"
              >
                {produto.desconto > 0 && (
                  <div className="bg-red-500 text-white text-center py-2 font-bold text-sm">
                    🏷️ {produto.desconto}% OFF
                  </div>
                )}

                <div className="p-8 text-center">
                  <div className="text-7xl mb-4">{produto.emoji}</div>
                  <div className="text-xs text-purple-600 font-semibold mb-2">
                    {produto.categoria}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {produto.nome}
                  </h3>
                  <p className="text-gray-600 mb-4">{produto.descricao}</p>

                  <div className="mb-6">
                    {produto.desconto > 0 && (
                      <div className="text-gray-400 line-through text-sm">
                        R$ {produto.preco.toFixed(2)}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-purple-600">
                      R$ {precoFinal.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => adicionarCarrinho(produto.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefícios */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Por que comprar conosco?
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">🚚</div>
              <div className="font-bold mb-1">Frete Grátis</div>
              <div className="text-sm text-gray-600">Acima de R$ 200</div>
            </div>
            <div>
              <div className="text-4xl mb-2">✅</div>
              <div className="font-bold mb-1">Garantia</div>
              <div className="text-sm text-gray-600">30 dias</div>
            </div>
            <div>
              <div className="text-4xl mb-2">💳</div>
              <div className="font-bold mb-1">Parcelamento</div>
              <div className="text-sm text-gray-600">Em até 12x</div>
            </div>
            <div>
              <div className="text-4xl mb-2">🎁</div>
              <div className="font-bold mb-1">Brindes</div>
              <div className="text-sm text-gray-600">Em compras acima de R$ 300</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
