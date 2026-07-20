/**
 * Types de domaine partagés / DTO transverses. Volontairement minimal au
 * Lot 0 : chaque service ajoutera ses propres types métier ; ce fichier ne
 * porte que ce qui est réellement inter-services.
 */

export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}



export interface AgeRange {
  min: number
  max?: number
}

/** Identifiants inter-services (référence par id, jamais par jointure — ADR-02). */
export type UserId = string
export type ProfileId = string
export type FamilyId = string
export type GameId = string
export type CreatorId = string
