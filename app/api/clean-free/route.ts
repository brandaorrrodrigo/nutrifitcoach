import { NextResponse } from 'next/server';
import { deveRecomendarCleanFree, gerarCalendarioCleanFreeCiclo } from '@/lib/protocolo-clean-free/integracao-ciclo';

export async function POST(request: Request) {
  try {
    const { acao, dados } = await request.json();

    switch (acao) {
      
      case 'analisar_recomendacao':
        const recomendacao = deveRecomendarCleanFree(
          new Date(dados.dataUltimaMenstruacao),
          dados.duracaoCiclo || 28,
          dados.historicoCompulsao,
          dados.primeiraVez
        );
        
        return NextResponse.json({
          success: true,
          recomendacao
        });

      case 'gerar_calendario':
        const calendario = gerarCalendarioCleanFreeCiclo(
          new Date(dados.dataUltimaMenstruacao),
          dados.duracaoCiclo || 28
        );
        
        return NextResponse.json({
          success: true,
          calendario
        });

      case 'iniciar_protocolo':
        // Salvar escolha do usuário
        return NextResponse.json({
          success: true,
          message: 'Protocolo Clean & Free iniciado!'
        });

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
