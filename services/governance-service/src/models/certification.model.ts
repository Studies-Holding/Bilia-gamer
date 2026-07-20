/**
 * Certification — cf. docs/modules/governance-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Certification {
  id: string
  // creatorId, level, evidence[]
  createdAt: Date
  updatedAt: Date
}
