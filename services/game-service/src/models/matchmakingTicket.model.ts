/**
 * MatchmakingTicket — cf. docs/modules/game-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface MatchmakingTicket {
  id: string
  // profileId, criteria, status
  createdAt: Date
  updatedAt: Date
}
