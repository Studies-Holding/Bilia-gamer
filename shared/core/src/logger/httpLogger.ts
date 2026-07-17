import type { NextFunction, Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import type winston from 'winston'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId?: string
    }
  }
}

/**
 * Middleware Express : assigne un requestId (repris de `x-request-id` si présent,
 * sinon généré), l'expose sur `req` et log entrée/sortie corrélées.
 */
export function httpLogger(logger: winston.Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string | undefined) ?? randomUUID()
    req.requestId = requestId
    res.setHeader('x-request-id', requestId)

    const start = process.hrtime.bigint()
    logger.debug(`--> ${req.method} ${req.originalUrl}`, { requestId })

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1e6
      logger.info(`<-- ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`, {
        requestId,
        statusCode: res.statusCode,
        durationMs,
      })
    })

    next()
  }
}
