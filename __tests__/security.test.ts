/**
 * Testes de segurança do NutriFit
 */

import { describe, it, expect } from '@jest/globals';
import { validateChatMessage, validateImageBase64, validatePasswordStrength } from '@/lib/security/validation';
import { sanitizeHTML, sanitizeFilename } from '@/lib/security/validation';

describe('Validação de Input', () => {
  it('validateChatMessage - deve aceitar mensagem válida', () => {
    const result = validateChatMessage('Olá, preciso de ajuda com minha dieta', 1000);
    expect(result.valid).toBe(true);
  });

  it('validateChatMessage - deve rejeitar mensagem muito longa', () => {
    const longMessage = 'a'.repeat(5000);
    const result = validateChatMessage(longMessage, 1000);
    expect(result.valid).toBe(false);
  });

  it('validateChatMessage - deve rejeitar input malicioso', () => {
    const malicious = '<script>alert("xss")</script>';
    const result = validateChatMessage(malicious, 1000);
    expect(result.valid).toBe(false);
  });
});

describe('Sanitização', () => {
  it('sanitizeHTML - deve remover tags HTML', () => {
    const dirty = '<p>Hello <script>alert("xss")</script></p>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('</script>');
  });

  it('sanitizeFilename - deve remover caracteres perigosos', () => {
    const dangerous = '../../etc/passwd';
    const safe = sanitizeFilename(dangerous);
    expect(safe).not.toContain('../');
    expect(safe).not.toContain('/');
  });
});

describe('Senha', () => {
  it('validatePasswordStrength - deve aceitar senha forte', () => {
    const result = validatePasswordStrength('Senha@123');
    expect(result.valid).toBe(true);
  });

  it('validatePasswordStrength - deve rejeitar senha fraca', () => {
    const result = validatePasswordStrength('123456');
    expect(result.valid).toBe(false);
  });

  it('validatePasswordStrength - deve rejeitar senha comum', () => {
    const result = validatePasswordStrength('password');
    expect(result.valid).toBe(false);
  });
});
