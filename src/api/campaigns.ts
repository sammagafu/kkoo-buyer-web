/**
 * Platform campaigns for buyer web — Fiber §32
 */
import client from './client'

export type BuyerCampaign = {
  id: number
  title: string
  subtitle?: string
  image_url?: string
  placement?: string
  delivery_channels?: string
  gift_voucher_id?: number
  gift_label?: string
  flash_sale_id?: number
  flash_sale_slug?: string
  flash_sale_name?: string
  promotion_id?: number
  promotion_slug?: string
  promotion_name?: string
  cta_label?: string
  cta_route?: string
  cta_external_url?: string
  creative_type?: 'inapp_advert' | 'promo_banner' | string
  image_width?: number
  image_height?: number
  priority?: number
  start_at?: string
  end_at?: string
  target_app_key?: string
}

export const campaignsUserApi = {
  getActive(params: { placement: string; app?: string; channel?: string }) {
    return client.get<{ results: BuyerCampaign[]; placement: string }>('/campaigns/active/', {
      params: { app: 'marketplace', ...params },
    })
  },
  recordImpression(id: number) {
    return client.post(`/campaigns/${id}/impression/`)
  },
  dismiss(id: number) {
    return client.post(`/campaigns/${id}/dismiss/`)
  },
}

export const campaignsAdminApi = {
  list() {
    return client.get<{ results: unknown[] }>('/admin/campaigns/')
  },
  create(data: Record<string, unknown>) {
    return client.post('/admin/campaigns/', data)
  },
  patch(id: number, data: Record<string, unknown>) {
    return client.patch(`/admin/campaigns/${id}/`, data)
  },
  delete(id: number) {
    return client.delete(`/admin/campaigns/${id}/`)
  },
}

export type AppCampaignPayload = {
  id?: number
  title: string
  subtitle?: string
  image_url?: string
  placement?: string
  cta_label?: string
  cta_route?: string
  cta_external_url?: string
  priority?: number
  start_at: string
  end_at: string
  target_app_key?: string
  max_impressions_per_user?: number
  cooldown_hours?: number
  is_active?: boolean
}
