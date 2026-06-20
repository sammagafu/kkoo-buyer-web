import client from './client'

/** Passenger ride request — Fiber: POST /logistics/passenger/rides/ */
export type RideRequestPayload = {
  pickup_address: string
  dropoff_address: string
  rider_notes?: string
  notes?: string
  vehicle_type?: string
  payment_method?: string
  pickup_lat?: number
  pickup_lng?: number
  dropoff_lat?: number
  dropoff_lng?: number
  pickup_map_place_id?: number
  dropoff_map_place_id?: number
  fare?: number
}

export const ridesApi = {
  getQuote(params: {
    pickup_lat: number
    pickup_lng: number
    dropoff_lat: number
    dropoff_lng: number
    vehicle_type?: string
    energy_type?: 'fuel' | 'gas' | 'ev'
  }) {
    return client.get('/logistics/passenger/quote/', { params })
  },
  requestRide(payload: RideRequestPayload) {
    const body = {
      pickup_address: payload.pickup_address,
      dropoff_address: payload.dropoff_address,
      pickup_lat: payload.pickup_lat,
      pickup_lng: payload.pickup_lng,
      dropoff_lat: payload.dropoff_lat,
      dropoff_lng: payload.dropoff_lng,
      pickup_map_place_id: payload.pickup_map_place_id,
      dropoff_map_place_id: payload.dropoff_map_place_id,
      vehicle_type: payload.vehicle_type,
      notes: payload.notes ?? payload.rider_notes,
      fare: payload.fare,
    }
    return client.post<{ id?: number; message?: string }>(
      '/logistics/passenger/rides/',
      body,
    )
  },
  listRides(params?: { status?: string }) {
    return client.get<{ results?: unknown[] } | unknown[]>('/logistics/passenger/rides/', { params })
  },
  getRide(id: number | string) {
    return client.get(`/logistics/passenger/rides/${id}/`)
  },
  cancelRide(id: number | string, data?: { cancel_reason?: string; reason?: string }) {
    return client.post(`/logistics/passenger/rides/${id}/cancel/`, {
      cancel_reason: data?.cancel_reason ?? data?.reason ?? 'Cancelled by passenger',
    })
  },
  getRideTracking(id: number | string) {
    return client.get(`/logistics/passenger/rides/${id}/tracking/`)
  },
}
