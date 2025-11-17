import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate Limiter - Sistema de controle de taxa de requisições
 *
 * Armazena em memória com fallback para produção via headers
 * Diferencia usuários autenticados vs não autenticados
 */

interface RateLimitConfig {
  authenticatedLimit: number; // requisições/minuto para usuários autenticados
  unauthenticatedLimit: number; // requisições/minuto para visitantes
  windowMs: number; // janela de tempo em milissegundos
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Armazenamento em memória (resetado a cada deploy)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuração padrão
const DEFAULT_CONFIG: RateLimitConfig = {
  authenticatedLimit: 10, // 10 req/min para autenticados
  unauthenticatedLimit: 3, // 3 req/min para visitantes
  windowMs: 60 * 1000, // 1 minuto
};

/**
 * Limpa entradas expiradas do store (executado periodicamente)
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Limpeza a cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Extrai identificador do usuário (email se autenticado, IP se não)
 */
function getUserIdentifier(request: NextRequest, userEmail?: string): string {
  if (userEmail) {
    return `user:${userEmail}`;
  }

  // Tenta pegar IP real (considerando proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return `ip:${ip}`;
}

/**
 * Verifica rate limit para uma requisição
 *
 * @param request - NextRequest object
 * @param endpoint - Nome do endpoint (ex: 'chat', 'vision')
 * @param userEmail - Email do usuário autenticado (opcional)
 * @param config - Configuração customizada (opcional)
 * @returns NextResponse com erro 429 se limite excedido, null se OK
 */
export function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  userEmail?: string,
  config: Partial<RateLimitConfig> = {}
): NextResponse | null {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const identifier = getUserIdentifier(request, userEmail);
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();

  // Determina limite baseado em autenticação
  const limit = userEmail
    ? finalConfig.authenticatedLimit
    : finalConfig.unauthenticatedLimit;

  // Busca ou cria entrada
  let entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Nova janela de tempo
    entry = {
      count: 1,
      resetTime: now + finalConfig.windowMs,
    };
    rateLimitStore.set(key, entry);
    return null; // OK
  }

  // Incrementa contador
  entry.count++;

  // Verifica se excedeu limite
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Você excedeu o limite de requisições. Tente novamente em ${retryAfter} segundos.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        }
      }
    );
  }

  // Atualiza entrada
  rateLimitStore.set(key, entry);

  // OK - retorna null
  return null;
}

/**
 * Adiciona headers informativos de rate limit à resposta
 */
export function addRateLimitHeaders(
  response: NextResponse,
  endpoint: string,
  identifier: string,
  limit: number
): void {
  const key = `${endpoint}:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (entry) {
    const remaining = Math.max(0, limit - entry.count);
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
  }
}

/**
 * Reseta rate limit para um usuário específico (útil após logout, etc)
 */
export function resetRateLimit(endpoint: string, identifier: string): void {
  const key = `${endpoint}:${identifier}`;
  rateLimitStore.delete(key);
}
