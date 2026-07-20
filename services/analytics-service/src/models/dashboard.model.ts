/**
 * Dashboard — cf. docs/modules/analytics-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Dashboard {
  id: string
  // ownerId, ownerType (joueur/famille/createur), widgets[]
  createdAt: Date
  updatedAt: Date
}
