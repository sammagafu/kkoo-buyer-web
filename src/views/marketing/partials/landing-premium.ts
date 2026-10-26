import { landingSrc } from '@/config/landing-images'
import type { RouteLocationRaw } from 'vue-router'
import { buyerRoutes } from '@/config/landing-links'
import type { SuperAppPillarId } from '@/config/landing-superapp'
import { superAppServiceGroups } from '@/config/landing-superapp'

export type PremiumStat = {
  key: string
  value: string
  labelKey: string
  icon?: string
}

export type PremiumRegionCardLink =
  | { kind: 'pillar'; pillar: SuperAppPillarId }
  | { kind: 'anchor'; sectionId: string }
  | { kind: 'route'; to: RouteLocationRaw }

export type PremiumRegionCard = {
  key: string
  image: string
  labelKey: string
  altKey: string
  icon: string
  link: PremiumRegionCardLink
  main?: boolean
}

export type PremiumServiceCard = {
  key: string
  icon: string
  labelKey: string
  descKey: string
  to?: RouteLocationRaw
  href?: string
}

export type PremiumShowcaseItem = {
  key: string
  image: string
  icon: string
  titleKey: string
  descKey: string
  altKey: string
  to?: RouteLocationRaw
}

const showcaseImages: Record<string, string> = {
  eats: landingSrc('food'),
  grocery: landingSrc('groceries'),
  marketplace: landingSrc('shop'),
  send: landingSrc('send'),
  ride: landingSrc('ride'),
  courier: landingSrc('ride'),
  restaurants: landingSrc('food'),
  hotels: landingSrc('hotels'),
  booking: landingSrc('hotels'),
  vouchers: landingSrc('shop'),
  'share-earn': landingSrc('hero'),
  community: landingSrc('cat'),
}

export const premiumShowcaseItems: PremiumShowcaseItem[] = superAppServiceGroups.consumer
  .flatMap((g) => g.items)
  .filter((item): item is typeof item & { to: RouteLocationRaw } => Boolean(item.to))
  .map((item) => ({
    key: item.key,
    icon: item.icon,
    image: showcaseImages[item.key] ?? landingSrc('hero'),
    titleKey: item.labelKey,
    descKey: item.descKey,
    altKey: item.labelKey,
    to: item.to,
  }))

export const premiumHeroImage = landingSrc('hero')

export const premiumStats: PremiumStat[] = [
  { key: 'users', value: '50K+', labelKey: 'landing.premium.statUsers', icon: 'solar:users-group-rounded-bold' },
  { key: 'sellers', value: '10K+', labelKey: 'landing.heroStatSellersLabel' },
  { key: 'services', value: '20+', labelKey: 'landing.premium.statServices' },
  { key: 'orders', value: '1M+', labelKey: 'landing.heroStatOrdersLabel' },
]

export const premiumRegionCards: PremiumRegionCard[] = [
  {
    key: 'buyers',
    image: landingSrc('food'),
    labelKey: 'landing.sisyphus.regionBuyersLabel',
    altKey: 'landing.sisyphus.regionBuyersAlt',
    icon: 'solar:bag-smile-bold',
    link: { kind: 'pillar', pillar: 'buy' },
  },
  {
    key: 'sellers',
    image: landingSrc('shop'),
    labelKey: 'landing.sisyphus.regionSellersLabel',
    altKey: 'landing.sisyphus.regionSellersAlt',
    icon: 'solar:shop-2-bold',
    link: { kind: 'anchor', sectionId: 'sell-section' },
  },
  {
    key: 'riders',
    image: landingSrc('ride'),
    labelKey: 'landing.sisyphus.regionRidersLabel',
    altKey: 'landing.sisyphus.regionRidersAlt',
    icon: 'solar:scooter-bold',
    link: { kind: 'anchor', sectionId: 'ride-partners' },
  },
  {
    key: 'business',
    image: landingSrc('hero'),
    labelKey: 'landing.sisyphus.regionBusinessLabel',
    altKey: 'landing.sisyphus.regionBusinessAlt',
    icon: 'solar:chart-2-bold',
    link: { kind: 'route', to: buyerRoutes.business },
  },
]

export const premiumServiceCards: PremiumServiceCard[] = superAppServiceGroups.consumer
  .flatMap((g) => g.items)
  .slice(0, 6)
  .map((item) => ({
  key: item.key,
  icon: item.icon,
  labelKey: item.labelKey,
  descKey: item.descKey,
  to: item.to,
  href: item.href,
}))

export const premiumFeaturedServiceIndex = 1

// Legacy exports
export const premiumHeroMockupImage = landingSrc('hero')
export const premiumFeatures = [] as const
export const premiumTrustKeys = [] as const
export const premiumAccentCycle = ['food', 'grocery', 'ride', 'shop', 'purple', 'teal'] as const
export const premiumSteps = [] as const
export const premiumPreviewSlides = [] as const
