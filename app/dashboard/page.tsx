'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getColorScheme } from '@/lib/colors';
import dynamic from 'next/dynamic';

const GamificationPanel = dynamic(() => import('@/app/components/GamificationPanel'), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [plano, setPlano] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [gamificationOpen, setGamificationOpen] = useState(false);
  const [listaComprasOpen, setListaComprasOpen] = useState(false);
  const [listaCompras, setListaCompras] = useState<any>(null);
  const [userData, setUserData] = useState<any>({ points: 0, level: 1, streak: 0 });
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou seu nutricionista virtual.' }
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [listaLoading, setListaLoading] = useState(false);

  useEffect(() => {
    const planoSalvo = localStorage.getItem('plano');
    if (planoSalvo) {
      const planoData = JSON.parse(planoSalvo);
      setPlano(planoData);
      salvarNoHistorico(planoData);
      
      // Primeira visita? Badge!
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (!userData.badges || !userData.badges.includes('FIRST_PLAN')) {
        fetch('/api/gamification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'first_plan' })
        });
      }
    }

    // Carregar dados do usuário
    const saved = JSON.parse(localStorage.getItem('userData') || '{"points": 0, "level": 1, "streak": 0}');
    setUserData(saved);

    // Check-in diário automático
    const lastCheckIn = saved.lastCheckIn ? new Date(saved.lastCheckIn).toDateString() : null;
    const today = new Date().toDateString();
    
    if (lastCheckIn !== today) {
      fetch('/api/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_in' })
      }).then(() => {
        const updated = JSON.parse(localStorage.getItem('userData') || '{}');
        setUserData(updated);
      });
    }

    setLoading(false);
  }, []);

  const salvarNoHistorico = (planoData: any) => {
    const historico = JSON.parse(localStorage.getItem('historico_planos') || '[]');
    historico.unshift({ ...planoData, createdAt: new Date().toISOString() });
    localStorage.setItem('historico_planos', JSON.stringify(historico.slice(0, 10)));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.clear();
    router.push('/');
  };

  const handleDownloadPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const response = await fetch('/api/gerar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano })
      });
      const data = await response.json();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(data.html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    } catch (error) {
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleGerarListaCompras = async () => {
    if (listaLoading) return;
    setListaLoading(true);
    try {
      const response = await fetch('/api/gerar-lista-compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano })
      });
      const data = await response.json();
      setListaCompras(data.lista);
      setListaComprasOpen(true);
    } catch (error) {
      alert('Erro ao gerar lista de compras. Tente novamente.');
    } finally {
      setListaLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, plano, historico: newMessages.slice(1) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro');
      setMessages([...newMessages, { role: 'assistant', content: data.resposta }]);
    } catch (error: any) {
      setMessages([...newMessages, { role: 'assistant', content: `Erro: ${error.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!plano) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Nenhum Plano Gerado</h1>
          <Link href="/anamnese" className="inline-block bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 text-white px-12 py-5 rounded-xl font-bold text-xl">
            Fazer Anamnese
          </Link>
        </div>
      </div>
    );
  }

  const colors = getColorScheme(plano.usuario.sexo || 'masculino');
  const progressPercent = (userData.points % 100);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            NUTRIFITCOACH
          </Link>

          {/* BARRA DE XP */}
          <div 
            onClick={() => setGamificationOpen(true)}
            className="flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full cursor-pointer hover:scale-105 transition-all"
          >
            <div className="text-white font-bold">
              Nível {userData.level}
            </div>
            <div className="w-32 bg-white/30 rounded-full h-3">
              <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="text-white font-bold">
              {userData.points} pts
            </div>
            {userData.streak > 0 && (
              <div className="text-2xl">
                🔥{userData.streak}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link href="/perfil" className="px-4 py-2 text-gray-700 font-semibold hover:text-purple-600">👤</Link>
            <Link href="/minha-anamnese" className="px-4 py-2 text-gray-700 font-semibold hover:text-purple-600">🏥</Link>
            <Link href="/progresso" className="px-4 py-2 text-gray-700 font-semibold hover:text-purple-600">📈</Link>
            {/* FOTOS */}
            <Link href="/minhas-fotos" className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all">
              <div className="text-5xl mb-3">📸</div>
              <h3 className="text-xl font-bold mb-2">Minhas Fotos</h3>
              <p className="opacity-90">Ver evolução visual</p>
            </Link>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfLoading ? '⏳' : '📄'}
            </button>
            <button
              onClick={handleGerarListaCompras}
              disabled={listaLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {listaLoading ? '⏳' : '🛒'}
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold">Sair</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className={`bg-gradient-to-r ${colors.primary} text-white py-16 shadow-2xl`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Seu Plano Nutricional</h1>
          {plano.geradoComIA && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
              <span className="font-bold">🤖 Gerado com IA</span>
            </div>
          )}
          <p className="text-2xl mb-2 font-semibold">{plano.usuario.nome} • {plano.usuario.peso}kg</p>
          <div className="flex justify-center gap-6 text-lg mt-6 flex-wrap">
            <div className="bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-bold">{plano.calorias} kcal</div>
            <div className="bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-bold">{plano.macros.proteina}g prot</div>
            <div className="bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-bold">{plano.macros.carboidrato}g carb</div>
            <div className="bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-bold">{plano.macros.gordura}g gord</div>
          </div>
        </div>
      </div>

      {/* REFEIÇÕES */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {Object.entries(plano.refeicoes).map(([key, refeicao]: [string, any]) => (
            <div key={key} className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
              <div className={`bg-gradient-to-r ${colors.card} text-white p-6`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{refeicao.nome}</h2>
                    <p className="text-xl font-semibold">{refeicao.horario}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{refeicao.macros.calorias} kcal</div>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gray-50">
                <div className="space-y-4">
                  {refeicao.alimentos.map((alimento: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-md border-2 border-gray-200">
                      <div className="flex-1">
                        <div className="font-bold text-2xl text-gray-900 mb-1">{alimento.nome}</div>
                        <div className="text-lg text-gray-700 font-semibold">{alimento.quantidade}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{alimento.calorias}</div>
                        <div className="text-sm text-gray-600 font-semibold">kcal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-12 bg-gradient-to-r ${colors.badge} rounded-3xl shadow-2xl p-10 text-white text-center`}>
          <h3 className="text-4xl font-bold mb-3">NUTRIFITCOACH.COM.BR</h3>
          <p className="text-2xl mb-6 font-semibold">Nutrição com IA</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/anamnese" className={`inline-block bg-gradient-to-r ${colors.button} text-white px-12 py-5 rounded-xl font-bold text-xl`}>
            Gerar Novo Plano
          </Link>
        </div>
      </div>

      {/* BOTÃO CHAT */}
      <button onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 rounded-full shadow-2xl hover:scale-110 transition-all" style={{ width: '80px', height: '80px', fontSize: '32px' }}>💬</button>

      {/* MODAIS */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[600px] flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 via-green-500 to-cyan-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-3xl font-bold">Nutricionista IA</h2>
              <button onClick={() => setChatOpen(false)} className="text-white text-4xl font-bold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-900'}`}>
                    <p className="whitespace-pre-wrap text-lg">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-white rounded-b-3xl">
              <div className="flex gap-3">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Digite..." className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg text-gray-900" />
                <button onClick={handleSendMessage} disabled={chatLoading || !input.trim()} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-600 text-white rounded-2xl font-bold disabled:opacity-50">Enviar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {listaComprasOpen && listaCompras && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-3xl font-bold">🛒 Lista de Compras</h2>
              <button onClick={() => setListaComprasOpen(false)} className="text-white text-4xl font-bold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {Object.entries(listaCompras).map(([categoria, itens]: [string, any]) => (
                itens.length > 0 && (
                  <div key={categoria} className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 pb-2">{categoria}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {itens.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                          <input type="checkbox" className="w-5 h-5" />
                          <div>
                            <div className="font-bold text-gray-900">{item.nome}</div>
                            <div className="text-sm text-gray-600">{item.quantidade}x</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-3xl">
              <button onClick={() => window.print()} className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl font-bold text-lg">Imprimir</button>
            </div>
          </div>
        </div>
      )}

      {gamificationOpen && <GamificationPanel onClose={() => setGamificationOpen(false)} />}
    </div>
  );
}


