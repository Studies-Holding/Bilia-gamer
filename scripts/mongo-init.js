// ================================================================
//  BILIA-V4 — docker/mongo-init.js  (VERSION CORRIGÉE & COMPLÈTE)
//  Exécuté automatiquement par le conteneur MongoDB au 1er démarrage.
//  Variables disponibles : db (pointe sur MONGO_INITDB_DATABASE)
// ================================================================

// ── 0. Utilisateur applicatif ─────────────────────────────────────
const adminDb = db.getSiblingDB('admin');

try {
  adminDb.createUser({
    user: 'bilia_app',
    pwd:  'bilia_app_password_change_in_prod',
    roles: [
      { role: 'readWrite', db: 'bilia_auth'   },
      { role: 'readWrite', db: 'bilia_core'   },
      { role: 'readWrite', db: 'bilia_game'   },
      { role: 'readWrite', db: 'bilia_socket' },
    ],
  });
  print('Utilisateur bilia_app créé');
} catch (e) {
  print('⚠️  bilia_app existe déjà (ignoré) : ' + e.message);
}

// ════════════════════════════════════════════════════════════════
//  BASE : bilia_auth
// ════════════════════════════════════════════════════════════════
const authDb = db.getSiblingDB('bilia_auth');

// Collections
authDb.createCollection('users');
authDb.createCollection('profiles');
authDb.createCollection('refresh_tokens');

// Index users
authDb.users.createIndex({ email:     1 }, { unique: true });
authDb.users.createIndex({ magicCode: 1 }, { unique: true, sparse: true });
authDb.users.createIndex({ role:      1 });
authDb.users.createIndex({ createdAt: -1 });

// Index profiles
authDb.profiles.createIndex({ userId:         1 });
authDb.profiles.createIndex({ userId:         1, theme: 1 });
authDb.profiles.createIndex({ parentId:       1 });
authDb.profiles.createIndex({ childCode:      1 }, { unique: true, sparse: true });

// Index refresh_tokens
authDb.refresh_tokens.createIndex({ token:     1 }, { unique: true });
authDb.refresh_tokens.createIndex({ userId:    1 });
authDb.refresh_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Seed : compte parent de démonstration (mot de passe : Demo1234!)
// Hash bcrypt de "Demo1234!" (cost=10) — à régénérer en production
authDb.users.insertOne({
  _id:        new ObjectId(),
  email:      'parent@demo.bilia',
  password:   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
  role:       'parent',
  magicCode:  null,
  isVerified: true,
  createdAt:  new Date(),
  updatedAt:  new Date(),
});

print( 'bilia_auth initialisée');

// ════════════════════════════════════════════════════════════════
//  BASE : bilia_core
// ════════════════════════════════════════════════════════════════
const coreDb = db.getSiblingDB('bilia_core');

coreDb.createCollection('activities');
coreDb.createCollection('shopitems');
coreDb.createCollection('wallets');
coreDb.createCollection('analytics');
coreDb.createCollection('themes');
coreDb.createCollection('time_configs');

// Index activities (historique de jeux)
coreDb.activities.createIndex({ profileId: 1, createdAt: -1 });
coreDb.activities.createIndex({ gameId:    1, score:     -1 });
coreDb.activities.createIndex({ profileId: 1, gameId:    1 });
coreDb.activities.createIndex({ sessionId: 1 }, { unique: true, sparse: true });

// Index wallets
coreDb.wallets.createIndex({ profileId: 1 }, { unique: true });

// Index analytics
coreDb.analytics.createIndex({ profileId: 1, date: -1 });
coreDb.analytics.createIndex({ date:      -1 });
coreDb.analytics.createIndex({ eventType: 1, date: -1 });

// Index themes
coreDb.themes.createIndex({ key: 1 }, { unique: true });

// Index time_configs
coreDb.time_configs.createIndex({ profileId: 1 }, { unique: true });

// Seed shop items
coreDb.shopitems.insertMany([
  // Avatars
  { id:'avatar-astronaut', name:'Astronaute',   type:'avatar', price:50,  rarity:'common',    previewUrl:'/shop/avatars/astronaut.svg',  requiredLevel:1,  isAvailable:true, createdAt:new Date() },
  { id:'avatar-dragon',    name:'Dragon',        type:'avatar', price:150, rarity:'rare',      previewUrl:'/shop/avatars/dragon.svg',     requiredLevel:5,  isAvailable:true, createdAt:new Date() },
  { id:'avatar-robot',     name:'Robot IA',      type:'avatar', price:300, rarity:'epic',      previewUrl:'/shop/avatars/robot.svg',      requiredLevel:10, isAvailable:true, createdAt:new Date() },
  { id:'avatar-phoenix',   name:'Phénix',        type:'avatar', price:800, rarity:'legendary', previewUrl:'/shop/avatars/phoenix.svg',    requiredLevel:20, isAvailable:true, createdAt:new Date() },
  // Bordures
  { id:'border-neon',      name:'Néon Pulse',    type:'border', price:75,  rarity:'common',    previewUrl:'/shop/borders/neon.svg',       requiredLevel:2,  isAvailable:true, cssClass:'border-effect-neon', createdAt:new Date() },
  { id:'border-fire',      name:'Flammes',        type:'border', price:200, rarity:'rare',      previewUrl:'/shop/borders/fire.svg',       requiredLevel:7,  isAvailable:true, cssClass:'border-effect-fire', createdAt:new Date() },
  // Thèmes
  { id:'theme-ocean',      name:'Océan Profond',  type:'theme',  price:100, rarity:'common',    previewUrl:'/shop/themes/ocean.svg',       requiredLevel:3,  isAvailable:true, createdAt:new Date() },
  { id:'theme-space',      name:'Espace Infini',  type:'theme',  price:250, rarity:'rare',      previewUrl:'/shop/themes/space.svg',       requiredLevel:8,  isAvailable:true, createdAt:new Date() },
  // Power-ups
  { id:'powerup-x2',       name:'Score x2',       type:'powerup',price:30,  rarity:'common',    previewUrl:'/shop/powerups/x2.svg',        requiredLevel:1,  isAvailable:true, createdAt:new Date() },
  { id:'powerup-shield',   name:'Bouclier',       type:'powerup',price:50,  rarity:'common',    previewUrl:'/shop/powerups/shield.svg',    requiredLevel:1,  isAvailable:true, createdAt:new Date() },
]);

// Seed themes
coreDb.themes.insertMany([
  { key:'default', name:'BILIA Classique', primaryColor:'#00f2ff', secondaryColor:'#7c3aed', bgColor:'#050d1a', isDefault:true },
  { key:'ocean',   name:'Océan Profond',   primaryColor:'#0ea5e9', secondaryColor:'#06b6d4', bgColor:'#0c1a2e', isDefault:false },
  { key:'forest',  name:'Forêt Magique',   primaryColor:'#22c55e', secondaryColor:'#15803d', bgColor:'#0a1a0f', isDefault:false },
  { key:'fire',    name:'Volcan',          primaryColor:'#f97316', secondaryColor:'#dc2626', bgColor:'#1a0a00', isDefault:false },
]);

print(' bilia_core initialisée');

// ════════════════════════════════════════════════════════════════
//  BASE : bilia_game
// ════════════════════════════════════════════════════════════════
const gameDb = db.getSiblingDB('bilia_game');

gameDb.createCollection('game_manifests');
gameDb.createCollection('download_requests');
gameDb.createCollection('game_scores');
gameDb.createCollection('approved_games');   // liste blanche par parent

// Index game_manifests
gameDb.game_manifests.createIndex({ gameId:    1 }, { unique: true });
gameDb.game_manifests.createIndex({ category:  1 });
gameDb.game_manifests.createIndex({ tags:      1 });
gameDb.game_manifests.createIndex({ minAge:    1, maxAge: 1 });
gameDb.game_manifests.createIndex({ isPublished: 1 });

// Index download_requests
gameDb.download_requests.createIndex({ profileId: 1, gameId: 1 });
gameDb.download_requests.createIndex({ status:    1, createdAt: -1 });
gameDb.download_requests.createIndex({ parentId:  1, status: 1 });

// Index game_scores
gameDb.game_scores.createIndex({ profileId: 1, gameId: 1, createdAt: -1 });
gameDb.game_scores.createIndex({ gameId:    1, score:  -1 });
gameDb.game_scores.createIndex({ profileId: 1, createdAt: -1 });

// Index approved_games
gameDb.approved_games.createIndex({ parentId:  1, gameId:    1 }, { unique: true });
gameDb.approved_games.createIndex({ profileId: 1, isAllowed: 1 });

// Seed : jeux de démonstration
gameDb.game_manifests.insertMany([
  {
    gameId:       'math-blaster-001',
    name:         'Math Blaster',
    description:  'Entraîne-toi aux additions et soustractions en combattant des extraterrestres !',
    version:      '1.0.0',
    author:       'BILIA Studios',
    category:     'mathematics',
    tags:         ['addition', 'soustraction', 'espace', 'action'],
    minAge:       6, maxAge: 12,
    difficulty:   'beginner',
    thumbnailUrl: '/games/math-blaster/thumbnail.png',
    entryPoint:   'index.html',
    fileSize:     2048000,
    isPublished:  true,
    isOfflineReady: true,
    skills:       ['calcul-mental', 'rapidite', 'concentration'],
    createdAt:    new Date(),
    updatedAt:    new Date(),
  },
  {
    gameId:       'word-wizard-002',
    name:         'Word Wizard',
    description:  'Forme des mots, découvre le vocabulaire et améliore ton orthographe.',
    version:      '1.0.0',
    author:       'BILIA Studios',
    category:     'language',
    tags:         ['orthographe', 'vocabulaire', 'lecture'],
    minAge:       7, maxAge: 13,
    difficulty:   'beginner',
    thumbnailUrl: '/games/word-wizard/thumbnail.png',
    entryPoint:   'index.html',
    fileSize:     1536000,
    isPublished:  true,
    isOfflineReady: true,
    skills:       ['orthographe', 'vocabulaire', 'memoire'],
    createdAt:    new Date(),
    updatedAt:    new Date(),
  },
  {
    gameId:       'geo-explorer-003',
    name:         'Géo Explorer',
    description:  'Explore les pays, les capitales et les continents du monde entier.',
    version:      '1.0.0',
    author:       'BILIA Studios',
    category:     'geography',
    tags:         ['geographie', 'capitales', 'drapeaux', 'culture'],
    minAge:       9, maxAge: 15,
    difficulty:   'intermediate',
    thumbnailUrl: '/games/geo-explorer/thumbnail.png',
    entryPoint:   'index.html',
    fileSize:     3072000,
    isPublished:  true,
    isOfflineReady: false,
    skills:       ['culture-generale', 'memoire', 'geographie'],
    createdAt:    new Date(),
    updatedAt:    new Date(),
  },
]);

print('bilia_game initialisée');

// ════════════════════════════════════════════════════════════════
//  BASE : bilia_socket
// ════════════════════════════════════════════════════════════════
const socketDb = db.getSiblingDB('bilia_socket');

socketDb.createCollection('sessions');
socketDb.createCollection('notifications');
socketDb.createCollection('quick_messages');

// Index sessions
socketDb.sessions.createIndex({ userId:    1 });
socketDb.sessions.createIndex({ socketId:  1 }, { unique: true, sparse: true });
socketDb.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index notifications
socketDb.notifications.createIndex({ userId:    1, isRead: 1, createdAt: -1 });
socketDb.notifications.createIndex({ createdAt: -1 });
socketDb.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Index quick_messages
socketDb.quick_messages.createIndex({ fromUserId: 1, toUserId: 1, createdAt: -1 });
socketDb.quick_messages.createIndex({ createdAt: -1 });

print('bilia_socket initialisée');

print('');
print('════════════════════════════════════════════════');
print(' BILIA-V4 MongoDB initialisée avec succès ! ');
print(' Utilisateur app : bilia_app                 ');
print('  N\'oubliez pas de changer de mot de passe ');
print('════════════════════════════════════════════════');
