/**
 * CashbackRule — cf. docs/modules/wallet-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface CashbackRule {
  id: string
  // percentage, cap, activeFrom, activeTo
  createdAt: Date
  updatedAt: Date
}
