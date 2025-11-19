// Teste de conexão com o banco de dados
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...\n');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

    // Tentar fazer uma query simples
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;

    console.log('\n✅ CONEXÃO BEM-SUCEDIDA!');
    console.log('Hora do servidor:', result[0].current_time);

    // Tentar listar tabelas
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('\n📋 Tabelas no banco:');
    tables.forEach(t => console.log('  -', t.table_name));

  } catch (error) {
    console.error('\n❌ ERRO DE CONEXÃO:');
    console.error('Mensagem:', error.message);
    console.error('\nPossíveis causas:');
    console.error('1. Projeto Supabase pausado');
    console.error('2. Connection string incorreta');
    console.error('3. Senha errada');
    console.error('4. Firewall bloqueando');

  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
