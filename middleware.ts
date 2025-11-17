import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleCORSPreflight, addCORSHeaders } from '@/lib/security/cors';

export default withAuth(
  function middleware(req: NextRequest) {
    // 🔒 CORS - Handle preflight requests
    const preflightResponse = handleCORSPreflight(req);
    if (preflightResponse) {
      return preflightResponse;
    }

    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Verificar se é rota premium
    const premiumRoutes = ['/dashboard', '/anamnese', '/enem/simulados'];
    const isPremiumRoute = premiumRoutes.some(route => pathname.startsWith(route));

    // Se é rota premium e usuário não é premium/founder, redirecionar
    if (isPremiumRoute && !token?.isPremium && !token?.isFounder) {
      const url = req.nextUrl.clone();
      url.pathname = '/planos';
      url.searchParams.set('error', 'premium_required');
      return NextResponse.redirect(url);
    }

    // 🔒 SECURITY HEADERS
    const response = NextResponse.next();

    // Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "img-src 'self' data: blob: https:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline e unsafe-eval necessários para Next.js
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' https://api.anthropic.com https://api.openai.com http://localhost:* ws://localhost:*",
        "font-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
      ].join('; ')
    );

    // Previne clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Previne MIME sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Controla informações do referrer
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // HSTS - Force HTTPS (apenas em produção)
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload'
      );
    }

    // Permissions Policy - Desabilita recursos não utilizados
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    );

    // Remove header que expõe tecnologia
    response.headers.delete('X-Powered-By');

    // 🔒 CORS Headers
    return addCORSHeaders(response, req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     * - Arquivos públicos (*.svg, *.png, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
