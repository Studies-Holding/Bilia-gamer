// ================================================================
//  BILIA-V4 — shared/config/themes.config.ts
//  Registre central des thèmes — source de vérité unique
//  Migré depuis ThemeRegistry.js + theme.css du ZIP source
// ================================================================

import type { ITheme, ThemeId } from '../types';

/**
 * Registre de tous les thèmes BiLiA.
 * Chaque thème définit sa palette complète, son auteur,
 * son prix en BiCoins et ses variables CSS associées.
 */
export const THEMES_REGISTRY: ITheme[] = [
  // ── SuperShane — Cyber Bleu (thème par défaut) ──────────────
  {
    id:        'SuperShane',
    label:     'Shane',
    author:    'Team BiLiA',
    icon:      'fa-bolt',
    tagline:   'Cyber — Bleu électrique',
    isDefault: true,
    price:     0,
    scanlines: true,
    glowColor: 'rgba(0, 242, 255, 0.6)',
    palette: {
      primary:   '#00f2ff',
      secondary: '#b400ff',
      bg:        '#050d1a',
      surface:   '#0f1e38',
      surface2:  '#162440',
      text:      '#e8f4ff',
      muted:     'rgba(232, 244, 255, 0.4)',
      border:    'rgba(0, 242, 255, 0.18)',
      glow:      '0 0 20px rgba(0,242,255,0.4), 0 0 40px rgba(0,242,255,0.15)',
      grid:      'rgba(0, 242, 255, 0.04)',
    },
  },

  // ── HisteroIanis — Inferno Rouge ────────────────────────────
  {
    id:        'HisteroIanis',
    label:     'Ianis',
    author:    'Team BiLiA',
    icon:      'fa-fire',
    tagline:   'Inferno — Feu ardent',
    isDefault: false,
    price:     0,
    scanlines: true,
    glowColor: 'rgba(255, 107, 0, 0.6)',
    palette: {
      primary:   '#ff6b00',
      secondary: '#ff0055',
      bg:        '#140500',
      surface:   '#2a0f00',
      surface2:  '#351500',
      text:      '#fff0e8',
      muted:     'rgba(255, 240, 232, 0.4)',
      border:    'rgba(255, 107, 0, 0.2)',
      glow:      '0 0 20px rgba(255,107,0,0.4), 0 0 40px rgba(255,107,0,0.15)',
      grid:      'rgba(255, 107, 0, 0.04)',
    },
  },

  // ── VolontéMbakop — Matrix Vert ─────────────────────────────
  {
    id:        'VolontéMbakop',
    label:     'Mbakop',
    author:    'Team BiLiA',
    icon:      'fa-terminal',
    tagline:   'Matrix — Hacker vert',
    isDefault: false,
    price:     0,
    scanlines: true,
    glowColor: 'rgba(0, 255, 65, 0.6)',
    palette: {
      primary:   '#00ff41',
      secondary: '#00b827',
      bg:        '#000d00',
      surface:   '#001e00',
      surface2:  '#002800',
      text:      '#d6ffe0',
      muted:     'rgba(214, 255, 224, 0.4)',
      border:    'rgba(0, 255, 65, 0.18)',
      glow:      '0 0 20px rgba(0,255,65,0.4), 0 0 40px rgba(0,255,65,0.15)',
      grid:      'rgba(0, 255, 65, 0.04)',
    },
  },

  // ── AnxioColeen — Sakura Rose ───────────────────────────────
  {
    id:        'AnxioColeen',
    label:     'Coleen',
    author:    'Team BiLiA',
    icon:      'fa-heart',
    tagline:   'Sakura — Rose cyberpunk',
    isDefault: false,
    price:     0,
    scanlines: false,
    glowColor: 'rgba(255, 110, 180, 0.6)',
    palette: {
      primary:   '#ff6eb4',
      secondary: '#c44bff',
      bg:        '#13000d',
      surface:   '#2a0022',
      surface2:  '#36002d',
      text:      '#ffe8f5',
      muted:     'rgba(255, 232, 245, 0.4)',
      border:    'rgba(255, 110, 180, 0.2)',
      glow:      '0 0 20px rgba(255,110,180,0.4), 0 0 40px rgba(255,110,180,0.15)',
      grid:      'rgba(255, 110, 180, 0.04)',
    },
  },

  // ── TimidoAhmed — Solaire Or ────────────────────────────────
  {
    id:        'TimidoAhmed',
    label:     'Ahmed',
    author:    'Team BiLiA',
    icon:      'fa-sun',
    tagline:   'Solaire — Or lumineux',
    isDefault: false,
    price:     150,   // thème premium
    scanlines: false,
    glowColor: 'rgba(255, 238, 0, 0.6)',
    palette: {
      primary:   '#ffee00',
      secondary: '#ff9900',
      bg:        '#1a1400',
      surface:   '#251e00',
      surface2:  '#302800',
      text:      '#fffde8',
      muted:     'rgba(255, 253, 232, 0.4)',
      border:    'rgba(255, 238, 0, 0.2)',
      glow:      '0 0 20px rgba(255,238,0,0.4), 0 0 40px rgba(255,238,0,0.15)',
      grid:      'rgba(255, 238, 0, 0.04)',
    },
  },
];

/** Map id → thème pour accès O(1) */
export const THEMES_MAP = new Map<ThemeId, ITheme>(
  THEMES_REGISTRY.map(t => [t.id, t])
);

/** Thème par défaut */
export const DEFAULT_THEME = THEMES_REGISTRY[0];

/** Retourner un thème par id (fallback SuperShane si inconnu) */
export function getTheme(id: ThemeId | string): ITheme {
  return THEMES_MAP.get(id as ThemeId) ?? DEFAULT_THEME;
}

/**
 * Génère le bloc de variables CSS pour un thème donné.
 * Injecté dans :root via ThemeManager côté frontend.
 */
export function themeToCSSVars(theme: ITheme): Record<string, string> {
  const p = theme.palette;
  return {
    '--neon':              p.primary,
    '--neon-alt':          p.secondary,
    '--neon-glow':         theme.glowColor,
    '--main-color':        p.primary,
    '--main-color-rgb':    hexToRgb(p.primary),
    '--accent':            p.secondary,
    '--accent-rgb':        hexToRgb(p.secondary),
    '--black':             p.bg,
    '--bg-color':          p.bg,
    '--surface':           p.surface,
    '--surface-2':         p.surface2,
    '--border-color':      p.border,
    '--white':             p.text,
    '--light-white':       p.muted.replace('0.4', '0.7'),
    '--muted':             p.muted,
    '--glow-shadow':       p.glow,
    '--grid-color':        p.grid,
    '--font-head':         "'Rajdhani', 'Inter', sans-serif",
    '--font-body':         "'Inter', 'Montserrat', sans-serif",
    '--transition':        '.3s ease',
    '--transition-slow':   '.6s cubic-bezier(0.16, 1, 0.3, 1)',
    '--rank-color':        '#ffd700',
  };
}

/** Convertit une couleur hex en "r, g, b" */
function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
