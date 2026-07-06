export type KkooPricingConfig = {
  currency: string
  seller: {
    avgOrderTzs: number
    platformCommissionPercent: number
  }
  rider: {
    platformCommissionPercent: number
    baseFeeTzs: number
    perKmFeeTzs: number
    avgTripDistanceKm: number
    tripsPerDayMin: number
    tripsPerDayMax: number
    tripEarningsTzs: number
    weeklyEarningsMinTzs: number
    weeklyEarningsMaxTzs: number
  }
  creator: {
    shareCommissionPercent: number
    avgOrderTzs: number
  }
}

export const DEFAULT_KKOO_PRICING: KkooPricingConfig = {
  currency: 'TZS',
  seller: {
    avgOrderTzs: 45000,
    platformCommissionPercent: 2,
  },
  rider: {
    platformCommissionPercent: 20,
    baseFeeTzs: 3500,
    perKmFeeTzs: 850,
    avgTripDistanceKm: 5,
    tripsPerDayMin: 4,
    tripsPerDayMax: 10,
    tripEarningsTzs: 6200,
    weeklyEarningsMinTzs: 173600,
    weeklyEarningsMaxTzs: 434000,
  },
  creator: {
    shareCommissionPercent: 5,
    avgOrderTzs: 45000,
  },
}

export function normalizeKkooPricingConfig(
  partial: Partial<KkooPricingConfig> & {
    seller?: Partial<KkooPricingConfig['seller']>
    rider?: Partial<KkooPricingConfig['rider']>
    creator?: Partial<KkooPricingConfig['creator']>
  },
): KkooPricingConfig {
  const seller = { ...DEFAULT_KKOO_PRICING.seller, ...partial.seller }
  const rider = { ...DEFAULT_KKOO_PRICING.rider, ...partial.rider }
  const creator = { ...DEFAULT_KKOO_PRICING.creator, ...partial.creator }
  return {
    currency: partial.currency ?? DEFAULT_KKOO_PRICING.currency,
    seller,
    rider: {
      ...rider,
      tripEarningsTzs: estimateRiderTripEarnings(rider),
      weeklyEarningsMinTzs: estimateRiderWeeklyEarnings(rider.tripsPerDayMin, rider),
      weeklyEarningsMaxTzs: estimateRiderWeeklyEarnings(rider.tripsPerDayMax, rider),
    },
    creator,
  }
}

export function sellerKeepRate(platformCommissionPercent: number) {
  return Math.max(0, (100 - platformCommissionPercent) / 100)
}

export function estimateSellerMonthlyEarnings(ordersPerMonth: number, config: KkooPricingConfig) {
  if (ordersPerMonth <= 0) return 0
  return Math.round(
    ordersPerMonth * config.seller.avgOrderTzs * sellerKeepRate(config.seller.platformCommissionPercent),
  )
}

export function estimateRiderTripGross(rider: KkooPricingConfig['rider']) {
  return rider.baseFeeTzs + rider.perKmFeeTzs * rider.avgTripDistanceKm
}

export function estimateRiderTripEarnings(rider: KkooPricingConfig['rider']) {
  return Math.round(estimateRiderTripGross(rider) * sellerKeepRate(rider.platformCommissionPercent))
}

export function estimateRiderWeeklyEarnings(tripsPerDay: number, config: KkooPricingConfig) {
  if (tripsPerDay <= 0) return 0
  return Math.round(estimateRiderTripEarnings(config.rider) * tripsPerDay * 7)
}

export function estimateCreatorOrderCommission(orders: number, config: KkooPricingConfig) {
  if (orders <= 0) return 0
  return Math.round(
    orders * config.creator.avgOrderTzs * (config.creator.shareCommissionPercent / 100),
  )
}

export function formatCompactTzs(amount: number, currency = 'TZS') {
  const abs = Math.abs(amount)
  if (abs >= 1_000_000) {
    const value = amount / 1_000_000
    const digits = value >= 10 ? 0 : 1
    return `${currency} ${value.toFixed(digits).replace(/\.0$/, '')}M`
  }
  if (abs >= 1_000) {
    const value = amount / 1_000
    const digits = value >= 100 ? 0 : value >= 10 ? 0 : 1
    return `${currency} ${value.toFixed(digits).replace(/\.0$/, '')}K`
  }
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompactTzsRange(min: number, max: number, currency = 'TZS') {
  const minLabel = formatCompactTzs(min, currency).replace(`${currency} `, '')
  const maxLabel = formatCompactTzs(max, currency).replace(`${currency} `, '')
  return `${minLabel}–${maxLabel}`
}

export function formatTzs(amount: number, currency = 'TZS') {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function setKkooPricingConfig(config: KkooPricingConfig) {
  activeConfig = normalizeKkooPricingConfig(config)
}

export function getKkooPricingConfig() {
  return { ...activeConfig }
}

let activeConfig: KkooPricingConfig = { ...DEFAULT_KKOO_PRICING }
