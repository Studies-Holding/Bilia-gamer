/**
 * Recommendation — cf. docs/modules/skills-idc-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Recommendation {
  id: string
  // profileId, gameId, score, criteria
  createdAt: Date
  updatedAt: Date
}
