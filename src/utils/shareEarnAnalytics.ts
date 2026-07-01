export type ShareEarnStats = {
  total_referrals?: number
  completed_referrals?: number
  rewarded_referrals?: number
  total_earnings?: number
}

export type ShareEarningsPayload = {
  units_sold?: number
  commission_pending?: number
  commission_paid?: number
  sales?: ShareSaleRow[]
}

export type ShareSaleRow = {
  id?: number
  created_at?: string
  quantity?: number
  amount?: number
  commission_percent?: number
  commission_amount?: number
  status?: string
  order_id?: number
}

export type RewardTransactionRow = {
  id?: number
  created_at?: string
  transaction_type?: string
  amount?: number
  is_credit?: boolean
  description?: string
}

export type ShareEarnOffers = {
  earn?: {
    referral?: { referrer_bonus?: number; referred_bonus?: number }
    share?: { share_purchase_bonus?: number; share_commission_percent?: number }
  }
}

export type ShareEarnSummary = {
  referralPoints: number
  referralCount: number
  completedReferrals: number
  referralConversionPct: number | null
  shareCommissionPending: number
  shareCommissionPaid: number
  shareUnitsSold: number
  recommendationPoints: number
  totalCommissionTzs: number
}

export type MonthlyEarningBucket = {
  month: string
  referralPoints: number
  shareCommission: number
  recommendationPoints: number
}

const SHARE_TX_TYPES = new Set(['share_bonus', 'share_purchase_bonus', 'share_purchase'])

function monthKey(value: string | undefined) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function isRecommendationTx(tx: RewardTransactionRow) {
  const type = String(tx.transaction_type ?? '').toLowerCase()
  if (SHARE_TX_TYPES.has(type)) return true
  const desc = String(tx.description ?? '').toLowerCase()
  return desc.includes('share') && type !== 'referral_bonus'
}

function isReferralTx(tx: RewardTransactionRow) {
  return String(tx.transaction_type ?? '').toLowerCase() === 'referral_bonus'
}

export function computeShareEarnSummary(
  stats: ShareEarnStats | null | undefined,
  earnings: ShareEarningsPayload | null | undefined,
  transactions: RewardTransactionRow[] | null | undefined,
): ShareEarnSummary {
  const referralCount = Number(stats?.total_referrals ?? 0)
  const completedReferrals = Number(stats?.completed_referrals ?? 0)
  const referralPoints = Number(stats?.total_earnings ?? 0)
  const shareCommissionPending = Number(earnings?.commission_pending ?? 0)
  const shareCommissionPaid = Number(earnings?.commission_paid ?? 0)
  const shareUnitsSold = Number(earnings?.units_sold ?? 0)

  let recommendationPoints = 0
  for (const tx of transactions ?? []) {
    if (!tx.is_credit) continue
    if (isRecommendationTx(tx)) recommendationPoints += Number(tx.amount ?? 0)
  }

  const referralConversionPct =
    referralCount > 0 ? Math.round((completedReferrals / referralCount) * 100) : null

  return {
    referralPoints,
    referralCount,
    completedReferrals,
    referralConversionPct,
    shareCommissionPending,
    shareCommissionPaid,
    shareUnitsSold,
    recommendationPoints,
    totalCommissionTzs: shareCommissionPending + shareCommissionPaid,
  }
}

export function groupShareEarnByMonth(
  sales: ShareSaleRow[] | null | undefined,
  transactions: RewardTransactionRow[] | null | undefined,
  months = 6,
): MonthlyEarningBucket[] {
  const now = new Date()
  const buckets = new Map<string, MonthlyEarningBucket>()

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets.set(key, {
      month: key,
      referralPoints: 0,
      shareCommission: 0,
      recommendationPoints: 0,
    })
  }

  for (const sale of sales ?? []) {
    const key = monthKey(sale.created_at)
    const bucket = buckets.get(key)
    if (!bucket) continue
    bucket.shareCommission += Number(sale.commission_amount ?? 0)
  }

  for (const tx of transactions ?? []) {
    if (!tx.is_credit) continue
    const key = monthKey(tx.created_at)
    const bucket = buckets.get(key)
    if (!bucket) continue
    if (isReferralTx(tx)) bucket.referralPoints += Number(tx.amount ?? 0)
    else if (isRecommendationTx(tx)) bucket.recommendationPoints += Number(tx.amount ?? 0)
  }

  return [...buckets.values()]
}

export function shareEarnActivityRows(
  sales: ShareSaleRow[] | null | undefined,
  transactions: RewardTransactionRow[] | null | undefined,
) {
  type Row = {
    id: string
    at: string
    channel: 'referral' | 'share' | 'recommendation'
    label: string
    amount: number
    unit: 'pts' | 'tzs'
    status?: string
  }

  const rows: Row[] = []

  for (const sale of sales ?? []) {
    rows.push({
      id: `sale-${sale.id ?? sale.order_id ?? rows.length}`,
      at: String(sale.created_at ?? ''),
      channel: 'share',
      label: `Order #${sale.order_id ?? '—'}`,
      amount: Number(sale.commission_amount ?? 0),
      unit: 'tzs',
      status: sale.status,
    })
  }

  for (const tx of transactions ?? []) {
    if (!tx.is_credit) continue
    const type = String(tx.transaction_type ?? '')
    let channel: Row['channel'] | null = null
    if (isReferralTx(tx)) channel = 'referral'
    else if (isRecommendationTx(tx)) channel = 'recommendation'
    if (!channel) continue
    rows.push({
      id: `tx-${tx.id ?? rows.length}`,
      at: String(tx.created_at ?? ''),
      channel,
      label: tx.description || type,
      amount: Number(tx.amount ?? 0),
      unit: 'pts',
    })
  }

  return rows.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
}
