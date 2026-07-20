/**
 * TokenLedger — cf. docs/modules/wallet-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface TokenLedger {
  id: string
  // profileId, operationId, type, amount, refType, refId
  createdAt: Date
  updatedAt: Date
}
