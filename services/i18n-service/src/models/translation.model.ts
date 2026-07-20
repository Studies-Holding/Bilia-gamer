/**
 * Translation — cf. docs/modules/i18n-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Translation {
  id: string
  // localeCode, key, value
  createdAt: Date
  updatedAt: Date
}
