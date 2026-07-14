// ================================================================
//  BILIA-V4 — services/socket-service/src/__tests__/timeGuard.test.ts
//  Tests unitaires purs (aucune connexion Mongo/Socket.io requise).
// ================================================================
import { isCurfewActive } from '../utils/timeGuard';

describe('isCurfewActive', () => {
  it('détecte une plage simple dans la même journée (13:00 → 14:00)', () => {
    const now = new Date('2026-01-01T13:30:00');
    expect(isCurfewActive('13:00', '14:00', now)).toBe(true);
  });

  it('renvoie false en dehors de la plage simple', () => {
    const now = new Date('2026-01-01T15:00:00');
    expect(isCurfewActive('13:00', '14:00', now)).toBe(false);
  });

  it('gère une plage traversant minuit (21:00 → 07:00) — nuit', () => {
    const now = new Date('2026-01-01T23:00:00');
    expect(isCurfewActive('21:00', '07:00', now)).toBe(true);
  });

  it('gère une plage traversant minuit (21:00 → 07:00) — petit matin', () => {
    const now = new Date('2026-01-01T05:00:00');
    expect(isCurfewActive('21:00', '07:00', now)).toBe(true);
  });

  it('gère une plage traversant minuit — hors couvre-feu (journée)', () => {
    const now = new Date('2026-01-01T12:00:00');
    expect(isCurfewActive('21:00', '07:00', now)).toBe(false);
  });

  it('est inclusif sur l\'heure de début et exclusif sur la fin', () => {
    const start = new Date('2026-01-01T21:00:00');
    const end   = new Date('2026-01-01T07:00:00');
    expect(isCurfewActive('21:00', '07:00', start)).toBe(true);
    expect(isCurfewActive('21:00', '07:00', end)).toBe(false);
  });
});
