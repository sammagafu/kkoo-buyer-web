import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { campaignsUserApi, type BuyerCampaign } from '@/api/campaigns'
import { resolveAssetUrl } from '@/utils/assetUrl'

const ROUTE_MAP: Record<string, RouteLocationRaw> = {
  '/marketplace': { name: 'buyer.marketplace' },
  '/rewards': { name: 'buyer.rewards' },
  '/weekly-pass': { name: 'buyer.weekly-pass' },
  '/gamification': { name: 'buyer.gamification' },
  '/wallet': { name: 'buyer.wallet' },
  '/favorites': { name: 'buyer.favorites' },
  '/checkout': { name: 'buyer.checkout' },
  '/eats': { name: 'buyer.eats' },
  '/grocery': { name: 'buyer.grocery' },
  '/ride': { name: 'buyer.ride' },
  '/send': { name: 'buyer.send' },
  '/settings': { name: 'buyer.settings' },
  '/flash-sales': { name: 'buyer.flash-sales' },
  'buyer.marketplace': { name: 'buyer.marketplace' },
  'buyer.rewards': { name: 'buyer.rewards' },
  'buyer.weekly-pass': { name: 'buyer.weekly-pass' },
  'buyer.gamification': { name: 'buyer.gamification' },
  'buyer.wallet': { name: 'buyer.wallet' },
  'buyer.favorites': { name: 'buyer.favorites' },
  'buyer.checkout': { name: 'buyer.checkout' },
  'buyer.flash-sales': { name: 'buyer.flash-sales' },
}

export function campaignImageUrl(campaign?: BuyerCampaign | null) {
  return resolveAssetUrl(campaign?.image_url) ?? ''
}

export function campaignCtaRoute(campaign?: BuyerCampaign | null): RouteLocationRaw | null {
  if (!campaign) return null
  const external = String(campaign.cta_external_url ?? '').trim()
  if (external) return external
  const raw = String(campaign.cta_route ?? '').trim()
  if (raw) {
    if (ROUTE_MAP[raw]) return ROUTE_MAP[raw]
    const flashMatch = raw.match(/^\/flash-sales\/([^/]+)\/?$/)
    if (flashMatch) return { name: 'buyer.flash-sale', params: { slug: flashMatch[1] } }
    if (raw.startsWith('/')) return raw
    if (raw.includes('.')) return { name: raw }
    return { path: raw.startsWith('/') ? raw : `/${raw}` }
  }
  const flashSlug = String(campaign.flash_sale_slug ?? '').trim()
  if (flashSlug) return { name: 'buyer.flash-sale', params: { slug: flashSlug } }
  const promoSlug = String(campaign.promotion_slug ?? '').trim()
  if (promoSlug) return { name: 'buyer.marketplace', query: { promo: promoSlug } }
  return null
}

export function useBuyerCampaigns() {
  const modalCampaign = ref<BuyerCampaign | null>(null)
  const carouselCampaigns = ref<BuyerCampaign[]>([])
  const loadingModal = ref(false)
  const loadingCarousel = ref(false)

  async function loadAdvertCampaign() {
    loadingModal.value = true
    try {
      const { data } = await campaignsUserApi.getActive({ placement: 'inapp_advert', channel: 'web_advert' })
      const results = data.results ?? []
      modalCampaign.value = results[0] ?? null
      if (modalCampaign.value?.id) {
        void campaignsUserApi.recordImpression(modalCampaign.value.id)
      }
    } catch {
      modalCampaign.value = null
    } finally {
      loadingModal.value = false
    }
  }

  async function loadCarouselCampaigns() {
    loadingCarousel.value = true
    try {
      const { data } = await campaignsUserApi.getActive({ placement: 'promo_carousel', channel: 'web_banner' })
      carouselCampaigns.value = data.results ?? []
      for (const camp of carouselCampaigns.value) {
        if (camp.id) void campaignsUserApi.recordImpression(camp.id)
      }
    } catch {
      carouselCampaigns.value = []
    } finally {
      loadingCarousel.value = false
    }
  }

  async function dismissModal() {
    const camp = modalCampaign.value
    modalCampaign.value = null
    if (camp?.id) {
      try {
        await campaignsUserApi.dismiss(camp.id)
      } catch {
        // ignore
      }
    }
  }

  async function dismissCarousel(camp: BuyerCampaign) {
    carouselCampaigns.value = carouselCampaigns.value.filter((c) => c.id !== camp.id)
    if (camp.id) {
      try {
        await campaignsUserApi.dismiss(camp.id)
      } catch {
        // ignore
      }
    }
  }

  return {
    modalCampaign,
    carouselCampaigns,
    loadingModal,
    loadingCarousel,
    loadModalCampaign: loadAdvertCampaign,
    loadAdvertCampaign,
    loadCarouselCampaigns,
    dismissModal,
    dismissCarousel,
    campaignImageUrl,
    campaignCtaRoute,
  }
}
