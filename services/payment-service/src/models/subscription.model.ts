/**
 * Subscription — cf. docs/modules/payment-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Subscription {
  id: string
  // userId, plan, cycle, status
  createdAt: Date
  updatedAt: Date
}
