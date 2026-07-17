import rateLimitMiddleware from 'express-rate-limit'

/**
 * Rate-limit applicatif en périphérie (cf. AFG-DT-000 §4.1, AFG-DT-001 §7).
 * Valeurs de dev volontairement larges ; à durcir par route/rôle au Lot 1
 * (ex. limites plus strictes sur /auth/*).
 */
export function rateLimit() {
  return rateLimitMiddleware({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
}
