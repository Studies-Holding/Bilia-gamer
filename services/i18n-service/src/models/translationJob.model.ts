/**
 * TranslationJob — cf. docs/modules/i18n-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface TranslationJob {
  id: string
  // gameId, targetLocale, status, source (communaute/IA)
  createdAt: Date
  updatedAt: Date
}
