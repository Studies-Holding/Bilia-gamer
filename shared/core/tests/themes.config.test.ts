import { describe, expect, it } from '@jest/globals'
import { THEMES_REGISTRY, getTheme } from '../src/themes/registry.js'
import { generateCssVars } from '../src/themes/cssVars.js'

describe('THEMES_REGISTRY', () => {
  it('contient un thème "default"', () => {
    expect(THEMES_REGISTRY.default).toBeDefined()
  })

  it('getTheme retombe sur "default" pour un id inconnu', () => {
    expect(getTheme('inexistant')).toBe(THEMES_REGISTRY.default)
  })
})

describe('generateCssVars', () => {
  it('génère un bloc :root avec les variables couleur', () => {
    const css = generateCssVars()
    expect(css).toContain(':root {')
    expect(css).toContain('--accent: #aa3bff;')
  })
})
