// ================================================================
//  BILIA-V4 — services/auth-service/src/__tests__/profile.model.test.ts
//  Tests unitaires purs (aucune connexion Mongo requise).
// ================================================================
import { xpToLevel, xpToRank } from '../models/Profile';

describe('xpToLevel', () => {
  it('retourne le niveau 1 pour 0 XP', () => {
    expect(xpToLevel(0)).toBe(1);
  });

  it('augmente avec l\'XP selon une courbe racine carrée', () => {
    expect(xpToLevel(100)).toBe(2);
    expect(xpToLevel(400)).toBe(3);
    expect(xpToLevel(900)).toBe(4);
  });

  it('ne redescend jamais en dessous de 1', () => {
    expect(xpToLevel(-50)).toBeGreaterThanOrEqual(1);
  });
});

describe('xpToRank', () => {
  it.each([
    [0, 'Novice'],
    [499, 'Novice'],
    [500, 'Initié'],
    [1999, 'Initié'],
    [2000, 'Joueur'],
    [7999, 'Joueur'],
    [8000, 'Expert'],
    [19999, 'Expert'],
    [20000, 'Maître'],
    [49999, 'Maître'],
    [50000, 'Légendaire'],
  ])('attribue le rang correct pour %i XP', (xp, expected) => {
    expect(xpToRank(xp)).toBe(expected);
  });
});
