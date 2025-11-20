import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// ✅ Lazy initialization - só inicializa quando usado
let stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    });
  }
  if (!stripe) {
    throw new Error('Stripe not configured');
  }
  return stripe;
}

export async function POST(request: Request) {
  console.log('📨 Requisição recebida');

  try {
    const body = await request.json();
    console.log('📦 Body:', body);

    const { priceId, email, userId } = body;
    console.log('🛒 Criando checkout...', { priceId, email });

    // ✅ Validação da chave do Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY não configurada!');
      return NextResponse.json(
        { error: 'Serviço de pagamento não configurado.' },
        { status: 500 }
      );
    }

    // ✅ Obter cliente Stripe
    const stripeClient = getStripeClient();

    console.log('⏳ Chamando Stripe API...');
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/pagamento-sucesso?success=true&session_id={CHECKOUT_SESSION_ID}`,
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
