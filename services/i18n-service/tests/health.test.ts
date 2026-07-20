import { describe, expect, it } from '@jest/globals'
import request from 'supertest'
import { createApp } from '../src/app.js'

describe('GET /health', () => {
  it('répond 200 avec le statut ok', async () => {
    const res = await request(createApp()).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', service: 'i18n-service' })
  })
})
