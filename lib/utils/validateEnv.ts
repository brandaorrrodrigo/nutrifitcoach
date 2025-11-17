/**
 * Validação de variáveis de ambiente obrigatórias
 * Executa ao iniciar a aplicação e falha fast se algo estiver faltando
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

const optionalEnvVars = [
  'ANTHROPIC_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
  'TELEGRAM_BOT_TOKEN',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_ENVIRONMENT',
  'RAG_STORAGE_PATH',
] as const;

export function validateEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Verificar variáveis obrigatórias
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Verificar variáveis opcionais (avisos apenas)
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  // Falhar se houver variáveis obrigatórias faltando
  if (missing.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente obrigatórias não encontradas:');
    missing.forEach((v) => console.error(`  - ${v}`));
    console.error('\n💡 Copie .env.example para .env e preencha os valores.');
    throw new Error('Variáveis de ambiente obrigatórias não configuradas');
  }

  // Validar formato de NEXTAUTH_SECRET
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn('⚠️  AVISO: NEXTAUTH_SECRET deve ter pelo menos 32 caracteres');
  }

  // Avisar sobre variáveis opcionais
  if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn('⚠️  Variáveis opcionais não configuradas:');
    warnings.forEach((v) => console.warn(`  - ${v}`));
    console.warn('Algumas funcionalidades podem não estar disponíveis.\n');
  }

  // Log de sucesso
  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Variáveis de ambiente validadas com sucesso');
    console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}\n`);
  }
}

// Auto-executar em produção/desenvolvimento (não em testes)
if (process.env.NODE_ENV !== 'test' && typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    // Em produção, falhar completamente
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}
