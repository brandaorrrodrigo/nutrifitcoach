import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/test-supabase
 *
 * Testa conexão com Supabase usando Supabase Client (não Prisma)
 * Isso sempre funciona mesmo quando Prisma falha
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Supabase credentials missing',
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      }, { status: 500 });
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Testar query simples
    const { data, error } = await supabase
      .from('AppUser')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Supabase query failed',
        error: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    // Tentar criar um usuário de teste (para verificar se tabela existe)
    const testEmail = `test-${Date.now()}@example.com`;

    const { data: testUser, error: createError } = await supabase
      .from('AppUser')
      .insert({
        email: testEmail,
        name: 'Test User',
        display_name: 'Test User',
        password: 'hashed_password_placeholder',
        is_founder: false,
        is_premium: false
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({
        status: 'PARTIAL',
        message: 'Can query but cannot insert',
        queryWorks: true,
        insertError: createError.message,
        userCount: data
      }, { status: 200 });
    }

    // Deletar o usuário de teste
    await supabase
      .from('AppUser')
      .delete()
      .eq('id', testUser.id);

    return NextResponse.json({
      status: 'OK',
      message: 'Supabase connection works perfectly!',
      supabaseUrl,
      testUserCreated: true,
      testUserDeleted: true
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
