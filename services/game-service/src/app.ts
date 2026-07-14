// ================================================================
//  BILIA-V4 — services/game-service/src/app.ts
//  Configuration Express pure (sans connexion DB ni écoute du port).
//  Séparée d'index.ts pour être importable telle quelle par les
//  tests (supertest) sans dépendre d'une vraie instance MongoDB.
// ================================================================
import express   from 'express';
import cors      from 'cors';
import helmet    from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv    from 'dotenv';
import path      from 'path';
import routes    from './routes';
import { logger } from './logger';
import { httpLogger } from '../../../shared/logger';

dotenv.config();

const app     = express();
const STORAGE = path.join(__dirname, '..', 'storage', 'games');
const ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:5174'];

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: ORIGINS, credentials: true }));
app.use(httpLogger(logger));
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Servir les jeux statiques depuis /storage/games
app.use('/games', express.static(STORAGE, {
  maxAge: '30d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  },
}));

// Health check
app.get('/health', (_req, res) =>
  res.json({ service: 'game-service', status: 'ok', v: '4.0.0', ts: new Date().toISOString() })
);

// Routes API
app.use('/api', routes);

// 404
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route introuvable' }));

export default app;
