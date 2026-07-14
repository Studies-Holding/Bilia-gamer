// ================================================================
//  BILIA-V4 — services/game-service/src/logger.ts
//  Instance unique du logger mutualisé pour ce service.
// ================================================================
import { createLogger } from '../../../shared/logger';

export const logger = createLogger({ service: 'game-service' });
