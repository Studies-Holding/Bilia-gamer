/**
 * Family — cf. docs/modules/identity-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Family {
  id: string
  // ownerUserId, profileIds[], maxProfiles (7)
  createdAt: Date
  updatedAt: Date
}
