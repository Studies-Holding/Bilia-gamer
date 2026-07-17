import type { NextFunction, Request, Response } from 'express'
import { UnauthorizedError, ForbiddenError } from '../errors/index.js'

/**
 * Claims RBAC minimales portées par un access token (identity-service, Lot 1).
 * Source unique dédupliquée — ne pas réimplémenter par service (cf. AFG-DT-000 §3.6).
 */
export interface AuthClaims {
  userId: string
  profileId?: string
  roles: string[]
  familyId?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthClaims
    }
  }
}

export type TokenVerifier = (token: string) => AuthClaims | Promise<AuthClaims>

/**
 * Middleware d'authentification générique : extrait le Bearer token et le
 * vérifie via `verify` (fourni par le service, ex. appel `identity-service`
 * ou vérification JWT locale). Ne fait pas d'hypothèse sur le mécanisme.
 */
export function requireAuth(verify: TokenVerifier) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing bearer token'))
    }

    try {
      req.auth = await verify(header.slice('Bearer '.length))
      next()
    } catch {
      next(new UnauthorizedError('Invalid or expired token'))
    }
  }
}

/** Middleware RBAC : exige qu'au moins un des rôles listés soit présent. */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new UnauthorizedError())
    if (!roles.some((r) => req.auth!.roles.includes(r))) {
      return next(new ForbiddenError(`Requires role: ${roles.join(' or ')}`))
    }
    next()
  }
}
