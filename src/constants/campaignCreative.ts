/** Platform campaign image specs (must match backend models). */
export const CAMPAIGN_ADVERT = {
  creativeType: 'inapp_advert',
  width: 1080,
  height: 1350,
  label: '1080 × 1350',
  aspectRatio: '1080 / 1350',
} as const

export const CAMPAIGN_PROMO_BANNER = {
  creativeType: 'promo_banner',
  width: 1920,
  height: 786,
  label: '1920 × 786',
  aspectRatio: '1920 / 786',
} as const

const FULLSCREEN_PLACEMENTS = new Set(['inapp_advert', 'modal', 'home_hero', 'promo_carousel'])

export function creativeSpecForPlacement(placement?: string) {
  const p = String(placement ?? '').trim().toLowerCase()
  if (FULLSCREEN_PLACEMENTS.has(p)) return { ...CAMPAIGN_ADVERT, isPortrait: true as const }
  return { ...CAMPAIGN_PROMO_BANNER, isPortrait: false as const }
}

export function campaignAspectRatio(campaign?: {
  creative_type?: string
  placement?: string
  image_width?: number
  image_height?: number
}) {
  if (campaign?.image_width && campaign?.image_height) {
    return `${campaign.image_width} / ${campaign.image_height}`
  }
  if (isInappAdvert(campaign)) return CAMPAIGN_ADVERT.aspectRatio
  return CAMPAIGN_PROMO_BANNER.aspectRatio
}

export function isInappAdvert(campaign?: { creative_type?: string; placement?: string }) {
  const p = campaign?.placement ?? ''
  return (
    campaign?.creative_type === CAMPAIGN_ADVERT.creativeType ||
    FULLSCREEN_PLACEMENTS.has(p)
  )
}

/** Form / docs helper text for upload size. */
export function imageUploadHint(placement?: string) {
  const spec = creativeSpecForPlacement(placement)
  if (spec.isPortrait) {
    return `Upload ${spec.label} px (4:5 portrait). Full-screen in-app adverts and web marketplace carousel.`
  }
  return `Upload ${spec.label} px (landscape banner). Same as promotion cover images.`
}
