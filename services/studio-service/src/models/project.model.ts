/**
 * Project — cf. docs/modules/studio-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Project {
  id: string
  // creatorId, level, scenes[], assets[]
  createdAt: Date
  updatedAt: Date
}
