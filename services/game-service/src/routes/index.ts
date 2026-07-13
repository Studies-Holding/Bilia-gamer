// ================================================================
//  BILIA-V4 — services/game-service/src/routes/index.ts
// ================================================================
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  getCatalogue,
  getGame,
  publishGame,
  updateGame,
  togglePublish,
  uploadMiddleware,
} from '../controllers/catalogueController';
import {
  requestDownload,
  getPending,
  getHistory,
  approveDownload,
  rejectDownload,
  confirmCached,
  getApprovedGames,
  getDownloadStatus,
} from '../controllers/downloadController';

const router = Router();

// ── Catalogue (lecture publique, écriture admin) ──────────────────
router.get('/games',                       getCatalogue);
router.get('/games/:id',                   getGame);
router.post('/games',                      requireAuth, requireRole('admin'), uploadMiddleware, publishGame);
router.patch('/games/:id',                 requireAuth, requireRole('admin'), updateGame);
router.patch('/games/:id/publish',         requireAuth, requireRole('admin'), togglePublish);

// ── Approbations ──────────────────────────────────────────────────
router.post('/downloads/request',          requireAuth, requestDownload);
router.get('/downloads/pending',           requireAuth, getPending);
router.get('/downloads/history',           requireAuth, getHistory);
router.patch('/downloads/:id/approve',     requireAuth, approveDownload);
router.patch('/downloads/:id/reject',      requireAuth, rejectDownload);
router.patch('/downloads/:id/cached',      requireAuth, confirmCached);
router.get('/downloads/approved/:profileId', requireAuth, getApprovedGames);
router.get('/downloads/status/:profileId/:gameId', requireAuth, getDownloadStatus);

export default router;
