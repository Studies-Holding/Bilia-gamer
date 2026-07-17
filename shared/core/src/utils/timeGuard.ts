/**
 * timeGuard — logique pure du couvre-feu (cf. AFG-DT-000 §3.6, exemple type
 * de "logique métier pure extraite en modules purs"). Consommé par
 * `identity-service` (politique) et appliqué au runtime par `game-service` /
 * `realtime-service` (cf. AFG-DT-000 §6). Aucune dépendance I/O ici : testable
 * unitairement à 100%, indépendamment du fuseau horaire du serveur.
 */

/** Une fenêtre de couvre-feu, dans le fuseau horaire du profil. */
export interface CurfewWindow {
  /** 0 = dimanche ... 6 = samedi (comme Date#getDay). Absent = tous les jours. */
  days?: number[]
  /** Heure de début "HH:MM", incluse. */
  start: string
  /** Heure de fin "HH:MM", exclue. Peut être < start (fenêtre à cheval sur minuit). */
  end: string
}

export interface CurfewPolicy {
  enabled: boolean
  windows: CurfewWindow[]
}

function toMinutes(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function windowAppliesToDay(window: CurfewWindow, day: number): boolean {
  return !window.days || window.days.includes(day)
}

function isWithinWindow(window: CurfewWindow, minutesOfDay: number, day: number, previousDay: number): boolean {
  const start = toMinutes(window.start)
  const end = toMinutes(window.end)

  if (start <= end) {
    // Fenêtre normale (ex. 21:00 -> 23:59) : s'applique au jour courant.
    return windowAppliesToDay(window, day) && minutesOfDay >= start && minutesOfDay < end
  }

  // Fenêtre à cheval sur minuit (ex. 21:00 -> 07:00) :
  // - le jour où elle démarre, actif de `start` à minuit ;
  // - le lendemain, actif de minuit à `end`.
  const activeLateOnStartDay = windowAppliesToDay(window, previousDay) && minutesOfDay >= start
  const activeEarlyOnNextDay = windowAppliesToDay(window, day) && minutesOfDay < end
  return activeLateOnStartDay || activeEarlyOnNextDay
}

/**
 * Détermine si le couvre-feu est actif à l'instant `now`, selon `policy`.
 * `now` est interprété dans le fuseau horaire local du runtime appelant —
 * c'est à l'appelant de fournir un `Date` déjà projeté dans le fuseau du profil.
 */
export function isCurfewActive(policy: CurfewPolicy, now: Date = new Date()): boolean {
  if (!policy.enabled || policy.windows.length === 0) return false

  const day = now.getDay()
  const previousDay = (day + 6) % 7
  const minutesOfDay = now.getHours() * 60 + now.getMinutes()

  return policy.windows.some((window) => isWithinWindow(window, minutesOfDay, day, previousDay))
}
