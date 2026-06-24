import { describe, it, expect } from 'vitest'
import {
  adminDashboardUrl,
  bizCrmUrl,
  bizSellerAccountUrl,
  bizSellerDashboardUrl,
  bizSellerRegisterUrl,
  bizSignInUrl,
} from '@/config/landing-links'

describe('landing-links app URLs', () => {
  it('uses correct seller and admin paths', () => {
    expect(bizSellerDashboardUrl).toMatch(/\/seller\/?$/)
    expect(bizCrmUrl).toMatch(/\/seller\/crm\/?$/)
    expect(bizSellerRegisterUrl).toMatch(/\/join\/?$/)
    expect(bizSellerAccountUrl).toMatch(/\/account\/?$/)
    expect(bizSignInUrl).toMatch(/\/auth\/sign-in\/?$/)
    expect(adminDashboardUrl).toMatch(/\/dashboard\/?$/)
    expect(bizSellerDashboardUrl).not.toBe(bizSellerDashboardUrl.replace(/\/seller.*/, ''))
  })

  it('points at biz and admin hosts from env or runtime defaults', () => {
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    if (isLocal) {
      expect(bizSellerDashboardUrl).toMatch(/^https?:\/\/[^/]+:5174\/seller/)
      expect(adminDashboardUrl).toMatch(/^https?:\/\/[^/]+:5173\/dashboard/)
    } else {
      expect(bizSellerDashboardUrl).toMatch(/biz\.kkooapp\.co\.tz\/seller/)
      expect(adminDashboardUrl).toMatch(/admin\.kkooapp\.co\.tz\/dashboard/)
    }
  })
})
