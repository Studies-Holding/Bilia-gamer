// ================================================================
//  BILIA-V4 — services/game-service/src/controllers/catalogueController.ts
// ================================================================
import { Request, Response } from 'express';
import path    from 'path';
import fs      from 'fs';
import multer  from 'multer';
import { GameManifest } from '../models/GameManifest';

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage', 'games');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

// ── Multer setup ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, STORAGE_DIR),
  filename:    (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['.zip', '.html', '.png', '.jpg', '.svg', '.jpeg'];
    const ext     = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
}).fields([
  { name: 'bundle', maxCount: 1 },
  { name: 'logo',   maxCount: 1 },
]);

// GET /api/games
export async function getCatalogue(req: Request, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = { isPublished: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minAge)   filter.minAge   = { $lte: Number(req.query.minAge) };
    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }
    const games = await GameManifest
      .find(filter)
      .sort({ downloadCount: -1, rating: -1 })
      .select('-uploadedBy');
    res.json({ success: true, data: games });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// GET /api/games/:id
export async function getGame(req: Request, res: Response): Promise<void> {
  try {
    const game = await GameManifest.findOne({ id: req.params.id, isPublished: true });
    if (!game) { res.status(404).json({ success: false, error: 'Jeu introuvable' }); return; }
    res.json({ success: true, data: game });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// POST /api/games  (admin — upload bundle + logo)
export async function publishGame(req: Request, res: Response): Promise<void> {
  try {
    const files  = req.files as Record<string, Express.Multer.File[]>;
    const config = JSON.parse(req.body.config || '{}');

    if (!config.gameId || !config.name || !config.category) {
      res.status(400).json({ success: false, error: 'gameId, name et category requis dans config' });
      return;
    }

    const bundleFile = files['bundle']?.[0];
    const logoFile   = files['logo']?.[0];

    if (!bundleFile) {
      res.status(400).json({ success: false, error: 'Fichier bundle requis' }); return;
    }

    // Créer le dossier dédié au jeu
    const gameDir = path.join(STORAGE_DIR, config.gameId);
    fs.mkdirSync(gameDir, { recursive: true });
    fs.renameSync(bundleFile.path, path.join(gameDir, bundleFile.originalname));

    if (logoFile) {
      fs.renameSync(logoFile.path, path.join(gameDir, logoFile.originalname));
    }

    const logoPath = logoFile
      ? `/games/${config.gameId}/${logoFile.originalname}`
      : `/games/${config.gameId}/logo.png`;

    const game = await GameManifest.create({
      id:           config.gameId,
      name:         config.name,
      description:  config.description   ?? '',
      logo:         logoPath,
      category:     config.category,
      version:      config.version       ?? '1.0.0',
      author:       config.author        ?? 'Développeur BiLiA',
      entryPoint:   config.entry_point   ?? 'index.html',
      bundlePath:   `/games/${config.gameId}`,
      bundleSize:   bundleFile.size,
      minAge:       config.minAge        ?? 3,
      requirements: config.requirements  ?? [],
      skills:       config.skills        ?? {},
      uploadedBy:   req.user!.userId,
      isPublished:  false,  // requiert validation admin
    });

    res.status(201).json({ success: true, data: game });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// PATCH /api/games/:id  (admin — modifier un jeu)
export async function updateGame(req: Request, res: Response): Promise<void> {
  try {
    // Empêcher la modification du bundlePath directement
    const { bundlePath, uploadedBy, ...safe } = req.body;
    void bundlePath; void uploadedBy;

    const game = await GameManifest.findOneAndUpdate(
      { id: req.params.id },
      { ...safe, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!game) { res.status(404).json({ success: false, error: 'Jeu introuvable' }); return; }
    res.json({ success: true, data: game });
  } catch (e) {
    res.status(400).json({ success: false, error: String(e) });
  }
}

// PATCH /api/games/:id/publish  (admin — publier/dépublier)
export async function togglePublish(req: Request, res: Response): Promise<void> {
  try {
    const game = await GameManifest.findOne({ id: req.params.id });
    if (!game) { res.status(404).json({ success: false, error: 'Jeu introuvable' }); return; }
    game.isPublished = !game.isPublished;
    await game.save();
    res.json({ success: true, data: { id: game.id, isPublished: game.isPublished } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}
