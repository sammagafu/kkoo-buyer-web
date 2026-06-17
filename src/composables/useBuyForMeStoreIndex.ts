import { ref } from 'vue'
import { discoveryApi } from '@/api/discovery'
import { superAppApi } from '@/api/superApp'
import { metersBetween, readDistanceMeters, readSellerId } from '@/utils/buyForMePricing'

export type StoreRow = Record<string, unknown>

const storeIndex = ref<Map<number, StoreRow>>(new Map())
const loading = ref(false)

function ingest(target: Map<number, StoreRow>, rows: StoreRow[], defaultType: string) {
  for (const raw of rows) {
    const sid = readSellerId(raw)
    if (!sid || sid <= 0) continue
    const row = { ...raw, seller_type: raw.seller_type ?? defaultType }
    const existing = target.get(sid)
    if (!existing) {
      target.set(sid, row)
      continue
    }
    const existingDist = readDistanceMeters(existing) ?? Number.MAX_SAFE_INTEGER
    const newDist = readDistanceMeters(row) ?? Number.MAX_SAFE_INTEGER
    if (newDist < existingDist) target.set(sid, row)
  }
}

export function useBuyForMeStoreIndex() {
  async function load(lat: number, lng: number) {
    loading.value = true
    const index = new Map<number, StoreRow>()
    try {
      const { data } = await discoveryApi.nearby({ lat, lng })
      ingest(index, (data?.restaurants ?? []) as StoreRow[], 'restaurant')
      ingest(index, (data?.hotels ?? []) as StoreRow[], 'hotel')
      ingest(index, (data?.grocery_stores ?? []) as StoreRow[], 'grocery')
    } catch {
      // ignore
    }
    try {
      const { data } = await superAppApi.getGroceryStores({ limit: 40 })
      ingest(index, (data?.results ?? []) as StoreRow[], 'grocery')
    } catch {
      // ignore
    }
    try {
      const { data } = await superAppApi.getRestaurants({ limit: 40 })
      ingest(index, (data?.results ?? []) as StoreRow[], 'restaurant')
    } catch {
      // ignore
    }
    storeIndex.value = index
    return index
  }

  function distanceForSeller(sellerId: number, deliveryLat: number, deliveryLng: number) {
    const store = storeIndex.value.get(sellerId)
    const fromApi = readDistanceMeters(store)
    if (fromApi != null) return fromApi
    const lat = store?.business_latitude
    const lng = store?.business_longitude
    if (typeof lat === 'number' && typeof lng === 'number') {
      return metersBetween(deliveryLat, deliveryLng, lat, lng)
    }
    return 5000
  }

  function storeNameForSeller(sellerId: number) {
    const store = storeIndex.value.get(sellerId)
    return String(store?.business_name ?? `Store #${sellerId}`)
  }

  function storeSlugForSeller(sellerId: number) {
    const store = storeIndex.value.get(sellerId)
    const slug = store?.menu_slug ?? store?.slug
    return slug ? String(slug) : undefined
  }

  return {
    storeIndex,
    loading,
    load,
    distanceForSeller,
    storeNameForSeller,
    storeSlugForSeller,
  }
}
