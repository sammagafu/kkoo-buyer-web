import type { RouteLocationRaw } from 'vue-router'
import { bizSellerRegisterUrl, buyerRoutes } from '@/config/landing-links'
import type { SuperAppPillarId } from '@/config/landing-superapp'
import heroImage from '@/assets/landing/hero.jpg'
import shopImage from '@/assets/landing/services/shop.jpg'
import rideImage from '@/assets/landing/services/ride.jpg'
import sendImage from '@/assets/landing/services/Untitled-2.jpg'

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

/** Launch verticals only — shopping, delivery/send, and business tools (food/rides return later). */
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
