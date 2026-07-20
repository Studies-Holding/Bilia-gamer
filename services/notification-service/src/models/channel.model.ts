/**
 * Channel — cf. docs/modules/notification-service.md §3 (entites/modeles).
 * Contrat de donnees (Mongoose a cabler en Lot de construction correspondant, AFG-DT-003).
 */
export interface Channel {
  id: string
  // type (in-app/push/email/sms), config
  createdAt: Date
  updatedAt: Date
}
