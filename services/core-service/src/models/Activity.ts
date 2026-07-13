// ================================================================
//  BILIA-V4 — services/core-service/src/models/Activity.ts
// ================================================================
import { Schema, model } from 'mongoose';
import type { IActivity } from '../../../../shared/types';

const ActivitySchema = new Schema<IActivity>({
  profileId:     { type: Schema.Types.ObjectId, ref: 'Profile', required: true, index: true },
  gameId:        { type: String, required: true, index: true },
  gameName:      { type: String, required: true },
  score:         { type: Number, default: 0 },
  highScore:     { type: Number, default: 0 },
  xpEarned:      { type: Number, default: 0 },
  biCoinsEarned: { type: Number, default: 0 },
  duration:      { type: Number, default: 0 },
  won:           { type: Boolean, default: false },
  skills: {
    logique:    { type: Number, default: 0 },
    reflexes:   { type: Number, default: 0 },
    memoire:    { type: Number, default: 0 },
    calcul:     { type: Number, default: 0 },
    creativite: { type: Number, default: 0 },
    langage:    { type: Number, default: 0 },
  },
  gameState: { type: Schema.Types.Mixed, default: null },
  syncedAt:  { type: Date, default: null },
}, { timestamps: true });

ActivitySchema.index({ profileId: 1, createdAt: -1 });
ActivitySchema.index({ gameId:    1, score:     -1 });
ActivitySchema.index({ profileId: 1, gameId:    1  });

export const Activity = model<IActivity>('Activity', ActivitySchema);

// ── Helpers ───────────────────────────────────────────────────────
export function calcXp(score: number, won: boolean, difficulty = 5): number {
  return Math.max(1, Math.floor(score / 10) + (won ? 50 * difficulty : 0));
}

export function calcBiCoins(score: number, won: boolean, difficulty = 5): number {
  return Math.max(1, Math.floor(score / 50) + (won ? 10 * difficulty : 0));
}
