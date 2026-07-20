/**
 * Achievement — cf. docs/modules/game-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Achievement {
  id: string
  // profileId, gameId, badgeCode, unlockedAt
  createdAt: Date
  updatedAt: Date
}
