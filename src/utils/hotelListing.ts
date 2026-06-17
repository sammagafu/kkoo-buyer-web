import type { HotelListItem } from '@/api/superApp'

export type HotelRow = HotelListItem & Record<string, unknown>

const DAR_LAT = -6.8172
const DAR_LNG = 39.2833

export function hotelId(row: HotelRow): number | null {
  const v = row.seller_id ?? row.user_id ?? row.id
  if (typeof v === 'number') return v
  if (typeof v === 'string') return Number.parseInt(v, 10) || null
  return null
}

export function hotelName(row: HotelRow): string {
  return String(row.business_name || 'Stay')
}

export function hotelAddress(row: HotelRow): string {
  return String(row.business_address || '')
}

export function hotelLatitude(row: HotelRow): number | null {
  const v = row.business_latitude
  if (typeof v === 'number' && Number.isFinite(v)) return v
  return null
}

export function hotelLongitude(row: HotelRow): number | null {
  const v = row.business_longitude
  if (typeof v === 'number' && Number.isFinite(v)) return v
  return null
}

export function hotelHasCoordinates(row: HotelRow): boolean {
  return hotelLatitude(row) != null && hotelLongitude(row) != null
}

export function hotelDistanceMeters(row: HotelRow): number | null {
  const v = row.distance_meters
  if (typeof v === 'number') return v
  return null
}

export function formatHotelDistance(meters: number | null | undefined): string {
  if (meters == null || meters <= 0) return ''
  if (meters < 1000) return `${meters} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function mergeHotelCatalog(catalog: HotelRow[], nearby: HotelRow[]): HotelRow[] {
  const byId = new Map<number, HotelRow>()
  for (const row of catalog) {
    const id = hotelId(row)
    if (id == null) continue
    byId.set(id, { ...row, seller_id: id, user_id: id })
  }
  for (const row of nearby) {
    const id = hotelId(row)
    if (id == null) continue
    const existing = byId.get(id)
    if (existing) {
      byId.set(id, {
        ...existing,
        ...(row.distance_meters != null ? { distance_meters: row.distance_meters } : {}),
        ...(row.average_rating != null ? { average_rating: row.average_rating } : {}),
        ...(row.open_now === true ? { open_now: true } : {}),
        ...(hotelLatitude(row) != null ? { business_latitude: hotelLatitude(row)! } : {}),
        ...(hotelLongitude(row) != null ? { business_longitude: hotelLongitude(row)! } : {}),
      })
    } else {
      byId.set(id, {
        ...row,
        seller_id: id,
        user_id: id,
        store_slug: String(row.store_slug || `store-${id}`),
      })
    }
  }
  return [...byId.values()].sort((a, b) => {
    const ao = a.open_now === true ? 0 : 1
    const bo = b.open_now === true ? 0 : 1
    if (ao !== bo) return ao - bo
    const ad = hotelDistanceMeters(a) ?? 999999
    const bd = hotelDistanceMeters(b) ?? 999999
    return ad - bd
  })
}

export function demoHotelsWithCoords(): HotelRow[] {
  return [
    {
      business_name: 'Harbor View Suites',
      business_address: 'Oceanfront · City center',
      seller_id: -1,
      menu_slug: 'harbor-view',
      business_latitude: -6.816,
      business_longitude: 39.28,
    },
    {
      business_name: 'Serengeti Stay',
      business_address: 'Safari-inspired rooms',
      seller_id: -2,
      menu_slug: 'serengeti-stay',
      business_latitude: -6.7924,
      business_longitude: 39.2083,
    },
    {
      business_name: 'Urban Loft',
      business_address: 'Boutique · Fast Wi‑Fi',
      seller_id: -3,
      menu_slug: 'urban-loft',
      business_latitude: -6.823,
      business_longitude: 39.269,
    },
  ]
}

export function defaultMapCenter(): { lat: number; lng: number } {
  return { lat: DAR_LAT, lng: DAR_LNG }
}

export function mapBounds(hotels: HotelRow[]): { north: number; south: number; east: number; west: number } | null {
  const mapped = hotels.filter(hotelHasCoordinates)
  if (!mapped.length) return null
  let north = -90
  let south = 90
  let east = -180
  let west = 180
  for (const row of mapped) {
    const lat = hotelLatitude(row)!
    const lng = hotelLongitude(row)!
    north = Math.max(north, lat)
    south = Math.min(south, lat)
    east = Math.max(east, lng)
    west = Math.min(west, lng)
  }
  return { north, south, east, west }
}

export function pinPosition(
  row: HotelRow,
  bounds: { north: number; south: number; east: number; west: number },
): { left: string; top: string } {
  const lat = hotelLatitude(row) ?? bounds.north
  const lng = hotelLongitude(row) ?? bounds.east
  const latSpan = bounds.north - bounds.south || 0.01
  const lngSpan = bounds.east - bounds.west || 0.01
  const topPct = ((bounds.north - lat) / latSpan) * 100
  const leftPct = ((lng - bounds.west) / lngSpan) * 100
  return {
    left: `${Math.min(96, Math.max(4, leftPct))}%`,
    top: `${Math.min(96, Math.max(4, topPct))}%`,
  }
}
