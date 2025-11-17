import { NextResponse } from 'next/server';
import Stripe from 'stripe';

console.log('🔑 STRIPE_SECRET_KEY existe?', !!process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: Request) {
  console.log('📨 Requisição recebida');
  
  try {
    const body = await request.json();
    console.log('📦 Body:', body);

    const { priceId, email, userId } = body;
    console.log('🛒 Criando checkout...', { priceId, email });

    console.log('⏳ Chamando Stripe API...');
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/planos?canceled=true`,
      customer_email: email || 'teste@email.com',
      subscription_data: {
        trial_period_days: 15,
      },
    });

    console.log('✅ Session criada!', session.id);
    console.log('🔗 URL:', session.url);
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ ERRO COMPLETO:', error);
    console.error('❌ Mensagem:', error.message);
    console.error('❌ Stack:', error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
