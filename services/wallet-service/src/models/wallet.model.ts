/**
 * Wallet — cf. docs/modules/wallet-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Wallet {
  id: string
  // profileId, familyId, balance, tokenBalance
  createdAt: Date
  updatedAt: Date
}
