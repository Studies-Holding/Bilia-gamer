// ================================================================
//  BILIA-V4 — services/core-service/src/controllers/analyticsController.ts
// ================================================================
import { Request, Response } from 'express';
import { Activity } from '../models/Activity';

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// GET /api/analytics/:profileId/report
export async function getReport(req: Request, res: Response): Promise<void> {
  try {
    const { profileId } = req.params;

    const [allActivities, skillAgg] = await Promise.all([
      Activity.find({ profileId })
        .sort({ createdAt: -1 })
        .limit(100)
        .select('-gameState'),
      Activity.aggregate([
        { $match: { profileId } },
        {
          $group: {
            _id:        null,
            logique:    { $avg: '$skills.logique'    },
            reflexes:   { $avg: '$skills.reflexes'   },
            memoire:    { $avg: '$skills.memoire'    },
            calcul:     { $avg: '$skills.calcul'     },
            creativite: { $avg: '$skills.creativite' },
            langage:    { $avg: '$skills.langage'    },
            totalXp:    { $sum: '$xpEarned'          },
            totalCoins: { $sum: '$biCoinsEarned'     },
            totalTime:  { $sum: '$duration'          },
          },
        },
      ]),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const todayActs  = allActivities.filter(a => a.createdAt.toISOString().slice(0, 10) === today);
    const todayTime  = todayActs.reduce((s, a) => s + (a.duration ?? 0), 0);
    const todayXp    = todayActs.reduce((s, a) => s + (a.xpEarned  ?? 0), 0);

    // Normaliser skills sur 100
    const rawSkills = skillAgg[0] ?? null;
    const skills = rawSkills ? {
      logique:    Math.min(100, Math.round(rawSkills.logique    ?? 0)),
      reflexes:   Math.min(100, Math.round(rawSkills.reflexes   ?? 0)),
      memoire:    Math.min(100, Math.round(rawSkills.memoire    ?? 0)),
      calcul:     Math.min(100, Math.round(rawSkills.calcul     ?? 0)),
      creativite: Math.min(100, Math.round(rawSkills.creativite ?? 0)),
      langage:    Math.min(100, Math.round(rawSkills.langage    ?? 0)),
    } : null;

    res.json({
      success: true,
      data: {
        skills,
        recentActivities: allActivities.slice(0, 50),
        todayTime,
        todayXp,
        totalXp:   rawSkills?.totalXp    ?? 0,
        totalTime: rawSkills?.totalTime  ?? 0,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// GET /api/analytics/:profileId/timeline?days=7
export async function getTimeline(req: Request, res: Response): Promise<void> {
  try {
    const { profileId } = req.params;
    const days  = parseInt(req.query.days as string) || 7;

    // Générer les N derniers jours
    const dates = Array.from({ length: days }, (_, i) => dateStr(days - 1 - i));

    const activities = await Activity.find({
      profileId,
      createdAt: { $gte: new Date(dates[0]) },
    }).select('createdAt duration xpEarned gameId won');

    // Agréger par jour
    const dayMap = new Map<string, { totalDuration: number; xpEarned: number; gamesPlayed: Set<string>; wins: number }>();
    activities.forEach(a => {
      const key = a.createdAt.toISOString().slice(0, 10);
      const cur = dayMap.get(key) ?? { totalDuration: 0, xpEarned: 0, gamesPlayed: new Set(), wins: 0 };
      cur.totalDuration += a.duration ?? 0;
      cur.xpEarned      += a.xpEarned ?? 0;
      if (a.gameId) cur.gamesPlayed.add(a.gameId);
      if (a.won)    cur.wins++;
      dayMap.set(key, cur);
    });

    const timeline = dates.map(date => {
      const d = dayMap.get(date);
      return {
        date,
        totalDuration: d?.totalDuration ?? 0,
        xpEarned:      d?.xpEarned      ?? 0,
        gamesCount:    d?.gamesPlayed.size ?? 0,
        wins:          d?.wins           ?? 0,
      };
    });

    res.json({ success: true, data: { timeline, days } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// GET /api/analytics/:profileId/games  (top jeux)
export async function getGameBreakdown(req: Request, res: Response): Promise<void> {
  try {
    const breakdown = await Activity.aggregate([
      { $match: { profileId: req.params.profileId } },
      {
        $group: {
          _id:       '$gameId',
          gameName:  { $first: '$gameName'  },
          plays:     { $sum: 1              },
          totalTime: { $sum: '$duration'    },
          bestScore: { $max: '$score'       },
          totalXp:   { $sum: '$xpEarned'   },
          wins:      { $sum: { $cond: ['$won', 1, 0] } },
        },
      },
      { $sort: { totalTime: -1 } },
      { $limit: 10 },
    ]);
    res.json({ success: true, data: breakdown });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}
