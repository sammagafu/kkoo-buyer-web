/**
 * Sharing (auth except land). API.md: create share, land by ref, earnings.
 */
import client from './client'

export const sharesApi = {
  create(body: {
    product_id?: number
    product_slug?: string
    to?: string
    deliver?: boolean
  }) {
    return client.post<{
      id?: number
      code?: string
      product_id?: number
      land_url?: string
      share_url?: string
      share_text?: string
      whatsapp_share_url?: string
      facebook_share_url?: string
      whatsapp_ready?: boolean
      delivered?: boolean
      delivered_to?: string
      deliver_error?: string
    }>('/shares/', body)
  },
  sendWhatsAppCTA(body: {
    product_id?: number
    product_slug?: string
    to: string
    message?: string
    button_text?: string
    share_code?: string
  }) {
    return client.post<{
      ok?: boolean
      to?: string
      product_id?: number
      button_url?: string
      button_text?: string
      error?: string
    }>('/shares/whatsapp-cta/', body)
  },
  land(ref: string) {
    return client.get<{ share_code?: string; product?: unknown }>('/shares/land/', { params: { ref } })
  },
  getEarnings() {
    return client.get<{ units_sold?: number; commission_pending?: number; commission_paid?: number; sales?: unknown[] }>('/shares/earnings/')
  },
}
