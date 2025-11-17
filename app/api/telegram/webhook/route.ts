import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: Request) {
  try {
    const update = await request.json();
    
    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });
    
    const chatId = message.chat.id;
    const text = message.text?.toLowerCase() || '';
    
    console.log('Mensagem Telegram:', { chatId, text });
    
    let responseText = '';
    
    // Comandos
    if (text === '/start') {
      responseText = `
🥗 <b>Bem-vindo ao NutriFitCoach!</b>

Eu sou seu assistente nutricional! 🤖

<b>Comandos disponíveis:</b>
/cardapio - Ver cardápio do dia
/progresso - Ver seu progresso
/pontos - Ver seus pontos e nível
/lembrete - Ativar lembretes
/ajuda - Ver esta mensagem

Acesse: nutrifitcoach.com.br
      `.trim();
    } else if (text === '/cardapio' || text === '/cardápio') {
      responseText = `
🍽️ <b>Seu Cardápio de Hoje</b>

<b>☀️ Café da Manhã (7h)</b>
- 3 ovos mexidos
- 2 fatias de pão integral
- 1/2 abacate

<b>🥤 Lanche (10h)</b>
- Iogurte grego 150g
- Granola 30g

Ver completo: nutrifitcoach.com.br/dashboard
      `.trim();
    } else if (text === '/progresso') {
      responseText = `
📊 <b>Seu Progresso</b>

⚖️ Peso: 75.5kg (-3.2kg)
🔥 Streak: 15 dias
🏆 Pontos: 450
📈 Nível: 5

Continue assim! 💪

Ver gráficos: nutrifitcoach.com.br/progresso
      `.trim();
    } else if (text === '/pontos') {
      responseText = `
🏆 <b>Seus Pontos</b>

💎 Pontos: 450
⭐ Nível: 5
🔥 Sequência: 15 dias
🎖️ Badges: 8

Próximo nível: 500 pontos (50 faltando)

Continue registrando seu progresso! 💪
      `.trim();
    } else if (text === '/lembrete') {
      responseText = `
⏰ <b>Lembretes Ativados!</b>

Você receberá notificações:
- 🌅 7h - Café da manhã
- 🥤 10h - Lanche
- 🍽️ 12h30 - Almoço
- 🍎 16h - Lanche tarde
- 🌙 19h30 - Jantar

Para desativar: /parar
      `.trim();
    } else if (text === '/ajuda' || text === '/help') {
      responseText = `
🤖 <b>Comandos do Bot</b>

/cardapio - Ver cardápio
/progresso - Ver progresso
/pontos - Ver pontos/nível
/lembrete - Ativar lembretes
/ranking - Ver ranking
/ajuda - Esta mensagem

Site: nutrifitcoach.com.br
      `.trim();
    } else {
      responseText = 'Olá! 👋 Digite /ajuda para ver os comandos disponíveis.';
    }
    
    // Enviar resposta
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: responseText,
        parse_mode: 'HTML'
      })
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Erro webhook Telegram:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
