// ================================================================
//  BILIA-V4 — services/core-service/src/models/Wallet.ts
// ================================================================
import { Schema, model, Document, Types } from 'mongoose';

export interface IWalletTransaction {
  type:        'earn' | 'spend' | 'bonus';
  amount:      number;
  description: string;
  gameId?:     string;
  itemId?:     string;
  createdAt:   Date;
}

export interface IWalletDoc extends Document {
  profileId:    Types.ObjectId;
  balance:      number;
  totalEarned:  number;
  totalSpent:   number;
  transactions: IWalletTransaction[];
}

export interface IInventoryDoc extends Document {
  profileId:     Types.ObjectId;
  ownedItemIds:  string[];
  equippedAvatar?:   string;
  equippedBorder?:   string;
  equippedEffect?:   string;
}

const TransactionSchema = new Schema<IWalletTransaction>({
  type:        { type: String, enum: ['earn','spend','bonus'], required: true },
  amount:      { type: Number, required: true },
  description: { type: String, required: true },
  gameId:      { type: String, default: null },
  itemId:      { type: String, default: null },
  createdAt:   { type: Date, default: Date.now },
}, { _id: true });

const WalletSchema = new Schema<IWalletDoc>({
  profileId:    { type: Schema.Types.ObjectId, ref: 'Profile', required: true, unique: true },
  balance:      { type: Number, default: 0, min: 0 },
  totalEarned:  { type: Number, default: 0 },
  totalSpent:   { type: Number, default: 0 },
  transactions: { type: [TransactionSchema], default: [] },
}, { timestamps: true });

const InventorySchema = new Schema<IInventoryDoc>({
  profileId:        { type: Schema.Types.ObjectId, ref: 'Profile', required: true, unique: true },
  ownedItemIds:     [{ type: String }],
  equippedAvatar:   { type: String, default: null },
  equippedBorder:   { type: String, default: null },
  equippedEffect:   { type: String, default: null },
}, { timestamps: true });

export const Wallet    = model<IWalletDoc>('Wallet',    WalletSchema);
export const Inventory = model<IInventoryDoc>('Inventory', InventorySchema);

// ── Helpers ───────────────────────────────────────────────────────
export async function creditBiCoins(
  profileId: string, amount: number, description: string, gameId?: string
): Promise<number> {
  const wallet = await Wallet.findOneAndUpdate(
    { profileId },
    {
      $inc:  { balance: amount, totalEarned: amount },
      $push: { transactions: { type:'earn', amount, description, gameId, createdAt: new Date() } },
    },
    { upsert: true, new: true }
  );
  return wallet?.balance ?? 0;
}

export async function spendBiCoins(
  profileId: string, itemId: string, price: number, itemName: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const wallet = await Wallet.findOne({ profileId });
  if (!wallet || wallet.balance < price) {
    return { success: false, newBalance: wallet?.balance ?? 0, error: 'Solde insuffisant' };
  }
  const inventory = await Inventory.findOne({ profileId });
  if (inventory?.ownedItemIds.includes(itemId)) {
    return { success: false, newBalance: wallet.balance, error: 'Déjà possédé' };
  }
  wallet.balance    -= price;
  wallet.totalSpent += price;
  wallet.transactions.push({ type:'spend', amount:price, description:`Achat : ${itemName}`, itemId, createdAt:new Date() });
  await wallet.save();
  await Inventory.findOneAndUpdate({ profileId }, { $addToSet:{ ownedItemIds: itemId } }, { upsert:true });
  return { success: true, newBalance: wallet.balance };
}
