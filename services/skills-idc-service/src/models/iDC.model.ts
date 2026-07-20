/**
 * IDC — cf. docs/modules/skills-idc-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface IDC {
  id: string
  // profileId, skillId, level (1-5), source
  createdAt: Date
  updatedAt: Date
}
