import { describe, it, expect } from 'vitest'
import { adminWebOrigin, bizWebOrigin, buyerWebOrigin } from '@/config/cross-app-links'

describe('cross-app-links origins', () => {
  it('resolves buyer, biz, and admin origins', () => {
    expect(buyerWebOrigin).toMatch(/^https?:\/\//)
    expect(bizWebOrigin).toMatch(/^https?:\/\//)
    expect(adminWebOrigin).toMatch(/^https?:\/\//)
  })

  it('uses local ports when running on localhost without env', () => {
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    if (!isLocal) return

    expect(buyerWebOrigin).toMatch(/:5175$/)
    expect(bizWebOrigin).toMatch(/:5174$/)
    expect(adminWebOrigin).toMatch(/:5173$/)
  })
})
