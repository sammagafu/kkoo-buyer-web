import client from './client'
import { resolveApiBaseUrl } from '@/utils/apiBaseUrl'

export type SmartCartItem = {
  id: number
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
}

export type SmartCartSession = {
  id: number
  token: string
  status: string
  business_id: number
  business_name?: string
  subtotal: number
  currency_code: string
  items: SmartCartItem[]
  checkout_url: string
  checkout_expires_at?: string
  paid_at?: string
  invoice_id?: number
}

export async function getPublicSmartCart(token: string): Promise<SmartCartSession> {
  return client.get(`/smart-cart/${encodeURIComponent(token)}/`).then((r) => r.data)
}

export async function paySmartCart(
  token: string,
  data: { payment_method: string; redirect_url?: string; cancel_url?: string }
): Promise<{
  status?: string
  invoice_id?: number
  amount?: number
  message?: string
  payment_gateway_url?: string
  payment_ref?: string
  simulated?: boolean
}> {
  return client.post(`/users/smart-cart/${encodeURIComponent(token)}/pay/`, data).then((r) => r.data)
}

export function smartCartStreamUrl(token: string): string {
  const base = resolveApiBaseUrl().replace(/\/$/, '')
  return `${base}/smart-cart/${encodeURIComponent(token)}/stream/`
}
