import client from './client'

export type BuyForMeItemPayload = {
  description: string
  title?: string
  quantity?: number
  preferred_details?: string
  source?: string
  expected_price?: number
}

export type BuyForMeCreatePayload = {
  title: string
  shopping_area: string
  budget_amount?: number
  delivery_address: string
  delivery_lat?: number
  delivery_lng?: number
  preferred_contact_phone?: string
  notes?: string
  items: BuyForMeItemPayload[]
}

export type BuyForMeRequest = {
  id?: number
  title?: string
  status?: string
  shopping_area?: string
  budget_amount?: number
  delivery_address?: string
  current_offer_amount?: number
  created_at?: string
}

export const buyForMeApi = {
  getPricing() {
    return client.get<{
      free_radius_meters?: number
      per_km_surcharge_tzs?: number
      currency?: string
    }>('/buy-for-me/pricing/')
  },
  create(payload: BuyForMeCreatePayload) {
    return client.post<{ id?: number; request?: BuyForMeRequest }>('/buy-for-me/', payload)
  },
  list() {
    return client.get<{ results?: BuyForMeRequest[] } | BuyForMeRequest[]>('/buy-for-me/')
  },
  get(id: number | string) {
    return client.get<BuyForMeRequest>(`/buy-for-me/${id}/`)
  },
  approve(id: number | string) {
    return client.post(`/buy-for-me/${id}/approve/`)
  },
  hold(id: number | string) {
    return client.post(`/buy-for-me/${id}/hold/`)
  },
}
