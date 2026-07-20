/**
 * LudicPassport — cf. docs/modules/analytics-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface LudicPassport {
  id: string
  // profileId, skillsSummary, history[]
  createdAt: Date
  updatedAt: Date
}
