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

/**
 * POST /api/create-checkout-session
 *
 * Cria uma sessão de checkout do Stripe para assinaturas
 *
 * Body esperado:
 * - priceId: ID do preço do Stripe (ex: price_xxx)
 * - email: Email do cliente (opcional)
 * - userId: ID do usuário (opcional)
 * - ref: Código de referência/cupom (opcional)
 *
 * Retorna:
 * - url: URL da página de checkout do Stripe
 */
export async function POST(request: Request) {
  try {
    // ✅ Parse do body (suporta JSON e FormData)
    let priceId: string | undefined;
    let email: string | undefined;
    let userId: string | undefined;
    let ref: string | undefined;

    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      // JSON do fetch()
      const body = await request.json();
      priceId = body.priceId;
      email = body.email;
      userId = body.userId;
      ref = body.ref;
    } else {
      // FormData de <form>
      const formData = await request.formData();
      priceId = formData.get('priceId') as string;
      email = formData.get('email') as string;
      userId = formData.get('userId') as string;
      ref = formData.get('ref') as string;
    }

    // ✅ Validação do priceId
    if (!priceId) {
      return NextResponse.json(
        { error: 'priceId é obrigatório' },
        { status: 400 }
      );
    }

    // ✅ Validação da chave do Stripe
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      console.error('❌ STRIPE_SECRET_KEY não configurada!');
      return NextResponse.json(
        { error: 'Serviço de pagamento não configurado. Entre em contato com o suporte.' },
        { status: 500 }
      );
    }

    // ✅ Obter cliente Stripe (lazy initialization)
    const stripeClient = getStripeClient();

    // ✅ Definir URLs de sucesso e cancelamento
    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/dashboard?success=true`;
    const cancelUrl = `${baseUrl}/planos?canceled=true`;

    console.log('💳 Criando sessão de checkout...', {
      priceId,
      email: email || 'não fornecido',
      userId: userId || 'não fornecido',
      ref: ref || 'sem referência'
    });

    // ✅ Criar sessão de checkout do Stripe
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email || undefined,
      subscription_data: {
        trial_period_days: 15, // Período de teste padrão
        metadata: {
          userId: userId || '',
          ref: ref || '',
        },
      },
      // ✅ Metadados para rastreamento
      metadata: {
        userId: userId || '',
        ref: ref || '',
      },
      // ✅ Permitir códigos promocionais
      allow_promotion_codes: true,
    });

    console.log('✅ Sessão criada com sucesso!', {
      sessionId: session.id,
      url: session.url,
    });

    // ✅ Se for FormData de <form>, redirecionar diretamente
    if (!contentType?.includes('application/json') && session.url) {
      return NextResponse.redirect(session.url);
    }

    // ✅ Se for JSON fetch(), retornar URL para o frontend redirecionar
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error: any) {
    console.error('❌ Erro ao criar sessão de checkout:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });

    // ✅ Tratamento de erros específicos do Stripe
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Dados inválidos. Verifique o priceId e tente novamente.' },
        { status: 400 }
      );
    }

    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: 'Erro de autenticação com Stripe. Entre em contato com o suporte.' },
        { status: 500 }
      );
    }

    // ✅ Erro genérico
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento. Tente novamente.' },
      { status: 500 }
    );
  }
}
