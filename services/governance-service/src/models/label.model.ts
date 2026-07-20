/**
 * Label — cf. docs/modules/governance-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Label {
  id: string
  // type, criteria, gameId (inclut 7 badges AFG)
  createdAt: Date
  updatedAt: Date
}
