// ================================================================
//  BILIA-V4 — services/core-service/src/index.ts
//  XP, BiCoins, Rangs, Boutique, Thèmes, Analytics — Port 5002
// ================================================================
import express   from 'express';
import cors      from 'cors';
import helmet    from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose  from 'mongoose';
import dotenv    from 'dotenv';
import routes    from './routes';

dotenv.config();

const app  = express();
const PORT = process.env.CORE_PORT || 5002;

app.use(helmet());
app.use(cors({
  origin:      process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173','http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '3mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

app.get('/health', (_req, res) =>
  res.json({ service: 'core-service', status: 'ok', v: '4.0.0', ts: new Date().toISOString() })
);

app.use('/api', routes);
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route introuvable' }));

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bilia_core')
  .then(() => {
    console.log('✅ [core-service] MongoDB connecté');
    app.listen(PORT, () => console.log(`⚡ core-service → http://localhost:${PORT}`));
  })
  .catch(e => { console.error('❌ [core-service]', e); process.exit(1); });

export default app;
