import DOMPurify from 'isomorphic-dompurify'

/**
 * Detecta patrones de ataque XSS en el texto
 */
export const detectXSSAttack = (text: string): boolean => {
  const xssPatterns = [
    /<script/i,
    /<\/script>/i,
    /on\w+\s*=/i,
    /javascript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /onclick\s*=/i,
    /alert\s*\(/i,
    /eval\s*\(/i,
    /document\.cookie/i,
    /<img[^>]+src/i,
    /<svg/i,
    /<body/i,
    /<input[^>]+onfocus/i,
    /<marquee/i
  ]

  return xssPatterns.some(pattern => pattern.test(text))
}

/**
 * Sanitiza el input eliminando HTML y scripts
 */
export const sanitizeInput = (text: string): string => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim()
}

/**
 * Valida que el contenido tenga entre 10 y 50 caracteres
 */
export const validateContentLength = (text: string): { valid: boolean; error?: string } => {
  if (!text || !text.trim()) {
    return { valid: false, error: 'El contenido no puede estar vacío' }
  }

  if (text.length < 10) {
    return { valid: false, error: 'El contenido debe tener al menos 10 caracteres' }
  }

  if (text.length > 50) {
    return { valid: false, error: 'El contenido no puede exceder 50 caracteres' }
  }

  return { valid: true }
}
