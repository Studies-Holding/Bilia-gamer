/**
 * PaymentIntent — cf. docs/modules/payment-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface PaymentIntent {
  id: string
  // orderId, provider, status
  createdAt: Date
  updatedAt: Date
}
