import express, { type Express } from 'express'
import { httpLogger } from '@shared/core/httpLogger'
import { errorHandler } from '@shared/core/middleware/errorHandler'
import { logger } from './logger.js'
import { routes } from './routes/index.js'
import { rateLimit } from './middleware/rateLimit.js'

/**
 * Express pur, sans bootstrap réseau — testable directement via supertest
 * (cf. AFG-DT-000 §3.6 : app.ts / index.ts séparés).
 *
 * Couche applicative du gateway (cf. AFG-DT-001 §7) : Nginx (nginx/, TLS,
 * routage réseau) est devant ce process en prod ; ce process porte le
 * rate-limit applicatif, l'agrégation et (Lot 1) la validation des tokens
 * en périphérie. Le reverse-proxy vers les services métier (routes/proxy.ts)
 * se peuple au fur et à mesure que chaque service existe (Lot 1+).
 */
export function createApp(): Express {
  const app = express()

  app.use(express.json())
  app.use(httpLogger(logger))
  app.use(rateLimit())
  app.use(routes)
  app.use(errorHandler(logger))

  return app
}
