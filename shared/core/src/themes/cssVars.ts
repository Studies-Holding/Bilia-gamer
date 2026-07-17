import { THEMES_REGISTRY, type ThemeDefinition } from './registry.js'

function themeToCssVars(theme: ThemeDefinition): string {
  const { colors } = theme
  return [
    `  --accent: ${colors.accent};`,
    `  --accent-bg: ${colors.accentBg};`,
    `  --accent-border: ${colors.accentBorder};`,
    `  --bg: ${colors.bg};`,
    `  --text: ${colors.text};`,
    `  --text-h: ${colors.textHeading};`,
    `  --border: ${colors.border};`,
  ].join('\n')
}

/**
 * Génère un bloc CSS `:root { ... }` par thème du registre, sélectionnable
 * via `[data-theme="<id>"]`. Utilisé pour produire `globals.css` (@shared/ui).
 */
export function generateCssVars(registry: Record<string, ThemeDefinition> = THEMES_REGISTRY): string {
  return Object.values(registry)
    .map((theme) => {
      const selector = theme.id === 'default' ? ':root' : `:root[data-theme="${theme.id}"]`
      return `${selector} {\n${themeToCssVars(theme)}\n}`
    })
    .join('\n\n')
}
