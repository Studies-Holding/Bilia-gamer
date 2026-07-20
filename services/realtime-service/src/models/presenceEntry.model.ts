/**
 * PresenceEntry — cf. docs/modules/realtime-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface PresenceEntry {
  id: string
  // profileId, roomCode, connectedAt
  createdAt: Date
  updatedAt: Date
}
