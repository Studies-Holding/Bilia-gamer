// ================================================================
//  BILIA-V4 — services/socket-service/src/index.ts
//  Temps réel : Notifications, Quick Chat, Time Guard — Port 5004
// ================================================================
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import mongoose, { Schema, model } from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  QuickMessageId,
  IJwtPayload,
  ITimeConfig,
} from '../../../shared/types';
import { QUICK_MESSAGES } from '../../../shared/types';
import { logger } from './logger';
import { httpLogger } from '../../../shared/logger';
import { isCurfewActive } from './utils/timeGuard';

dotenv.config();

const SECRET   = process.env.JWT_SECRET || 'bilia_dev_secret';
const PORT     = process.env.SOCKET_PORT || 5004;
const ORIGINS  = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173','http://localhost:5174'];

const app        = express();
const httpServer = createServer(app);

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ credentials: true, origin: ORIGINS }));
app.use(httpLogger(logger));
app.use(express.json());

// ── Socket.io ────────────────────────────────────────────────────
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: ORIGINS, credentials: true },
  transports: ['websocket', 'polling'],
});

// Maps de connexions
const parentRooms = new Map<string, Set<string>>();  // userId   → socketIds
const childRooms  = new Map<string, Set<string>>();  // profileId → socketIds

function addToRoom(map: Map<string, Set<string>>, key: string, socketId: string) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key)!.add(socketId);
}
function removeSocket(socketId: string) {
  for (const [k, set] of parentRooms) { set.delete(socketId); if (!set.size) parentRooms.delete(k); }
  for (const [k, set] of childRooms)  { set.delete(socketId); if (!set.size) childRooms.delete(k);  }
}

// ── Modèle TimeConfig ─────────────────────────────────────────────
const TimeConfigSchema = new Schema<ITimeConfig>({
  profileId:           { type: Schema.Types.ObjectId, required: true, unique: true },
  dailyLimitMinutes:   { type: Number, default: 0 },
  weekendLimitMinutes: { type: Number, default: 0 },
  curfewStart:         { type: String, default: null },
  curfewEnd:           { type: String, default: null },
  breakInterval:       { type: Number, default: null },
  breakDuration:       { type: Number, default: 5 },
  lockMessage:         { type: String, default: "À demain, champion ! 🌙" },
  curfewMessage:       { type: String, default: "C'est l'heure de dormir ! 🌙" },
  pauseMessage:        { type: String, default: "Repose tes yeux 5 minutes 👀" },
});
const TimeConfig = model('TimeConfig', TimeConfigSchema);

const DailyUsageSchema = new Schema({
  profileId:     { type: Schema.Types.ObjectId, required: true },
  date:          { type: String, required: true },
  minutesPlayed: { type: Number, default: 0 },
});
DailyUsageSchema.index({ profileId: 1, date: 1 }, { unique: true });
const DailyUsage = model('DailyUsage', DailyUsageSchema);

// ── Vérification du temps ─────────────────────────────────────────
async function checkTimeGuard(profileId: string): Promise<{
  allowed: boolean; reason?: string; message?: string; minutesLeft?: number
}> {
  const config = await TimeConfig.findOne({ profileId });
  if (!config) return { allowed: true };

  const now       = new Date();
  const isWeekend = [0, 6].includes(now.getDay());
  const today     = now.toISOString().slice(0, 10);

  // 1. Couvre-feu
  if (config.curfewStart && config.curfewEnd && isCurfewActive(config.curfewStart, config.curfewEnd, now)) {
    return { allowed: false, reason: 'curfew', message: config.curfewMessage };
  }

  // 2. Limite quotidienne
  const limit = isWeekend && config.weekendLimitMinutes > 0
    ? config.weekendLimitMinutes : config.dailyLimitMinutes;

  if (limit > 0) {
    const usage = await DailyUsage.findOne({ profileId, date: today });
    const played = usage?.minutesPlayed ?? 0;
    if (played >= limit) {
      return { allowed: false, reason: 'limit', message: config.lockMessage, minutesLeft: 0 };
    }
    return { allowed: true, minutesLeft: limit - played };
  }

  return { allowed: true };
}

// ── Connexion Socket.io ───────────────────────────────────────────
io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  logger.info('socket_connected', { socketId: socket.id });

  socket.on('join:parent', (userId: string) => {
    socket.join(`parent:${userId}`);
    addToRoom(parentRooms, userId, socket.id);
    logger.info('parent_joined', { userId, socketId: socket.id });
  });

  socket.on('join:child', async (profileId: string) => {
    socket.join(`child:${profileId}`);
    addToRoom(childRooms, profileId, socket.id);
    logger.info('child_joined', { profileId, socketId: socket.id });

    // Vérification immédiate du temps
    const status = await checkTimeGuard(profileId);
    if (!status.allowed) {
      socket.emit('time:lock', { reason: status.reason!, message: status.message! });
    } else if (status.minutesLeft !== undefined && status.minutesLeft <= 10) {
      socket.emit('time:warning', { minutesLeft: status.minutesLeft });
    }
  });

  // Heartbeat — 1 appel = 1 minute jouée
  socket.on('time:heartbeat', async (profileId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    await DailyUsage.findOneAndUpdate(
      { profileId, date: today },
      { $inc: { minutesPlayed: 1 } },
      { upsert: true }
    );

    const status = await checkTimeGuard(profileId);
    if (!status.allowed) {
      io.to(`child:${profileId}`).emit('time:lock', { reason: status.reason!, message: status.message! });
    } else if (status.minutesLeft !== undefined && [15, 10, 5, 2].includes(status.minutesLeft)) {
      io.to(`child:${profileId}`).emit('time:warning', { minutesLeft: status.minutesLeft });
    }
  });

  // Quick Chat — liste blanche stricte
  socket.on('chat:send', (data) => {
    const { toProfileId, messageId } = data;
    const valid = QUICK_MESSAGES.some(m => m.id === messageId);
    if (!valid) return; // message non autorisé — ignoré silencieusement
    const msg = QUICK_MESSAGES.find(m => m.id === messageId)!;
    io.to(`child:${toProfileId}`).emit('chat:message', {
      fromName:  'Ami',    // résolu côté client via API
      fromEmoji: '🎮',
      messageId: messageId as QuickMessageId,
    });
  });

  // Défi
  socket.on('challenge:send', (data) => {
    io.to(`child:${data.toProfileId}`).emit('challenge:in', {
      from:       data.toProfileId,
      gameId:     data.gameId,
      score:      data.score,
      requestId:  `ch_${Date.now()}`,
    });
  });

  socket.on('disconnect', () => {
    removeSocket(socket.id);
    logger.info('socket_disconnected', { socketId: socket.id });
  });
});

// ── Helpers exportables (appelés par game-service) ────────────────
export function notifyParent(parentId: string, event: keyof ServerToClientEvents, data: unknown) {
  io.to(`parent:${parentId}`).emit(event as any, data as any);
}
export function notifyChild(profileId: string, event: keyof ServerToClientEvents, data: unknown) {
  io.to(`child:${profileId}`).emit(event as any, data as any);
}

// ── REST — config temps (appelé par le parent dashboard) ─────────
app.put('/api/time/:profileId', async (req, res) => {
  try {
    const cfg = await TimeConfig.findOneAndUpdate(
      { profileId: req.params.profileId },
      req.body,
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ success: true, data: cfg });
  } catch(e) { res.status(400).json({ success: false, error: String(e) }); }
});

app.get('/api/time/:profileId/status', async (req, res) => {
  const status = await checkTimeGuard(req.params.profileId);
  res.json({ success: true, data: status });
});

app.get('/api/time/:profileId/usage', async (req, res) => {
  const days  = parseInt(req.query.days as string) || 7;
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
  const usage = await DailyUsage.find({ profileId: req.params.profileId, date: { $in: dates } });
  res.json({ success: true, data: usage });
});

app.get('/health', (_req, res) => res.json({ service: 'socket-service', status: 'ok', v: '4.0.0' }));

// ── Démarrage ─────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bilia_socket')
  .then(() => {
    logger.info('MongoDB connecté');
    httpServer.listen(PORT, () => logger.info(`socket-service démarré → http://localhost:${PORT}`));
  })
  .catch(e => { logger.error('Échec connexion MongoDB', { error: String(e) }); process.exit(1); });
