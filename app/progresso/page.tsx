'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// ⚡ LAZY LOAD - Recharts carregado apenas quando necessário
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

export default function ProgressoPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    peso: '',
    cintura: '',
    quadril: '',
    braco: '',
    perna: '',
    notas: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('progress_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    const record = {
      ...newRecord,
      data: new Date().toISOString(),
      id: Date.now()
    };

    const updated = [...records, record];
    setRecords(updated);
    localStorage.setItem('progress_records', JSON.stringify(updated));
    
    setNewRecord({ peso: '', cintura: '', quadril: '', braco: '', perna: '', notas: '' });
    setShowModal(false);

    // Adicionar pontos
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.points = (userData.points || 0) + 15;
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const chartData = records.map(r => ({
    data: new Date(r.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    peso: parseFloat(r.peso)
  })).filter(r => !isNaN(r.peso));

  const pesoInicial = records.length > 0 ? parseFloat(records[0].peso) : 0;
  const pesoAtual = records.length > 0 ? parseFloat(records[records.length - 1].peso) : 0;
  const diferenca = pesoAtual - pesoInicial;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            NUTRIFITCOACH
          </Link>
          <Link href="/dashboard" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            Meu Progresso
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl"
          >
            + Novo Registro
          </button>
        </div>

        {/* RESUMO */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <div className="text-gray-600 mb-2">Peso Inicial</div>
            <div className="text-5xl font-bold text-gray-900">{pesoInicial.toFixed(1)} kg</div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <div className="text-gray-600 mb-2">Peso Atual</div>
            <div className="text-5xl font-bold text-purple-600">{pesoAtual.toFixed(1)} kg</div>
          </div>
          
          <div className={`rounded-3xl shadow-xl p-8 border-2 ${diferenca < 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-orange-500 to-red-600'} text-white`}>
            <div className="opacity-90 mb-2">Diferença</div>
            <div className="text-5xl font-bold">
              {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)} kg
            </div>
          </div>
        </div>

        {/* GRÁFICO */}
        {chartData.length > 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border-2 border-gray-200">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Evolução do Peso</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="peso" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* HISTÓRICO */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Histórico de Medidas</h2>
          
          {records.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">Nenhum registro ainda</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold"
              >
                Adicionar Primeiro Registro
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {records.reverse().map((record) => (
                <div key={record.id} className="p-6 bg-gradient-to-br from-cyan-50 to-purple-50 rounded-2xl border-2 border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{record.peso} kg</div>
                      <div className="text-gray-600">{new Date(record.data).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {record.cintura && <div><span className="text-gray-600">Cintura:</span> <span className="font-semibold">{record.cintura}cm</span></div>}
                    {record.quadril && <div><span className="text-gray-600">Quadril:</span> <span className="font-semibold">{record.quadril}cm</span></div>}
                    {record.braco && <div><span className="text-gray-600">Braço:</span> <span className="font-semibold">{record.braco}cm</span></div>}
                    {record.perna && <div><span className="text-gray-600">Perna:</span> <span className="font-semibold">{record.perna}cm</span></div>}
                  </div>
                  
                  {record.notas && (
                    <div className="mt-4 p-4 bg-white rounded-xl">
                      <p className="text-gray-700">{record.notas}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOVO REGISTRO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Novo Registro</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Peso (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={newRecord.peso}
                  onChange={(e) => setNewRecord({...newRecord, peso: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Cintura (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.cintura}
                    onChange={(e) => setNewRecord({...newRecord, cintura: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Quadril (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.quadril}
                    onChange={(e) => setNewRecord({...newRecord, quadril: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Braço (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.braco}
                    onChange={(e) => setNewRecord({...newRecord, braco: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Perna (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.perna}
                    onChange={(e) => setNewRecord({...newRecord, perna: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Notas</label>
                <textarea
                  value={newRecord.notas}
                  onChange={(e) => setNewRecord({...newRecord, notas: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                  rows={3}
                  placeholder="Como está se sentindo? Alguma observação?"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!newRecord.peso}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50"
              >
                Salvar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

