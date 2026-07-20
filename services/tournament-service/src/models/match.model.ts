/**
 * Match — cf. docs/modules/tournament-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Match {
  id: string
  // tournamentId, sessionId (delegue a game)
  createdAt: Date
  updatedAt: Date
}
