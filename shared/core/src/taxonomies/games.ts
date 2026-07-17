/**
 * Taxonomie des jeux — source de vérité (cf. AFG-001 ch.14, AFG-DT-002 mapping
 * Couche 14). Amorce Lot 0 ; à enrichir avec `catalog-service` (Lot 2).
 */
export const GAME_CATEGORIES = [
  'quiz-culture',
  'calcul-mental',
  'cartes',
  'plateau-strategie',
  'action-sport',
  'famille',
  'educatif',
] as const

export type GameCategory = (typeof GAME_CATEGORIES)[number]

export const GAME_MODES = ['solo', 'duo', 'multi-local', 'multi-en-ligne'] as const
export type GameMode = (typeof GAME_MODES)[number]
