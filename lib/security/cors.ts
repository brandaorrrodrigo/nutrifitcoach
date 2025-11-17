/**
 * CORS Configuration - Configuração centralizada de CORS
 *
 * Protege contra requisições não autorizadas de origens externas
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domínios permitidos
const ALLOWED_ORIGINS = [
  'https://nutrifitcoach.com.br',
  'https://www.nutrifitcoach.com.br',
  'https://nutrifit.ai', // Futuro
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000']
    : [])
];

// Métodos HTTP permitidos
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

// Headers permitidos
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin'
];

/**
 * Verifica se a origem é permitida
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  // Em desenvolvimento, permite localhost
  if (process.env.NODE_ENV === 'development') {
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return true;
    }
  }

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Adiciona headers CORS à resposta
 */
export function addCORSHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get('origin');

  // Verifica se origem é permitida
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    ALLOWED_METHODS.join(', ')
  );

  response.headers.set(
    'Access-Control-Allow-Headers',
    ALLOWED_HEADERS.join(', ')
  );

  response.headers.set('Access-Control-Max-Age', '86400'); // 24 horas

  return response;
}

/**
 * Lida com requisições OPTIONS (preflight)
 */
export function handleCORSPreflight(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return addCORSHeaders(response, request);
  }

  return null;
}
