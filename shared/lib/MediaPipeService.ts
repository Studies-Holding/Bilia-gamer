// ================================================================
//  BILIA-V4 — shared/lib/MediaPipeService.ts
//  Singleton MediaPipe — Tracking Hands / Pose / Face
//  Partagé entre le SDK et la PWA via le socket-service
// ================================================================

export type MediaPipeMode = 'hands' | 'pose' | 'face';

export interface HandLandmark   { x: number; y: number; z: number }
export interface PoseLandmark   { x: number; y: number; z: number; visibility: number }
export interface FaceLandmark   { x: number; y: number; z: number }

export interface HandResult  { landmarks: HandLandmark[][];  handedness: string[] }
export interface PoseResult  { landmarks: PoseLandmark[] }
export interface FaceResult  { landmarks: FaceLandmark[][] }

type HandCallback = (r: HandResult)  => void;
type PoseCallback = (r: PoseResult)  => void;
type FaceCallback = (r: FaceResult)  => void;

const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe';

/**
 * Singleton MediaPipeService.
 * Charge les modèles à la demande (lazy), partage un seul flux caméra
 * entre tous les abonnés pour économiser les ressources.
 *
 * @example
 * ```typescript
 * await MediaPipeService.startHands(videoEl);
 * MediaPipeService.onHand(result => console.log(result.landmarks));
 * ```
 */
class MediaPipeServiceClass {

  private static _instance: MediaPipeServiceClass;

  private _stream: MediaStream | null = null;
  private _videoEl: HTMLVideoElement | null = null;
  private _activeMode: MediaPipeMode | null = null;
  private _running = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _detector: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _camera: any = null;

  private _handCbs: HandCallback[] = [];
  private _poseCbs: PoseCallback[] = [];
  private _faceCbs: FaceCallback[] = [];

  /** Singleton */
  static get instance(): MediaPipeServiceClass {
    if (!MediaPipeServiceClass._instance) {
      MediaPipeServiceClass._instance = new MediaPipeServiceClass();
    }
    return MediaPipeServiceClass._instance;
  }
  private constructor() {}

  // ── Chargement dynamique des scripts MediaPipe ─────────────────

  private _loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = url; s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Impossible de charger ${url}`));
      document.head.appendChild(s);
    });
  }

  // ── Démarrage caméra ────────────────────────────────────────────

  private async _startCamera(video: HTMLVideoElement): Promise<void> {
    if (this._stream) return; // déjà démarrée
    this._stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' },
    });
    video.srcObject = this._stream;
    await new Promise<void>(res => { video.onloadedmetadata = () => res(); });
    await video.play();
    this._videoEl = video;
    console.log('Caméra démarrée pour MediaPipe');
  }

  // ── HANDS ────────────────────────────────────────────────────────

  /**
   * Démarre la détection des mains.
   * @param video - Element vidéo connecté à la caméra.
   * @param maxHands - Nombre max de mains à détecter (1 ou 2).
   */
  async startHands(video: HTMLVideoElement, maxHands = 1): Promise<void> {
    await this._loadScript(`${CDN}/hands/hands.js`);
    await this._loadScript(`${CDN}/camera_utils/camera_utils.js`);
    await this._startCamera(video);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Hands   = (window as any).Hands;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Camera  = (window as any).Camera;

    this._detector = new Hands({
      locateFile: (f: string) => `${CDN}/hands/${f}`,
    });
    this._detector.setOptions({
      maxNumHands:            maxHands,
      modelComplexity:        1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence:  0.5,
    });
    this._detector.onResults((res: {
      multiHandLandmarks:  HandLandmark[][];
      multiHandedness:     { label: string }[];
    }) => {
      const result: HandResult = {
        landmarks:  res.multiHandLandmarks  ?? [],
        handedness: res.multiHandedness?.map(h => h.label) ?? [],
      };
      this._handCbs.forEach(cb => cb(result));
    });

    this._camera = new Camera(video, {
      onFrame: async () => { await this._detector.send({ image: video }); },
      width: 640, height: 480,
    });
    await this._camera.start();
    this._activeMode = 'hands';
    this._running    = true;
  }

  // ── POSE ─────────────────────────────────────────────────────────

  /**
   * Démarre la détection de pose corporelle (33 landmarks).
   */
  async startPose(video: HTMLVideoElement): Promise<void> {
    await this._loadScript(`${CDN}/pose/pose.js`);
    await this._loadScript(`${CDN}/camera_utils/camera_utils.js`);
    await this._startCamera(video);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Pose   = (window as any).Pose;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Camera = (window as any).Camera;

    this._detector = new Pose({
      locateFile: (f: string) => `${CDN}/pose/${f}`,
    });
    this._detector.setOptions({
      modelComplexity:        1,
      smoothLandmarks:        true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence:  0.6,
    });
    this._detector.onResults((res: { poseLandmarks: PoseLandmark[] }) => {
      if (!res.poseLandmarks) return;
      this._poseCbs.forEach(cb => cb({ landmarks: res.poseLandmarks }));
    });

    this._camera = new Camera(video, {
      onFrame: async () => { await this._detector.send({ image: video }); },
      width: 640, height: 480,
    });
    await this._camera.start();
    this._activeMode = 'pose';
    this._running    = true;
  }

  // ── FACE MESH ─────────────────────────────────────────────────────

  /**
   * Démarre la détection faciale (468 landmarks).
   */
  async startFace(video: HTMLVideoElement): Promise<void> {
    await this._loadScript(`${CDN}/face_mesh/face_mesh.js`);
    await this._loadScript(`${CDN}/camera_utils/camera_utils.js`);
    await this._startCamera(video);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const FaceMesh = (window as any).FaceMesh;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Camera   = (window as any).Camera;

    this._detector = new FaceMesh({
      locateFile: (f: string) => `${CDN}/face_mesh/${f}`,
    });
    this._detector.setOptions({
      maxNumFaces:            1,
      refineLandmarks:        true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence:  0.6,
    });
    this._detector.onResults((res: { multiFaceLandmarks: FaceLandmark[][] }) => {
      this._faceCbs.forEach(cb => cb({ landmarks: res.multiFaceLandmarks ?? [] }));
    });

    this._camera = new Camera(video, {
      onFrame: async () => { await this._detector.send({ image: video }); },
      width: 640, height: 480,
    });
    await this._camera.start();
    this._activeMode = 'face';
    this._running    = true;
  }

  // ── Abonnements ────────────────────────────────────────────────

  onHand(cb: HandCallback): () => void {
    this._handCbs.push(cb);
    return () => { this._handCbs = this._handCbs.filter(x => x !== cb); };
  }

  onPose(cb: PoseCallback): () => void {
    this._poseCbs.push(cb);
    return () => { this._poseCbs = this._poseCbs.filter(x => x !== cb); };
  }

  onFace(cb: FaceCallback): () => void {
    this._faceCbs.push(cb);
    return () => { this._faceCbs = this._faceCbs.filter(x => x !== cb); };
  }

  // ── Stop ────────────────────────────────────────────────────────

  stop(): void {
    this._camera?.stop();
    this._stream?.getTracks().forEach(t => t.stop());
    this._stream     = null;
    this._running    = false;
    this._activeMode = null;
    this._detector?.close?.();
  }

  get isRunning(): boolean { return this._running; }
  get mode(): MediaPipeMode | null { return this._activeMode; }
}

export const MediaPipeService = MediaPipeServiceClass.instance;
export default MediaPipeService;
