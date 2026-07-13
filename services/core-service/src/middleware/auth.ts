// ================================================================
//  BILIA-V4 — services/core-service/src/middleware/auth.ts
// ================================================================
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { IJwtPayload } from '../../../../shared/types';

const SECRET = process.env.JWT_SECRET || 'bilia_dev_secret';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Token manquant' }); return;
  }
  try {
    req.user = jwt.verify(h.slice(7), SECRET) as IJwtPayload;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token invalide ou expiré' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Accès refusé' }); return;
    }
    next();
  };
}
