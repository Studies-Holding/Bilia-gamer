// ================================================================
//  BILIA-V4 — services/game-service/src/models/GameManifest.ts
// ================================================================
import { Schema, model } from 'mongoose';
import type { IGameManifest, GameCategory } from '../../../../shared/types';

const CATEGORIES: GameCategory[] = [
  'Logique','Réflexion','Stratégie','Mémoire','Maths','Vocabulaire','Musique','Science',
];

const GameManifestSchema = new Schema<IGameManifest>({
  id:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:          { type: String, required: true, trim: true },
  description:   { type: String, default: '' },
  logo:          { type: String, required: true },
  category:      { type: String, enum: CATEGORIES, required: true },
  version:       { type: String, default: '1.0.0' },
  author:        { type: String, default: 'Team BiLiA' },
  entryPoint:    { type: String, default: 'index.html' },
  bundlePath:    { type: String, required: true },
  bundleSize:    { type: Number, default: 0 },
  skills: {
    logique:    { type: Number, default: 0, min: 0, max: 100 },
    reflexes:   { type: Number, default: 0, min: 0, max: 100 },
    memoire:    { type: Number, default: 0, min: 0, max: 100 },
    calcul:     { type: Number, default: 0, min: 0, max: 100 },
    creativite: { type: Number, default: 0, min: 0, max: 100 },
    langage:    { type: Number, default: 0, min: 0, max: 100 },
  },
  minAge:        { type: Number, default: 3,  min: 0 },
  requirements:  [{ type: String }],
  isPublished:   { type: Boolean, default: false, index: true },
  downloadCount: { type: Number,  default: 0 },
  rating:        { type: Number,  default: 0, min: 0, max: 5 },
  uploadedBy:    { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

GameManifestSchema.index({ category: 1, isPublished: 1 });
GameManifestSchema.index({ downloadCount: -1 });
GameManifestSchema.index({ name: 'text', description: 'text' });

export const GameManifest = model<IGameManifest>('GameManifest', GameManifestSchema);
