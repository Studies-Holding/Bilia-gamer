// ================================================================
//  BILIA-V4 — services/game-service/src/index.ts
//  Bootstrap : connexion MongoDB + démarrage du serveur HTTP.
//  Catalogue, Approbations, Upload jeux — Port 5003
// ================================================================
import mongoose from 'mongoose';
import app from './app';
import { logger } from './logger';

const PORT = process.env.GAME_PORT || 5003;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bilia_game')
  .then(() => {
    logger.info('MongoDB connecté');
    app.listen(PORT, () => logger.info(`game-service démarré → http://localhost:${PORT}`));
  })
  .catch(e => { logger.error('Échec connexion MongoDB', { error: String(e) }); process.exit(1); });
