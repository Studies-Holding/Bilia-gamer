/**
 * Prompt — cf. docs/modules/ai-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Prompt {
  id: string
  // templateId, context, variables
  createdAt: Date
  updatedAt: Date
}
