// ================================================================
//  BILIA-V4 — services/auth-service/src/app.ts
//  Configuration Express pure (sans connexion DB ni écoute du port).
//  Séparée d'index.ts pour être importable telle quelle par les
//  tests (supertest) sans dépendre d'une vraie instance MongoDB.
// ================================================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';
import { logger } from './logger';
import { httpLogger } from '../../../shared/logger';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(httpLogger(logger));
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/health', (_req, res) => res.json({ service: 'auth-service', status: 'ok', v: '4.0.0' }));
app.use('/api/auth', routes);

export default app;
