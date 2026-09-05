import { describe, expect, it } from 'vitest'
import {
  computeShareEarnSummary,
  groupShareEarnByMonth,
  shareEarnActivityRows,
} from './shareEarnAnalytics'

describe('shareEarnAnalytics', () => {
  it('aggregates referral, share, and recommendation earnings', () => {
    const summary = computeShareEarnSummary(
      { total_referrals: 4, completed_referrals: 2, total_earnings: 150 },
      { units_sold: 3, commission_pending: 5000, commission_paid: 12000 },
      [
        { transaction_type: 'referral_bonus', amount: 50, is_credit: true, created_at: '2026-06-01' },
        { transaction_type: 'share_purchase_bonus', amount: 100, is_credit: true, created_at: '2026-06-02' },
      ],
    )
    expect(summary.referralPoints).toBe(150)
    expect(summary.referralConversionPct).toBe(50)
    expect(summary.totalCommissionTzs).toBe(17000)
    expect(summary.recommendationPoints).toBe(100)
  })

  it('groups monthly buckets for the last six months', () => {
    const now = new Date()
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const day = `${key}-15`
    const buckets = groupShareEarnByMonth(
      [{ created_at: day, commission_amount: 2500 }],
      [{ transaction_type: 'referral_bonus', amount: 50, is_credit: true, created_at: `${key}-10` }],
      3,
    )
    expect(buckets).toHaveLength(3)
    const current = buckets.find((b) => b.month === key)
    expect(current?.shareCommission).toBe(2500)
    expect(current?.referralPoints).toBe(50)
  })

  it('merges sales and reward transactions into activity feed', () => {
    const rows = shareEarnActivityRows(
      [{ id: 1, order_id: 99, commission_amount: 800, status: 'paid', created_at: '2026-06-20' }],
      [{ id: 2, transaction_type: 'referral_bonus', amount: 50, is_credit: true, description: 'Bonus', created_at: '2026-06-21' }],
    )
    expect(rows).toHaveLength(2)
    expect(rows[0].channel).toBe('referral')
    expect(rows[1].channel).toBe('share')
  })
})
