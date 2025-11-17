'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FotoProgresso {
  id: string;
  url: string;
  data: string;
  peso?: number;
  notas?: string;
  tipo: 'frente' | 'lado' | 'costas';
}

export default function MinhasFotosPage() {
  const [fotos, setFotos] = useState<FotoProgresso[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [peso, setPeso] = useState('');
  const [notas, setNotas] = useState('');
  const [visualizacao, setVisualizacao] = useState<'galeria' | 'comparacao'>('galeria');
  const [fotoAntes, setFotoAntes] = useState<string | null>(null);
  const [fotoDepois, setFotoDepois] = useState<string | null>(null);

  useEffect(() => {
    carregarFotos();
  }, []);

  const carregarFotos = () => {
    // Carregar fotos do localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const progressRecords = JSON.parse(localStorage.getItem('progressRecords') || '[]');
    const plano = JSON.parse(localStorage.getItem('plano') || '{}');
    
    const todasFotos: FotoProgresso[] = [];
    
    // Fotos da anamnese inicial
    if (plano.fotosUrls && Array.isArray(plano.fotosUrls)) {
      plano.fotosUrls.forEach((url: string, idx: number) => {
        todasFotos.push({
          id: `inicial-${idx}`,
          url,
          data: plano.dataAnamnese || new Date().toISOString(),
          peso: plano.usuario?.peso,
          tipo: idx === 0 ? 'frente' : idx === 1 ? 'lado' : 'costas',
          notas: 'Foto inicial (anamnese)'
        });
      });
    }
    
    // Fotos de progresso
    progressRecords.forEach((record: any) => {
      if (record.foto) {
        todasFotos.push({
          id: record.id || `progress-${record.createdAt}`,
          url: record.foto,
          data: record.createdAt,
          peso: record.peso,
          notas: record.notas,
          tipo: 'frente'
        });
      }
    });
    
    // Ordenar por data
    todasFotos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    
    setFotos(todasFotos);
    
    // Setar automaticamente primeira e última para comparação
    if (todasFotos.length >= 2) {
      setFotoAntes(todasFotos[todasFotos.length - 1].url);
      setFotoDepois(todasFotos[0].url);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Selecione pelo menos uma foto');
      return;
    }

    setUploading(true);

    try {
      const urls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-foto', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          urls.push(data.url);
        }
      }

      // Salvar registro de progresso
      const progressRecords = JSON.parse(localStorage.getItem('progressRecords') || '[]');
      
      urls.forEach((url, idx) => {
        progressRecords.push({
          id: `${Date.now()}-${idx}`,
          foto: url,
          peso: parseFloat(peso) || null,
          notas,
          createdAt: new Date().toISOString()
        });
      });

      localStorage.setItem('progressRecords', JSON.stringify(progressRecords));

      // Adicionar pontos
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.points = (userData.points || 0) + 20;
      localStorage.setItem('userData', JSON.stringify(userData));

      alert('✅ Fotos enviadas com sucesso! +20 pontos');
      
      setSelectedFiles([]);
      setPeso('');
      setNotas('');
      carregarFotos();

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao enviar fotos');
    } finally {
      setUploading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calcularDiferenca = () => {
    if (fotos.length < 2) return null;
    
    const primeira = fotos[fotos.length - 1];
    const ultima = fotos[0];
    
    if (!primeira.peso || !ultima.peso) return null;
    
    const diferenca = ultima.peso - primeira.peso;
    const diasEntre = Math.floor(
      (new Date(ultima.data).getTime() - new Date(primeira.data).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return { diferenca, diasEntre };
  };

  const stats = calcularDiferenca();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            NUTRIFITCOACH
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600">
              Dashboard
            </Link>
            <Link href="/progresso" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600">
              Progresso
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          📸 Minhas Fotos
        </h1>
        <p className="text-center text-xl text-gray-700 mb-8">
          Registre sua evolução visual
        </p>

        {/* ESTATÍSTICAS */}
        {stats && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-lg opacity-90 mb-2">Diferença de Peso</p>
                <p className="text-5xl font-bold">
                  {stats.diferenca > 0 ? '+' : ''}{stats.diferenca.toFixed(1)} kg
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg opacity-90 mb-2">Tempo de Jornada</p>
                <p className="text-5xl font-bold">{stats.diasEntre}</p>
                <p className="text-lg opacity-90">dias</p>
              </div>
              <div className="text-center">
                <p className="text-lg opacity-90 mb-2">Fotos Registradas</p>
                <p className="text-5xl font-bold">{fotos.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TOGGLE VISUALIZAÇÃO */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setVisualizacao('galeria')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              visualizacao === 'galeria'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            📱 Galeria
          </button>
          <button
            onClick={() => setVisualizacao('comparacao')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              visualizacao === 'comparacao'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            ⚖️ Comparação
          </button>
        </div>

        {/* UPLOAD DE NOVAS FOTOS */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">➕ Adicionar Nova Foto</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Selecione Fotos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
              />
              <p className="text-sm text-gray-600 mt-2">
                Tire fotos de frente, lado e costas (mesmo local, mesma luz)
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700">Peso Atual (kg)</label>
              <input
                type="number"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                placeholder="Ex: 75.5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-2 text-gray-700">Notas (Opcional)</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                rows={3}
                placeholder="Como você está se sentindo? Alguma mudança notável?"
              />
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl hover:shadow-xl disabled:opacity-50"
          >
            {uploading ? '⏳ Enviando...' : '📤 Enviar Fotos (+20 pontos)'}
          </button>
        </div>

        {/* GALERIA */}
        {visualizacao === 'galeria' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">📱 Todas as Fotos</h2>
            
            {fotos.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <p className="text-2xl text-gray-600 mb-4">Nenhuma foto ainda</p>
                <p className="text-gray-500">Adicione sua primeira foto acima!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {fotos.map((foto) => (
                  <div key={foto.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-all">
                    <div className="relative h-80 bg-gray-100">
                      <Image
                        src={foto.url}
                        alt={`Foto ${formatarData(foto.data)}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{formatarData(foto.data)}</p>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {foto.tipo}
                          </span>
                        </div>
                        {foto.peso && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">{foto.peso} kg</p>
                          </div>
                        )}
                      </div>
                      {foto.notas && (
                        <p className="text-sm text-gray-700 mt-3 italic">{foto.notas}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPARAÇÃO ANTES/DEPOIS */}
        {visualizacao === 'comparacao' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">⚖️ Comparação Antes & Depois</h2>
            
            {fotos.length < 2 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <p className="text-2xl text-gray-600 mb-4">Mínimo 2 fotos necessárias</p>
                <p className="text-gray-500">Adicione mais fotos para comparar sua evolução!</p>
              </div>
            ) : (
              <div>
                {/* SELEÇÃO DE FOTOS */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Foto ANTES</label>
                      <select
                        value={fotoAntes || ''}
                        onChange={(e) => setFotoAntes(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                      >
                        <option value="">Selecione...</option>
                        {fotos.map((foto) => (
                          <option key={foto.id} value={foto.url}>
                            {formatarData(foto.data)} - {foto.peso ? `${foto.peso}kg` : 'Sem peso'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Foto DEPOIS</label>
                      <select
                        value={fotoDepois || ''}
                        onChange={(e) => setFotoDepois(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900"
                      >
                        <option value="">Selecione...</option>
                        {fotos.map((foto) => (
                          <option key={foto.id} value={foto.url}>
                            {formatarData(foto.data)} - {foto.peso ? `${foto.peso}kg` : 'Sem peso'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* COMPARAÇÃO LADO A LADO */}
                {fotoAntes && fotoDepois && (
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* ANTES */}
                      <div>
                        <h3 className="text-2xl font-bold text-center mb-4 text-red-600">ANTES</h3>
                        <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden">
                          <Image
                            src={fotoAntes}
                            alt="Foto Antes"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-4 text-center">
                          {fotos.find(f => f.url === fotoAntes)?.peso && (
                            <p className="text-3xl font-bold text-gray-900">
                              {fotos.find(f => f.url === fotoAntes)?.peso} kg
                            </p>
                          )}
                          <p className="text-gray-600">
                            {formatarData(fotos.find(f => f.url === fotoAntes)?.data || '')}
                          </p>
                        </div>
                      </div>

                      {/* DEPOIS */}
                      <div>
                        <h3 className="text-2xl font-bold text-center mb-4 text-green-600">DEPOIS</h3>
                        <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden">
                          <Image
                            src={fotoDepois}
                            alt="Foto Depois"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-4 text-center">
                          {fotos.find(f => f.url === fotoDepois)?.peso && (
                            <p className="text-3xl font-bold text-gray-900">
                              {fotos.find(f => f.url === fotoDepois)?.peso} kg
                            </p>
                          )}
                          <p className="text-gray-600">
                            {formatarData(fotos.find(f => f.url === fotoDepois)?.data || '')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RESULTADO DA COMPARAÇÃO */}
                    {(() => {
                      const fAntes = fotos.find(f => f.url === fotoAntes);
                      const fDepois = fotos.find(f => f.url === fotoDepois);
                      
                      if (fAntes?.peso && fDepois?.peso) {
                        const diff = fDepois.peso - fAntes.peso;
                        const dias = Math.floor(
                          (new Date(fDepois.data).getTime() - new Date(fAntes.data).getTime()) / (1000 * 60 * 60 * 24)
                        );
                        
                        return (
                          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-2 border-green-200">
                            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">📊 Resultado</h3>
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                              <div>
                                <p className="text-gray-700 mb-2">Diferença</p>
                                <p className={`text-4xl font-bold ${diff <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-700 mb-2">Período</p>
                                <p className="text-4xl font-bold text-purple-600">{dias} dias</p>
                              </div>
                              <div>
                                <p className="text-gray-700 mb-2">Média</p>
                                <p className="text-4xl font-bold text-blue-600">
                                  {(diff / (dias / 7)).toFixed(2)} kg/sem
                                </p>
                              </div>
                            </div>
                            
                            {diff <= 0 && (
                              <div className="mt-6 text-center">
                                <p className="text-2xl font-bold text-green-600">
                                  🎉 Parabéns! Você está evoluindo! 🎉
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
