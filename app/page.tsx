'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            NUTRIFITCOACH
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 text-gray-700 font-semibold hover:text-purple-600 transition-all">
              Entrar
            </Link>
            <Link href="/registro" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Cardápios Personalizados
          <br />com Inteligência Artificial
        </h1>
        <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
          Nutrição científica + IA avançada = Resultados reais. Seu plano alimentar perfeito em minutos.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/registro" className="px-12 py-5 bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 text-white rounded-xl font-bold text-xl hover:shadow-2xl transition-all">
            15 Dias Grátis - Começar Agora
          </Link>
          <Link href="/precos" className="px-12 py-5 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-bold text-xl hover:border-purple-600 transition-all">
            Ver Planos
          </Link>
        </div>
        <p className="text-gray-600 mt-6">✨ Sem cartão de crédito para testar • Cancele quando quiser</p>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-900">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '📝',
                titulo: '1. Anamnese Completa',
                descricao: 'Responda perguntas sobre seu estilo de vida, objetivos e preferências alimentares'
              },
              {
                emoji: '🤖',
                titulo: '2. IA Gera Seu Plano',
                descricao: 'Nossa IA analisa seus dados e cria cardápios personalizados com base científica'
              },
              {
                emoji: '🍽️',
                titulo: '3. 7 Variações Diárias',
                descricao: 'Receba cardápios diferentes para cada dia da semana, nunca enjoe!'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-cyan-50 to-purple-50 p-8 rounded-3xl text-center hover:shadow-2xl transition-all">
                <div className="text-6xl mb-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.titulo}</h3>
                <p className="text-gray-700 text-lg">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold text-center mb-16 text-gray-900">Por Que Escolher NutriFitCoach?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: '🎯', text: 'Cardápios 100% personalizados para seu objetivo' },
            { icon: '🧬', text: 'Baseado em evidências científicas' },
            { icon: '🤖', text: 'IA avançada com Ollama Llama 3.1' },
            { icon: '🇧🇷', text: 'Alimentos brasileiros e acessíveis' },
            { icon: '📊', text: 'Macros calculados perfeitamente' },
            { icon: '💬', text: 'Chat com nutricionista IA 24/7' },
            { icon: '🔄', text: '7 variações para não enjoar' },
            { icon: '📱', text: 'Acesse de qualquer dispositivo' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <span className="text-4xl">{item.icon}</span>
              <p className="text-xl font-semibold text-gray-800">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Pronto Para Transformar Sua Alimentação?</h2>
          <p className="text-2xl mb-10">Comece agora com 15 dias grátis. Sem compromisso.</p>
          <Link href="/registro" className="inline-block px-16 py-6 bg-white text-purple-600 rounded-2xl font-bold text-2xl hover:shadow-2xl transition-all">
            Criar Minha Conta Grátis
          </Link>
          <p className="text-lg mt-6 opacity-90">💳 Sem cartão necessário para teste</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xl mb-4">© 2025 NutriFitCoach. Todos os direitos reservados.</p>
          <p className="text-gray-400">Nutrição com IA • Evidências Científicas • Resultados Reais</p>
        </div>
      </footer>
    </div>
  );
}
