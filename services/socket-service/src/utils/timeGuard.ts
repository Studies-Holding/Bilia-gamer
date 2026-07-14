// ================================================================
//  BILIA-V4 — services/socket-service/src/utils/timeGuard.ts
//  Logique pure (sans I/O) extraite d'index.ts pour être testable
//  unitairement sans dépendre de Mongo/Socket.io.
// ================================================================

/**
 * Détermine si l'heure actuelle tombe dans une plage de couvre-feu.
 * Gère le cas où la plage traverse minuit (ex: 21:00 → 07:00).
 *
 * @param start - Heure de début "HH:mm"
 * @param end   - Heure de fin "HH:mm"
 * @param now   - Date de référence (par défaut: maintenant)
 */
export function isCurfewActive(start: string, end: string, now = new Date()): boolean {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  const s   = sh * 60 + sm;
  const e   = eh * 60 + em;
  return s < e ? cur >= s && cur < e : cur >= s || cur < e;
}
