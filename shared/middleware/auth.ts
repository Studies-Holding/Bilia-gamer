// ================================================================
//  BILIA-V4 — shared/middleware/auth.ts
//  Middleware JWT mutualisé (remplace les 3 copies dupliquées dans
//  auth-service, core-service et game-service).
// ================================================================
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { IJwtPayload } from '../types';

const SECRET = process.env.JWT_SECRET || 'bilia_dev_secret';

/**
 * Vérifie le Bearer token et attache le payload décodé à req.user.
 * Les échecs d'auth (401/403) sont déjà tracés automatiquement par
 * httpLogger (shared/logger), qui logue le status code de chaque
 * requête — inutile de dupliquer un appel logger ici.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Token manquant' });
    return;
  }
  try {
    req.user = jwt.verify(header.slice(7), SECRET) as IJwtPayload;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token invalide ou expiré' });
  }
}

/** Restreint une route à une liste de rôles (parent, child, admin). */
export function requireRole(...roles: Array<'parent' | 'child' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Accès refusé — rôle insuffisant' });
      return;
    }
    next();
  };
}
