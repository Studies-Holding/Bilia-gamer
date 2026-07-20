/**
 * Leaderboard — cf. docs/modules/game-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Leaderboard {
  id: string
  // gameId, entries[]
  createdAt: Date
  updatedAt: Date
}
