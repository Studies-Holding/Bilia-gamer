/**
 * Génère src/globals.css à partir de THEMES_REGISTRY (@shared/core).
 * `@shared/ui` reste la seule source de vérité pour les apps (elles importent
 * "@shared/ui/globals.css"), mais le contenu des couleurs vient de
 * `@shared/core/src/themes` — cf. modules/shared-and-sdk.md §A.
 *
 * Lancé via `pnpm run generate:css` (tsx). Le fichier généré est commité :
 * pas besoin d'exécuter ce script pour que les apps démarrent, seulement
 * pour le régénérer après une modification de THEMES_REGISTRY.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateCssVars } from '../../core/src/themes/cssVars.js'

const banner = `/* Fichier généré — ne pas éditer à la main. Source : shared/core/src/themes/registry.ts */\n/* Régénérer avec : pnpm --filter @shared/ui run generate:css */\n\n`

const base = `@import "tailwindcss";\n\n`

const themeVars = generateCssVars()

const output = `${banner}${base}${themeVars}\n\nbody {\n  color: var(--text);\n  background: var(--bg);\n}\n`

const outPath = fileURLToPath(new URL('../src/globals.css', import.meta.url))
writeFileSync(outPath, output, 'utf-8')

console.log(`@shared/ui: globals.css généré (${outPath})`)
