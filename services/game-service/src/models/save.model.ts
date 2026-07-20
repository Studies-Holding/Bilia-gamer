/**
 * Save — cf. docs/modules/game-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Save {
  id: string
  // profileId, gameId, state, updatedAt
  createdAt: Date
  updatedAt: Date
}
