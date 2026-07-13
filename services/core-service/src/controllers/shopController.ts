// ================================================================
//  BILIA-V4 — services/core-service/src/controllers/shopController.ts
// ================================================================
import { Request, Response } from 'express';
import { ShopItem } from '../models/ShopItem';
import { Wallet, Inventory, spendBiCoins } from '../models/Wallet';
import { THEMES_REGISTRY } from '../../../../shared/config/themes.config';

// GET /api/shop
export async function getShop(req: Request, res: Response): Promise<void> {
  try {
    const items = await ShopItem.find({ isAvailable: true }).sort({ price: 1 });

    // Ajouter les thèmes premium comme items virtuels
    const themeItems = THEMES_REGISTRY
      .filter(t => !t.isDefault && t.price > 0)
      .map(t => ({
        id:           `theme-${t.id}`,
        name:         t.label,
        description:  t.tagline,
        type:         'theme',
        previewUrl:   `/themes/${t.id}/preview.png`,
        price:        t.price,
        rarity:       'rare',
        themeId:      t.id,
        requiredLevel: 1,
        isAvailable:  true,
      }));

    res.json({ success: true, data: [...items, ...themeItems] });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// POST /api/shop/buy
export async function buyItem(req: Request, res: Response): Promise<void> {
  try {
    const { profileId, itemId } = req.body;
    if (!profileId || !itemId) {
      res.status(400).json({ success: false, error: 'profileId et itemId requis' }); return;
    }

    // Trouver l'item (boutique ou thème virtuel)
    let price    = 0;
    let itemName = '';

    if (itemId.startsWith('theme-')) {
      const themeId = itemId.replace('theme-', '');
      const theme   = THEMES_REGISTRY.find(t => t.id === themeId);
      if (!theme) { res.status(404).json({ success: false, error: 'Thème introuvable' }); return; }
      price    = theme.price;
      itemName = theme.label;
    } else {
      const item = await ShopItem.findOne({ id: itemId, isAvailable: true });
      if (!item) { res.status(404).json({ success: false, error: 'Item introuvable' }); return; }
      price    = item.price;
      itemName = item.name;
    }

    const result = await spendBiCoins(profileId, itemId, price, itemName);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error }); return;
    }

    res.json({ success: true, data: { itemId, newBalance: result.newBalance } });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// GET /api/shop/wallet/:profileId
export async function getWallet(req: Request, res: Response): Promise<void> {
  try {
    const wallet = await Wallet.findOne({ profileId: req.params.profileId });
    res.json({
      success: true,
      data: wallet ?? { balance: 0, totalEarned: 0, totalSpent: 0, transactions: [] },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// GET /api/shop/inventory/:profileId
export async function getInventory(req: Request, res: Response): Promise<void> {
  try {
    const inv = await Inventory.findOne({ profileId: req.params.profileId });
    res.json({
      success: true,
      data: inv ?? { ownedItemIds: [], equippedAvatar: null, equippedBorder: null, equippedEffect: null },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}

// PATCH /api/shop/equip
export async function equipItem(req: Request, res: Response): Promise<void> {
  try {
    const { profileId, itemId, itemType } = req.body;
    const field: Record<string, string> = {
      avatar: 'equippedAvatar',
      border: 'equippedBorder',
      effect: 'equippedEffect',
    };
    if (!field[itemType]) {
      res.status(400).json({ success: false, error: 'itemType invalide (avatar|border|effect)' }); return;
    }

    // Vérifier que l'item est possédé
    const inv = await Inventory.findOne({ profileId });
    if (!inv?.ownedItemIds.includes(itemId)) {
      res.status(403).json({ success: false, error: 'Item non possédé' }); return;
    }

    const updated = await Inventory.findOneAndUpdate(
      { profileId },
      { $set: { [field[itemType]]: itemId } },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}
