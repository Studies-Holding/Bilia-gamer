/**
 * ParentalControl — cf. docs/modules/identity-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface ParentalControl {
  id: string
  // familyId, purchaseCapPerMonth, requireApprovalAbove
  createdAt: Date
  updatedAt: Date
}
