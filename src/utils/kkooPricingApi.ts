import type { KkooPricingConfig } from '@/utils/kkooPricing'
import {
  DEFAULT_KKOO_PRICING,
  normalizeKkooPricingConfig,
} from '@/utils/kkooPricing'

export type KkooPricingApiResponse = {
  currency?: string
  seller?: {
    avg_order_tzs?: number
    platform_commission_percent?: number
  }
  rider?: {
    platform_commission_percent?: number
    base_fee_tzs?: number
    per_km_fee_tzs?: number
    avg_trip_distance_km?: number
    trips_per_day_min?: number
    trips_per_day_max?: number
    trip_earnings_tzs?: number
    weekly_earnings_min_tzs?: number
    weekly_earnings_max_tzs?: number
  }
  creator?: {
    share_commission_percent?: number
    avg_order_tzs?: number
  }
}

export function mapKkooPricingResponse(data: KkooPricingApiResponse): KkooPricingConfig {
  return normalizeKkooPricingConfig({
    currency: data.currency ?? DEFAULT_KKOO_PRICING.currency,
    seller: {
      avgOrderTzs: data.seller?.avg_order_tzs ?? DEFAULT_KKOO_PRICING.seller.avgOrderTzs,
      platformCommissionPercent:
        data.seller?.platform_commission_percent ??
        DEFAULT_KKOO_PRICING.seller.platformCommissionPercent,
    },
    rider: {
      platformCommissionPercent:
        data.rider?.platform_commission_percent ??
        DEFAULT_KKOO_PRICING.rider.platformCommissionPercent,
      baseFeeTzs: data.rider?.base_fee_tzs ?? DEFAULT_KKOO_PRICING.rider.baseFeeTzs,
      perKmFeeTzs: data.rider?.per_km_fee_tzs ?? DEFAULT_KKOO_PRICING.rider.perKmFeeTzs,
      avgTripDistanceKm:
        data.rider?.avg_trip_distance_km ?? DEFAULT_KKOO_PRICING.rider.avgTripDistanceKm,
      tripsPerDayMin: data.rider?.trips_per_day_min ?? DEFAULT_KKOO_PRICING.rider.tripsPerDayMin,
      tripsPerDayMax: data.rider?.trips_per_day_max ?? DEFAULT_KKOO_PRICING.rider.tripsPerDayMax,
      tripEarningsTzs: data.rider?.trip_earnings_tzs ?? DEFAULT_KKOO_PRICING.rider.tripEarningsTzs,
      weeklyEarningsMinTzs:
        data.rider?.weekly_earnings_min_tzs ?? DEFAULT_KKOO_PRICING.rider.weeklyEarningsMinTzs,
      weeklyEarningsMaxTzs:
        data.rider?.weekly_earnings_max_tzs ?? DEFAULT_KKOO_PRICING.rider.weeklyEarningsMaxTzs,
    },
    creator: {
      shareCommissionPercent:
        data.creator?.share_commission_percent ??
        DEFAULT_KKOO_PRICING.creator.shareCommissionPercent,
      avgOrderTzs: data.creator?.avg_order_tzs ?? DEFAULT_KKOO_PRICING.creator.avgOrderTzs,
    },
  })
}
