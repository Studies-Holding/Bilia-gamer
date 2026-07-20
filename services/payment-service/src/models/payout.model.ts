/**
 * Payout — cf. docs/modules/payment-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Payout {
  id: string
  // creatorId, period, amount, status
  createdAt: Date
  updatedAt: Date
}
