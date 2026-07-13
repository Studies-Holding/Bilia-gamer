// ================================================================
//  BILIA-V4 — services/core-service/src/models/ShopItem.ts
// ================================================================
import { Schema, model } from 'mongoose';
import type { IShopItem } from '../../../../shared/types';

const ShopItemSchema = new Schema<IShopItem>({
  id:            { type: String, required: true, unique: true },
  name:          { type: String, required: true },
  description:   { type: String, default: '' },
  type:          { type: String, enum: ['avatar','border','effect','theme'], required: true },
  previewUrl:    { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  rarity:        { type: String, enum: ['common','rare','epic','legendary'], default: 'common' },
  themeId:       { type: String, default: null },
  cssClass:      { type: String, default: null },
  requiredLevel: { type: Number, default: 1 },
  isAvailable:   { type: Boolean, default: true },
}, { timestamps: true });

export const ShopItem = model<IShopItem>('ShopItem', ShopItemSchema);
