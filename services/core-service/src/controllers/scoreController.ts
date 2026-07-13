// ================================================================
//  BILIA-V4 — services/core-service/src/controllers/scoreController.ts
// ================================================================
import { Request, Response } from 'express';
import { Activity, calcXp, calcBiCoins } from '../models/Activity';
import { creditBiCoins } from '../models/Wallet';

// POST /api/scores
export async function submitScore(req: Request, res: Response): Promise<void> {
  try {
    const { profileId, gameId, gameName, score, duration, won, gameState, skills, difficulty = 5 } = req.body;
    if (!profileId || !gameId) {
      res.status(400).json({ success: false, error: 'profileId et gameId requis' }); return;
    }
    const xpEarned      = calcXp(score, won ?? false, difficulty);
    const biCoinsEarned = calcBiCoins(score, won ?? false, difficulty);
    const prev          = await Activity.findOne({ profileId, gameId }).sort({ score: -1 });
    const highScore     = Math.max(prev?.score ?? 0, score ?? 0);

    const activity = await Activity.create({
      profileId, gameId, gameName, score, highScore,
      xpEarned, biCoinsEarned, duration, won, gameState, skills,
      syncedAt: new Date(),
    });

    // Créditer le wallet
    const newBalance = await creditBiCoins(profileId, biCoinsEarned, `Partie de ${gameName}`, gameId);

    res.status(201).json({ success: true, data: { activity, xpEarned, biCoinsEarned, highScore, newBalance } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// POST /api/scores/sync  (batch offline)
export async function syncScores(req: Request, res: Response): Promise<void> {
  try {
    const { activities } = req.body as { activities: Record<string, unknown>[] };
    if (!Array.isArray(activities)) {
      res.status(400).json({ success: false, error: 'activities[] requis' }); return;
    }
    let synced = 0;
    for (const a of activities) {
      if (!a.profileId || !a.gameId) continue;
      const xp    = calcXp(Number(a.score ?? 0), Boolean(a.won));
      const coins = calcBiCoins(Number(a.score ?? 0), Boolean(a.won));
      await Activity.create({ ...a, xpEarned: xp, biCoinsEarned: coins, syncedAt: new Date() });
      await creditBiCoins(String(a.profileId), coins, `Sync : ${a.gameName ?? a.gameId}`);
      synced++;
    }
    res.json({ success: true, data: { synced } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// GET /api/scores/leaderboard/:gameId
export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const board = await Activity.aggregate([
      { $match: { gameId: req.params.gameId } },
      { $sort:  { score: -1 } },
      { $group: { _id: '$profileId', best: { $first: '$score' }, gameName: { $first: '$gameName' } } },
      { $sort:  { best: -1 } },
      { $limit: limit },
    ]);
    res.json({ success: true, data: board });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// GET /api/scores/history  (profil courant via token)
export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const { profileId } = req.query;
    if (!profileId) { res.status(400).json({ success: false, error: 'profileId requis' }); return; }
    const page  = parseInt(req.query.page as string)  || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const [activities, total] = await Promise.all([
      Activity.find({ profileId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-gameState'),
      Activity.countDocuments({ profileId }),
    ]);
    res.json({ success: true, data: { activities, total, page, pages: Math.ceil(total / limit) } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}
