// ================================================================
//  BILIA-V4 — services/core-service/src/controllers/themesController.ts
// ================================================================
import { Request, Response } from 'express';
import { THEMES_REGISTRY, getTheme, themeToCSSVars } from '../../../../shared/config/themes.config';

// GET /api/themes
export function getAllThemes(_req: Request, res: Response): void {
  res.json({ success: true, data: THEMES_REGISTRY });
}

// GET /api/themes/:id
export function getThemeById(req: Request, res: Response): void {
  const theme = getTheme(req.params.id);
  res.json({ success: true, data: theme });
}

// GET /api/themes/:id/css-vars
export function getThemeCssVars(req: Request, res: Response): void {
  const theme = getTheme(req.params.id);
  const vars  = themeToCSSVars(theme);
  res.json({ success: true, data: vars });
}
