/**
 * AssetRef — cf. docs/modules/studio-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface AssetRef {
  id: string
  // projectId, assetId, source (bibliotheque/marketplace)
  createdAt: Date
  updatedAt: Date
}
