import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, plataforma, numero } = await request.json();
    
    // Horários das refeições
    const horarios = [
      { hora: '07:00', refeicao: 'Café da Manhã', emoji: '☀️' },
      { hora: '10:00', refeicao: 'Lanche da Manhã', emoji: '🥤' },
      { hora: '12:30', refeicao: 'Almoço', emoji: '🍽️' },
      { hora: '16:00', refeicao: 'Lanche da Tarde', emoji: '🍎' },
      { hora: '19:30', refeicao: 'Jantar', emoji: '🌙' }
    ];
    
    // Salvar configuração (em produção, salvar no banco)
    const config = {
      userId,
      plataforma,
      numero,
      horarios,
      ativo: true,
      criadoEm: new Date().toISOString()
    };
    
    console.log('Lembretes configurados:', config);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lembretes ativados!',
      horarios 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Função para enviar lembretes (chamar via cron job)
export async function GET(request: Request) {
  try {
    const agora = new Date();
    const horaAtual = agora.toTimeString().substring(0, 5);
    
    // Buscar usuários com lembretes ativos (mock)
    const usuariosComLembretes = [
      { id: '1', numero: '+5511999999999', plataforma: 'whatsapp' }
    ];
    
    for (const usuario of usuariosComLembretes) {
      const mensagem = `⏰ Hora da refeição!\n\nNão esqueça de seguir seu cardápio.\n\nBom apetite! 🍽️`;
      
      if (usuario.plataforma === 'whatsapp') {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/whatsapp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: usuario.numero,
            message: mensagem
          })
        });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      enviados: usuariosComLembretes.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
