import jwt from 'jsonwebtoken';
import { requireAuth, requireRole } from '../middleware/auth';
import type { Request, Response } from 'express';

const SECRET = process.env.JWT_SECRET || 'bilia_dev_secret';

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe('shared/middleware/auth — requireAuth', () => {
  it('rejette une requête sans header Authorization', () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejette un token invalide', () => {
    const req = { headers: { authorization: 'Bearer token-invalide' } } as Request;
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Token invalide ou expiré' });
    expect(next).not.toHaveBeenCalled();
  });

  it('accepte un token valide et attache le payload à req.user', () => {
    const token = jwt.sign({ userId: 'u1', email: 'a@b.com', role: 'parent' }, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ userId: 'u1', email: 'a@b.com', role: 'parent' });
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('shared/middleware/auth — requireRole', () => {
  it("refuse l'accès si req.user est absent", () => {
    const req = {} as Request;
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("refuse l'accès si le rôle ne correspond pas", () => {
    const req = { user: { userId: 'u1', email: 'a@b.com', role: 'parent' } } as Request;
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('autorise si le rôle correspond', () => {
    const req = { user: { userId: 'u1', email: 'a@b.com', role: 'admin' } } as Request;
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin', 'parent')(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
