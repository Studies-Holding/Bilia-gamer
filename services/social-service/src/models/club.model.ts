/**
 * Club — cf. docs/modules/social-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Club {
  id: string
  // name, familyIds[]
  createdAt: Date
  updatedAt: Date
}
