/**
 * IPClaim — cf. docs/modules/governance-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface IPClaim {
  id: string
  // gameId, claimantId, status
  createdAt: Date
  updatedAt: Date
}
