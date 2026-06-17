import client from './client'
import type { PremiumAdminMetrics, PremiumAdminSettings, PremiumMembership } from '@/types/premium'

/** Buyer premium (auth). */
export const premiumUserApi = {
  listTiers() {
    return client.get('/premium/tiers/')
  },
  listBenefits() {
    return client.get('/premium/benefits/')
  },
  upgrade(data: { tier_id?: number; program?: string }) {
    return client.post('/premium/upgrade/', data)
  },
}

export const premiumAdminApi = {
  getSettings() {
    return client.get<PremiumAdminSettings>('/users/admin/premium/settings/')
  },
  updateSettings(data: PremiumAdminSettings) {
    return client.put<PremiumAdminSettings>('/users/admin/premium/settings/', data)
  },
  getMetrics() {
    return client.get<PremiumAdminMetrics>('/users/admin/premium/metrics/')
  },
  getMemberships(params?: {
    program?: string
    status?: string
    q?: string
  }) {
    return client.get<{ results: PremiumMembership[] }>('/users/admin/premium/memberships/', { params })
  },
}
