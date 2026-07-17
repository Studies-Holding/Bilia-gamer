import { describe, expect, it } from '@jest/globals'
import { isCurfewActive, type CurfewPolicy } from '../src/utils/timeGuard.js'

function at(hour: number, minute: number, day: number): Date {
  // 2026-07 : dimanche 05, lundi 06, ... — day = getDay() voulu.
  const base = new Date(2026, 6, 5 + day, hour, minute)
  return base
}

describe('isCurfewActive', () => {
  it('retourne false si la politique est désactivée', () => {
    const policy: CurfewPolicy = { enabled: false, windows: [{ start: '21:00', end: '23:00' }] }
    expect(isCurfewActive(policy, at(22, 0, 1))).toBe(false)
  })

  it('détecte une fenêtre simple (même jour)', () => {
    const policy: CurfewPolicy = { enabled: true, windows: [{ start: '21:00', end: '23:00' }] }
    expect(isCurfewActive(policy, at(22, 0, 1))).toBe(true)
    expect(isCurfewActive(policy, at(20, 59, 1))).toBe(false)
    expect(isCurfewActive(policy, at(23, 0, 1))).toBe(false)
  })

  it('détecte une fenêtre à cheval sur minuit', () => {
    const policy: CurfewPolicy = { enabled: true, windows: [{ start: '21:00', end: '07:00' }] }
    expect(isCurfewActive(policy, at(23, 30, 1))).toBe(true) // même soir
    expect(isCurfewActive(policy, at(6, 30, 2))).toBe(true) // lendemain matin
    expect(isCurfewActive(policy, at(10, 0, 2))).toBe(false)
  })

  it('respecte la restriction par jour', () => {
    const weekendOnly: CurfewPolicy = { enabled: true, windows: [{ days: [0, 6], start: '20:00', end: '23:00' }] }
    expect(isCurfewActive(weekendOnly, at(21, 0, 0))).toBe(true) // dimanche
    expect(isCurfewActive(weekendOnly, at(21, 0, 1))).toBe(false) // lundi
  })
})
