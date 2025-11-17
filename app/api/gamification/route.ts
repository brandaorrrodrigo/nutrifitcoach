import { NextResponse } from 'next/server';

const BADGES = {
  FIRST_PLAN: { nome: 'Primeiro Passo', icon: '🎯', points: 10, descricao: 'Criou seu primeiro plano' },
  STREAK_7: { nome: 'Semana Forte', icon: '🔥', points: 50, descricao: '7 dias consecutivos' },
  STREAK_30: { nome: 'Mestre da Consistência', icon: '💪', points: 200, descricao: '30 dias consecutivos' },
  WEIGHT_LOSS_5: { nome: 'Primeiros 5kg', icon: '⚖️', points: 100, descricao: 'Perdeu 5kg' },
  SHARE: { nome: 'Influenciador', icon: '📢', points: 25, descricao: 'Compartilhou seu progresso' },
  CHAT_10: { nome: 'Curioso', icon: '💬', points: 30, descricao: '10 perguntas ao nutricionista IA' },
  COMPLETE_PROFILE: { nome: 'Perfil Completo', icon: '👤', points: 20, descricao: 'Completou todas informações' },
};

export async function POST(request: Request) {
  try {
    const { action, userId } = await request.json();
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    let points = userData.points || 0;
    let badges = userData.badges || [];
    let streak = userData.streak || 0;
    
    switch(action) {
      case 'check_in':
        const lastCheckIn = userData.lastCheckIn ? new Date(userData.lastCheckIn) : null;
        const today = new Date();
        
        if (lastCheckIn) {
          const diffDays = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak += 1;
            points += 5;
          } else if (diffDays > 1) {
            streak = 1;
          }
        } else {
          streak = 1;
        }
        
        userData.lastCheckIn = today.toISOString();
        userData.streak = streak;
        
        // Check badges
        if (streak === 7 && !badges.includes('STREAK_7')) {
          badges.push('STREAK_7');
          points += BADGES.STREAK_7.points;
        }
        
        if (streak === 30 && !badges.includes('STREAK_30')) {
          badges.push('STREAK_30');
          points += BADGES.STREAK_30.points;
        }
        break;
        
      case 'first_plan':
        if (!badges.includes('FIRST_PLAN')) {
          badges.push('FIRST_PLAN');
          points += BADGES.FIRST_PLAN.points;
        }
        break;
        
      case 'complete_profile':
        if (!badges.includes('COMPLETE_PROFILE')) {
          badges.push('COMPLETE_PROFILE');
          points += BADGES.COMPLETE_PROFILE.points;
        }
        break;
    }
    
    userData.points = points;
    userData.badges = badges;
    userData.level = Math.floor(points / 100) + 1;
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    return NextResponse.json({ 
      success: true,
      points,
      badges,
      streak,
      level: userData.level
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const userData = JSON.parse(localStorage.getItem('userData') || '{"points": 0, "badges": [], "streak": 0, "level": 1}');
  
  return NextResponse.json({
    points: userData.points || 0,
    badges: userData.badges || [],
    streak: userData.streak || 0,
    level: userData.level || 1,
    nextLevelPoints: (userData.level || 1) * 100
  });
}
