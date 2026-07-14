// ================================================================
//  BILIA-V4 — services/auth-service/src/models/Profile.ts
// ================================================================
import { Schema, model } from 'mongoose';
import type { IProfile, Rank } from '../../../../shared/types';

export function xpToLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

export function xpToRank(xp: number): Rank {
  if (xp >= 50000) return 'Légendaire';
  if (xp >= 20000) return 'Maître';
  if (xp >= 8000)  return 'Expert';
  if (xp >= 2000)  return 'Joueur';
  if (xp >= 500)   return 'Initié';
  return 'Novice';
}

const ProfileSchema = new Schema<IProfile>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  displayName:     { type: String, required: true, trim: true, maxlength: 30 },
  avatarEmoji:     { type: String, default: '🎮' },
  theme:           { type: String, default: 'SuperShane' },
  ownedThemes:     [{ type: String }],
  equippedAvatar:  { type: String, default: null },
  equippedBorder:  { type: String, default: null },
  equippedEffect:  { type: String, default: null },
  xp:              { type: Number, default: 0 },
  level:           { type: Number, default: 1 },
  rank:            { type: String, default: 'Novice' },
  biCoins:         { type: Number, default: 0 },
  badges:          [{ type: String }],
  skills: {
    logique:    { type: Number, default: 0 },
    reflexes:   { type: Number, default: 0 },
    memoire:    { type: Number, default: 0 },
    calcul:     { type: Number, default: 0 },
    creativite: { type: Number, default: 0 },
    langage:    { type: Number, default: 0 },
  },
  approvedGameIds:  [{ type: String }],
  totalGamesPlayed: { type: Number, default: 0 },
  totalTimePlayed:  { type: Number, default: 0 },
  dailyTimeLimit:   { type: Number, default: 0 },
  ageGroup:         { type: String, enum: ['3-6','7-10','11-14','15+'], default: '7-10' },
}, { timestamps: true });

ProfileSchema.pre('save', function(next) {
  this.level = xpToLevel(this.xp);
  this.rank  = xpToRank(this.xp);
  next();
});

export const Profile = model<IProfile>('Profile', ProfileSchema);
