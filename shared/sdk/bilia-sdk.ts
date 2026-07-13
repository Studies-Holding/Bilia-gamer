// ================================================================
//  BILIA-V4 — shared/sdk/bilia-sdk.ts
//  SDK officiel pour développeurs tiers
//  Communication via PostMessage API (iframe ↔ PWA)
//  Inclut : Thèmes, Score, Fin de partie, MediaPipe, Géolocalisation
// ================================================================

import type {
  ThemeId,
  ITheme,
  SDKGameEndPayload,
  SDKDifficultyPayload,
  ISkillRadar,
  SDKOutboundType,
  SDKInboundType,
  QuickMessageId,
} from '../types';

import { THEMES_REGISTRY, getTheme, themeToCSSVars } from '../config/themes.config';

// ─────────────────────────────────────────────────────────────────
//  TYPES SDK
// ─────────────────────────────────────────────────────────────────

export interface MediaPipeHandResult {
  landmarks:  { x: number; y: number; z: number }[][];
  handedness: string[];
}

export interface MediaPipePoseResult {
  landmarks: { x: number; y: number; z: number; visibility: number }[];
}

export interface MediaPipeFaceResult {
  multiFaceLandmarks: { x: number; y: number; z: number }[][];
}

type MediaPipeMode = 'hands' | 'pose' | 'face';

interface SDKMessage {
  type:    SDKOutboundType | SDKInboundType;
  gameId?: string;
  payload?: unknown;
}

interface BiliaSDKOptions {
  gameId:         string;
  /** Active les logs de debug dans la console */
  debug?:         boolean;
  /** Origine autorisée (laisser '*' en dev) */
  trustedOrigin?: string;
}

// ─────────────────────────────────────────────────────────────────
//  CLASSE PRINCIPALE
// ─────────────────────────────────────────────────────────────────

/**
 * SDK BiLiA — Pont sécurisé entre un jeu (iframe) et la plateforme.
 *
 * @example
 * ```typescript
 * import Bilia from './bilia-sdk';
 *
 * // Initialiser
 * await Bilia.init({ gameId: 'tetris-math' });
 *
 * // Adapter le jeu au thème actif
 * const theme = Bilia.getTheme();
 * document.body.style.background = theme.palette.bg;
 *
 * // Envoyer le score en temps réel
 * Bilia.sendScore(currentScore);
 *
 * // Détecter les mains via MediaPipe
 * Bilia.onHandDetected(result => movePlayer(result.landmarks[0]));
 *
 * // Fin de partie
 * Bilia.finishGame({ score: 1200, victory: true, xpEarned: 50 });
 * ```
 */
class BiliaSDKClass {

  private _gameId        = '';
  private _debug         = false;
  private _trustedOrigin = '*';
  private _theme: ITheme = THEMES_REGISTRY[0];
  private _difficulty: SDKDifficultyPayload | null = null;
  private _isInsidePlatform = false;
  private _isAuthorized     = false;

  // Callbacks abonnés
  private _onThemeCbs:      Array<(t: ITheme) => void>             = [];
  private _onPauseCbs:      Array<() => void>                      = [];
  private _onResumeCbs:     Array<() => void>                      = [];
  private _onDifficultyCbs: Array<(d: SDKDifficultyPayload) => void> = [];
  private _onTimeLockCbs:   Array<(reason: string) => void>        = [];
  private _onHandCbs:       Array<(r: MediaPipeHandResult) => void>= [];
  private _onPoseCbs:       Array<(r: MediaPipePoseResult) => void>= [];
  private _onFaceCbs:       Array<(r: MediaPipeFaceResult) => void>= [];

  // ── Init ────────────────────────────────────────────────────────

  /**
   * Initialise le SDK. À appeler en tout premier.
   * Détecte si le jeu tourne dans la plateforme BiLiA,
   * lit le thème depuis l'URL et s'abonne aux messages.
   */
  async init(opts: BiliaSDKOptions): Promise<void> {
    this._gameId        = opts.gameId;
    this._debug         = opts.debug ?? false;
    this._trustedOrigin = opts.trustedOrigin ?? '*';

    // Détecter si on est dans l'iframe BiLiA
    this._isInsidePlatform = window.parent !== window;

    if (!this._isInsidePlatform) {
      this._log('⚠️ Jeu lancé hors de la plateforme BiLiA — mode standalone');
      this._applyFallbackTheme();
    }

    // Lire les paramètres injectés dans l'URL par GameRunner
    const params = new URLSearchParams(window.location.search);
    const themeId      = params.get('biliaTheme') as ThemeId | null;
    const authorized   = params.get('authorized') === '1';

    this._isAuthorized  = authorized;

    if (themeId) this._applyTheme(themeId);

    // Écouter les messages entrants depuis la PWA
    window.addEventListener('message', this._handleMessage.bind(this));

    // Signaler que le jeu est prêt
    this._post('BILIA_READY', { gameId: this._gameId });

    // Demander thème + difficulté
    this._post('BILIA_LOG', { event: 'init', gameId: this._gameId });

    this._log('✅ SDK initialisé', { gameId: this._gameId, platform: this._isInsidePlatform });
  }

  // ── Gestion des messages entrants ───────────────────────────────

  private _handleMessage(event: MessageEvent<SDKMessage>): void {
    if (this._trustedOrigin !== '*' && event.origin !== this._trustedOrigin) return;
    const { type, payload } = event.data ?? {};
    if (!type) return;

    this._log('← reçu:', type, payload);

    switch (type) {
      case 'BILIA_THEME':
        this._applyTheme(payload as ThemeId);
        break;
      case 'BILIA_DIFFICULTY':
        this._difficulty = payload as SDKDifficultyPayload;
        this._onDifficultyCbs.forEach(cb => cb(this._difficulty!));
        break;
      case 'BILIA_CMD_PAUSE':
        this._onPauseCbs.forEach(cb => cb());
        break;
      case 'BILIA_CMD_RESUME':
        this._onResumeCbs.forEach(cb => cb());
        break;
      case 'BILIA_TIME_LOCK':
        this._onTimeLockCbs.forEach(cb => cb(String(payload)));
        break;
      case 'BILIA_MEDIAPIPE_RESULT': {
        const r = payload as { mode: MediaPipeMode; data: unknown };
        if (r.mode === 'hands') this._onHandCbs.forEach(cb => cb(r.data as MediaPipeHandResult));
        if (r.mode === 'pose')  this._onPoseCbs.forEach(cb => cb(r.data as MediaPipePoseResult));
        if (r.mode === 'face')  this._onFaceCbs.forEach(cb => cb(r.data as MediaPipeFaceResult));
        break;
      }
    }
  }

  // ── Application du thème ────────────────────────────────────────

  private _applyTheme(id: ThemeId | string): void {
    const theme = getTheme(id);
    this._theme = theme;

    // Injecter les variables CSS dans le jeu
    const vars = themeToCSSVars(theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.id);
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    this._onThemeCbs.forEach(cb => cb(theme));
    this._log('🎨 Thème appliqué:', theme.id);
  }

  private _applyFallbackTheme(): void {
    // Mode hors-plateforme : appliquer le thème par défaut
    this._applyTheme('SuperShane');
  }

  // ── Envoi de messages vers la PWA ───────────────────────────────

  private _post(type: SDKOutboundType, payload?: unknown): void {
    if (!this._isInsidePlatform) return;
    const msg: SDKMessage = { type, gameId: this._gameId, payload };
    window.parent.postMessage(msg, this._trustedOrigin);
    this._log('→ envoyé:', type, payload);
  }

  private _log(...args: unknown[]): void {
    if (this._debug) console.log(`[BiLiA SDK — ${this._gameId}]`, ...args);
  }

  // ─────────────────────────────────────────────────────────────────
  //  API PUBLIQUE
  // ─────────────────────────────────────────────────────────────────

  /**
   * Retourne le thème actuellement actif.
   * @returns L'objet thème complet avec palette et variables CSS.
   */
  getTheme(): ITheme {
    return this._theme;
  }

  /**
   * Retourne tous les thèmes disponibles dans le registre.
   */
  getAllThemes(): ITheme[] {
    return THEMES_REGISTRY;
  }

  /**
   * Envoie le score courant au HUD de la PWA (affichage temps réel).
   * @param score - Score actuel du joueur.
   */
  sendScore(score: number): void {
    this._post('BILIA_SCORE', { score });
  }

  /**
   * Signale la fin de la partie à la plateforme.
   * Déclenche le calcul XP, BiCoins et la synchronisation.
   *
   * @param payload - Score final, victoire, XP, durée, état sauvegardé.
   */
  finishGame(payload: SDKGameEndPayload): void {
    this._post('BILIA_GAME_END', payload);
  }

  /**
   * Sauvegarde l'état du jeu (reprise ultérieure).
   * @param state - Objet sérialisable représentant l'état complet du jeu.
   */
  saveState(state: Record<string, unknown>): void {
    this._post('BILIA_SAVE', { state });
  }

  /**
   * Notifie une pause volontaire côté jeu.
   */
  pause(): void {
    this._post('BILIA_PAUSE');
  }

  /**
   * Notifie une reprise volontaire côté jeu.
   */
  resume(): void {
    this._post('BILIA_RESUME');
  }

  /**
   * Déclenche une vibration haptic sur mobile.
   * @param pattern - Durée en ms ou tableau [vibrer, pause, vibrer…]
   */
  vibrate(pattern: number | number[]): void {
    this._post('BILIA_VIBRATE', { pattern });
    navigator.vibrate?.(pattern);
  }

  /**
   * Reporte des points de compétence acquis pendant la partie.
   * Utilisé par le moteur d'apprentissage adaptatif.
   * @param skills - Gains partiels de compétences (0-100 chaque).
   */
  reportSkill(skills: Partial<ISkillRadar>): void {
    this._post('BILIA_SKILL', { skills });
  }

  /**
   * Vérifie si le jeu est autorisé pour ce profil enfant.
   * Si false, afficher un écran "Demande à tes parents".
   */
  isAuthorized(): boolean {
    return this._isInsidePlatform ? this._isAuthorized : true;
  }

  /**
   * Retourne les paramètres de difficulté adaptés au profil courant.
   * Null si la difficulté n'a pas encore été reçue.
   */
  getDifficulty(): SDKDifficultyPayload | null {
    return this._difficulty;
  }

  // ─────────────────────────────────────────────────────────────────
  //  ABONNEMENTS
  // ─────────────────────────────────────────────────────────────────

  /**
   * S'abonner aux changements de thème.
   * Appelé immédiatement si un thème est déjà actif.
   * @returns Fonction de désabonnement.
   */
  onThemeChanged(cb: (theme: ITheme) => void): () => void {
    this._onThemeCbs.push(cb);
    cb(this._theme);
    return () => { this._onThemeCbs = this._onThemeCbs.filter(x => x !== cb); };
  }

  /** S'abonner aux pauses demandées par le HUD parent. */
  onPause(cb: () => void): () => void {
    this._onPauseCbs.push(cb);
    return () => { this._onPauseCbs = this._onPauseCbs.filter(x => x !== cb); };
  }

  /** S'abonner aux reprises demandées par le HUD parent. */
  onResume(cb: () => void): () => void {
    this._onResumeCbs.push(cb);
    return () => { this._onResumeCbs = this._onResumeCbs.filter(x => x !== cb); };
  }

  /**
   * S'abonner aux mises à jour de difficulté adaptative.
   * Ajuster la complexité du jeu en conséquence.
   */
  onDifficultyUpdate(cb: (d: SDKDifficultyPayload) => void): () => void {
    this._onDifficultyCbs.push(cb);
    if (this._difficulty) cb(this._difficulty);
    return () => { this._onDifficultyCbs = this._onDifficultyCbs.filter(x => x !== cb); };
  }

  /**
   * S'abonner aux verrouillages de temps.
   * ARRÊTER LE JEU IMMÉDIATEMENT à la réception.
   */
  onTimeLock(cb: (reason: string) => void): () => void {
    this._onTimeLockCbs.push(cb);
    return () => { this._onTimeLockCbs = this._onTimeLockCbs.filter(x => x !== cb); };
  }

  // ─────────────────────────────────────────────────────────────────
  //  MEDIAPIPE (IA Corporelle)
  // ─────────────────────────────────────────────────────────────────

  /**
   * S'abonner aux résultats de détection des mains via MediaPipe.
   * Les frames sont calculées par le service MediaPipe de la PWA et
   * renvoyées au jeu via PostMessage.
   *
   * @param cb - Callback recevant les landmarks des mains détectées.
   * @example
   * ```typescript
   * Bilia.onHandDetected(({ landmarks }) => {
   *   const indexTip = landmarks[0][8]; // bout de l'index
   *   player.x = indexTip.x * canvas.width;
   * });
   * ```
   */
  onHandDetected(cb: (result: MediaPipeHandResult) => void): () => void {
    this._onHandCbs.push(cb);
    this._post('BILIA_LOG', { event: 'request_mediapipe', mode: 'hands' });
    return () => { this._onHandCbs = this._onHandCbs.filter(x => x !== cb); };
  }

  /**
   * S'abonner aux résultats de détection de pose corporelle.
   * @param cb - Callback recevant les 33 landmarks du corps.
   */
  onPoseDetected(cb: (result: MediaPipePoseResult) => void): () => void {
    this._onPoseCbs.push(cb);
    this._post('BILIA_LOG', { event: 'request_mediapipe', mode: 'pose' });
    return () => { this._onPoseCbs = this._onPoseCbs.filter(x => x !== cb); };
  }

  /**
   * S'abonner aux résultats de détection faciale.
   * @param cb - Callback recevant les 468 landmarks du visage.
   */
  onFaceDetected(cb: (result: MediaPipeFaceResult) => void): () => void {
    this._onFaceCbs.push(cb);
    this._post('BILIA_LOG', { event: 'request_mediapipe', mode: 'face' });
    return () => { this._onFaceCbs = this._onFaceCbs.filter(x => x !== cb); };
  }

  // ─────────────────────────────────────────────────────────────────
  //  GÉOLOCALISATION
  // ─────────────────────────────────────────────────────────────────

  /**
   * Obtenir la position géographique du joueur.
   * Demande l'autorisation au navigateur.
   * Le jeu doit déclarer "location" dans bilia.config.json requirements.
   *
   * @returns Promise avec les coordonnées { lat, lng, accuracy }
   * @throws Si l'utilisateur refuse ou si non disponible.
   */
  async getLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          lat:      pos.coords.latitude,
          lng:      pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
        err => reject(err),
        { enableHighAccuracy: false, timeout: 10_000 }
      );
    });
  }

  // ─────────────────────────────────────────────────────────────────
  //  SPEECH (Text-to-Speech)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Lire un texte à voix haute (Web Speech API).
   * @param text    - Texte à prononcer.
   * @param lang    - Langue (défaut: 'fr-FR').
   * @param rate    - Vitesse de lecture (0.5–2, défaut: 1).
   */
  speak(text: string, lang = 'fr-FR', rate = 1): void {
    if (!window.speechSynthesis) return;
    const utt  = new SpeechSynthesisUtterance(text);
    utt.lang   = lang;
    utt.rate   = rate;
    window.speechSynthesis.speak(utt);
  }

  // ─────────────────────────────────────────────────────────────────
  //  UTILITAIRES
  // ─────────────────────────────────────────────────────────────────

  /** Couleur principale du thème courant */
  get primaryColor(): string { return this._theme.palette.primary; }

  /** ID du thème courant */
  get themeId(): ThemeId { return this._theme.id; }
}

// ── Singleton exporté ─────────────────────────────────────────────
const Bilia = new BiliaSDKClass();

// Exposition globale pour les jeux en JS pur
if (typeof window !== 'undefined') {
  ((window as unknown)as Record<string, unknown>).Bilia = Bilia;
}

export default Bilia;
export { BiliaSDKClass };
