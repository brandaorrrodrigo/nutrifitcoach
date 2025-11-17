import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('📋 Processando anamnese completa...');
    
    // Calcular idade
    const dataNasc = new Date(data.dataNascimento);
    const idade = Math.floor((Date.now() - dataNasc.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    // Calcular IMC
    const peso = parseFloat(data.peso);
    const alturaM = parseFloat(data.altura) / 100;
    const imc = peso / (alturaM * alturaM);
    
    // ANÁLISE IA DOS EXAMES
    const analiseExames = analisarExamesLaboratoriais({
      glicemia: parseFloat(data.glicemia) || null,
      colesterolTotal: parseFloat(data.colesterolTotal) || null,
      hdl: parseFloat(data.hdl) || null,
      ldl: parseFloat(data.ldl) || null,
      triglicerideos: parseFloat(data.triglicerideos) || null,
      tsh: parseFloat(data.tsh) || null,
      t3: parseFloat(data.t3) || null,
      t4: parseFloat(data.t4) || null,
      vitaminaD: parseFloat(data.vitaminaD) || null,
      vitaminaB12: parseFloat(data.vitaminaB12) || null
    });
    
    // ANÁLISE ANTROPOMÉTRICA
    const analiseAntropometrica = analisarAntropometria({
      imc,
      peso,
      altura: parseFloat(data.altura),
      circunferenciaCintura: parseFloat(data.circunferenciaCintura) || null,
      circunferenciaQuadril: parseFloat(data.circunferenciaQuadril) || null,
      percentualGordura: parseFloat(data.percentualGordura) || null,
      sexo: data.sexo
    });
    
    // ANÁLISE DE RISCO
    const analiseRisco = analisarRiscos({
      doencasPreExistentes: data.doencasPreExistentes,
      imc,
      idade,
      fumante: data.fumante,
      consumoAlcool: data.consumoAlcool,
      nivelEstresse: data.nivelEstresse,
      horasSono: parseFloat(data.horasSono) || 7,
      exames: analiseExames
    });
    
    // RECOMENDAÇÕES PERSONALIZADAS
    const recomendacoes = gerarRecomendacoes({
      objetivo: data.objetivo,
      analiseExames,
      analiseAntropometrica,
      analiseRisco,
      comportamento: {
        belisca: data.belisca,
        comeCompulsivo: data.comeCompulsivo,
        comePorAnsiedade: data.comePorAnsiedade,
        pulaPefeicoes: data.pulaPefeicoes
      },
      praticaExercicio: data.praticaExercicio,
      frequenciaSemanal: data.frequenciaSemanal
    });
    
    // GERAR PLANO NUTRICIONAL COM OLLAMA
    const plano = await gerarPlanoComIA({
      ...data,
      idade,
      imc,
      analiseExames,
      recomendacoes
    });
    
    // SALVAR NO BANCO
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (user) {
        await prisma.anamneseCompleta.upsert({
          where: { userId: user.id },
          update: {
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            dataNascimento: new Date(data.dataNascimento),
            idade,
            sexo: data.sexo,
            estadoCivil: data.estadoCivil,
            profissao: data.profissao,
            peso,
            altura: parseFloat(data.altura),
            imc,
            circunferenciaCintura: parseFloat(data.circunferenciaCintura) || null,
            circunferenciaQuadril: parseFloat(data.circunferenciaQuadril) || null,
            circunferenciaBraco: parseFloat(data.circunferenciaBraco) || null,
            circunferenciaCoxa: parseFloat(data.circunferenciaCoxa) || null,
            circunferenciaPanturrilha: parseFloat(data.circunferenciaPanturrilha) || null,
            percentualGordura: parseFloat(data.percentualGordura) || null,
            massaMagra: parseFloat(data.massaMagra) || null,
            fotosCorpo: data.fotosUrls || [],
            doencasPreExistentes: data.doencasPreExistentes,
            cirurgias: data.cirurgias ? [data.cirurgias] : [],
            medicamentos: data.medicamentos ? [data.medicamentos] : [],
            suplementos: data.suplementos ? [data.suplementos] : [],
            alergias: data.alergias ? [data.alergias] : [],
            intolerancias: data.intolerancias ? [data.intolerancias] : [],
            examesUpload: data.examesUrls || [],
            glicemia: parseFloat(data.glicemia) || null,
            colesterolTotal: parseFloat(data.colesterolTotal) || null,
            hdl: parseFloat(data.hdl) || null,
            ldl: parseFloat(data.ldl) || null,
            triglicerideos: parseFloat(data.triglicerideos) || null,
            tsh: parseFloat(data.tsh) || null,
            t3: parseFloat(data.t3) || null,
            t4: parseFloat(data.t4) || null,
            vitaminaD: parseFloat(data.vitaminaD) || null,
            vitaminaB12: parseFloat(data.vitaminaB12) || null,
            dietasAnteriores: data.dietasAnteriores ? JSON.parse(JSON.stringify({ texto: data.dietasAnteriores })) : null,
            tempoUltimaDieta: data.tempoUltimaDieta,
            resultadosObtidos: data.resultadosObtidos,
            motivoParada: data.motivoParada,
            horasSono: parseFloat(data.horasSono) || null,
            qualidadeSono: data.qualidadeSono,
            nivelEstresse: data.nivelEstresse,
            tipoTrabalho: data.tipoTrabalho,
            horarioTrabalho: data.horarioTrabalho,
            consumoAgua: parseFloat(data.consumoAgua) || null,
            consumoAlcool: data.consumoAlcool,
            fumante: data.fumante,
            praticaExercicio: data.praticaExercicio,
            tipoExercicio: data.tipoExercicio,
            frequenciaSemanal: data.frequenciaSemanal ? parseInt(data.frequenciaSemanal) : null,
            duracaoTreino: data.duracaoTreino,
            objetivoTreino: data.objetivoTreino,
            cicloMenstrual: data.cicloMenstrual,
            usaAnticoncepcional: data.usaAnticoncepcional,
            amamentando: data.amamentando,
            gestante: data.gestante,
            menopausa: data.menopausa,
            sintomaTpm: data.sintomaTpm,
            problemasProstata: data.problemasProstata,
            calvicie: data.calvicie,
            objetivo: data.objetivo,
            metaPeso: parseFloat(data.metaPeso) || null,
            prazoDesejado: data.prazoDesejado,
            motivacaoPrincipal: data.motivacaoPrincipal,
            jaFezDieta: data.jaFezDieta,
            expectativas: data.expectativas,
            belisca: data.belisca,
            comeCompulsivo: data.comeCompulsivo,
            comePorAnsiedade: data.comePorAnsiedade,
            prefereDoce: data.prefereDoce,
            prefereSalgado: data.prefereSalgado,
            pulaPefeicoes: data.pulaPefeicoes,
            alimentosQueGosta: data.alimentosQueGosta.split(',').map((s: string) => s.trim()),
            alimentosQueNaoGosta: data.alimentosQueNaoGosta.split(',').map((s: string) => s.trim()),
            restricoesReligiosas: data.restricoesReligiosas ? [data.restricoesReligiosas] : [],
            dietasEspecificas: data.dietasEspecificas,
            analiseIA: {
              exames: analiseExames,
              antropometria: analiseAntropometrica,
              risco: analiseRisco
            },
            recomendacoesIA: recomendacoes,
            alertas: analiseRisco.alertas
          },
          create: {
            userId: user.id,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            dataNascimento: new Date(data.dataNascimento),
            idade,
            sexo: data.sexo,
            estadoCivil: data.estadoCivil,
            profissao: data.profissao,
            peso,
            altura: parseFloat(data.altura),
            imc,
            circunferenciaCintura: parseFloat(data.circunferenciaCintura) || null,
            circunferenciaQuadril: parseFloat(data.circunferenciaQuadril) || null,
            circunferenciaBraco: parseFloat(data.circunferenciaBraco) || null,
            circunferenciaCoxa: parseFloat(data.circunferenciaCoxa) || null,
            circunferenciaPanturrilha: parseFloat(data.circunferenciaPanturrilha) || null,
            percentualGordura: parseFloat(data.percentualGordura) || null,
            massaMagra: parseFloat(data.massaMagra) || null,
            fotosCorpo: data.fotosUrls || [],
            doencasPreExistentes: data.doencasPreExistentes,
            cirurgias: data.cirurgias ? [data.cirurgias] : [],
            medicamentos: data.medicamentos ? [data.medicamentos] : [],
            suplementos: data.suplementos ? [data.suplementos] : [],
            alergias: data.alergias ? [data.alergias] : [],
            intolerancias: data.intolerancias ? [data.intolerancias] : [],
            examesUpload: data.examesUrls || [],
            glicemia: parseFloat(data.glicemia) || null,
            colesterolTotal: parseFloat(data.colesterolTotal) || null,
            hdl: parseFloat(data.hdl) || null,
            ldl: parseFloat(data.ldl) || null,
            triglicerideos: parseFloat(data.triglicerideos) || null,
            tsh: parseFloat(data.tsh) || null,
            t3: parseFloat(data.t3) || null,
            t4: parseFloat(data.t4) || null,
            vitaminaD: parseFloat(data.vitaminaD) || null,
            vitaminaB12: parseFloat(data.vitaminaB12) || null,
            dietasAnteriores: data.dietasAnteriores ? JSON.parse(JSON.stringify({ texto: data.dietasAnteriores })) : null,
            tempoUltimaDieta: data.tempoUltimaDieta,
            resultadosObtidos: data.resultadosObtidos,
            motivoParada: data.motivoParada,
            horasSono: parseFloat(data.horasSono) || null,
            qualidadeSono: data.qualidadeSono,
            nivelEstresse: data.nivelEstresse,
            tipoTrabalho: data.tipoTrabalho,
            horarioTrabalho: data.horarioTrabalho,
            consumoAgua: parseFloat(data.consumoAgua) || null,
            consumoAlcool: data.consumoAlcool,
            fumante: data.fumante,
            praticaExercicio: data.praticaExercicio,
            tipoExercicio: data.tipoExercicio,
            frequenciaSemanal: data.frequenciaSemanal ? parseInt(data.frequenciaSemanal) : null,
            duracaoTreino: data.duracaoTreino,
            objetivoTreino: data.objetivoTreino,
            cicloMenstrual: data.cicloMenstrual,
            usaAnticoncepcional: data.usaAnticoncepcional,
            amamentando: data.amamentando,
            gestante: data.gestante,
            menopausa: data.menopausa,
            sintomaTpm: data.sintomaTpm,
            problemasProstata: data.problemasProstata,
            calvicie: data.calvicie,
            objetivo: data.objetivo,
            metaPeso: parseFloat(data.metaPeso) || null,
            prazoDesejado: data.prazoDesejado,
            motivacaoPrincipal: data.motivacaoPrincipal,
            jaFezDieta: data.jaFezDieta,
            expectativas: data.expectativas,
            belisca: data.belisca,
            comeCompulsivo: data.comeCompulsivo,
            comePorAnsiedade: data.comePorAnsiedade,
            prefereDoce: data.prefereDoce,
            prefereSalgado: data.prefereSalgado,
            pulaPefeicoes: data.pulaPefeicoes,
            alimentosQueGosta: data.alimentosQueGosta.split(',').map((s: string) => s.trim()),
            alimentosQueNaoGosta: data.alimentosQueNaoGosta.split(',').map((s: string) => s.trim()),
            restricoesReligiosas: data.restricoesReligiosas ? [data.restricoesReligiosas] : [],
            dietasEspecificas: data.dietasEspecificas,
            analiseIA: {
              exames: analiseExames,
              antropometria: analiseAntropometrica,
              risco: analiseRisco
            },
            recomendacoesIA: recomendacoes,
            alertas: analiseRisco.alertas
          }
        });

        console.log('💾 Anamnese salva no banco!');
      }
    } catch (dbError) {
      console.log('⚠️ Erro ao salvar no banco:', dbError);
    }
    
    return NextResponse.json({ 
      success: true,
      plano,
      analises: {
        exames: analiseExames,
        antropometria: analiseAntropometrica,
        risco: analiseRisco
      },
      recomendacoes
    });

  } catch (error: any) {
    console.error('❌ Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════
// FUNÇÕES DE ANÁLISE IA
// ═══════════════════════════════════════════════════

function analisarExamesLaboratoriais(exames: any) {
  const resultados: any = {
    status: 'normal',
    alertas: [],
    sugestoes: [],
    detalhes: {}
  };

  // GLICEMIA
  if (exames.glicemia) {
    if (exames.glicemia < 70) {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ Glicemia baixa - risco de hipoglicemia');
      resultados.sugestoes.push('Consulte um médico sobre hipoglicemia');
      resultados.detalhes.glicemia = 'BAIXA';
    } else if (exames.glicemia >= 70 && exames.glicemia <= 99) {
      resultados.detalhes.glicemia = 'NORMAL';
    } else if (exames.glicemia >= 100 && exames.glicemia <= 125) {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ Glicemia elevada - pré-diabetes');
      resultados.sugestoes.push('Reduzir carboidratos simples e aumentar fibras');
      resultados.detalhes.glicemia = 'PRÉ-DIABETES';
    } else {
      resultados.status = 'alerta';
      resultados.alertas.push('🚨 Glicemia alta - diabetes');
      resultados.sugestoes.push('Consulta médica urgente necessária');
      resultados.detalhes.glicemia = 'DIABETES';
    }
  }

  // COLESTEROL TOTAL
  if (exames.colesterolTotal) {
    if (exames.colesterolTotal < 200) {
      resultados.detalhes.colesterolTotal = 'DESEJÁVEL';
    } else if (exames.colesterolTotal >= 200 && exames.colesterolTotal <= 239) {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ Colesterol limítrofe');
      resultados.sugestoes.push('Aumentar consumo de ômega-3 e fibras');
      resultados.detalhes.colesterolTotal = 'LIMÍTROFE';
    } else {
      resultados.status = 'alerta';
      resultados.alertas.push('🚨 Colesterol alto');
      resultados.sugestoes.push('Reduzir gorduras saturadas, aumentar ômega-3');
      resultados.detalhes.colesterolTotal = 'ALTO';
    }
  }

  // HDL (BOM)
  if (exames.hdl) {
    if (exames.hdl >= 60) {
      resultados.detalhes.hdl = 'ÓTIMO';
      resultados.sugestoes.push('Seu HDL está excelente! Continue assim!');
    } else if (exames.hdl >= 40 && exames.hdl < 60) {
      resultados.detalhes.hdl = 'ADEQUADO';
    } else {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ HDL baixo - aumentar exercícios');
      resultados.sugestoes.push('Aumentar atividade física e consumo de gorduras boas');
      resultados.detalhes.hdl = 'BAIXO';
    }
  }

  // LDL (RUIM)
  if (exames.ldl) {
    if (exames.ldl < 100) {
      resultados.detalhes.ldl = 'ÓTIMO';
    } else if (exames.ldl >= 100 && exames.ldl <= 129) {
      resultados.detalhes.ldl = 'ADEQUADO';
    } else if (exames.ldl >= 130 && exames.ldl <= 159) {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ LDL limítrofe');
      resultados.detalhes.ldl = 'LIMÍTROFE';
    } else {
      resultados.status = 'alerta';
      resultados.alertas.push('🚨 LDL alto - risco cardiovascular');
      resultados.sugestoes.push('Reduzir gorduras saturadas drasticamente');
      resultados.detalhes.ldl = 'ALTO';
    }
  }

  // TRIGLICERÍDEOS
  if (exames.triglicerideos) {
    if (exames.triglicerideos < 150) {
      resultados.detalhes.triglicerideos = 'NORMAL';
    } else if (exames.triglicerideos >= 150 && exames.triglicerideos <= 199) {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ Triglicerídeos limítrofes');
      resultados.sugestoes.push('Reduzir açúcares e álcool');
      resultados.detalhes.triglicerideos = 'LIMÍTROFE';
    } else {
      resultados.status = 'alerta';
      resultados.alertas.push('🚨 Triglicerídeos altos');
      resultados.sugestoes.push('Eliminar açúcares e álcool, aumentar ômega-3');
      resultados.detalhes.triglicerideos = 'ALTO';
    }
  }

  // TIREOIDE - TSH
  if (exames.tsh) {
    if (exames.tsh >= 0.4 && exames.tsh <= 4.0) {
      resultados.detalhes.tsh = 'NORMAL';
    } else if (exames.tsh < 0.4) {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ TSH baixo - possível hipertireoidismo');
      resultados.sugestoes.push('Consultar endocrinologista');
      resultados.detalhes.tsh = 'BAIXO';
    } else {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ TSH alto - possível hipotireoidismo');
      resultados.sugestoes.push('Consultar endocrinologista, aumentar selênio e iodo');
      resultados.detalhes.tsh = 'ALTO';
    }
  }

  // VITAMINA D
  if (exames.vitaminaD) {
    if (exames.vitaminaD >= 30) {
      resultados.detalhes.vitaminaD = 'ADEQUADO';
    } else if (exames.vitaminaD >= 20 && exames.vitaminaD < 30) {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ Vitamina D insuficiente');
      resultados.sugestoes.push('Suplementar 2000-4000 UI/dia + sol 15min');
      resultados.detalhes.vitaminaD = 'INSUFICIENTE';
    } else {
      resultados.status = 'alerta';
      resultados.alertas.push('🚨 Vitamina D deficiente');
      resultados.sugestoes.push('Suplementar 4000-10000 UI/dia');
      resultados.detalhes.vitaminaD = 'DEFICIENTE';
    }
  }

  // VITAMINA B12
  if (exames.vitaminaB12) {
    if (exames.vitaminaB12 >= 200) {
      resultados.detalhes.vitaminaB12 = 'NORMAL';
    } else {
      resultados.status = 'atencao';
      resultados.alertas.push('⚠️ B12 baixa - risco de anemia');
      resultados.sugestoes.push('Aumentar carnes, ovos ou suplementar');
      resultados.detalhes.vitaminaB12 = 'BAIXA';
    }
  }

  return resultados;
}

function analisarAntropometria(dados: any) {
  const analise: any = {
    classificacaoIMC: '',
    riscoSaude: 'baixo',
    alertas: [],
    sugestoes: []
  };

  // Classificação IMC
  if (dados.imc < 18.5) {
    analise.classificacaoIMC = 'ABAIXO DO PESO';
    analise.riscoSaude = 'moderado';
    analise.alertas.push('⚠️ IMC abaixo do ideal');
    analise.sugestoes.push('Aumentar consumo calórico gradualmente');
  } else if (dados.imc >= 18.5 && dados.imc < 25) {
    analise.classificacaoIMC = 'PESO NORMAL';
    analise.riscoSaude = 'baixo';
  } else if (dados.imc >= 25 && dados.imc < 30) {
    analise.classificacaoIMC = 'SOBREPESO';
    analise.riscoSaude = 'moderado';
    analise.alertas.push('⚠️ Sobrepeso');
    analise.sugestoes.push('Déficit calórico moderado + exercícios');
  } else if (dados.imc >= 30 && dados.imc < 35) {
    analise.classificacaoIMC = 'OBESIDADE GRAU I';
    analise.riscoSaude = 'alto';
    analise.alertas.push('🚨 Obesidade grau I');
    analise.sugestoes.push('Acompanhamento profissional recomendado');
  } else {
    analise.classificacaoIMC = 'OBESIDADE GRAU II/III';
    analise.riscoSaude = 'muito-alto';
    analise.alertas.push('🚨 Obesidade grave - acompanhamento urgente');
    analise.sugestoes.push('Necessário acompanhamento médico + nutricional');
  }

  // Circunferência da Cintura
  if (dados.circunferenciaCintura) {
    const limiteHomem = 102;
    const limiteMulher = 88;
    const limite = dados.sexo === 'masculino' ? limiteHomem : limiteMulher;

    if (dados.circunferenciaCintura >= limite) {
      analise.riscoSaude = 'alto';
      analise.alertas.push('🚨 Circunferência da cintura elevada - risco metabólico');
      analise.sugestoes.push('Priorizar redução de gordura abdominal');
    }
  }

  // Relação Cintura/Quadril
  if (dados.circunferenciaCintura && dados.circunferenciaQuadril) {
    const rcq = dados.circunferenciaCintura / dados.circunferenciaQuadril;
    const limiteRCQHomem = 0.95;
    const limiteRCQMulher = 0.85;
    const limiteRCQ = dados.sexo === 'masculino' ? limiteRCQHomem : limiteRCQMulher;

    if (rcq >= limiteRCQ) {
      analise.alertas.push('⚠️ Relação cintura/quadril elevada');
    }
  }

  // % Gordura
  if (dados.percentualGordura) {
    const limites = dados.sexo === 'masculino'
      ? { baixo: 6, ideal: 14, moderado: 18, alto: 25 }
      : { baixo: 14, ideal: 21, moderado: 25, alto: 32 };

    if (dados.percentualGordura < limites.baixo) {
      analise.alertas.push('⚠️ % gordura muito baixo');
    } else if (dados.percentualGordura > limites.alto) {
      analise.alertas.push('⚠️ % gordura elevado');
    }
  }

  return analise;
}

function analisarRiscos(dados: any) {
  const riscos: any = {
    nivelRisco: 'baixo',
    alertas: [],
    recomendacoes: []
  };

  // Doenças pré-existentes
  if (dados.doencasPreExistentes && dados.doencasPreExistentes.length > 0) {
    if (dados.doencasPreExistentes.includes('Diabetes')) {
      riscos.nivelRisco = 'alto';
      riscos.alertas.push('🚨 Diabetes - controle glicêmico essencial');
      riscos.recomendacoes.push('Low carb ou controle rigoroso de carboidratos');
    }
    if (dados.doencasPreExistentes.includes('Hipertensão')) {
      riscos.nivelRisco = 'alto';
      riscos.alertas.push('🚨 Hipertensão - reduzir sódio');
      riscos.recomendacoes.push('Máximo 2g de sódio/dia, aumentar potássio');
    }
    if (dados.doencasPreExistentes.includes('Colesterol Alto')) {
      riscos.alertas.push('⚠️ Colesterol alto - cuidado com gorduras');
      riscos.recomendacoes.push('Priorizar gorduras insaturadas');
    }
  }

  // IMC
  if (dados.imc >= 30) {
    riscos.nivelRisco = 'alto';
    riscos.alertas.push('🚨 Obesidade - risco aumentado de doenças');
  }

  // Estilo de vida
  if (dados.fumante) {
    riscos.nivelRisco = 'alto';
    riscos.alertas.push('🚨 Tabagismo - aumentar antioxidantes');
    riscos.recomendacoes.push('Aumentar vitamina C, E e antioxidantes');
  }

  if (dados.consumoAlcool && (dados.consumoAlcool === 'frequente' || dados.consumoAlcool === 'diario')) {
    riscos.nivelRisco = 'moderado';
    riscos.alertas.push('⚠️ Consumo elevado de álcool');
    riscos.recomendacoes.push('Reduzir álcool, aumentar hidratação');
  }

  if (dados.nivelEstresse === 'alto' || dados.nivelEstresse === 'muito-alto') {
    riscos.alertas.push('⚠️ Estresse elevado - cortisol alto');
    riscos.recomendacoes.push('Aumentar magnésio, adaptar dieta para estresse');
  }

  if (dados.horasSono < 6) {
    riscos.alertas.push('⚠️ Sono insuficiente - prejudica resultados');
    riscos.recomendacoes.push('Melhorar higiene do sono, magnésio antes de dormir');
  }

  // Exames alterados
  if (dados.exames && dados.exames.status !== 'normal') {
    riscos.nivelRisco = 'alto';
    riscos.alertas.push(...dados.exames.alertas);
  }

  return riscos;
}

function gerarRecomendacoes(dados: any) {
  const recomendacoes: string[] = [];

  // Baseado no objetivo
  if (dados.objetivo === 'perda de peso') {
    recomendacoes.push('🎯 Déficit calórico de 15-20%');
    recomendacoes.push('🍖 Alta proteína (2-2.5g/kg) para preservar massa magra');
    recomendacoes.push('🥗 Aumentar vegetais para saciedade');
  } else if (dados.objetivo === 'ganho de massa') {
    recomendacoes.push('🎯 Superávit calórico de 10-15%');
    recomendacoes.push('🍖 Proteína 2g/kg mínimo');
    recomendacoes.push('🍚 Carboidratos ao redor do treino');
  }

  // Comportamento alimentar
  if (dados.comportamento.comePorAnsiedade) {
    recomendacoes.push('😌 Incluir alimentos com triptofano (banana, aveia, peru)');
    recomendacoes.push('🧘 Técnicas de mindful eating');
  }

  if (dados.comportamento.belisca) {
    recomendacoes.push('🍽️ Aumentar frequência de refeições menores');
    recomendacoes.push('💧 Aumentar hidratação entre refeições');
  }

  if (dados.comportamento.comeCompulsivo) {
    recomendacoes.push('🥗 Priorizar alimentos de baixa densidade calórica');
    recomendacoes.push('📊 Acompanhamento psicológico recomendado');
  }

  // Exames alterados
  if (dados.analiseExames && dados.analiseExames.sugestoes) {
    recomendacoes.push(...dados.analiseExames.sugestoes);
  }

  // Atividade física
  if (!dados.praticaExercicio) {
    recomendacoes.push('🏃 Iniciar atividade física gradualmente');
  } else if (dados.frequenciaSemanal && dados.frequenciaSemanal.includes('5-6')) {
    recomendacoes.push('💪 Volume de treino alto - aumentar calorias');
  }

  return recomendacoes;
}

async function gerarPlanoComIA(dados: any) {
  // Tentar gerar com Ollama
  try {
    const prompt = `Você é um nutricionista expert. Crie um plano nutricional DETALHADO baseado nesta anamnese completa:

PERFIL:
- ${dados.idade} anos, ${dados.sexo}, ${dados.peso}kg, ${dados.altura}cm
- IMC: ${dados.imc.toFixed(1)}
- Objetivo: ${dados.objetivo}
- Atividade: ${dados.tipoTrabalho}
${dados.praticaExercicio ? `- Exercício: ${dados.tipoExercicio} ${dados.frequenciaSemanal}` : ''}

EXAMES:
${dados.analiseExames && dados.analiseExames.detalhes ? Object.entries(dados.analiseExames.detalhes).map(([k, v]) => `- ${k}: ${v}`).join('\n') : 'Não fornecidos'}

RESTRIÇÕES:
- Alergias: ${dados.alergias || 'nenhuma'}
- Intolerâncias: ${dados.intolerancias || 'nenhuma'}
- Não gosta: ${dados.alimentosQueNaoGosta}
- Gosta: ${dados.alimentosQueGosta}

COMPORTAMENTO:
- Come por ansiedade: ${dados.comePorAnsiedade ? 'SIM' : 'NÃO'}
- Belisca: ${dados.belisca ? 'SIM' : 'NÃO'}
- Prefere: ${dados.prefereDoce ? 'doces' : 'salgados'}

RECOMENDAÇÕES IA:
${dados.recomendacoes.join('\n')}

Crie um plano com 5 refeições BRASILEIRAS, práticas e deliciosas.
Respeite TODAS as restrições e preferências.
Distribua os macros corretamente.

RESPONDA APENAS COM JSON VÁLIDO:
{
  "cafeDaManha": {
    "horario": "07:00",
    "nome": "Café da Manhã",
    "alimentos": [{"nome": "...", "quantidade": "...", "calorias": X}],
    "macros": {"calorias": X, "proteina": Y, "carboidrato": Z, "gordura": W}
  },
  ...
}`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        prompt: prompt,
        stream: false,
        options: { temperature: 0.7 }
      }),
      signal: AbortSignal.timeout(90000)
    });

    if (response.ok) {
      const data = await response.json();
      let jsonText = data.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const plano = JSON.parse(jsonMatch[0]);
        return {
          usuario: {
            nome: dados.nome,
            peso: parseFloat(dados.peso),
            altura: parseFloat(dados.altura),
            objetivo: dados.objetivo,
            sexo: dados.sexo
          },
          calorias: Math.round(dados.analiseExames?.caloriasRecomendadas || 2000),
          macros: {
            proteina: Math.round(parseFloat(dados.peso) * 2),
            carboidrato: 200,
            gordura: 60
          },
          refeicoes: plano,
          geradoComIA: true,
          analises: {
            exames: dados.analiseExames,
            antropometria: dados.analiseAntropometrica,
            risco: dados.analiseRisco
          },
          recomendacoes: dados.recomendacoes
        };
      }
    }
  } catch (error) {
    console.log('⚠️ Ollama indisponível, usando algoritmo padrão');
  }

  // Fallback: plano básico
  return gerarPlanoBasico(dados);
}

function gerarPlanoBasico(dados: any) {
  const peso = parseFloat(dados.peso);
  const proteina = Math.round(peso * 2);
  const calorias = dados.objetivo === 'perda de peso' ? 1800 : 2400;
  const carboidrato = Math.round((calorias * 0.40) / 4);
  const gordura = Math.round((calorias * 0.25) / 9);

  return {
    usuario: {
      nome: dados.nome,
      peso,
      altura: parseFloat(dados.altura),
      objetivo: dados.objetivo,
      sexo: dados.sexo
    },
    calorias,
    macros: { proteina, carboidrato, gordura },
    refeicoes: {
      cafeDaManha: {
        horario: '07:00',
        nome: 'Café da Manhã',
        alimentos: [
          { nome: 'Ovos mexidos', quantidade: '3 unidades', calorias: 210, proteina: 18 },
          { nome: 'Pão integral', quantidade: '2 fatias', calorias: 140 },
          { nome: 'Abacate', quantidade: '1/2 unidade', calorias: 120 }
        ],
        macros: { calorias: 470, proteina: 25, carboidrato: 35, gordura: 15 }
      },
      lancheManha: {
        horario: '10:00',
        nome: 'Lanche',
        alimentos: [
          { nome: 'Iogurte grego', quantidade: '150g', calorias: 150, proteina: 15 },
          { nome: 'Granola', quantidade: '30g', calorias: 120 }
        ],
        macros: { calorias: 270, proteina: 18, carboidrato: 28, gordura: 8 }
      },
      almoco: {
        horario: '12:30',
        nome: 'Almoço',
        alimentos: [
          { nome: 'Frango grelhado', quantidade: '150g', calorias: 250, proteina: 40 },
          { nome: 'Arroz integral', quantidade: '150g', calorias: 200 },
          { nome: 'Feijão', quantidade: '100g', calorias: 130 },
          { nome: 'Brócolis', quantidade: '100g', calorias: 35 }
        ],
        macros: { calorias: 615, proteina: 50, carboidrato: 65, gordura: 10 }
      },
      lancheTarde: {
        horario: '16:00',
        nome: 'Lanche da Tarde',
        alimentos: [
          { nome: 'Whey protein', quantidade: '30g', calorias: 120, proteina: 24 },
          { nome: 'Banana', quantidade: '1 unidade', calorias: 105 }
        ],
        macros: { calorias: 225, proteina: 26, carboidrato: 30, gordura: 2 }
      },
      jantar: {
        horario: '19:30',
        nome: 'Jantar',
        alimentos: [
          { nome: 'Salmão', quantidade: '150g', calorias: 280, proteina: 35 },
          { nome: 'Batata doce', quantidade: '150g', calorias: 130 },
          { nome: 'Salada verde', quantidade: '100g', calorias: 25 }
        ],
        macros: { calorias: 435, proteina: 40, carboidrato: 40, gordura: 12 }
      }
    },
    geradoComIA: false
  };
}

