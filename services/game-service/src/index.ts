// ================================================================
//  BILIA-V4 — services/game-service/src/index.ts
//  Catalogue, Approbations, Upload jeux — Port 5003
// ================================================================
import express   from 'express';
import cors      from 'cors';
import helmet    from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose  from 'mongoose';
import dotenv    from 'dotenv';
import path      from 'path';
import routes    from './routes';

dotenv.config();

const app        = express();
const PORT       = process.env.GAME_PORT || 5003;
const STORAGE    = path.join(__dirname, '..', 'storage', 'games');
const ORIGINS    = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173','http://localhost:5174'];

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: ORIGINS, credentials: true }));
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

// Démarrage
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bilia_game')
  .then(() => {
    console.log('✅ [game-service] MongoDB connecté');
    app.listen(PORT, () => console.log(`🎮 game-service → http://localhost:${PORT}`));
  })
  .catch(e => { console.error('❌ [game-service]', e); process.exit(1); });

export default app;
