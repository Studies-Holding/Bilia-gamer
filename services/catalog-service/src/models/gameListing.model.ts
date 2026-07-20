/**
 * GameListing — cf. docs/modules/catalog-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface GameListing {
  id: string
  // gameId, price, currency, availability
  createdAt: Date
  updatedAt: Date
}
