import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { plano } = await request.json();
    
    // Gerar HTML para PDF
    const html = gerarHTMLCardapio(plano);
    
    return NextResponse.json({ html, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function gerarHTMLCardapio(plano: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { color: #8B5CF6; margin: 0; }
    .macros { display: flex; justify-content: space-around; margin: 30px 0; }
    .macro-box { text-align: center; padding: 20px; background: #F3F4F6; border-radius: 10px; }
    .refeicao { margin: 30px 0; page-break-inside: avoid; }
    .refeicao-header { background: linear-gradient(to right, #06B6D4, #8B5CF6); color: white; padding: 15px; border-radius: 10px; }
    .alimento { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #E5E7EB; }
    .footer { text-align: center; margin-top: 50px; color: #6B7280; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🥗 NUTRIFITCOACH</h1>
    <h2>Seu Plano Nutricional Personalizado</h2>
    <p><strong>${plano.usuario.nome}</strong> • ${plano.usuario.peso}kg • ${plano.usuario.objetivo}</p>
  </div>

  <div class="macros">
    <div class="macro-box">
      <h3>🔥 Calorias</h3>
      <p><strong>${plano.calorias} kcal</strong></p>
    </div>
    <div class="macro-box">
      <h3>🥩 Proteína</h3>
      <p><strong>${plano.macros.proteina}g</strong></p>
    </div>
    <div class="macro-box">
      <h3>🍚 Carboidratos</h3>
      <p><strong>${plano.macros.carboidrato}g</strong></p>
    </div>
    <div class="macro-box">
      <h3>🥑 Gorduras</h3>
      <p><strong>${plano.macros.gordura}g</strong></p>
    </div>
  </div>

  ${Object.entries(plano.refeicoes).map(([key, refeicao]: [string, any]) => `
    <div class="refeicao">
      <div class="refeicao-header">
        <h3>${refeicao.nome} - ${refeicao.horario}</h3>
        <p>${refeicao.macros.calorias} kcal</p>
      </div>
      ${refeicao.alimentos.map((alimento: any) => `
        <div class="alimento">
          <div>
            <strong>${alimento.nome}</strong><br>
            <small>${alimento.quantidade}</small>
          </div>
          <div style="text-align: right;">
            <strong>${alimento.calorias} kcal</strong>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('')}

  <div class="footer">
    <p><strong>NUTRIFITCOACH.COM.BR</strong></p>
    <p>Nutrição com IA • Evidências Científicas</p>
    <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>`;
}
