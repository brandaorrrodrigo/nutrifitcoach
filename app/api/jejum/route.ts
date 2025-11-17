import { NextResponse } from 'next/server';
import { TrackerJejum } from '@/lib/jejum-intermitente/tracker';
import { ajustarCardapioParaJejum } from '@/lib/jejum-intermitente/ajustar-cardapio';
import { PROTOCOLOS_JEJUM } from '@/lib/jejum-intermitente/protocolos';

export async function POST(request: Request) {
  try {
    const { acao, dados } = await request.json();

    switch (acao) {
      case 'iniciar':
        const sessao = TrackerJejum.iniciarJejum(
          dados.usuarioId,
          dados.protocoloId
        );
        return NextResponse.json({ success: true, sessao });

      case 'finalizar':
        const finalizado = TrackerJejum.finalizarJejum(
          dados.sessaoId,
          dados.comoSeSentiu,
          dados.sintomas,
          dados.notas
        );
        return NextResponse.json({ success: true, sessao: finalizado });

      case 'cancelar':
        const cancelado = TrackerJejum.cancelarJejum(dados.sessaoId, dados.motivo);
        return NextResponse.json({ success: true, sessao: cancelado });

      case 'progresso':
        const historico = TrackerJejum.buscarHistorico(dados.usuarioId);
        const emAndamento = historico.find(s => s.status === 'em_andamento');
        
        if (emAndamento) {
          const prog = TrackerJejum.calcularProgresso(emAndamento);
          return NextResponse.json({ success: true, progresso: prog, sessao: emAndamento });
        }
        
        return NextResponse.json({ success: false, message: 'Nenhum jejum ativo' });

      case 'estatisticas':
        const stats = TrackerJejum.calcularEstatisticas(dados.usuarioId);
        return NextResponse.json({ success: true, estatisticas: stats });

      case 'ajustar_cardapio':
        const protocolo = PROTOCOLOS_JEJUM[dados.protocoloId];
        const cardapioAjustado = ajustarCardapioParaJejum(
          dados.cardapioBase,
          protocolo,
          dados.horarioInicio
        );
        return NextResponse.json({ success: true, cardapio: cardapioAjustado });

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
