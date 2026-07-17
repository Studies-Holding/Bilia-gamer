import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../errors/index.js'

/** Contrat minimal compatible zod/valibot/yup sans lier `@shared/core` à une lib précise. */
export interface Schema<T> {
  parse: (input: unknown) => T
}

type Source = 'body' | 'query' | 'params'

/** Middleware de validation générique : valide `req[source]` avec le schéma fourni. */
export function validate<T>(schema: Schema<T>, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]) as never
      next()
    } catch (err) {
      next(new BadRequestError('Validation failed', err))
    }
  }
}
