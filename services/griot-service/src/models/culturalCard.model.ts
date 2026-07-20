/**
 * CulturalCard — cf. docs/modules/griot-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface CulturalCard {
  id: string
  // gameId, country, culture, content
  createdAt: Date
  updatedAt: Date
}
