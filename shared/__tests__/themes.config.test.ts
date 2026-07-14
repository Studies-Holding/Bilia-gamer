// ================================================================
//  BILIA-V4 — shared/__tests__/themes.config.test.ts
// ================================================================
import { getTheme, themeToCSSVars, THEMES_REGISTRY, DEFAULT_THEME } from '../config/themes.config';

describe('themes.config', () => {
  it('expose au moins un thème par défaut', () => {
    expect(THEMES_REGISTRY.length).toBeGreaterThan(0);
    expect(DEFAULT_THEME.isDefault).toBe(true);
  });

  it('getTheme retourne le thème demandé', () => {
    const theme = getTheme('HisteroIanis');
    expect(theme.id).toBe('HisteroIanis');
    expect(theme.palette.primary).toBe('#ff6b00');
  });

  it('getTheme retombe sur le thème par défaut si id inconnu', () => {
    const theme = getTheme('ThemeInexistant');
    expect(theme.id).toBe(DEFAULT_THEME.id);
  });

  it('themeToCSSVars convertit correctement une couleur hex en rgb', () => {
    const vars = themeToCSSVars(DEFAULT_THEME);
    expect(vars['--main-color-rgb']).toBe('0, 242, 255');
    expect(vars['--main-color']).toBe(DEFAULT_THEME.palette.primary);
  });
});
