import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const from = formData.get('From')?.toString() || '';
    const body = formData.get('Body')?.toString().toLowerCase() || '';
    
    console.log('Mensagem WhatsApp:', { from, body });
    
    let responseMessage = '';
    
    // Comandos
    if (body.includes('cardapio') || body.includes('cardápio')) {
      responseMessage = '🥗 Aqui está seu cardápio de hoje! Acesse: https://nutrifitcoach.com.br/dashboard';
    } else if (body.includes('progresso')) {
      responseMessage = '📊 Veja seu progresso: https://nutrifitcoach.com.br/progresso';
    } else if (body.includes('ajuda') || body.includes('help')) {
      responseMessage = `
🤖 *Comandos disponíveis:*

📋 *cardapio* - Ver cardápio do dia
📊 *progresso* - Ver seu progresso
🏆 *pontos* - Ver seus pontos
💬 *ajuda* - Ver esta mensagem

Acesse: nutrifitcoach.com.br
      `.trim();
    } else if (body.includes('pontos') || body.includes('xp')) {
      responseMessage = '🏆 Você tem 150 pontos! Está no nível 5. Continue assim! 💪';
    } else {
      responseMessage = 'Olá! 👋 Digite *ajuda* para ver os comandos disponíveis.';
    }
    
    // Responder via TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMessage}</Message>
</Response>`;
    
    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });
  } catch (error: any) {
    console.error('Erro webhook WhatsApp:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
