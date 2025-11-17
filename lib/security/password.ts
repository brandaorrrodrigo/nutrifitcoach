/**
 * Password Security - Validação e políticas de senha
 *
 * Garante senhas fortes e seguras
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida força da senha
 *
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 *
 * @param password - Senha a validar
 * @returns Resultado com sucesso e lista de erros
 */
export function validatePasswordStrength(
  password: string
): PasswordValidationResult {
  const errors: string[] = [];

  // Verifica comprimento mínimo
  if (!password || password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }

  // Verifica se contém pelo menos uma letra
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 letra');
  }

  // Verifica se contém pelo menos um número
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 número');
  }

  // Verifica se contém pelo menos um caractere especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 caractere especial (!@#$%^&*...)');
  }

  // Verifica se senha é muito comum
  const commonPasswords = [
    '12345678',
    'password',
    'senha123',
    'admin123',
    'qwerty12',
    '123456789',
    'abc123456'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Senha muito comum. Escolha uma senha mais segura');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Gera mensagem de erro amigável para o usuário
 */
export function getPasswordErrorMessage(
  validation: PasswordValidationResult
): string {
  if (validation.valid) return '';

  return `Senha fraca. ${validation.errors.join('. ')}.`;
}
