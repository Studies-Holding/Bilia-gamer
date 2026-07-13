// ================================================================
//  BILIA-V4 — services/core-service/src/routes/index.ts
// ================================================================
import { Router }   from 'express';
import { requireAuth } from '../middleware/auth';
import { submitScore, syncScores, getLeaderboard, getHistory } from '../controllers/scoreController';
import { getShop, buyItem, getWallet, getInventory, equipItem } from '../controllers/shopController';
import { getReport, getTimeline, getGameBreakdown }              from '../controllers/analyticsController';
import { getAllThemes, getThemeById, getThemeCssVars }           from '../controllers/themesController';

const router = Router();

// ── Scores ────────────────────────────────────────────────────────
router.post('/scores',                       requireAuth, submitScore);
router.post('/scores/sync',                  requireAuth, syncScores);
router.get('/scores/leaderboard/:gameId',    getLeaderboard);
router.get('/scores/history',                requireAuth, getHistory);

// ── Boutique & Wallet ─────────────────────────────────────────────
router.get('/shop',                          requireAuth, getShop);
router.post('/shop/buy',                     requireAuth, buyItem);
router.patch('/shop/equip',                  requireAuth, equipItem);
router.get('/shop/wallet/:profileId',        requireAuth, getWallet);
router.get('/shop/inventory/:profileId',     requireAuth, getInventory);

// ── Analytics parentaux ───────────────────────────────────────────
router.get('/analytics/:profileId/report',   requireAuth, getReport);
router.get('/analytics/:profileId/timeline', requireAuth, getTimeline);
router.get('/analytics/:profileId/games',    requireAuth, getGameBreakdown);

// ── Thèmes (public) ───────────────────────────────────────────────
router.get('/themes',              getAllThemes);
router.get('/themes/:id',          getThemeById);
router.get('/themes/:id/css-vars', getThemeCssVars);

export default router;
