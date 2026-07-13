// ================================================================
//  BILIA-V4 — services/game-service/src/controllers/downloadController.ts
//  Workflow : Demande enfant → Notification parent → Approbation → Cache SW
// ================================================================
import { Request, Response } from 'express';
import { DownloadRequest } from '../models/DownloadRequest';
import { GameManifest    } from '../models/GameManifest';

// ── POST /api/downloads/request ──────────────────────────────────
// L'enfant demande l'installation d'un jeu
export async function requestDownload(req: Request, res: Response): Promise<void> {
  try {
    const { profileId, gameId, parentId } = req.body;
    if (!profileId || !gameId || !parentId) {
      res.status(400).json({ success: false, error: 'profileId, gameId et parentId requis' }); return;
    }

    // Vérifier que le jeu existe et est publié
    const game = await GameManifest.findOne({ id: gameId, isPublished: true });
    if (!game) {
      res.status(404).json({ success: false, error: 'Jeu introuvable ou non publié' }); return;
    }

    // Éviter les doublons en attente
    const existing = await DownloadRequest.findOne({ profileId, gameId, status: 'pending' });
    if (existing) {
      res.json({ success: true, data: { status: 'pending', requestId: existing._id, alreadyPending: true } });
      return;
    }

    const dr = await DownloadRequest.create({
      profileId,
      parentId,
      gameId,
      gameName: game.name,
      gameLogo: game.logo,
    });

    // La notification Socket.io est émise par le socket-service
    // (découplage — le client frontend déclenche join:parent et écoute download:request)

    res.status(201).json({ success: true, data: { status: 'pending', requestId: dr._id } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// ── GET /api/downloads/pending ────────────────────────────────────
// Le parent consulte sa file d'attente
export async function getPending(req: Request, res: Response): Promise<void> {
  try {
    const parentId = req.user!.userId;
    const requests = await DownloadRequest
      .find({ parentId, status: 'pending' })
      .sort({ requestedAt: -1 })
      .populate('profileId', 'displayName avatarEmoji');
    res.json({ success: true, data: requests });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// ── GET /api/downloads/history ────────────────────────────────────
export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const parentId = req.user!.userId;
    const limit    = parseInt(req.query.limit as string) || 50;
    const requests = await DownloadRequest
      .find({ parentId })
      .sort({ requestedAt: -1 })
      .limit(limit)
      .populate('profileId', 'displayName avatarEmoji');
    res.json({ success: true, data: requests });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// ── PATCH /api/downloads/:id/approve ─────────────────────────────
export async function approveDownload(req: Request, res: Response): Promise<void> {
  try {
    const dr = await DownloadRequest.findOneAndUpdate(
      { _id: req.params.id, parentId: req.user!.userId, status: 'pending' },
      { status: 'approved', respondedAt: new Date() },
      { new: true }
    );
    if (!dr) {
      res.status(404).json({ success: false, error: 'Demande introuvable ou déjà traitée' }); return;
    }

    // Incrémenter le compteur de téléchargements
    await GameManifest.findOneAndUpdate(
      { id: dr.gameId },
      { $inc: { downloadCount: 1 } }
    );

    const game = await GameManifest.findOne({ id: dr.gameId });

    res.json({
      success: true,
      data: {
        requestId:  dr._id,
        gameId:     dr.gameId,
        bundlePath: game?.bundlePath ?? `/games/${dr.gameId}`,
        status:     'approved',
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// ── PATCH /api/downloads/:id/reject ──────────────────────────────
export async function rejectDownload(req: Request, res: Response): Promise<void> {
  try {
    const { reason } = req.body;
    const dr = await DownloadRequest.findOneAndUpdate(
      { _id: req.params.id, parentId: req.user!.userId, status: 'pending' },
      { status: 'rejected', respondedAt: new Date(), parentNote: reason ?? null },
      { new: true }
    );
    if (!dr) {
      res.status(404).json({ success: false, error: 'Demande introuvable ou déjà traitée' }); return;
    }
    res.json({ success: true, data: { requestId: dr._id, status: 'rejected' } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// ── PATCH /api/downloads/:id/cached ──────────────────────────────
// La PWA confirme que le Service Worker a mis le jeu en cache
export async function confirmCached(req: Request, res: Response): Promise<void> {
  try {
    await DownloadRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'cached' }
    );
    res.json({ success: true, data: { status: 'cached' } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// ── GET /api/downloads/approved/:profileId ────────────────────────
// Liste des jeux approuvés pour un profil (utilisé par la PWA enfant au démarrage)
export async function getApprovedGames(req: Request, res: Response): Promise<void> {
  try {
    const approved = await DownloadRequest
      .find({ profileId: req.params.profileId, status: { $in: ['approved', 'cached'] } })
      .select('gameId status');

    const gameIds = [...new Set(approved.map(d => d.gameId))];
    const games   = await GameManifest
      .find({ id: { $in: gameIds }, isPublished: true })
      .select('-uploadedBy');

    res.json({ success: true, data: games });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// ── GET /api/downloads/status/:profileId/:gameId ──────────────────
// Vérifier le statut d'une demande précise (utilisé par le SDK isAuthorized())
export async function getDownloadStatus(req: Request, res: Response): Promise<void> {
  try {
    const { profileId, gameId } = req.params;
    const dr = await DownloadRequest
      .findOne({ profileId, gameId })
      .sort({ requestedAt: -1 })
      .select('status requestedAt respondedAt');

    res.json({
      success: true,
      data: dr
        ? { status: dr.status, requestedAt: dr.requestedAt, respondedAt: dr.respondedAt }
        : { status: 'none' },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}
