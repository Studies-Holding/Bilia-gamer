import { useCallback, useEffect, useState } from 'react'

/**
 * Hook générique de persistance locale (préférences UI non sensibles :
 * thème choisi, langue, dernière salle rejointe...). Ne jamais y stocker de
 * token d'auth ou de donnée personnelle — cf. `identity-service` pour ça.
 * Compatible offline-first (apps/pwa-child) : lecture/écriture synchrone,
 * pas d'appel réseau.
 */
export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Stockage indisponible (quota, navigation privée...) : on ignore silencieusement.
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset] as const
}
