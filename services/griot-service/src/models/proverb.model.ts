/**
 * Proverb — cf. docs/modules/griot-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Proverb {
  id: string
  // culture, text, translation
  createdAt: Date
  updatedAt: Date
}
