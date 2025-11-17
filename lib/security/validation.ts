/**
 * Validation & Sanitization - Sistema centralizado de validação e sanitização
 *
 * Protege contra:
 * - XSS (Cross-Site Scripting)
 * - SQL Injection
 * - Path Traversal
 * - Ataques de upload
 * - Inputs maliciosos
 */

/**
 * Sanitiza string removendo tags HTML e scripts
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove <iframe>
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers (onclick, onerror, etc)
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, '') // Remove data:text/html
    .trim();
}

/**
 * Valida e sanitiza mensagem de chat
 *
 * @param message - Mensagem do usuário
 * @param maxLength - Tamanho máximo permitido (default: 4000)
 * @returns Objeto com sucesso e mensagem sanitizada ou erro
 */
export function validateChatMessage(
  message: unknown,
  maxLength: number = 4000
): { valid: boolean; sanitized?: string; error?: string } {
  // Verifica se é string
  if (typeof message !== 'string') {
    return { valid: false, error: 'Mensagem deve ser texto' };
  }

  // Remove espaços
  const trimmed = message.trim();

  // Verifica vazio
  if (!trimmed) {
    return { valid: false, error: 'Mensagem não pode estar vazia' };
  }

  // Verifica tamanho
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Mensagem muito longa. Máximo de ${maxLength} caracteres.`
    };
  }

  // Sanitiza HTML
  const sanitized = sanitizeHTML(trimmed);

  // Verifica caracteres perigosos adicionais
  const dangerousPatterns = [
    /\$\{.*?\}/g, // Template literals
    /\`.*?\`/g, // Backticks
    /<\?php/gi, // PHP tags
    /<\%/g, // ASP/JSP tags
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return { valid: false, error: 'Mensagem contém caracteres não permitidos' };
    }
  }

  return { valid: true, sanitized };
}

/**
 * Valida base64 de imagem
 *
 * @param base64 - String base64 da imagem
 * @param maxSizeMB - Tamanho máximo em MB (default: 5)
 * @returns Objeto com sucesso e detalhes ou erro
 */
export function validateImageBase64(
  base64: unknown,
  maxSizeMB: number = 5
): {
  valid: boolean;
  mimeType?: string;
  sizeBytes?: number;
  error?: string;
} {
  // Verifica se é string
  if (typeof base64 !== 'string') {
    return { valid: false, error: 'Base64 deve ser texto' };
  }

  // Remove prefixo data:image se existir
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

  // Valida formato base64
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(base64Data)) {
    return { valid: false, error: 'Formato base64 inválido' };
  }

  // Calcula tamanho
  const sizeBytes = (base64Data.length * 3) / 4;
  const sizeMB = sizeBytes / (1024 * 1024);

  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `Imagem muito grande. Máximo de ${maxSizeMB}MB. Tamanho atual: ${sizeMB.toFixed(2)}MB`
    };
  }

  // Extrai mime type do prefixo
  let mimeType = 'image/jpeg'; // default
  if (base64.startsWith('data:')) {
    const match = base64.match(/^data:(image\/[a-z]+);base64,/);
    if (match) {
      mimeType = match[1];
    }
  }

  // Valida mime types permitidos
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(mimeType)) {
    return {
      valid: false,
      error: `Tipo de imagem não permitido. Permitidos: JPEG, PNG, WebP`
    };
  }

  return {
    valid: true,
    mimeType,
    sizeBytes: Math.round(sizeBytes)
  };
}

/**
 * Sanitiza nome de arquivo
 * Previne path traversal e caracteres perigosos
 *
 * @param filename - Nome do arquivo
 * @returns Nome sanitizado
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return `file_${Date.now()}`;
  }

  return filename
    .replace(/\.\./g, '') // Remove ..
    .replace(/\//g, '') // Remove /
    .replace(/\\/g, '') // Remove \
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Só permite alfanuméricos, ponto, traço e underscore
    .slice(0, 255); // Limite de tamanho
}

/**
 * Valida arquivo de upload
 *
 * @param file - File object
 * @param maxSizeMB - Tamanho máximo em MB (default: 5)
 * @param allowedExtensions - Extensões permitidas
 * @returns Objeto com sucesso e detalhes ou erro
 */
export function validateUploadFile(
  file: File,
  maxSizeMB: number = 5,
  allowedExtensions: string[] = ['jpg', 'jpeg', 'png', 'webp']
): {
  valid: boolean;
  sanitizedName?: string;
  error?: string;
} {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo fornecido' };
  }

  // Valida tamanho
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo de ${maxSizeMB}MB. Tamanho atual: ${sizeMB.toFixed(2)}MB`
    };
  }

  // Extrai extensão
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Extensão não permitida. Permitidas: ${allowedExtensions.join(', ')}`
    };
  }

  // Valida mime type
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo não permitido'
    };
  }

  // Sanitiza nome
  const sanitizedName = sanitizeFilename(file.name);

  return {
    valid: true,
    sanitizedName
  };
}

/**
 * Valida query para RAG
 *
 * @param query - Query do usuário
 * @param maxLength - Tamanho máximo (default: 300)
 * @returns Objeto com sucesso e query sanitizada ou erro
 */
export function validateRAGQuery(
  query: unknown,
  maxLength: number = 300
): { valid: boolean; sanitized?: string; error?: string } {
  // Verifica se é string
  if (typeof query !== 'string') {
    return { valid: false, error: 'Query deve ser texto' };
  }

  const trimmed = query.trim();

  if (!trimmed) {
    return { valid: false, error: 'Query não pode estar vazia' };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Query muito longa. Máximo de ${maxLength} caracteres.`
    };
  }

  // Sanitiza caracteres de escape perigosos
  const sanitized = trimmed
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove caracteres de controle
    .replace(/[`$\\]/g, '') // Remove backticks, dollar signs e backslashes
    .trim();

  return { valid: true, sanitized };
}
