import heroImage from '@/assets/landing/hero.jpg'
import shopImage from '@/assets/landing/services/shop.jpg'
import foodImage from '@/assets/landing/services/food.jpg'
import rideImage from '@/assets/landing/services/ride.jpg'
import catImage from '@/assets/landing/cat.jpg'
import groceriesImage from '@/assets/images/landing/services/groceries.jpg'
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
  titleKey: string
  descKey: string
  altKey: string
  wide?: boolean
  to?: RouteLocationRaw
}

export const premiumHeroImage = heroImage

export const premiumStats: PremiumStat[] = [
  { key: 'users', value: '50K+', labelKey: 'landing.premium.statUsers', icon: 'solar:users-group-rounded-bold' },
  { key: 'sellers', value: '10K+', labelKey: 'landing.heroStatSellersLabel' },
  { key: 'services', value: '20+', labelKey: 'landing.premium.statServices' },
  { key: 'orders', value: '1M+', labelKey: 'landing.heroStatOrdersLabel' },
]

export const premiumRegionCards: PremiumRegionCard[] = [
  {
    key: 'buyers',
    image: foodImage,
    labelKey: 'landing.sisyphus.regionBuyersLabel',
    altKey: 'landing.sisyphus.regionBuyersAlt',
    icon: 'solar:bag-smile-bold',
    link: { kind: 'pillar', pillar: 'buy' },
  },
  {
    key: 'sellers',
    image: shopImage,
    labelKey: 'landing.sisyphus.regionSellersLabel',
    altKey: 'landing.sisyphus.regionSellersAlt',
    icon: 'solar:shop-2-bold',
    link: { kind: 'anchor', sectionId: 'sell-section' },
  },
  {
    key: 'riders',
    image: rideImage,
    labelKey: 'landing.sisyphus.regionRidersLabel',
    altKey: 'landing.sisyphus.regionRidersAlt',
    icon: 'solar:scooter-bold',
    link: { kind: 'anchor', sectionId: 'ride-partners' },
  },
  {
    key: 'business',
    image: heroImage,
    labelKey: 'landing.sisyphus.regionBusinessLabel',
    altKey: 'landing.sisyphus.regionBusinessAlt',
    icon: 'solar:chart-2-bold',
    link: { kind: 'route', to: buyerRoutes.business },
  },
]

const consumerItems = superAppServiceGroups.consumer.flatMap((g) => g.items)

export const premiumServiceCards: PremiumServiceCard[] = consumerItems.slice(0, 6).map((item) => ({
  key: item.key,
  icon: item.icon,
  labelKey: item.labelKey,
  descKey: item.descKey,
  to: item.to,
  href: item.href,
}))

export const premiumFeaturedServiceIndex = 1

export const premiumShowcaseItems: PremiumShowcaseItem[] = [
  {
    key: 'market',
    wide: true,
    image: shopImage,
    titleKey: 'landing.navMarketplace',
    descKey: 'landing.superApp.marketplaceDesc',
    altKey: 'landing.navMarketplace',
    to: buyerRoutes.marketplace,
  },
  {
    key: 'eats',
    image: foodImage,
    titleKey: 'landing.navEats',
    descKey: 'landing.superApp.eatsDesc',
    altKey: 'landing.navEats',
    to: buyerRoutes.eats,
  },
  {
    key: 'grocery',
    image: groceriesImage,
    titleKey: 'landing.navGrocery',
    descKey: 'landing.superApp.groceryDesc',
    altKey: 'landing.navGrocery',
    to: buyerRoutes.grocery,
  },
  {
    key: 'community',
    image: catImage,
    titleKey: 'landing.navCommunity',
    descKey: 'landing.superApp.communityDesc',
    altKey: 'landing.navCommunity',
    to: buyerRoutes.community,
  },
]

// Legacy exports
export const premiumHeroMockupImage = heroImage
export const premiumFeatures = [] as const
export const premiumTrustKeys = [] as const
export const premiumAccentCycle = ['food', 'grocery', 'ride', 'shop', 'purple', 'teal'] as const
export const premiumSteps = [] as const
export const premiumPreviewSlides = [] as const
