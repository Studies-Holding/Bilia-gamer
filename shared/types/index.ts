// ================================================================
//  BILIA-V4 — shared/types/index.ts
//  Interfaces TypeScript globales — source de vérité unique
// ================================================================

import { Document, Types } from 'mongoose';

// ─────────────────────────────────────────────────────────────────
//  THÈMES
// ─────────────────────────────────────────────────────────────────

/** Identifiants des thèmes disponibles (synchronisés avec themes.config.ts) */
export type ThemeId =
  | 'SuperShane'
  | 'HisteroIanis'
  | 'VolontéMbakop'
  | 'AnxioColeen'
  | 'TimidoAhmed';

export interface IThemePalette {
  primary:   string;
  secondary: string;
  bg:        string;
  surface:   string;
  surface2:  string;
  text:      string;
  muted:     string;
  border:    string;
  glow:      string;
  grid:      string;
}

export interface ITheme {
  id:          ThemeId;
  label:       string;
  author:      string;
  icon:        string;
  tagline:     string;
  palette:     IThemePalette;
  glowColor:   string;
  scanlines:   boolean;
  price:       number;        // Prix en BiCoins (0 = gratuit par défaut)
  isDefault:   boolean;
}

// ─────────────────────────────────────────────────────────────────
//  UTILISATEUR & PROFIL
// ─────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id:              Types.ObjectId;
  username:         string;
  email:            string;
  password:         string;
  role:             'parent' | 'child' | 'admin';
  parentId?:        Types.ObjectId;
  magicCode:        string;         // 8 chars — connexion enfant
  avatarUrl?:       string;
  countryCode?:     string;
  subscriptionPlan: 'free' | 'family' | 'pro';
  settings: {
    theme:         ThemeId;
    volume:        number;
    language:      string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IProfile extends Document {
  _id:               Types.ObjectId;
  userId:            Types.ObjectId;
  displayName:       string;
  avatarEmoji:       string;
  theme:             ThemeId;
  ownedThemes:       ThemeId[];         // thèmes achetés
  equippedAvatar?:   string;            // item boutique équipé
  equippedBorder?:   string;
  equippedEffect?:   string;
  xp:                number;
  level:             number;
  rank:              Rank;
  biCoins:           number;
  badges:            string[];
  skills:            ISkillRadar;
  approvedGameIds:   string[];
  totalGamesPlayed:  number;
  totalTimePlayed:   number;
  dailyTimeLimit?:   number;
  ageGroup:          '3-6' | '7-10' | '11-14' | '15+';
  createdAt:         Date;
  updatedAt:         Date;
}

// ─────────────────────────────────────────────────────────────────
//  XP & RANGS
// ─────────────────────────────────────────────────────────────────

export type Rank =
  | 'Novice' | 'Initié' | 'Joueur' | 'Expert' | 'Maître' | 'Légendaire';

export interface ISkillRadar {
  logique:    number;  // 0-100
  reflexes:   number;
  memoire:    number;
  calcul:     number;
  creativite: number;
  langage:    number;
}

// ─────────────────────────────────────────────────────────────────
//  BICOINS & BOUTIQUE
// ─────────────────────────────────────────────────────────────────

export type ShopItemType = 'avatar' | 'border' | 'effect' | 'theme';
export type ItemRarity   = 'common' | 'rare' | 'epic' | 'legendary';

export interface IShopItem extends Document {
  id:           string;
  name:         string;
  description:  string;
  type:         ShopItemType;
  previewUrl:   string;
  price:        number;
  rarity:       ItemRarity;
  themeId?:     ThemeId;
  cssClass?:    string;
  requiredLevel:number;
  isAvailable:  boolean;
  createdAt:    Date;
}

export interface IWalletTransaction {
  type:        'earn' | 'spend' | 'bonus';
  amount:      number;
  description: string;
  gameId?:     string;
  itemId?:     string;
  createdAt:   Date;
}

// ─────────────────────────────────────────────────────────────────
//  JEUX & CATALOGUE
// ─────────────────────────────────────────────────────────────────

export type GameCategory =
  | 'Logique' | 'Réflexion' | 'Stratégie' | 'Mémoire'
  | 'Maths'   | 'Vocabulaire' | 'Musique' | 'Science';

/** Manifest JSON lu depuis bilia.config.json dans chaque jeu */
export interface IGameConfig {
  gameId:       string;
  name:         string;
  version:      string;
  author:       string;
  category:     GameCategory;
  description:  string;
  minAge:       number;
  requirements: Array<'camera' | 'location' | 'microphone'>;
  logo:         string;
  entryPoint:   string;
  bundleSize?:  number;
  skills?:      Partial<ISkillRadar>;
}

export interface IGameManifest extends Document {
  id:            string;
  name:          string;
  description:   string;
  logo:          string;
  category:      GameCategory;
  version:       string;
  author:        string;
  entryPoint:    string;
  bundlePath:    string;       // chemin sur le serveur /storage/games/:id
  bundleSize:    number;
  skills:        Partial<ISkillRadar>;
  minAge:        number;
  requirements:  string[];
  isPublished:   boolean;
  downloadCount: number;
  rating:        number;
  uploadedBy:    Types.ObjectId;
  createdAt:     Date;
  updatedAt:     Date;
}

export type DownloadStatus = 'pending' | 'approved' | 'rejected' | 'cached';

export interface IDownloadRequest extends Document {
  _id:          Types.ObjectId;
  profileId:    Types.ObjectId;
  parentId:     Types.ObjectId;
  gameId:       string;
  gameName:     string;
  gameLogo:     string;
  status:       DownloadStatus;
  parentNote?:  string;
  requestedAt:  Date;
  respondedAt?: Date;
}

// ─────────────────────────────────────────────────────────────────
//  SCORES & ANALYTICS
// ─────────────────────────────────────────────────────────────────

export interface IActivity extends Document {
  _id:         Types.ObjectId;
  profileId:   Types.ObjectId;
  gameId:      string;
  gameName:    string;
  score:       number;
  highScore:   number;
  xpEarned:   number;
  biCoinsEarned: number;
  duration:    number;
  won:         boolean;
  skills:      Partial<ISkillRadar>;
  gameState?:  Record<string, unknown>;
  syncedAt?:   Date;
  createdAt:   Date;
}

export interface IDailySession extends Document {
  profileId:     Types.ObjectId;
  date:          string;          // "YYYY-MM-DD"
  minutesPlayed: number;
  xpEarned:     number;
  gamesPlayed:   string[];
  skills:        ISkillRadar;
}

// ─────────────────────────────────────────────────────────────────
//  TEMPS DE JEU (TIME GUARD)
// ─────────────────────────────────────────────────────────────────

export interface ITimeConfig {
  profileId:           Types.ObjectId;
  dailyLimitMinutes:   number;
  weekendLimitMinutes: number;
  curfewStart?:        string;   // "21:00"
  curfewEnd?:          string;   // "07:00"
  breakInterval?:      number;   // toutes les N minutes
  breakDuration?:      number;   // durée pause en minutes
  lockMessage:         string;
  curfewMessage:       string;
  pauseMessage:        string;
}

// ─────────────────────────────────────────────────────────────────
//  SOCKET.IO EVENTS
// ─────────────────────────────────────────────────────────────────

export const QUICK_MESSAGES = [
  { id: 'gg',        icon: 'fa-solid fa-trophy',           text: 'Bravo ! 🚀'       },
  { id: 'wellplayed',icon: 'fa-solid fa-hands-clapping',   text: 'Bien joué ! 👏'   },
  { id: 'challenge', icon: 'fa-solid fa-sword',            text: 'Défi relevé ! 🎮' },
  { id: 'wow',       icon: 'fa-solid fa-star',             text: 'Incroyable ! ⭐'  },
  { id: 'try',       icon: 'fa-solid fa-fire',             text: 'Encore ! 💪'      },
  { id: 'bye',       icon: 'fa-solid fa-hand-wave',        text: 'À bientôt ! 👋'   },
] as const;

export type QuickMessageId = typeof QUICK_MESSAGES[number]['id'];

export interface ServerToClientEvents {
  'download:approved':  (d: { requestId: string; gameId: string; bundlePath: string }) => void;
  'download:rejected':  (d: { requestId: string; reason?: string }) => void;
  'download:request':   (d: { profileName: string; gameName: string; requestId: string }) => void;
  'notification:badge': (count: number) => void;
  'time:warning':       (d: { minutesLeft: number }) => void;
  'time:lock':          (d: { reason: string; message: string }) => void;
  'time:unlock':        () => void;
  'wallet:update':      (d: { earned: number; newBalance: number; reason: string }) => void;
  'challenge:in':       (d: { from: string; gameId: string; score: number; requestId: string }) => void;
  'chat:message':       (d: { fromName: string; fromEmoji: string; messageId: QuickMessageId }) => void;
  'xp:gained':          (d: { amount: number; newTotal: number; levelUp: boolean; newLevel?: number }) => void;
}

export interface ClientToServerEvents {
  'join:parent':    (userId: string) => void;
  'join:child':     (profileId: string) => void;
  'time:heartbeat': (profileId: string) => void;
  'chat:send':      (d: { toProfileId: string; messageId: QuickMessageId }) => void;
  'challenge:send': (d: { toProfileId: string; gameId: string; score: number }) => void;
}

// ─────────────────────────────────────────────────────────────────
//  SDK TYPES (PostMessage API)
// ─────────────────────────────────────────────────────────────────

export type SDKOutboundType =
  | 'BILIA_READY'
  | 'BILIA_SCORE'
  | 'BILIA_GAME_END'
  | 'BILIA_SAVE'
  | 'BILIA_PAUSE'
  | 'BILIA_RESUME'
  | 'BILIA_VIBRATE'
  | 'BILIA_SKILL'
  | 'BILIA_LOG';

export type SDKInboundType =
  | 'BILIA_THEME'
  | 'BILIA_DIFFICULTY'
  | 'BILIA_CMD_PAUSE'
  | 'BILIA_CMD_RESUME'
  | 'BILIA_TIME_LOCK'
  | 'BILIA_MEDIAPIPE_RESULT';

export interface SDKGameEndPayload {
  score:       number;
  victory:     boolean;
  xpEarned:    number;
  duration?:   number;
  gameState?:  Record<string, unknown>;
  skills?:     Partial<ISkillRadar>;
}

export interface SDKDifficultyPayload {
  level:          number;        // 1-10
  hints:          boolean;
  timeMultiplier: number;
  targetScore:    number;
}

// ─────────────────────────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────────────────────────

export interface IJwtPayload {
  userId: string;
  email:  string;
  role:   'parent' | 'child' | 'admin';
  iat?:   number;
  exp?:   number;
}

export interface ApiOk<T = unknown>  { success: true;  data: T;       message?: string }
export interface ApiErr              { success: false; error: string; code?: number    }
export type     ApiRes<T = unknown>  = ApiOk<T> | ApiErr;

declare global {
  namespace Express {
    interface Request { user?: IJwtPayload; requestId?: string }
  }
}
