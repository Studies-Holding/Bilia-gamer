// ================================================================
//  BILIA-V4 — services/auth-service/src/models/User.ts
// ================================================================
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import type { IUser } from '../../../../shared/types';

const UserSchema = new Schema<IUser>({
  username:  { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, select: false, minlength: 6 },
  role:      { type: String, enum: ['parent','child','admin'], default: 'parent' },
  parentId:  { type: Schema.Types.ObjectId, ref: 'User', default: null },
  magicCode: { type: String, unique: true, default: () => uuid().slice(0,8).toUpperCase() },
  avatarUrl: { type: String, default: null },
  countryCode:{ type: String, default: null },
  subscriptionPlan: { type: String, enum: ['free','family','pro'], default: 'free' },
  settings: {
    theme:         { type: String, default: 'SuperShane' },
    volume:        { type: Number, default: 70 },
    language:      { type: String, default: 'fr' },
    notifications: { type: Boolean, default: true },
  },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', UserSchema);
