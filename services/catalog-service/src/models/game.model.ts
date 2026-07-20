/**
 * Game — cf. docs/modules/catalog-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Game {
  id: string
  // creatorId, title, taxonomy[], idcId, status
  createdAt: Date
  updatedAt: Date
}
