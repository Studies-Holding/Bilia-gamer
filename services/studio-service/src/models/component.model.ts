/**
 * Component — cf. docs/modules/studio-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Component {
  id: string
  // kind, name, publishable
  createdAt: Date
  updatedAt: Date
}
