// ================================================================
//  BILIA-V4 — services/game-service/src/models/DownloadRequest.ts
// ================================================================
import { Schema, model } from 'mongoose';
import type { IDownloadRequest, DownloadStatus } from '../../../../shared/types';

const STATUSES: DownloadStatus[] = ['pending', 'approved', 'rejected', 'cached'];

const DownloadRequestSchema = new Schema<IDownloadRequest>({
  profileId:   { type: Schema.Types.ObjectId, ref: 'Profile', required: true, index: true },
  parentId:    { type: Schema.Types.ObjectId, ref: 'User',    required: true, index: true },
  gameId:      { type: String, required: true },
  gameName:    { type: String, required: true },
  gameLogo:    { type: String, default: '' },
  status:      { type: String, enum: STATUSES, default: 'pending', index: true },
  parentNote:  { type: String, default: null },
  requestedAt: { type: Date, default: Date.now },
  respondedAt: { type: Date, default: null },
}, { timestamps: true });

// Empêcher les demandes dupliquées en attente pour le même jeu/profil
DownloadRequestSchema.index({ profileId: 1, gameId: 1, status: 1 });
DownloadRequestSchema.index({ parentId: 1, status: 1, requestedAt: -1 });

export const DownloadRequest = model<IDownloadRequest>('DownloadRequest', DownloadRequestSchema);
