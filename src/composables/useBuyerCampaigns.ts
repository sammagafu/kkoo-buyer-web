import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { campaignsUserApi, type BuyerCampaign } from '@/api/campaigns'
import { useAuthStore } from '@/stores/auth'
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
  if (!campaign) return ''
  const direct = resolveAssetUrl(campaign.image_url)
  if (direct) return direct
  const productImage = resolveAssetUrl(campaign.product_image)
  if (productImage) return productImage
  const firstCover = campaign.products?.find((p) => p.cover_image)?.cover_image
  return resolveAssetUrl(firstCover) ?? ''
}

export function campaignProductThumbs(campaign?: BuyerCampaign | null) {
  if (!campaign?.products?.length) return []
  return campaign.products
    .map((p) => ({
      id: p.id,
      title: p.title || '',
      slug: p.slug || '',
      image: resolveAssetUrl(p.cover_image) ?? '',
    }))
    .filter((p) => p.id && p.image)
    .slice(0, 6)
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
    const productSlug = raw.match(/^\/product\/s\/([^/?#]+)\/?$/)
    if (productSlug) return { name: 'buyer.product.slug', params: { slug: productSlug[1] } }
    const productId = raw.match(/^\/product\/(\d+)\/?$/)
    if (productId) return { name: 'buyer.product', params: { id: productId[1] } }
    if (raw.startsWith('/')) return raw
    if (raw.includes('.')) return { name: raw }
    return { path: raw.startsWith('/') ? raw : `/${raw}` }
  }
  const productSlug = String(campaign.product_slug ?? '').trim()
  if (productSlug) return { name: 'buyer.product.slug', params: { slug: productSlug } }
  if (campaign.product_id) return { name: 'buyer.product', params: { id: String(campaign.product_id) } }
  const flashSlug = String(campaign.flash_sale_slug ?? '').trim()
  if (flashSlug) return { name: 'buyer.flash-sale', params: { slug: flashSlug } }
  const promoSlug = String(campaign.promotion_slug ?? '').trim()
  if (promoSlug) return { name: 'buyer.marketplace', query: { promo: promoSlug } }
  return null
}

function dedupeCampaigns(rows: BuyerCampaign[]) {
  const seenIds = new Set<number>()
  const seenKeys = new Set<string>()
  return rows.filter((c) => {
    if (!c?.id || seenIds.has(c.id)) return false
    seenIds.add(c.id)
    const key = [c.action_type || '', c.product_id || '', c.cta_route || '', c.title || ''].join('|')
    if (seenKeys.has(key)) return false
    seenKeys.add(key)
    return true
  })
}

export function useBuyerCampaigns() {
  const auth = useAuthStore()
  const modalCampaign = ref<BuyerCampaign | null>(null)
  const carouselCampaigns = ref<BuyerCampaign[]>([])
  /** Landscape strip below hero (`promo_banner`, 1920×786). */
  const stripCampaigns = ref<BuyerCampaign[]>([])
  const loadingModal = ref(false)
  const loadingCarousel = ref(false)
  const loadingStrip = ref(false)

  function trackImpression(id?: number) {
    // Impression/dismiss need JWT; posting as a guest forces a sign-in redirect.
    if (!id || !auth.isAuthenticated) return
    void campaignsUserApi.recordImpression(id).catch(() => {})
  }

  async function loadAdvertCampaign() {
    loadingModal.value = true
    try {
      const { data } = await campaignsUserApi.getActive({ placement: 'inapp_advert', channel: 'web_advert' })
      const results = data.results ?? []
      modalCampaign.value = results[0] ?? null
      trackImpression(modalCampaign.value?.id)
    } catch {
      modalCampaign.value = null
    } finally {
      loadingModal.value = false
    }
  }

  async function loadCarouselCampaigns() {
    loadingCarousel.value = true
    try {
      // Full-screen marketplace carousel: home_hero + promo_carousel (1080×1350).
      const [hero, carousel] = await Promise.all([
        campaignsUserApi.getActive({ placement: 'home_hero', channel: 'web_banner' }).catch(() => ({ data: { results: [] as BuyerCampaign[] } })),
        campaignsUserApi.getActive({ placement: 'promo_carousel', channel: 'web_banner' }).catch(() => ({ data: { results: [] as BuyerCampaign[] } })),
      ])
      carouselCampaigns.value = dedupeCampaigns([
        ...(hero.data.results ?? []),
        ...(carousel.data.results ?? []),
      ])
      for (const camp of carouselCampaigns.value) {
        trackImpression(camp.id)
      }
    } catch {
      carouselCampaigns.value = []
    } finally {
      loadingCarousel.value = false
    }
  }

  async function loadStripCampaigns() {
    loadingStrip.value = true
    try {
      const { data } = await campaignsUserApi.getActive({
        placement: 'promo_banner',
        channel: 'web_banner',
      })
      stripCampaigns.value = dedupeCampaigns(data.results ?? [])
      for (const camp of stripCampaigns.value) {
        trackImpression(camp.id)
      }
    } catch {
      stripCampaigns.value = []
    } finally {
      loadingStrip.value = false
    }
  }

  /** Load full-screen carousel + landscape strip under hero. */
  async function loadHomeCampaigns() {
    await Promise.all([loadCarouselCampaigns(), loadStripCampaigns()])
  }

  async function dismissModal() {
    const camp = modalCampaign.value
    modalCampaign.value = null
    if (camp?.id && auth.isAuthenticated) {
      try {
        await campaignsUserApi.dismiss(camp.id)
      } catch {
        // ignore
      }
    }
  }

  async function dismissCampaign(camp: BuyerCampaign) {
    if (camp.id && auth.isAuthenticated) {
      try {
        await campaignsUserApi.dismiss(camp.id)
      } catch {
        // ignore
      }
    }
  }

  async function dismissCarousel(camp: BuyerCampaign) {
    carouselCampaigns.value = carouselCampaigns.value.filter((c) => c.id !== camp.id)
    await dismissCampaign(camp)
  }

  async function dismissStrip(camp: BuyerCampaign) {
    stripCampaigns.value = stripCampaigns.value.filter((c) => c.id !== camp.id)
    await dismissCampaign(camp)
  }

  return {
    modalCampaign,
    carouselCampaigns,
    stripCampaigns,
    loadingModal,
    loadingCarousel,
    loadingStrip,
    loadModalCampaign: loadAdvertCampaign,
    loadAdvertCampaign,
    loadCarouselCampaigns,
    loadStripCampaigns,
    loadHomeCampaigns,
    dismissModal,
    dismissCarousel,
    dismissStrip,
    campaignImageUrl,
    campaignProductThumbs,
    campaignCtaRoute,
  }
}
