/**
 * PlaythroughStat — cf. docs/modules/analytics-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface PlaythroughStat {
  id: string
  // profileId, gameId, sessionId, metrics
  createdAt: Date
  updatedAt: Date
}
