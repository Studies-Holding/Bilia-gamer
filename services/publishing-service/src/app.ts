import express, { type Express } from 'express'
import { httpLogger } from '@shared/core/httpLogger'
import { errorHandler } from '@shared/core/middleware/errorHandler'
import { logger } from './logger.js'
import { routes } from './routes/index.js'

/**
 * Express pur, sans bootstrap réseau — testable directement via supertest
 * (cf. AFG-DT-000 §3.6 : app.ts / index.ts séparés).
 */
export function createApp(): Express {
  const app = express()

  app.use(express.json())
  app.use(httpLogger(logger))
  app.use(routes)
  app.use(errorHandler(logger))

  return app
}
