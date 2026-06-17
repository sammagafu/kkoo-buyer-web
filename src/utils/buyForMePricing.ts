/** Earth's mean radius in metres — physical constant for haversine distance. */
const EARTH_RADIUS_M = 6371000

export type BuyForMePricingConfig = {
  freeRadiusMeters: number
  perKmSurchargeTzs: number
}

export const DEFAULT_BUY_FOR_ME_PRICING: BuyForMePricingConfig = {
  freeRadiusMeters: 2000,
  perKmSurchargeTzs: 500,
}

let activeConfig: BuyForMePricingConfig = { ...DEFAULT_BUY_FOR_ME_PRICING }

export function setBuyForMePricingConfig(cfg: Partial<BuyForMePricingConfig>) {
  activeConfig = {
    freeRadiusMeters: cfg.freeRadiusMeters ?? activeConfig.freeRadiusMeters,
    perKmSurchargeTzs: cfg.perKmSurchargeTzs ?? activeConfig.perKmSurchargeTzs,
  }
}

export function getBuyForMePricingConfig(): BuyForMePricingConfig {
  return { ...activeConfig }
}

function rad(deg: number) {
  return (deg * Math.PI) / 180
}

export function metersBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dLat = rad(lat2 - lat1)
  const dLng = rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2
  return Math.round(EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function distanceSurchargeTzs(
  distanceMeters: number,
  cfg: BuyForMePricingConfig = activeConfig,
) {
  if (distanceMeters <= cfg.freeRadiusMeters) return 0
  const extraKm = (distanceMeters - cfg.freeRadiusMeters) / 1000
  return Math.ceil(extraKm * cfg.perKmSurchargeTzs)
}

export function lineTotal(
  productPrice: number,
  distanceMeters: number,
  cfg: BuyForMePricingConfig = activeConfig,
) {
  return productPrice + distanceSurchargeTzs(distanceMeters, cfg)
}

export function formatDistanceLabel(meters: number) {
  if (meters < 1000) return `${meters} m away`
  return `${(meters / 1000).toFixed(1)} km away`
}

export function readSellerId(row: Record<string, unknown>) {
  const v = row.seller_id ?? row.user_id ?? row.id
  if (typeof v === 'number') return v
  if (typeof v === 'string') return Number(v) || null
  return null
}

export function readDistanceMeters(row: Record<string, unknown> | null | undefined) {
  if (!row) return null
  const d = row.distance_meters
  if (typeof d === 'number') return Math.round(d)
  if (typeof d === 'string') return Number(d) || null
  return null
}
