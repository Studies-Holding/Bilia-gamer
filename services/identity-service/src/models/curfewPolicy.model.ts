/**
 * CurfewPolicy — cf. docs/modules/identity-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface CurfewPolicy {
  id: string
  // profileId, allowedWindows[], timezone
  createdAt: Date
  updatedAt: Date
}
