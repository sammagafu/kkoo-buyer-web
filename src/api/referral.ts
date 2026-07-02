/**
 * Referral & rewards – referral part (auth). API.md: code, apply, stats.
 */
import client from './client'

export type ReferralCodePayload = {
  code?: string
  share_url?: string
  share_text?: string
}

export type ReferralStatsPayload = ReferralCodePayload & {
  total_referrals?: number
  completed_referrals?: number
  rewarded_referrals?: number
  total_earnings?: number
}

export const referralApi = {
  getCode() {
    return client.get<ReferralCodePayload>('/users/referral/code/')
  },
  apply(code: string) {
    return client.post<{ message?: string }>('/users/referral/apply/', { code })
  },
  getStats() {
    return client.get<ReferralStatsPayload>('/users/referral/stats/')
  },
}
