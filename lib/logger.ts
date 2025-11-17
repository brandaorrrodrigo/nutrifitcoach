/**
 * Sistema de Logs do NutriFit
 * Usa Pino para logs estruturados e performance
 */

import pino from 'pino';

// Configuração baseada no ambiente
const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Pretty print em desenvolvimento
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,

  // Formatação para produção (JSON estruturado)
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },

  // Serializers para objetos comuns
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

/**
 * Logger específico para IA (Anthropic/Claude)
 */
export const aiLogger = logger.child({ module: 'AI' });

/**
 * Logger específico para RAG
 */
export const ragLogger = logger.child({ module: 'RAG' });

/**
 * Logger específico para Upload
 */
export const uploadLogger = logger.child({ module: 'Upload' });

/**
 * Logger específico para ChatBot
 */
export const chatLogger = logger.child({ module: 'ChatBot' });

/**
 * Logger específico para Auth
 */
export const authLogger = logger.child({ module: 'Auth' });

/**
 * Logger específico para Database
 */
export const dbLogger = logger.child({ module: 'Database' });

/**
 * Helper para log de erros com contexto
 */
export function logError(
  error: Error,
  context: Record<string, any> = {},
  loggerInstance = logger
) {
  loggerInstance.error(
    {
      err: error,
      ...context,
    },
    error.message
  );
}

/**
 * Helper para log de requisições API
 */
export function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
) {
  logger.info({
    type: 'api_request',
    method,
    path,
    statusCode,
    duration,
    userId,
  });
}

/**
 * Helper para log de chamadas IA
 */
export function logAICall(
  provider: string,
  model: string,
  promptTokens: number,
  completionTokens: number,
  duration: number,
  success: boolean
) {
  aiLogger.info({
    type: 'ai_call',
    provider,
    model,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    duration,
    success,
  });
}

export default logger;
