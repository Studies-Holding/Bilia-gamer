/**
 * Template — cf. docs/modules/notification-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Template {
  id: string
  // code, locale, content
  createdAt: Date
  updatedAt: Date
}
