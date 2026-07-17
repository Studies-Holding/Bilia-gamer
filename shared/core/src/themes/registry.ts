/**
 * THEMES_REGISTRY — source de vérité des thèmes visuels (univers / passes
 * culturels). `@shared/ui` consomme `generateCssVars` (themes/cssVars.ts)
 * pour produire les variables CSS de `globals.css`.
 */
export interface ThemeDefinition {
  id: string
  label: string
  colors: {
    accent: string
    accentBg: string
    accentBorder: string
    bg: string
    text: string
    textHeading: string
    border: string
  }
}

const DEFAULT_THEME: ThemeDefinition = {
  id: 'default',
  label: 'Bilibilia (défaut)',
  colors: {
    accent: '#aa3bff',
    accentBg: 'rgba(170, 59, 255, 0.1)',
    accentBorder: 'rgba(170, 59, 255, 0.5)',
    bg: '#ffffff',
    text: '#6b6375',
    textHeading: '#08060d',
    border: '#e5e4e7',
  },
}

export const THEMES_REGISTRY: Record<string, ThemeDefinition> = {
  default: DEFAULT_THEME,
}

export function getTheme(id: string): ThemeDefinition {
  return THEMES_REGISTRY[id] ?? DEFAULT_THEME
}
