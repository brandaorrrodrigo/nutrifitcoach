'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NotificacoesPage() {
  const [whatsappNumero, setWhatsappNumero] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [lembretes, setLembretes] = useState({
    whatsapp: false,
    telegram: false,
    push: false
  });

  const handleWhatsAppSave = async () => {
    try {
      const response = await fetch('/api/lembretes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user123',
          plataforma: 'whatsapp',
          numero: whatsappNumero
        })
      });

      if (response.ok) {
        setLembretes({ ...lembretes, whatsapp: true });
        alert('✅ WhatsApp configurado! Você receberá lembretes.');
      }
    } catch (error) {
      alert('Erro ao configurar WhatsApp');
    }
  };

  const handleTelegramSave = async () => {
    try {
      const response = await fetch('/api/lembretes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user123',
          plataforma: 'telegram',
          numero: telegramId
        })
      });

      if (response.ok) {
        setLembretes({ ...lembretes, telegram: true });
        alert('✅ Telegram configurado!');
      }
    } catch (error) {
      alert('Erro ao configurar Telegram');
    }
  };

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          🔔 Notificações
        </h1>
        <p className="text-center text-xl text-gray-700 mb-12">
          Configure seus lembretes de refeições
        </p>

        <div className="space-y-8">
          {/* WHATSAPP */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">💬</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">WhatsApp</h2>
                <p className="text-gray-600">Receba lembretes via WhatsApp</p>
              </div>
            </div>

            {!lembretes.whatsapp ? (
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Seu número (com DDI)
                  </label>
                  <input
                    type="tel"
                    placeholder="+55 11 99999-9999"
                    value={whatsappNumero}
                    onChange={(e) => setWhatsappNumero(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 text-lg"
                  />
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <b>Como funciona:</b>
                  </p>
                  <ol className="list-decimal ml-4 mt-2 space-y-1 text-sm text-gray-600">
                    <li>Adicione o número do WhatsApp Sandbox: <b>+1 415 523 8886</b></li>
                    <li>Envie: <b>join anything-teach</b></li>
                    <li>Clique em "Ativar Lembretes"</li>
                  </ol>
                </div>

                <button
                  onClick={handleWhatsAppSave}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-xl"
                >
                  Ativar Lembretes WhatsApp
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <p className="text-green-700 font-bold text-lg">✅ WhatsApp Ativo</p>
                <p className="text-gray-600 mt-2">Você receberá lembretes nos horários das refeições</p>
              </div>
            )}
          </div>

          {/* TELEGRAM */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">✈️</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Telegram</h2>
                <p className="text-gray-600">Receba lembretes via Telegram</p>
              </div>
            </div>

            {!lembretes.telegram ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <b>Como configurar:</b>
                  </p>
                  <ol className="list-decimal ml-4 space-y-1 text-sm text-gray-600">
                    <li>Abra o Telegram</li>
                    <li>Busque por: <b>@NutriFitCoachBot</b></li>
                    <li>Envie: <b>/start</b></li>
                    <li>Copie seu Chat ID</li>
                  </ol>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Seu Chat ID do Telegram
                  </label>
                  <input
                    type="text"
                    placeholder="123456789"
                    value={telegramId}
                    onChange={(e) => setTelegramId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 text-lg"
                  />
                </div>

                <button
                  onClick={handleTelegramSave}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl"
                >
                  Ativar Lembretes Telegram
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <p className="text-green-700 font-bold text-lg">✅ Telegram Ativo</p>
                <p className="text-gray-600 mt-2">Você receberá lembretes via bot</p>
              </div>
            )}
          </div>

          {/* PUSH */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">🔔</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Notificações Push</h2>
                <p className="text-gray-600">Receba alertas no navegador</p>
              </div>
            </div>

            <button
              onClick={() => {
                if ('Notification' in window) {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      setLembretes({ ...lembretes, push: true });
                      new Notification('🎉 Notificações Ativadas!', {
                        body: 'Você receberá lembretes no navegador',
                        icon: '/icon-192.png'
                      });
                    }
                  });
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl"
            >
              {lembretes.push ? '✅ Ativado' : 'Ativar Notificações Push'}
            </button>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">⏰ Horários dos Lembretes</h3>
          <div className="space-y-2 text-gray-700">
            <p>☀️ <b>07:00</b> - Café da Manhã</p>
            <p>🥤 <b>10:00</b> - Lanche da Manhã</p>
            <p>🍽️ <b>12:30</b> - Almoço</p>
            <p>🍎 <b>16:00</b> - Lanche da Tarde</p>
            <p>🌙 <b>19:30</b> - Jantar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
