import type { NextFunction, Request, Response } from 'express'
import type winston from 'winston'
import { isAppError } from '../errors/index.js'

/**
 * Middleware d'erreur Express final. Sérialise les `AppError` connues avec
 * leur statusCode ; toute autre erreur devient un 500 générique (le détail
 * part dans les logs, pas dans la réponse).
 */
export function errorHandler(logger: winston.Logger) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (isAppError(err)) {
      logger.warn(err.message, { requestId: req.requestId, code: err.code, details: err.details })
      return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } })
    }

    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error(message, { requestId: req.requestId, stack: err instanceof Error ? err.stack : undefined })
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
  }
}
