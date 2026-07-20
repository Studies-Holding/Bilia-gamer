/**
 * Story — cf. docs/modules/griot-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Story {
  id: string
  // culture, title, narration, audioRef
  createdAt: Date
  updatedAt: Date
}
