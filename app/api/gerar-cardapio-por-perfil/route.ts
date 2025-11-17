import { NextResponse } from 'next/server';
import { gerarCardapioPorPerfil } from '@/lib/diet-profiles/gerador-cardapios';

export async function POST(request: Request) {
  try {
    const { anamnese, perfilId } = await request.json();
    
    console.log('🍽️ Gerando cardápio para perfil:', perfilId);
    
    // Gerar cardápio personalizado
    const cardapio = gerarCardapioPorPerfil(anamnese, perfilId);
    
    // Retornar tudo junto
    return NextResponse.json({
      success: true,
      ...anamnese,
      perfil_alimentar: cardapio.perfil,
      calorias: cardapio.caloriasAlvo,
      macros: cardapio.macrosAlvo,
      refeicoes: cardapio.refeicoes,
      informacoes_adicionais: cardapio.informacoes_adicionais,
      suplementos_sugeridos: cardapio.suplementos_sugeridos,
      suplementos_obrigatorios: cardapio.suplementos_obrigatorios,
      gerado_em: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Erro ao gerar cardápio:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
