// ================================================================
//  BILIA-V4 — services/auth-service/src/controllers/authController.ts
// ================================================================
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import type { IJwtPayload } from '../../../../shared/types';

const SECRET  = process.env.JWT_SECRET  || 'bilia_dev_secret';
const EXPIRES = process.env.JWT_EXPIRES || '7d';

function sign(payload: Omit<IJwtPayload,'iat'|'exp'>): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ success: false, error: 'Champs obligatoires manquants' }); return;
    }
    if (await User.findOne({ email })) {
      res.status(409).json({ success: false, error: 'Email déjà utilisé' }); return;
    }
    const user    = await User.create({ username, email, password });
    await Profile.create({ userId: user._id, displayName: username });
    const token   = sign({ userId: String(user._id), email: user.email, role: user.role });
    res.status(201).json({ success: true, data: { token, user } });
  } catch(e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, error: 'Identifiants incorrects' }); return;
    }
    const token = sign({ userId: String(user._id), email: user.email, role: user.role });
    const { password: _, ...safe } = user.toObject();
    res.json({ success: true, data: { token, user: safe } });
  } catch(e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

export async function magicLogin(req: Request, res: Response): Promise<void> {
  try {
    const { magicCode } = req.body;
    const user = await User.findOne({ magicCode: magicCode?.toUpperCase() });
    if (!user) {
      res.status(401).json({ success: false, error: 'Code Magique invalide' }); return;
    }
    const token = sign({ userId: String(user._id), email: user.email, role: user.role });
    res.json({ success: true, data: { token, user } });
  } catch(e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) { res.status(404).json({ success: false, error: 'Introuvable' }); return; }
    res.json({ success: true, data: user });
  } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
}

// ── Profils ───────────────────────────────────────────────────────
export async function getProfiles(req: Request, res: Response): Promise<void> {
  const profiles = await Profile.find({ userId: req.user!.userId });
  res.json({ success: true, data: profiles });
}

export async function createProfile(req: Request, res: Response): Promise<void> {
  try {
    const p = await Profile.create({ userId: req.user!.userId, ...req.body });
    res.status(201).json({ success: true, data: p });
  } catch(e) { res.status(400).json({ success: false, error: String(e) }); }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const p = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.userId },
      req.body, { new: true, runValidators: true }
    );
    if (!p) { res.status(404).json({ success: false, error: 'Profil introuvable' }); return; }
    res.json({ success: true, data: p });
  } catch(e) { res.status(400).json({ success: false, error: String(e) }); }
}
