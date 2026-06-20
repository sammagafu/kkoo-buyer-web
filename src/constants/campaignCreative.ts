/** Platform campaign image specs (must match backend models). */
export const CAMPAIGN_ADVERT = {
  creativeType: 'inapp_advert',
  width: 1080,
  height: 1350,
  aspectRatio: '1080 / 1350',
} as const

export const CAMPAIGN_PROMO_BANNER = {
  creativeType: 'promo_banner',
  width: 1920,
  height: 786,
  aspectRatio: '1920 / 786',
} as const

export function campaignAspectRatio(campaign?: { creative_type?: string; image_width?: number; image_height?: number }) {
  if (campaign?.image_width && campaign?.image_height) {
    return `${campaign.image_width} / ${campaign.image_height}`
  }
  if (campaign?.creative_type === CAMPAIGN_ADVERT.creativeType) return CAMPAIGN_ADVERT.aspectRatio
  return CAMPAIGN_PROMO_BANNER.aspectRatio
}

export function isInappAdvert(campaign?: { creative_type?: string; placement?: string }) {
  const p = campaign?.placement ?? ''
  return campaign?.creative_type === CAMPAIGN_ADVERT.creativeType || p === 'inapp_advert' || p === 'modal'
}
