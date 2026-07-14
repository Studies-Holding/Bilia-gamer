// ================================================================
//  BILIA-V4 — services/auth-service/src/routes/index.ts
// ================================================================
import { Router } from 'express';
import { register, login, magicLogin, getMe, getProfiles, createProfile, updateProfile } from '../controllers/authController';
import { requireAuth } from '../../../../shared/middleware/auth';

const r = Router();
r.post('/register',       register);
r.post('/login',          login);
r.post('/magic',          magicLogin);
r.get('/me',              requireAuth, getMe);
r.get('/profiles',        requireAuth, getProfiles);
r.post('/profiles',       requireAuth, createProfile);
r.patch('/profiles/:id',  requireAuth, updateProfile);
export default r;
