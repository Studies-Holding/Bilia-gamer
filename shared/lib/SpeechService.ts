// ================================================================
//  BILIA-V4 — shared/lib/SpeechService.ts
//  Text-to-Speech + Speech Recognition (Web Speech API)
//  Singleton partagé — accessibilité WCAG 2.1
// ================================================================

export interface SpeechOptions {
  lang?:   string;   // 'fr-FR', 'en-US'…
  rate?:   number;   // 0.5–2.0 (défaut 1)
  pitch?:  number;   // 0–2 (défaut 1)
  volume?: number;   // 0–1 (défaut 1)
  voice?:  string;   // nom de la voix (ex: 'Amelie')
}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  isFinal:    boolean;
}

type RecognitionCallback = (result: RecognitionResult) => void;

/**
 * Service Text-to-Speech et Speech Recognition.
 * Utilisé par le SDK pour la méthode `Bilia.speak()`
 * et pour les jeux accessibles aux joueurs dyslexiques.
 */
class SpeechServiceClass {
  private static _instance: SpeechServiceClass;
  private _synth:       SpeechSynthesis | null = null;
  private _recognition: SpeechRecognition | null = null;
  private _voices:      SpeechSynthesisVoice[] = [];
  private _isListening  = false;

  static get instance(): SpeechServiceClass {
    if (!SpeechServiceClass._instance) {
      SpeechServiceClass._instance = new SpeechServiceClass();
    }
    return SpeechServiceClass._instance;
  }
  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this._synth = window.speechSynthesis;
      // Charger les voix (asynchrone sur certains navigateurs)
      const load = () => { this._voices = this._synth!.getVoices(); };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  // ── TTS ───────────────────────────────────────────────────────

  get isSupported(): boolean { return this._synth !== null; }

  /**
   * Lire un texte à voix haute.
   * @param text    - Texte à prononcer.
   * @param options - Langue, vitesse, pitch, volume, voix préférée.
   */
  speak(text: string, options: SpeechOptions = {}): void {
    if (!this._synth) return;
    this._synth.cancel(); // annuler la parole en cours

    const utt       = new SpeechSynthesisUtterance(text);
    utt.lang        = options.lang   ?? 'fr-FR';
    utt.rate        = options.rate   ?? 1;
    utt.pitch       = options.pitch  ?? 1;
    utt.volume      = options.volume ?? 1;

    if (options.voice) {
      const found = this._voices.find(v => v.name === options.voice);
      if (found) utt.voice = found;
    } else {
      // Choisir automatiquement une voix dans la langue demandée
      const lang = options.lang ?? 'fr-FR';
      const auto = this._voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
      if (auto) utt.voice = auto;
    }

    this._synth.speak(utt);
  }

  /** Arrêter la lecture en cours. */
  stop(): void { this._synth?.cancel(); }

  /** Mettre en pause. */
  pause(): void { this._synth?.pause(); }

  /** Reprendre. */
  resume(): void { this._synth?.resume(); }

  /** Liste des voix disponibles sur cet appareil. */
  getVoices(): SpeechSynthesisVoice[] { return this._voices; }

  /** Voix françaises disponibles. */
  getFrenchVoices(): SpeechSynthesisVoice[] {
    return this._voices.filter(v => v.lang.startsWith('fr'));
  }

  // ── Reconnaissance vocale ─────────────────────────────────────

  get recognitionSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  /**
   * Démarrer la reconnaissance vocale.
   * @param lang     - Langue à reconnaître (défaut: 'fr-FR').
   * @param onResult - Callback appelé à chaque résultat.
   * @param onEnd    - Appelé quand la reconnaissance s'arrête.
   */
  startListening(lang = 'fr-FR', onResult: RecognitionCallback, onEnd?: () => void): void {
    if (this._isListening) return;
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition
            || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;

    this._recognition = new (SR as typeof SpeechRecognition)();
    this._recognition.lang        = lang;
    this._recognition.interimResults = true;
    this._recognition.continuous     = true;

    this._recognition.onresult = (e: SpeechRecognitionEvent) => {
      for (const res of Array.from(e.results)) {
        const alt = res[0];
        onResult({ transcript: alt.transcript, confidence: alt.confidence, isFinal: res.isFinal });
      }
    };
    this._recognition.onend = () => { this._isListening = false; onEnd?.(); };
    this._recognition.start();
    this._isListening = true;
  }

  /** Arrêter la reconnaissance vocale. */
  stopListening(): void {
    this._recognition?.stop();
    this._isListening = false;
  }

  get isListening(): boolean { return this._isListening; }
}

export const SpeechService = SpeechServiceClass.instance;
export default SpeechService;
