import type { RouteLocationRaw } from 'vue-router'
import { bizSellerRegisterUrl, buyerRoutes } from '@/config/landing-links'
import type { SuperAppPillarId } from '@/config/landing-superapp'
import heroImage from '@/assets/landing/hero.jpg'
import foodImage from '@/assets/landing/services/food.jpg'
import shopImage from '@/assets/landing/services/shop.jpg'
import rideImage from '@/assets/landing/services/ride.jpg'
import sendImage from '@/assets/landing/services/Untitled-2.jpg'
import communityImage from '@/assets/landing/cat.jpg'

/** KKOO brand palette — purple, gold, ink only */
const KKOO_BRAND = {
  purple: '#5d318e',
  purpleDark: '#3f1f66',
  purpleLight: '#9b6fd4',
  gold: '#f7a828',
  goldDeep: '#e8941a',
} as const

const pillarTintCycle: Record<SuperAppPillarId, string[]> = {
  eat: [KKOO_BRAND.gold, KKOO_BRAND.goldDeep, KKOO_BRAND.gold, KKOO_BRAND.goldDeep],
  buy: [KKOO_BRAND.purple, KKOO_BRAND.purpleLight, KKOO_BRAND.purple, KKOO_BRAND.purpleLight, KKOO_BRAND.gold],
  go: [KKOO_BRAND.purpleDark, KKOO_BRAND.purple, KKOO_BRAND.purpleDark],
  sell: [KKOO_BRAND.purple, KKOO_BRAND.purpleDark, KKOO_BRAND.gold],
}

const pillarTintIndex: Record<SuperAppPillarId, number> = { eat: 0, buy: 0, go: 0, sell: 0 }

function brandTint(pillar: SuperAppPillarId): string {
  const cycle = pillarTintCycle[pillar]
  const i = pillarTintIndex[pillar] % cycle.length
  pillarTintIndex[pillar] += 1
  return cycle[i]
}

export type HeroShowcaseSlide = {
  key: string
  layout?: 'download' | 'vertical'
  pillar: SuperAppPillarId
  image: string
  tint: string
  wordLeftKey: string
  wordRightKey: string
  brandKey: string
  descKey: string
  ctaKey: string
  tabLabelKey: string
  chipLabelKey: string
  altKey: string
  to?: RouteLocationRaw
  href?: string
}

/** Every major KKOO vertical — one hero slide each. */
export const premiumHeroSlides: HeroShowcaseSlide[] = [
  {
    key: 'home',
    layout: 'download',
    pillar: 'buy',
    image: heroImage,
    tint: brandTint('buy'),
    wordLeftKey: 'landing.premium.downloadHeroTitle',
    wordRightKey: 'landing.premium.downloadHeroAccent',
    brandKey: 'landing.premium.downloadHeroEyebrow',
    descKey: 'landing.premium.downloadHeroLead',
    ctaKey: 'landing.premium.browseWithoutSignup',
    tabLabelKey: 'landing.premium.downloadHeroEyebrow',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.premium.heroMockupAlt',
    to: buyerRoutes.marketplace,
  },
  {
    key: 'food-local',
    pillar: 'eat',
    image: foodImage,
    tint: brandTint('eat'),
    wordLeftKey: 'landing.heroShowcase.foodLocal.wordLeft',
    wordRightKey: 'landing.heroShowcase.foodLocal.wordRight',
    brandKey: 'landing.heroShowcase.foodLocal.brand',
    descKey: 'landing.heroShowcase.foodLocal.desc',
    ctaKey: 'landing.heroShowcase.foodLocal.cta',
    tabLabelKey: 'landing.heroShowcase.foodLocal.tab',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.heroShowcase.foodLocal.tab',
    to: buyerRoutes.marketplace,
  },
  {
    key: 'hotels',
    pillar: 'buy',
    image: heroImage,
    tint: brandTint('buy'),
    wordLeftKey: 'landing.heroShowcase.hotels.wordLeft',
    wordRightKey: 'landing.heroShowcase.hotels.wordRight',
    brandKey: 'landing.heroShowcase.hotels.brand',
    descKey: 'landing.superApp.hotelsDesc',
    ctaKey: 'landing.heroShowcase.hotels.cta',
    tabLabelKey: 'landing.exploreHotels',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.exploreHotels',
    to: buyerRoutes.hotels,
  },
  {
    key: 'vouchers',
    pillar: 'buy',
    image: shopImage,
    tint: brandTint('buy'),
    wordLeftKey: 'landing.heroShowcase.vouchers.wordLeft',
    wordRightKey: 'landing.heroShowcase.vouchers.wordRight',
    brandKey: 'landing.heroShowcase.vouchers.brand',
    descKey: 'landing.superApp.vouchersDesc',
    ctaKey: 'landing.heroShowcase.vouchers.cta',
    tabLabelKey: 'landing.exploreVouchers',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.exploreVouchers',
    to: buyerRoutes.vouchers,
  },
  {
    key: 'community',
    pillar: 'buy',
    image: communityImage,
    tint: brandTint('buy'),
    wordLeftKey: 'landing.heroShowcase.community.wordLeft',
    wordRightKey: 'landing.heroShowcase.community.wordRight',
    brandKey: 'landing.heroShowcase.community.brand',
    descKey: 'landing.superApp.communityDesc',
    ctaKey: 'landing.heroShowcase.community.cta',
    tabLabelKey: 'landing.navCommunity',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.navCommunity',
    to: buyerRoutes.community,
  },
  {
    key: 'share-earn',
    pillar: 'buy',
    image: communityImage,
    tint: brandTint('buy'),
    wordLeftKey: 'landing.heroShowcase.shareEarn.wordLeft',
    wordRightKey: 'landing.heroShowcase.shareEarn.wordRight',
    brandKey: 'landing.heroShowcase.shareEarn.brand',
    descKey: 'landing.superApp.shareEarnDesc',
    ctaKey: 'landing.heroShowcase.shareEarn.cta',
    tabLabelKey: 'landing.exploreShareEarn',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.exploreShareEarn',
    to: buyerRoutes.shareEarn,
  },
  {
    key: 'ride',
    pillar: 'go',
    image: rideImage,
    tint: brandTint('go'),
    wordLeftKey: 'landing.heroShowcase.ride.wordLeft',
    wordRightKey: 'landing.heroShowcase.ride.wordRight',
    brandKey: 'landing.heroShowcase.ride.brand',
    descKey: 'landing.superApp.rideDesc',
    ctaKey: 'landing.heroShowcase.ride.cta',
    tabLabelKey: 'landing.navRide',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.navRide',
    to: buyerRoutes.ride,
  },
  {
    key: 'courier',
    pillar: 'go',
    image: rideImage,
    tint: brandTint('go'),
    wordLeftKey: 'landing.heroShowcase.courier.wordLeft',
    wordRightKey: 'landing.heroShowcase.courier.wordRight',
    brandKey: 'landing.heroShowcase.courier.brand',
    descKey: 'landing.superApp.courierDesc',
    ctaKey: 'landing.heroShowcase.courier.cta',
    tabLabelKey: 'landing.exploreCourier',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.exploreCourier',
    to: buyerRoutes.courier,
  },
  {
    key: 'send',
    pillar: 'go',
    image: sendImage,
    tint: brandTint('go'),
    wordLeftKey: 'landing.heroShowcase.send.wordLeft',
    wordRightKey: 'landing.heroShowcase.send.wordRight',
    brandKey: 'landing.heroShowcase.send.brand',
    descKey: 'landing.superApp.sendDesc',
    ctaKey: 'landing.heroShowcase.send.cta',
    tabLabelKey: 'landing.navSend',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.navSend',
    to: buyerRoutes.send,
  },
  {
    key: 'sell',
    pillar: 'sell',
    image: shopImage,
    tint: brandTint('sell'),
    wordLeftKey: 'landing.heroShowcase.sell.wordLeft',
    wordRightKey: 'landing.heroShowcase.sell.wordRight',
    brandKey: 'landing.heroShowcase.sell.brand',
    descKey: 'landing.superApp.earnSellDesc',
    ctaKey: 'landing.heroShowcase.sell.cta',
    tabLabelKey: 'landing.superApp.earnSell',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.superApp.earnSell',
    href: bizSellerRegisterUrl,
  },
  {
    key: 'deliver',
    pillar: 'sell',
    image: rideImage,
    tint: brandTint('sell'),
    wordLeftKey: 'landing.heroShowcase.deliver.wordLeft',
    wordRightKey: 'landing.heroShowcase.deliver.wordRight',
    brandKey: 'landing.heroShowcase.deliver.brand',
    descKey: 'landing.superApp.earnDeliverDesc',
    ctaKey: 'landing.heroShowcase.deliver.cta',
    tabLabelKey: 'landing.superApp.earnDeliver',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.superApp.earnDeliver',
    to: buyerRoutes.courier,
  },
  {
    key: 'business',
    pillar: 'sell',
    image: heroImage,
    tint: brandTint('sell'),
    wordLeftKey: 'landing.heroShowcase.business.wordLeft',
    wordRightKey: 'landing.heroShowcase.business.wordRight',
    brandKey: 'landing.heroShowcase.business.brand',
    descKey: 'landing.superApp.enterpriseBusinessDesc',
    ctaKey: 'landing.heroShowcase.business.cta',
    tabLabelKey: 'landing.navBusiness',
    chipLabelKey: 'landing.heroShowcase.chipLabel',
    altKey: 'landing.navBusiness',
    to: buyerRoutes.business,
  },
]

export const HERO_SHOWCASE_AUTO_MS = 6500
