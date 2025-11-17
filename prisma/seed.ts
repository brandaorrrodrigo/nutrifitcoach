import { AreaConhecimento } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface QuestionSeed {
  ano: number;
  prova: string;
  numero: number;
  area: string;
  disciplina: string;
  habilidade?: string;
  enunciado: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  gabarito: string;
  dificuldade?: string;
}

// Novo formato do backend (todas_questoes_enem.json)
interface QuestionBackend {
  numero: number;
  ano: number;
  disciplina: string;
  enunciado: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correta: string; // Gabarito no formato do backend
  habilidade?: string;
  competencia?: number;
  explicacao?: string;
}

interface BackendQuestionsFile {
  versao: string;
  total_questoes: number;
  gerado_em: string;
  questoes: QuestionBackend[];
}

// Mapeia disciplina para área de conhecimento
function mapDisciplinaToArea(disciplina: string): string {
  const disciplinaLower = disciplina.toLowerCase();

  // Linguagens, Códigos e suas Tecnologias
  if (['portugues', 'literatura', 'ingles', 'espanhol', 'artes', 'educacao_fisica'].includes(disciplinaLower)) {
    return 'linguagens';
  }

  // Matemática e suas Tecnologias
  if (['matematica'].includes(disciplinaLower)) {
    return 'matematica';
  }

  // Ciências da Natureza e suas Tecnologias
  if (['fisica', 'quimica', 'biologia'].includes(disciplinaLower)) {
    return 'ciencias_natureza';
  }

  // Ciências Humanas e suas Tecnologias
  if (['historia', 'geografia', 'filosofia', 'sociologia'].includes(disciplinaLower)) {
    return 'ciencias_humanas';
  }

  // Fallback: tentar inferir pela primeira palavra
  console.warn(`⚠️  Disciplina não mapeada: ${disciplina}, usando fallback`);
  return 'linguagens'; // default
}

// Mapeia strings para o enum AreaConhecimento
function mapAreaToEnum(area: string): AreaConhecimento {
  const areaMap: { [key: string]: AreaConhecimento } = {
    'linguagens': AreaConhecimento.linguagens,
    'matematica': AreaConhecimento.matematica,
    'ciencias_natureza': AreaConhecimento.ciencias_natureza,
    'ciencias_humanas': AreaConhecimento.ciencias_humanas,
  };

  const mappedArea = areaMap[area.toLowerCase()];
  if (!mappedArea) {
    throw new Error(`Área desconhecida: ${area}. Use: linguagens, matematica, ciencias_natureza, ciencias_humanas`);
  }

  return mappedArea;
}

// Converte questão do formato backend para formato interno
function convertBackendQuestion(q: QuestionBackend): QuestionSeed {
  const area = mapDisciplinaToArea(q.disciplina);

  return {
    ano: q.ano,
    prova: `${q.ano}_aplicacao`, // Criar identificador de prova
    numero: q.numero,
    area,
    disciplina: q.disciplina,
    habilidade: q.habilidade,
    enunciado: q.enunciado,
    alternativas: q.alternativas,
    gabarito: q.correta,
    dificuldade: undefined, // Não presente no formato backend
  };
}

async function seedQuestions() {
  console.log('🌱 Iniciando seed de questões ENEM...\n');

  // Definir caminhos dos arquivos
  const backendFilePath = 'D:/enem-ia/backend/enem_ingestion/todas_questoes_enem.json';
  const localFilePath = path.join(__dirname, 'enem_questions_seed.json');

  let questions: QuestionSeed[] = [];
  let sourceFile = '';

  // Tentar carregar arquivo do backend primeiro
  if (fs.existsSync(backendFilePath)) {
    console.log('📂 Carregando questões do backend (todas_questoes_enem.json)...');
    try {
      const fileContent = fs.readFileSync(backendFilePath, 'utf-8');
      const backendData: BackendQuestionsFile = JSON.parse(fileContent);

      console.log(`   Versão: ${backendData.versao}`);
      console.log(`   Gerado em: ${backendData.gerado_em}`);
      console.log(`   Total declarado: ${backendData.total_questoes} questões`);

      // Converter questões do formato backend
      questions = backendData.questoes.map(convertBackendQuestion);
      sourceFile = backendFilePath;

      console.log(`✅ Carregadas ${questions.length} questões do backend\n`);
    } catch (error: any) {
      console.error(`❌ Erro ao ler arquivo do backend: ${error.message}`);
      console.log('   Tentando arquivo local...\n');
    }
  } else {
    console.log('📂 Arquivo do backend não encontrado, tentando arquivo local...');
  }

  // Fallback: tentar carregar arquivo local
  if (questions.length === 0 && fs.existsSync(localFilePath)) {
    console.log('📂 Carregando questões do arquivo local (enem_questions_seed.json)...');
    const fileContent = fs.readFileSync(localFilePath, 'utf-8');
    questions = JSON.parse(fileContent);
    sourceFile = localFilePath;
    console.log(`✅ Carregadas ${questions.length} questões do arquivo local\n`);
  }

  // Verificar se conseguiu carregar questões
  if (questions.length === 0) {
    console.error('❌ Nenhum arquivo de questões encontrado!');
    console.error('   Arquivos procurados:');
    console.error(`   1. ${backendFilePath}`);
    console.error(`   2. ${localFilePath}`);
    console.error('\n   Crie pelo menos um desses arquivos com questões.\n');
    process.exit(1);
  }

  console.log(`📚 Total de questões carregadas: ${questions.length}`);
  console.log(`📁 Fonte: ${sourceFile}\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const question of questions) {
    try {
      // Verificar se questão já existe (unique constraint: ano, prova, numero)
      const existing = await prisma.enemQuestao.findUnique({
        where: {
          ano_prova_numero: {
            ano: question.ano,
            prova: question.prova,
            numero: question.numero,
          },
        },
      });

      if (existing) {
        // Log silencioso para não poluir (apenas incrementa contador)
        skipped++;
        continue;
      }

      // Validar gabarito
      if (!['A', 'B', 'C', 'D', 'E'].includes(question.gabarito)) {
        console.error(`❌ Gabarito inválido para questão ${question.numero}: ${question.gabarito}`);
        errors++;
        continue;
      }

      // Validar alternativas
      const requiredAlternatives = ['A', 'B', 'C', 'D', 'E'];
      const hasAllAlternatives = requiredAlternatives.every(
        (alt) => question.alternativas[alt as keyof typeof question.alternativas]
      );

      if (!hasAllAlternatives) {
        console.error(`❌ Questão ${question.numero} não possui todas as alternativas (A-E)`);
        errors++;
        continue;
      }

      // Inserir questão
      const created = await prisma.enemQuestao.create({
        data: {
          ano: question.ano,
          prova: question.prova,
          numero: question.numero,
          area: mapAreaToEnum(question.area),
          disciplina: question.disciplina,
          habilidade: question.habilidade || null,
          enunciado: question.enunciado,
          alternativas: question.alternativas,
          gabarito: question.gabarito,
          dificuldade: question.dificuldade || null,
        },
      });

      // Log apenas a cada 10 questões inseridas para não poluir
      if (inserted % 10 === 0 || inserted < 10) {
        console.log(`✅ Questão ${question.numero} inserida: ${question.disciplina} (${question.area})`);
      }
      inserted++;
    } catch (error: any) {
      console.error(`❌ Erro ao inserir questão ${question.numero}:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DO SEED');
  console.log('='.repeat(60));
  console.log(`📚 Questões carregadas do JSON: ${questions.length}`);
  console.log(`✅ Questões inseridas no banco: ${inserted}`);
  console.log(`⏭️  Questões puladas (duplicadas): ${skipped}`);
  console.log(`❌ Erros durante inserção: ${errors}`);
  console.log('='.repeat(60) + '\n');

  // Estatísticas por área
  const stats = await prisma.enemQuestao.groupBy({
    by: ['area'],
    _count: {
      id: true,
    },
  });

  console.log('📈 Questões por área no banco:');
  stats.forEach((stat) => {
    console.log(`   ${stat.area}: ${stat._count.id} questões`);
  });

  // Estatísticas por disciplina
  const statsDisciplina = await prisma.enemQuestao.groupBy({
    by: ['disciplina'],
    _count: {
      id: true,
    },
    orderBy: {
      disciplina: 'asc',
    },
  });

  console.log('\n📚 Questões por disciplina no banco:');
  statsDisciplina.forEach((stat) => {
    console.log(`   ${stat.disciplina}: ${stat._count.id} questões`);
  });

  // Total de questões
  const total = await prisma.enemQuestao.count();
  console.log(`\n🎯 TOTAL DE QUESTÕES NO BANCO: ${total}\n`);

  return { inserted, skipped, errors, total, loaded: questions.length };
}

async function createTestUser() {
  console.log('👤 Verificando usuário de teste...\n');

  const testUserId = 'user-123';

  const existingUser = await prisma.appUser.findUnique({
    where: { id: testUserId },
  });

  if (existingUser) {
    console.log(`✅ Usuário de teste já existe: ${existingUser.email}\n`);
    return existingUser;
  }

  // Criar usuário de teste
  const user = await prisma.appUser.create({
    data: {
      id: testUserId,
      email: 'teste@enem.com.br',
      name: 'Usuário Teste ENEM',
      display_name: 'Teste ENEM',
      is_premium: true,
    },
  });

  console.log(`✅ Usuário de teste criado: ${user.email}\n`);

  // Criar gamificação para o usuário
  const gamification = await prisma.userGamificationEnem.create({
    data: {
      user_id: user.id,
      total_fp: 0,
      current_streak: 0,
      best_streak: 0,
    },
  });

  console.log(`✅ Gamificação criada para o usuário\n`);

  return user;
}

async function main() {
  try {
    console.log('🚀 SEED DE QUESTÕES ENEM - INICIANDO\n');
    console.log('=' .repeat(60) + '\n');

    // Criar usuário de teste se não existir
    await createTestUser();

    // Seed de questões
    const result = await seedQuestions();

    console.log('=' .repeat(60));
    console.log('✅ SEED CONCLUÍDO COM SUCESSO!\n');

    if (result.inserted > 0) {
      console.log('🎓 Você já pode iniciar simulados ENEM!');
      console.log('   Acesse: http://localhost:3000/enem/dashboard\n');
    } else if (result.total > 0) {
      console.log('📚 O banco já possui questões cadastradas.');
      console.log('   Acesse: http://localhost:3000/enem/dashboard\n');
    } else {
      console.log('⚠️  Nenhuma questão foi inserida.');
      console.log('   Verifique os arquivos de questões.\n');
    }

  } catch (error: any) {
    console.error('\n❌ ERRO DURANTE O SEED:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed
main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
