// ================================================================
//  BILIA-V4 — services/auth-service/src/index.ts
//  Bootstrap : connexion MongoDB + démarrage du serveur HTTP.
//  Port : 5001
// ================================================================
import mongoose from 'mongoose';
import app from './app';
import { logger } from './logger';

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bilia_auth')
  .then(() => {
    logger.info('MongoDB connecté');
    app.listen(PORT, () => logger.info(`auth-service démarré → http://localhost:${PORT}`));
  })
  .catch(e => { logger.error('Échec connexion MongoDB', { error: String(e) }); process.exit(1); });
