import { describe, expect, it } from '@jest/globals'
import { createLogger } from '../src/logger/logger.js'

describe('createLogger', () => {
  it('crée un logger Winston avec le service en meta par défaut', () => {
    const logger = createLogger({ serviceName: 'test-service' })
    expect(logger.defaultMeta).toEqual({ serviceName: 'test-service' })
  })

  it('utilise le niveau explicite si fourni', () => {
    const logger = createLogger({ serviceName: 'test-service', level: 'warn' })
    expect(logger.level).toBe('warn')
  })
})
