import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

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
  try {
    // ✅ Validação das chaves do Stripe
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('❌ Stripe não configurado!');
      return NextResponse.json(
        { error: 'Stripe webhook not configured' },
        { status: 500 }
      );
    }

    const stripeClient = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('📨 Webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        await prisma.subscription.create({
          data: {
            userId: session.metadata?.userId || 'temp',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.line_items?.data[0]?.price?.id,
            stripeStatus: 'active',
            trialEndsAt: null, // Trial info is on subscription object, not session
          },
        });

        console.log('✅ Subscription created');
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeStatus: subscription.status,
            currentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          },
        });

        console.log('✅ Subscription updated');
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
