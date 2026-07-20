/**
 * Template — cf. docs/modules/studio-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Template {
  id: string
  // name, category, projectSeed
  createdAt: Date
  updatedAt: Date
}
