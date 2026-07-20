/**
 * Collection — cf. docs/modules/catalog-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Collection {
  id: string
  // title, gameIds[], curated
  createdAt: Date
  updatedAt: Date
}
