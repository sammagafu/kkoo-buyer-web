import client from './client'

/** Passenger ride request — Fiber: POST /logistics/passenger/rides/ */
export type RideRequestPayload = {
  pickup_address: string
  dropoff_address: string
  rider_notes?: string
  vehicle_type?: string
  payment_method?: string
  pickup_lat?: number
  pickup_lng?: number
  dropoff_lat?: number
  dropoff_lng?: number
}

export const ridesApi = {
  /** Quote before booking: GET /logistics/passenger/quote/ */
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
    return client.post<{ id?: number; message?: string }>(
      '/logistics/passenger/rides/',
      payload,
    )
  },
  listRides(params?: { status?: string }) {
    return client.get<{ results?: unknown[] } | unknown[]>('/logistics/passenger/rides/', { params })
  },
  getRide(id: number | string) {
    return client.get(`/logistics/passenger/rides/${id}/`)
  },
  cancelRide(id: number | string, data?: { reason?: string }) {
    return client.post(`/logistics/passenger/rides/${id}/cancel/`, data ?? {})
  },
  getRideTracking(id: number | string) {
    return client.get(`/logistics/passenger/rides/${id}/tracking/`)
  },
}
