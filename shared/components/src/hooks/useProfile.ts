/**
 * Stub — le vrai contexte profil viendra de `bilia-sdk` (module `player`,
 * cf. modules/shared-and-sdk.md §B) une fois `identity-service` disponible
 * (Lot 1). Signature posée ici pour que les apps puissent déjà typer contre
 * elle sans dépendre du SDK avant qu'il existe.
 */
export interface Profile {
  id: string
  displayName: string
  avatarUrl?: string
  locale: string
}

export function useProfile(): { profile: Profile | null; loading: boolean } {
  return { profile: null, loading: false }
}
