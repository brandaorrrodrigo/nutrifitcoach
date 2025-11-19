import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/debug
 *
 * Rota de diagnóstico para verificar configuração do ambiente
 * REMOVER EM PRODUÇÃO DEPOIS DE TESTAR!
 */
export async function GET() {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {}
    };

    // Check 1: Variáveis de ambiente
    diagnostics.checks.env_vars = {
      DATABASE_URL: !!process.env.DATABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_URL: !!process.env.SUPABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
    };

    // Check 2: Conexão com banco
    try {
      await prisma.$queryRaw`SELECT NOW() as current_time`;
      diagnostics.checks.database_connection = 'OK';
    } catch (dbError: any) {
      diagnostics.checks.database_connection = {
        status: 'ERROR',
        message: dbError.message,
        code: dbError.code
      };
    }

    // Check 3: Verificar se tabela AppUser existe
    try {
      const userCount = await prisma.appUser.count();
      diagnostics.checks.appuser_table = {
        status: 'OK',
        user_count: userCount
      };
    } catch (tableError: any) {
      diagnostics.checks.appuser_table = {
        status: 'ERROR',
        message: tableError.message,
        code: tableError.code
      };
    }

    // Check 4: Verificar se tabela FemaleHormonalProfile existe
    try {
      const profileCount = await prisma.femaleHormonalProfile.count();
      diagnostics.checks.hormonal_profile_table = {
        status: 'OK',
        profile_count: profileCount
      };
    } catch (tableError: any) {
      diagnostics.checks.hormonal_profile_table = {
        status: 'ERROR',
        message: tableError.message,
        code: tableError.code
      };
    }

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Diagnostic failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
