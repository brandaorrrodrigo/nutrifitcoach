import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/progress-photos/sessions
 *
 * Lista todas as sessões de fotos de evolução do usuário
 * Ordenadas por data (mais recentes primeiro)
 */
export async function GET(request: Request) {
  try {
    // 1. Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // 2. Criar cliente Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Configuração do servidor incorreta'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Buscar usuário
    const { data: user } = await supabase
      .from('AppUser')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // 4. Buscar sessões do usuário
    const { data: sessions, error: sessionsError } = await supabase
      .from('ProgressSession')
      .select('*')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false });

    if (sessionsError) {
      console.error('Erro ao buscar sessões:', sessionsError);
      return NextResponse.json({
        error: 'Erro ao buscar sessões'
      }, { status: 500 });
    }

    // 5. Para cada sessão, buscar as fotos
    const sessionsWithPhotos = await Promise.all(
      (sessions || []).map(async (session) => {
        const { data: photos } = await supabase
          .from('ProgressPhoto')
          .select('*')
          .eq('session_id', session.id)
          .order('photo_type', { ascending: true });

        return {
          id: session.id,
          sessionDate: session.session_date,
          weightKg: parseFloat(session.weight_kg),
          heightCm: parseFloat(session.height_cm),
          ageYears: session.age_years,
          bodyFatPercent: session.body_fat_percent ? parseFloat(session.body_fat_percent) : null,
          bmi: session.bmi ? parseFloat(session.bmi) : null,
          leanMassKg: session.lean_mass_kg ? parseFloat(session.lean_mass_kg) : null,
          fatMassKg: session.fat_mass_kg ? parseFloat(session.fat_mass_kg) : null,
          weightChangeKg: session.weight_change_kg ? parseFloat(session.weight_change_kg) : null,
          bfChangePercent: session.bf_change_percent ? parseFloat(session.bf_change_percent) : null,
          daysSinceLast: session.days_since_last,
          isComplete: session.is_complete,
          photosCount: session.photos_count,
          notes: session.notes,
          photos: (photos || []).map(photo => ({
            id: photo.id,
            photoType: photo.photo_type,
            watermarkedUrl: photo.watermarked_url,
            thumbUrl: photo.thumb_url,
            width: photo.width,
            height: photo.height,
            takenAt: photo.taken_at,
            sharedTo: photo.shared_to,
            likesCount: photo.likes_count,
            commentsCount: photo.comments_count,
            sharesCount: photo.shares_count
          })),
          createdAt: session.created_at,
          updatedAt: session.updated_at
        };
      })
    );

    // 6. Calcular comparações entre sessões
    const sessionsWithComparisons = sessionsWithPhotos.map((session, index) => {
      if (index < sessionsWithPhotos.length - 1) {
        const previousSession = sessionsWithPhotos[index + 1];
        const weightChange = session.weightKg - previousSession.weightKg;
        const bfChange = session.bodyFatPercent && previousSession.bodyFatPercent
          ? session.bodyFatPercent - previousSession.bodyFatPercent
          : null;

        const daysBetween = Math.floor(
          (new Date(session.sessionDate).getTime() - new Date(previousSession.sessionDate).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        return {
          ...session,
          comparison: {
            weightChangeKg: parseFloat(weightChange.toFixed(2)),
            bfChangePercent: bfChange ? parseFloat(bfChange.toFixed(2)) : null,
            daysSinceLast: daysBetween
          }
        };
      }

      return session;
    });

    return NextResponse.json({
      success: true,
      sessions: sessionsWithComparisons,
      totalSessions: sessionsWithComparisons.length
    });

  } catch (error) {
    console.error('❌ Erro ao buscar sessões:', error);
    const message = error instanceof Error ? error.message : 'Erro ao buscar sessões. Tente novamente.';
    return NextResponse.json({
      error: message
    }, { status: 500 });
  }
}
