import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user
    const user = await prisma.appUser.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const {
      age,
      cycle_status,
      contraceptive_type,
      contraceptive_effects,
      hormonal_conditions,
      hormone_therapy,
      menopause_status,
      menopause_symptoms,
      general_symptoms,
      objective,
      classification,
    } = body;

    // Check if profile already exists
    const existingProfile = await prisma.femaleHormonalProfile.findUnique({
      where: { user_id: user.id },
    });

    // Upsert profile
    const profile = await prisma.femaleHormonalProfile.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        age,
        cycle_status,
        contraceptive_type,
        contraceptive_effects,
        hormonal_conditions,
        hormone_therapy,
        menopause_status,
        menopause_symptoms,
        general_symptoms,
        objective,
        hormonal_profile: classification.perfil_hormonal,
        hormonal_subprofile: classification.subperfil,
        nutritional_adjustments: classification.ajustes_nutricionais,
        sensitivities: classification.sensibilidades,
        alerts: classification.alertas,
        critical_points: classification.pontos_criticos,
      },
      update: {
        age,
        cycle_status,
        contraceptive_type,
        contraceptive_effects,
        hormonal_conditions,
        hormone_therapy,
        menopause_status,
        menopause_symptoms,
        general_symptoms,
        objective,
        hormonal_profile: classification.perfil_hormonal,
        hormonal_subprofile: classification.subperfil,
        nutritional_adjustments: classification.ajustes_nutricionais,
        sensitivities: classification.sensibilidades,
        alerts: classification.alertas,
        critical_points: classification.pontos_criticos,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error) {
    console.error('Error saving hormonal profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
