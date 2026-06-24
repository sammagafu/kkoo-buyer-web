import { describe, it, expect } from 'vitest'
import { isPublicAppPath, isPublicMarketingRouteName } from '@/constants/publicRoutes'

describe('publicRoutes', () => {
  it('treats landing and marketing paths as public', () => {
    expect(isPublicAppPath('/')).toBe(true)
    expect(isPublicAppPath('/discover')).toBe(true)
    expect(isPublicAppPath('/business')).toBe(true)
    expect(isPublicAppPath('/merchant')).toBe(true)
    expect(isPublicAppPath('/seller')).toBe(true)
    expect(isPublicAppPath('/join')).toBe(true)
    expect(isPublicAppPath('/privacy-policy')).toBe(true)
    expect(isPublicMarketingRouteName('pages.landing')).toBe(true)
    expect(isPublicMarketingRouteName('pages.discover')).toBe(true)
  })

  it('does not treat buyer shopping paths as public', () => {
    expect(isPublicAppPath('/marketplace')).toBe(false)
    expect(isPublicAppPath('/checkout')).toBe(false)
    expect(isPublicMarketingRouteName('buyer.marketplace')).toBe(false)
  })
})
