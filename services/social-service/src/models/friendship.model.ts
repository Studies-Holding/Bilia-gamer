/**
 * Friendship — cf. docs/modules/social-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Friendship {
  id: string
  // profileIdA, profileIdB, status
  createdAt: Date
  updatedAt: Date
}
