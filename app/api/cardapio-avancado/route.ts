import { NextResponse } from 'next/server';
import { ajustarPorcoesComIA, ajustarPorcoesRapido } from '@/lib/ia-porcoes/ajustar-porcoes';
import { encontrarSubstituicoes, substituirAlimento } from '@/lib/substituicoes/substituicoes';
import { PROTOCOLOS_CARB_CYCLING, ajustarCardapioPorCiclo, recomendarProtocoloCarbCycling } from '@/lib/ciclo-carboidratos/ciclo-carb';
import { calcularFaseAtual, ajustarCardapioPorFase, FASES_CICLO_MENSTRUAL } from '@/lib/periodizacao-menstrual/periodizacao';
import { gerarListaCompras, exportarListaTexto } from '@/lib/lista-compras/lista-compras';

export async function POST(request: Request) {
  try {
    const { acao, dados } = await request.json();
    
    console.log('🚀 Ação:', acao);

    switch (acao) {
      
      case 'ajustar_porcoes_ia':
        const ajusteIA = await ajustarPorcoesComIA(
          dados.refeicoes,
          dados.anamnese,
          dados.feedback
        );
        return NextResponse.json(ajusteIA);

      case 'ajustar_porcoes_rapido':
        const ajusteRapido = ajustarPorcoesRapido(
          dados.refeicoes,
          dados.fator
        );
        return NextResponse.json({ refeicoes_ajustadas: ajusteRapido });

      case 'buscar_substituicoes':
        const substituicoes = encontrarSubstituicoes(
          dados.alimento,
          dados.perfil,
          dados.razao
        );
        return NextResponse.json({ substituicoes });

      case 'substituir_alimento':
        const refeicaoAtualizada = substituirAlimento(
          dados.refeicao,
          dados.alimentoOriginal,
          dados.alimentoSubstituto
        );
        return NextResponse.json({ refeicao: refeicaoAtualizada });

      case 'ativar_ciclo_carboidratos':
        const protocolo = dados.protocolo || recomendarProtocoloCarbCycling(
          dados.anamnese.objetivo,
          dados.anamnese.sexo,
          dados.anamnese.experiencia || 'intermediario'
        );
        
        const protocoloCompleto = PROTOCOLOS_CARB_CYCLING[protocolo];
        
        return NextResponse.json({
          protocolo: protocoloCompleto,
          recomendacao: `Protocolo ${protocoloCompleto.nome} ativado!`
        });

      case 'gerar_cardapio_ciclo':
        const diaCiclo = PROTOCOLOS_CARB_CYCLING[dados.protocolo].semana[dados.diaSemana];
        const cardapioCiclo = ajustarCardapioPorCiclo(
          dados.cardapioBase,
          diaCiclo,
          dados.peso
        );
        return NextResponse.json({ cardapio: cardapioCiclo });

      case 'verificar_fase_menstrual':
        const faseAtual = calcularFaseAtual(
          new Date(dados.dataUltimaMenstruacao),
          dados.duracaoCiclo || 28
        );
        
        const faseDetalhes = FASES_CICLO_MENSTRUAL[faseAtual.fase];
        
        return NextResponse.json({
          fase: faseAtual.fase,
          dia_atual: faseAtual.diaAtual,
          dias_restantes: faseAtual.diasRestantes,
          detalhes: faseDetalhes
        });

      case 'ajustar_por_fase':
        const faseMenstrual = FASES_CICLO_MENSTRUAL[dados.fase];
        const cardapioAjustado = ajustarCardapioPorFase(
          dados.cardapioBase,
          faseMenstrual
        );
        return NextResponse.json({ cardapio: cardapioAjustado });

      case 'gerar_lista_compras':
        const lista = gerarListaCompras(
          dados.cardapios,
          dados.periodo || 'semanal'
        );
        
        return NextResponse.json({
          lista,
          texto: exportarListaTexto(lista)
        });

      default:
        return NextResponse.json(
          { error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('❌ Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
