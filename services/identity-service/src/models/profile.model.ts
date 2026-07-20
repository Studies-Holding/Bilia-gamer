/**
 * Profile — cf. docs/modules/identity-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Profile {
  id: string
  // familyId, displayName, birthYear, role, preferences
  createdAt: Date
  updatedAt: Date
}
