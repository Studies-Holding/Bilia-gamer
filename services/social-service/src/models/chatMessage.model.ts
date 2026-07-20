/**
 * ChatMessage — cf. docs/modules/social-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface ChatMessage {
  id: string
  // roomId, profileId, content, sentAt
  createdAt: Date
  updatedAt: Date
}
