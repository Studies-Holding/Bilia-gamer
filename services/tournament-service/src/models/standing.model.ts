/**
 * Standing — cf. docs/modules/tournament-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Standing {
  id: string
  // tournamentId, profileId, rank, points
  createdAt: Date
  updatedAt: Date
}
