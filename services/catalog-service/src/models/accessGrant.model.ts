/**
 * AccessGrant — cf. docs/modules/catalog-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface AccessGrant {
  id: string
  // userId, gameId, grantedAt, source
  createdAt: Date
  updatedAt: Date
}
