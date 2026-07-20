/**
 * Scene — cf. docs/modules/studio-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Scene {
  id: string
  // projectId, type, order
  createdAt: Date
  updatedAt: Date
}
