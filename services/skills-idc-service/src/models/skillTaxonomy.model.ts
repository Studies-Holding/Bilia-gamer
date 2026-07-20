/**
 * SkillTaxonomy — cf. docs/modules/skills-idc-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface SkillTaxonomy {
  id: string
  // families[] (6 familles), skills[]
  createdAt: Date
  updatedAt: Date
}
