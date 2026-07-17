/**
 * Référentiel des compétences (IDC) — 6 familles (cf. AFG-001 ch.15-16,
 * AFG-DT-002 mapping Couche 5/15-16). Amorce Lot 0 ; source de vérité réelle
 * portée par `skills-idc-service` (Lot 5).
 */
export const SKILL_FAMILIES = [
  'cognitives',
  'motrices',
  'sociales-emotionnelles',
  'culturelles',
  'linguistiques',
  'numeriques',
] as const

export type SkillFamily = (typeof SKILL_FAMILIES)[number]

/** Niveaux IDC (cf. AFG-DT-000 §2) : 1 déclaration → 5 IA. */
export const IDC_LEVELS = [1, 2, 3, 4, 5] as const
export type IdcLevel = (typeof IDC_LEVELS)[number]
