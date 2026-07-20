/**
 * Rule — cf. docs/modules/studio-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Rule {
  id: string
  // projectId, condition, action
  createdAt: Date
  updatedAt: Date
}
