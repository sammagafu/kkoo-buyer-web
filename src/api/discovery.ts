import client from './client'

export const discoveryApi = {
  nearby(params: { lat: number; lng: number; radius_km?: number }) {
    return client.get<{
      restaurants?: Record<string, unknown>[]
      hotels?: Record<string, unknown>[]
      grocery_stores?: Record<string, unknown>[]
    }>('/discover/nearby/', { params })
  },
  hotelsNearby(params: { lat: number; lng: number }) {
    return client.get<{ results: Record<string, unknown>[] }>('/discover/hotels/nearby/', { params })
  },
}
