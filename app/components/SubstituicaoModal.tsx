'use client';

import { useState } from 'react';

interface SubstituicaoModalProps {
  alimento: string;
  onClose: () => void;
  onSubstituir: (novoAlimento: any) => void;
}

export default function SubstituicaoModal({ alimento, onClose, onSubstituir }: SubstituicaoModalProps) {
  const [substituicoes, setSubstituicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarSubstituicoes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/substituir-alimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alimento })
      });
      const data = await response.json();
      setSubstituicoes(data.substituicoes);
    } catch (error) {
      console.error('Erro ao buscar substituições:', error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    buscarSubstituicoes();
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Substituir: {alimento}</h2>
            <p className="text-gray-600 mt-2">Escolha uma alternativa com macros similares</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-4xl font-bold">
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {substituicoes.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSubstituir(sub);
                  onClose();
                }}
                className="w-full p-6 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition-all text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{sub.nome}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {sub.proteina && <span>Proteína: {sub.proteina}g</span>}
                      {sub.carboidrato && <span>Carboidrato: {sub.carboidrato}g</span>}
                      {sub.gordura && <span>Gordura: {sub.gordura}g</span>}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {sub.calorias} kcal
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
