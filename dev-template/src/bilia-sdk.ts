// ================================================================
//  BILIA-V4 — dev-template/src/bilia-sdk.ts
//  Copie locale du SDK pour développeurs — version bundle autonome
//  En production, le fichier /sdk/bilia-sdk.js est servi par la PWA
// ================================================================

// ── Types ─────────────────────────────────────────────────────────
export type ThemeId = 'SuperShane' | 'HisteroIanis' | 'VolontéMbakop' | 'AnxioColeen' | 'TimidoAhmed';

export interface IThemePalette {
  primary: string; secondary: string; bg: string; surface: string;
  text: string; muted: string; border: string; glow: string;
}

export interface ITheme {
  id: ThemeId; label: string; icon: string; palette: IThemePalette;
}

export interface SDKGameEndPayload {
  score:      number;
  victory:    boolean;
  xpEarned:   number;
  duration?:  number;
  gameState?: Record<string, unknown>;
  skills?:    Partial<{ logique: number; reflexes: number; memoire: number; calcul: number; creativite: number; langage: number }>;
}

export interface SDKDifficultyPayload {
  level: number; hints: boolean; timeMultiplier: number; targetScore: number;
}

interface BiliaSDKOptions {
  gameId:         string;
  debug?:         boolean;
  trustedOrigin?: string;
}

// ── Palettes embarquées ────────────────────────────────────────────
const PALETTES: Record<ThemeId, IThemePalette> = {
  SuperShane:    { primary:'#00f2ff', secondary:'#b400ff', bg:'#050d1a', surface:'#0f1e38', text:'#e8f4ff', muted:'rgba(232,244,255,0.4)', border:'rgba(0,242,255,0.18)', glow:'0 0 20px rgba(0,242,255,0.4)' },
  HisteroIanis:  { primary:'#ff6b00', secondary:'#ff0055', bg:'#140500', surface:'#2a0f00', text:'#fff0e8', muted:'rgba(255,240,232,0.4)', border:'rgba(255,107,0,0.2)',  glow:'0 0 20px rgba(255,107,0,0.4)' },
  'VolontéMbakop':{ primary:'#00ff41',secondary:'#00b827', bg:'#000d00', surface:'#001e00', text:'#d6ffe0', muted:'rgba(214,255,224,0.4)', border:'rgba(0,255,65,0.18)',  glow:'0 0 20px rgba(0,255,65,0.4)' },
  AnxioColeen:   { primary:'#ff6eb4', secondary:'#c44bff', bg:'#13000d', surface:'#2a0022', text:'#ffe8f5', muted:'rgba(255,232,245,0.4)', border:'rgba(255,110,180,0.2)',glow:'0 0 20px rgba(255,110,180,0.4)' },
  TimidoAhmed:   { primary:'#ffee00', secondary:'#ff9900', bg:'#1a1400', surface:'#251e00', text:'#fffde8', muted:'rgba(255,253,232,0.4)', border:'rgba(255,238,0,0.2)',  glow:'0 0 20px rgba(255,238,0,0.4)' },
};

// ── Classe SDK ─────────────────────────────────────────────────────
class BiliaSDKClass {
  private _gameId        = '';
  private _debug         = false;
  private _trustedOrigin = '*';
  private _theme: ITheme = { id: 'SuperShane', label: 'Shane', icon: 'fa-bolt', palette: PALETTES.SuperShane };
  private _difficulty: SDKDifficultyPayload | null = null;
  private _inPlatform   = false;
  private _authorized   = false;

  private _themeCbs:      Array<(t: ITheme) => void>             = [];
  private _pauseCbs:      Array<() => void>                      = [];
  private _resumeCbs:     Array<() => void>                      = [];
  private _difficultyCbs: Array<(d: SDKDifficultyPayload) => void> = [];
  private _timeLockCbs:   Array<(r: string) => void>             = [];
  private _handCbs:       Array<(r: unknown) => void>            = [];
  private _poseCbs:       Array<(r: unknown) => void>            = [];

  async init(opts: BiliaSDKOptions): Promise<void> {
    this._gameId        = opts.gameId;
    this._debug         = opts.debug ?? false;
    this._trustedOrigin = opts.trustedOrigin ?? '*';
    this._inPlatform    = window.parent !== window;

    const params   = new URLSearchParams(window.location.search);
    const themeId  = params.get('biliaTheme') as ThemeId | null;
    this._authorized = params.get('authorized') === '1';

    if (themeId) this._applyTheme(themeId);
    else         this._applyTheme('SuperShane');

    window.addEventListener('message', this._onMessage.bind(this));

    if (this._inPlatform) {
      this._post('BILIA_READY', { gameId: this._gameId });
    } else {
      this._log('⚠ Mode standalone (hors plateforme BiLiA)');
    }
  }

  private _onMessage(e: MessageEvent): void {
    if (this._trustedOrigin !== '*' && e.origin !== this._trustedOrigin) return;
    const { type, payload } = e.data ?? {};
    if (!type) return;
    switch (type) {
      case 'BILIA_THEME':          this._applyTheme(payload as ThemeId); break;
      case 'BILIA_DIFFICULTY':     this._difficulty = payload; this._difficultyCbs.forEach(cb => cb(payload)); break;
      case 'BILIA_CMD_PAUSE':      this._pauseCbs.forEach(cb => cb()); break;
      case 'BILIA_CMD_RESUME':     this._resumeCbs.forEach(cb => cb()); break;
      case 'BILIA_TIME_LOCK':      this._timeLockCbs.forEach(cb => cb(String(payload))); break;
      case 'BILIA_MEDIAPIPE_RESULT': {
        const r = payload as { mode: string; data: unknown };
        if (r.mode === 'hands') this._handCbs.forEach(cb => cb(r.data));
        if (r.mode === 'pose')  this._poseCbs.forEach(cb => cb(r.data));
        break;
      }
    }
  }

  private _applyTheme(id: ThemeId | string): void {
    const palette = PALETTES[id as ThemeId] ?? PALETTES.SuperShane;
    this._theme   = { id: id as ThemeId, label: id, icon: 'fa-bolt', palette };
    const r = document.documentElement;
    r.setAttribute('data-theme', id);
    r.style.setProperty('--main-color',  palette.primary);
    r.style.setProperty('--accent',      palette.secondary);
    r.style.setProperty('--bg-color',    palette.bg);
    r.style.setProperty('--surface',     palette.surface);
    r.style.setProperty('--white',       palette.text);
    r.style.setProperty('--muted',       palette.muted);
    r.style.setProperty('--border-color',palette.border);
    r.style.setProperty('--glow-shadow', palette.glow);
    r.style.setProperty('--neon',        palette.primary);
    r.style.setProperty('--neon-alt',    palette.secondary);
    r.style.setProperty('--font-head',   "'Rajdhani','Inter',sans-serif");
    r.style.setProperty('--font-body',   "'Inter','Montserrat',sans-serif");
    r.style.setProperty('--transition',  '.3s ease');
    this._themeCbs.forEach(cb => cb(this._theme));
    this._log('🎨 Thème:', id);
  }

  private _post(type: string, payload?: unknown): void {
    if (!this._inPlatform) return;
    window.parent.postMessage({ type, gameId: this._gameId, payload }, this._trustedOrigin);
    this._log('→', type, payload);
  }

  private _log(...a: unknown[]): void { if (this._debug) console.log(`[BiLiA SDK — ${this._gameId}]`, ...a); }

  // ── API Publique ────────────────────────────────────────────────
  getTheme():           ITheme                       { return this._theme; }
  getDifficulty():      SDKDifficultyPayload | null  { return this._difficulty; }
  isAuthorized():       boolean                      { return this._inPlatform ? this._authorized : true; }
  get primaryColor():   string                       { return this._theme.palette.primary; }
  get themeId():        ThemeId                      { return this._theme.id; }

  sendScore(score: number):                    void { this._post('BILIA_SCORE',    { score }); }
  finishGame(p: SDKGameEndPayload):            void { this._post('BILIA_GAME_END', p); }
  saveState(state: Record<string, unknown>):  void { this._post('BILIA_SAVE',     { state }); }
  pause():                                    void { this._post('BILIA_PAUSE'); }
  resume():                                   void { this._post('BILIA_RESUME'); }
  reportSkill(skills: Record<string, number>):void { this._post('BILIA_SKILL', { skills }); }
  vibrate(p: number | number[]):              void { this._post('BILIA_VIBRATE', { pattern: p }); navigator.vibrate?.(p); }

  speak(text: string, lang = 'fr-FR', rate = 1): void {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate;
    window.speechSynthesis.speak(u);
  }

  async getLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
    return new Promise((res, rej) => {
      if (!navigator.geolocation) { rej(new Error('Non supporté')); return; }
      navigator.geolocation.getCurrentPosition(p => res({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }), rej, { timeout: 10000 });
    });
  }

  onThemeChanged(cb: (t: ITheme) => void): () => void          { this._themeCbs.push(cb); cb(this._theme); return () => { this._themeCbs      = this._themeCbs.filter(x=>x!==cb); }; }
  onPause(cb: () => void): () => void                          { this._pauseCbs.push(cb);  return () => { this._pauseCbs      = this._pauseCbs.filter(x=>x!==cb);  }; }
  onResume(cb: () => void): () => void                         { this._resumeCbs.push(cb); return () => { this._resumeCbs     = this._resumeCbs.filter(x=>x!==cb); }; }
  onDifficultyUpdate(cb: (d: SDKDifficultyPayload) => void): () => void { this._difficultyCbs.push(cb); if (this._difficulty) cb(this._difficulty); return () => { this._difficultyCbs = this._difficultyCbs.filter(x=>x!==cb); }; }
  onTimeLock(cb: (r: string) => void): () => void              { this._timeLockCbs.push(cb); return () => { this._timeLockCbs = this._timeLockCbs.filter(x=>x!==cb); }; }
  onHandDetected(cb: (r: unknown) => void): () => void         { this._handCbs.push(cb); this._post('BILIA_LOG', { event:'request_mediapipe', mode:'hands' }); return () => { this._handCbs = this._handCbs.filter(x=>x!==cb); }; }
  onPoseDetected(cb: (r: unknown) => void): () => void         { this._poseCbs.push(cb); this._post('BILIA_LOG', { event:'request_mediapipe', mode:'pose'  }); return () => { this._poseCbs = this._poseCbs.filter(x=>x!==cb); }; }
}

const Bilia = new BiliaSDKClass();
if (typeof window !== 'undefined') (window as Record<string, unknown>).Bilia = Bilia;
export default Bilia;
