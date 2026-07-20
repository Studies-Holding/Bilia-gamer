/**
 * Submission — cf. docs/modules/publishing-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Submission {
  id: string
  // gameId, creatorId, status, steps[]
  createdAt: Date
  updatedAt: Date
}
