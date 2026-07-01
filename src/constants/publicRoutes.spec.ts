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
    expect(isPublicAppPath('/data-deletion')).toBe(true)
    expect(isPublicMarketingRouteName('pages.landing')).toBe(true)
    expect(isPublicMarketingRouteName('pages.discover')).toBe(true)
  })

  it('treats buyer browse paths as public for guest access', () => {
    expect(isPublicAppPath('/marketplace')).toBe(true)
    expect(isPublicAppPath('/search')).toBe(true)
    expect(isPublicAppPath('/eats')).toBe(true)
    expect(isPublicAppPath('/checkout')).toBe(true)
    expect(isPublicAppPath('/product/42')).toBe(true)
    expect(isPublicMarketingRouteName('buyer.marketplace')).toBe(false)
  })

  it('still requires sign-in for account-only buyer paths', () => {
    expect(isPublicAppPath('/orders')).toBe(false)
    expect(isPublicAppPath('/profile')).toBe(false)
    expect(isPublicAppPath('/wallet')).toBe(false)
  })
})
