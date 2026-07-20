/**
 * Order — cf. docs/modules/payment-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Order {
  id: string
  // idempotencyKey, userId, lines[], status
  createdAt: Date
  updatedAt: Date
}
