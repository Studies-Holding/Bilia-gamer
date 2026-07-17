import { describe, expect, it, jest } from '@jest/globals'
import { createBiliaSdk } from '../src/index.js'

describe('createBiliaSdk', () => {
  it('expose les modules MVP (player/session/save/payment/notifications)', () => {
    const sdk = createBiliaSdk({ baseUrl: 'http://localhost:5000' })
    expect(sdk.player).toBeDefined()
    expect(sdk.session).toBeDefined()
    expect(sdk.save).toBeDefined()
    expect(sdk.payment).toBeDefined()
    expect(sdk.notifications).toBeDefined()
  })

  it('ajoute le Bearer token quand getAccessToken est fourni', async () => {
    const fetchMock = jest.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    global.fetch = fetchMock as unknown as typeof fetch

    const sdk = createBiliaSdk({ baseUrl: 'http://localhost:5000', getAccessToken: () => 'test-token' })
    await sdk.player.me()

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = new Headers(init.headers)
    expect(headers.get('Authorization')).toBe('Bearer test-token')
  })
})
