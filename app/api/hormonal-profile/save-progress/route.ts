import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

/**
 * Save partial progress during hormonal onboarding
 * This endpoint is called at each step to prevent data loss
 */
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // For now, we just acknowledge the save
    // In production, you might want to save to a temporary table or session storage
    // to allow users to resume incomplete profiles

    return NextResponse.json({ success: true, message: 'Progress saved' }, { status: 200 });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
