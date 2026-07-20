/**
 * SyncSnapshot — cf. docs/modules/realtime-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface SyncSnapshot {
  id: string
  // roomCode, seq, payload
  createdAt: Date
  updatedAt: Date
}
