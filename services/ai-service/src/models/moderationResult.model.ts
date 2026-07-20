/**
 * ModerationResult — cf. docs/modules/ai-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface ModerationResult {
  id: string
  // targetType, targetId, verdict, confidence
  createdAt: Date
  updatedAt: Date
}
