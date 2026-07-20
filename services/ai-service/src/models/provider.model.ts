/**
 * Provider — cf. docs/modules/ai-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Provider {
  id: string
  // name, kind (llm/reco/moderation), config
  createdAt: Date
  updatedAt: Date
}
