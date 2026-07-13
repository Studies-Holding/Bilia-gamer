// ================================================================
//  BILIA-V4 — services/auth-service/src/index.ts
//  Port : 5001
// ================================================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173','http://localhost:5174'], credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 15*60*1000, max: 300 }));

app.get('/health', (_req, res) => res.json({ service: 'auth-service', status: 'ok', v: '4.0.0' }));
app.use('/api/auth', routes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bilia_auth')
  .then(() => {
    console.log('✅ [auth-service] MongoDB connecté');
    app.listen(PORT, () => console.log(`🔐 auth-service → http://localhost:${PORT}`));
  })
  .catch(e => { console.error(e); process.exit(1); });
