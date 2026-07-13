// ================================================================
//  BILIA-V4 — dev-template/src/main.ts
//  Exemple de jeu complet utilisant le SDK BiLiA
//  Jeu de cible : cliquer/toucher la cible avant la fin du temps
//
//  INSTRUCTIONS :
//  1. `npm install` dans ce dossier
//  2. `npm run dev` → ouvre http://localhost:3000
//  3. En dehors de la plateforme BiLiA, le jeu fonctionne en mode standalone
// ================================================================

import Bilia from './bilia-sdk';
import type { SDKDifficultyPayload } from './bilia-sdk';

// ── Sélecteurs DOM ────────────────────────────────────────────────
const canvas       = document.getElementById('game-canvas')     as HTMLCanvasElement;
const ctx          = canvas.getContext('2d')!;
const startScreen  = document.getElementById('start-screen')!;
const gameoverScreen = document.getElementById('gameover-screen')!;
const unauthScreen = document.getElementById('unauthorized-screen')!;
const scoreDisplay = document.getElementById('score-display')!;
const resultScore  = document.getElementById('result-score')!;
const resultIcon   = document.getElementById('result-icon')!;
const resultTitle  = document.getElementById('result-title')!;
const startBtn     = document.getElementById('start-btn')!;
const replayBtn    = document.getElementById('replay-btn')!;
const gameTitle    = document.getElementById('game-title')!;
const gameDesc     = document.getElementById('game-desc')!;

// ── État du jeu ────────────────────────────────────────────────────
interface Target {
  x: number; y: number;
  radius: number;
  speedX: number; speedY: number;
  points: number;
}

interface GameState {
  running:    boolean;
  score:      number;
  timeLeft:   number;   // secondes
  targets:    Target[];
  level:      number;
  startTime:  number;
}

let state: GameState = {
  running: false, score: 0, timeLeft: 30, targets: [], level: 1, startTime: 0,
};

let animFrame:    number | null = null;
let timerInterval:ReturnType<typeof setInterval> | null = null;
let difficulty:   SDKDifficultyPayload = { level: 5, hints: true, timeMultiplier: 1, targetScore: 300 };

// ── Initialisation SDK ────────────────────────────────────────────
(async () => {
  await Bilia.init({ gameId: 'target-rush', debug: false });

  // Vérifier l'autorisation
  if (!Bilia.isAuthorized()) {
    startScreen.hidden  = true;
    unauthScreen.hidden = false;
    return;
  }

  // Adapter le jeu au thème
  Bilia.onThemeChanged(theme => {
    gameTitle.textContent = 'Target Rush';
    gameDesc.textContent  = `Touche les cibles ! Thème : ${theme.label}`;
    // Le style.css réagit automatiquement aux CSS vars
  });

  // Adapter la difficulté selon le profil
  Bilia.onDifficultyUpdate(d => {
    difficulty = d;
    state.level    = d.level;
    state.timeLeft = Math.floor(30 * d.timeMultiplier);
  });

  // Stopper le jeu si le temps est verrouillé
  Bilia.onTimeLock(reason => {
    stopGame();
    showGameOver(false, reason === 'curfew' ? '🌙' : '⏰');
  });

  // Pause / Reprise depuis le HUD
  Bilia.onPause(() => { if (state.running) pauseGame(); });
  Bilia.onResume(() => { if (!state.running && animFrame === null) resumeGame(); });

  // Adapter le canvas à la fenêtre
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
})();

// ── Resize Canvas ─────────────────────────────────────────────────
function resizeCanvas(): void {
  const parent = canvas.parentElement!;
  const W = parent.clientWidth;
  const H = parent.clientHeight;
  canvas.width  = W;
  canvas.height = H;
  if (!state.running) drawIdle();
}

// ── Dessin d'attente ──────────────────────────────────────────────
function drawIdle(): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Grille de fond
  ctx.strokeStyle = 'rgba(0,242,255,0.06)';
  ctx.lineWidth   = 1;
  for (let x = 0; x < canvas.width; x += 40)  { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
}

// ── Démarrer ──────────────────────────────────────────────────────
function startGame(): void {
  state = {
    running:   true,
    score:     0,
    timeLeft:  Math.floor(30 * difficulty.timeMultiplier),
    targets:   [],
    level:     difficulty.level,
    startTime: Date.now(),
  };
  startScreen.hidden = true;
  spawnTarget();
  runTimer();
  animFrame = requestAnimationFrame(loop);
}

// ── Boucle principale ─────────────────────────────────────────────
function loop(): void {
  if (!state.running) return;
  update();
  render();
  animFrame = requestAnimationFrame(loop);
}

function update(): void {
  for (const t of state.targets) {
    t.x += t.speedX;
    t.y += t.speedY;
    if (t.x - t.radius < 0 || t.x + t.radius > canvas.width)  t.speedX *= -1;
    if (t.y - t.radius < 0 || t.y + t.radius > canvas.height) t.speedY *= -1;
  }
}

function render(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fond grille
  ctx.strokeStyle = 'rgba(0,242,255,0.05)';
  ctx.lineWidth   = 1;
  for (let x = 0; x < canvas.width; x += 40)  { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }

  // Cibles
  const color = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim() || '#00f2ff';
  for (const t of state.targets) {
    // Halo
    const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.radius * 1.8);
    grad.addColorStop(0,   color + '40');
    grad.addColorStop(1,   'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(t.x, t.y, t.radius * 1.8, 0, Math.PI * 2); ctx.fill();

    // Cercle principal
    ctx.fillStyle   = color + '22';
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2.5;
    ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Croix centrale
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5;
    const arm = t.radius * 0.45;
    ctx.beginPath(); ctx.moveTo(t.x - arm, t.y); ctx.lineTo(t.x + arm, t.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(t.x, t.y - arm); ctx.lineTo(t.x, t.y + arm); ctx.stroke();

    // Points
    if (difficulty.hints) {
      ctx.fillStyle   = color;
      ctx.font        = `bold ${Math.max(12, t.radius * 0.6)}px var(--font-head, Rajdhani)`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.fillText(String(t.points), t.x, t.y + t.radius + 18);
    }
  }

  // Timer bar
  const ratio    = state.timeLeft / (30 * difficulty.timeMultiplier);
  const barColor = ratio > 0.4 ? color : ratio > 0.2 ? '#ff9900' : '#ff3333';
  ctx.fillStyle  = 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, canvas.height - 6, canvas.width, 6);
  ctx.fillStyle  = barColor;
  ctx.fillRect(0, canvas.height - 6, canvas.width * ratio, 6);
}

// ── Spawner ───────────────────────────────────────────────────────
function spawnTarget(): void {
  const count  = 1 + Math.floor(state.level / 3);   // plus de cibles selon niveau
  const minR   = Math.max(18, 50 - state.level * 3);
  state.targets = Array.from({ length: count }, () => {
    const r = minR + Math.random() * 15;
    const spd = 1 + state.level * 0.35;
    return {
      x:      r + Math.random() * (canvas.width  - r * 2),
      y:      r + Math.random() * (canvas.height - r * 2),
      radius: r,
      speedX: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * spd),
      speedY: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * spd),
      points: Math.ceil(r < 25 ? 30 : r < 35 ? 20 : 10),
    };
  });
}

// ── Clic / Toucher ───────────────────────────────────────────────
function handlePointer(e: PointerEvent): void {
  if (!state.running) return;
  const rect = canvas.getBoundingClientRect();
  const mx   = (e.clientX - rect.left) * (canvas.width  / rect.width);
  const my   = (e.clientY - rect.top)  * (canvas.height / rect.height);

  let hit = false;
  state.targets = state.targets.filter(t => {
    const dist = Math.hypot(mx - t.x, my - t.y);
    if (dist <= t.radius) {
      state.score += t.points;
      scoreDisplay.textContent = state.score.toLocaleString();
      Bilia.sendScore(state.score);
      Bilia.reportSkill({ reflexes: 1 });
      Bilia.vibrate(40);
      hit = true;
      return false; // supprimer la cible touchée
    }
    return true;
  });

  if (hit || state.targets.length === 0) spawnTarget();
}

canvas.addEventListener('pointerdown', handlePointer);

// ── Timer ─────────────────────────────────────────────────────────
function runTimer(): void {
  timerInterval = setInterval(() => {
    if (!state.running) return;
    state.timeLeft--;
    if (state.timeLeft <= 0) endGame();
  }, 1000);
}

// ── Pause / Reprise ───────────────────────────────────────────────
function pauseGame(): void {
  state.running = false;
  if (animFrame !== null) { cancelAnimationFrame(animFrame); animFrame = null; }
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function resumeGame(): void {
  state.running = true;
  runTimer();
  animFrame = requestAnimationFrame(loop);
}

function stopGame(): void {
  state.running = false;
  if (animFrame !== null)  { cancelAnimationFrame(animFrame); animFrame = null; }
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ── Fin de partie ─────────────────────────────────────────────────
function endGame(): void {
  stopGame();
  const victory  = state.score >= difficulty.targetScore;
  const duration = Math.floor((Date.now() - state.startTime) / 1000);
  const xpEarned = Math.max(1, Math.floor(state.score / 10) + (victory ? 50 : 0));

  Bilia.finishGame({
    score:    state.score,
    victory,
    xpEarned,
    duration,
    gameState: { level: state.level, finalScore: state.score },
    skills:    { reflexes: Math.ceil(state.score / 50) },
  });

  showGameOver(victory);
}

function showGameOver(victory: boolean, overrideIcon?: string): void {
  resultIcon.textContent  = overrideIcon ?? (victory ? '🏆' : '💀');
  resultTitle.textContent = victory ? 'Victoire !' : 'Perdu…';
  resultScore.textContent = `Score : ${state.score.toLocaleString()} pts`;
  gameoverScreen.hidden   = false;
}

// ── Boutons ───────────────────────────────────────────────────────
startBtn.addEventListener('click', () => startGame());
replayBtn.addEventListener('click', () => { gameoverScreen.hidden = true; startGame(); });

// ── Initialisation visuelle ───────────────────────────────────────
drawIdle();
