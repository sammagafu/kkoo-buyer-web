import heroImage from '@/assets/landing/hero.jpg'
import foodImage from '@/assets/landing/services/food.jpg'
import rideImage from '@/assets/landing/services/ride.jpg'
import { buyerRoutes, bizSellerRegisterUrl } from '@/config/landing-links'

const env = import.meta.env

export const riderWhatsAppApplyUrl =
  (env.VITE_KKOO_RIDER_WHATSAPP_URL as string | undefined) ??
  'https://wa.me/255712345678?text=Hi%20KKOO%2C%20I%20want%20to%20apply%20as%20a%20rider%2Fdelivery%20partner'

export const creatorSignupUrl = { name: 'pages.share-earn' } as const

export const heroMockupSlides = [
  { key: 'hero', image: heroImage, altKey: 'landing.premium.heroMockupAlt' },
  { key: 'food-local', image: foodImage, altKey: 'landing.heroShowcase.foodLocal.tab' },
  { key: 'ride', image: rideImage, altKey: 'landing.premium.heroMockupAlt' },
] as const

export const audienceSwitcherItems = [
  { key: 'buyer', sectionId: 'hero', labelKey: 'landing.premium.audienceBuyer' },
  { key: 'seller', sectionId: 'sell-section', labelKey: 'landing.premium.audienceSeller' },
  { key: 'rider', sectionId: 'ride-partners', labelKey: 'landing.premium.audienceRider' },
  { key: 'creator', sectionId: 'creator', labelKey: 'landing.premium.audienceCreator' },
] as const

export type LandingPartnerNavItem =
  | { key: string; labelKey: string; sectionId: string; kind: 'anchor' }
  | { key: string; labelKey: string; route: typeof buyerRoutes.business; kind: 'route' }

export const landingPartnersNavItems: LandingPartnerNavItem[] = [
  { key: 'sell', sectionId: 'sell-section', labelKey: 'landing.premium.navPartnerSell', kind: 'anchor' },
  { key: 'deliver', sectionId: 'ride-partners', labelKey: 'landing.premium.navPartnerDeliver', kind: 'anchor' },
  { key: 'creator', sectionId: 'creator', labelKey: 'landing.premium.navPartnerCreator', kind: 'anchor' },
  { key: 'business', route: buyerRoutes.business, labelKey: 'landing.premium.navPartnerBusiness', kind: 'route' },
]

export const sellerBenefitPills = [
  { key: 'cost', icon: 'solar:wallet-money-bold', labelKey: 'landing.premium.sellerBenefit1' },
  { key: 'escrow', icon: 'solar:shield-check-bold', labelKey: 'landing.premium.sellerBenefit2' },
  { key: 'delivery', icon: 'solar:delivery-bold', labelKey: 'landing.premium.sellerBenefit3' },
] as const

export const sellerOnboardingSteps = [
  { key: 'create', icon: 'solar:shop-2-linear', titleKey: 'landing.premium.sellerStep1Title', descKey: 'landing.premium.sellerStep1Desc' },
  { key: 'list', icon: 'solar:box-linear', titleKey: 'landing.premium.sellerStep2Title', descKey: 'landing.premium.sellerStep2Desc' },
  { key: 'earn', icon: 'solar:wallet-money-linear', titleKey: 'landing.premium.sellerStep3Title', descKey: 'landing.premium.sellerStep3Desc' },
] as const

export const sellerBusinessTypes = [
  { value: 'retail', labelKey: 'landing.premium.sellerTypeRetail' },
  { value: 'food', labelKey: 'landing.premium.sellerTypeFood' },
  { value: 'services', labelKey: 'landing.premium.sellerTypeServices' },
  { value: 'other', labelKey: 'landing.premium.sellerTypeOther' },
] as const

export const riderHighlights = [
  { key: 'pay', icon: 'solar:wallet-money-bold', valueKey: 'landing.premium.riderHighlightPay', labelKey: 'landing.premium.riderHighlightPayLabel' },
  { key: 'flex', icon: 'solar:clock-circle-bold', valueKey: 'landing.premium.riderHighlightFlex', labelKey: 'landing.premium.riderHighlightFlexLabel' },
  { key: 'routes', icon: 'solar:map-point-bold', valueKey: 'landing.premium.riderHighlightRoutes', labelKey: 'landing.premium.riderHighlightRoutesLabel' },
] as const

export const riderEligibilityItems = [
  { key: 'bike', icon: 'solar:scooter-bold', labelKey: 'landing.premium.riderEligibility1' },
  { key: 'phone', icon: 'solar:smartphone-2-bold', labelKey: 'landing.premium.riderEligibility2' },
  { key: 'id', icon: 'solar:card-bold', labelKey: 'landing.premium.riderEligibility3' },
] as const

export const riderOnboardingSteps = [
  { key: 'register', icon: 'solar:user-id-linear', titleKey: 'landing.premium.riderStep1Title', descKey: 'landing.premium.riderStep1Desc' },
  { key: 'verify', icon: 'solar:shield-check-linear', titleKey: 'landing.premium.riderStep2Title', descKey: 'landing.premium.riderStep2Desc' },
  { key: 'app', icon: 'solar:smartphone-2-linear', titleKey: 'landing.premium.riderStep3Title', descKey: 'landing.premium.riderStep3Desc' },
  { key: 'earn', icon: 'solar:wallet-money-linear', titleKey: 'landing.premium.riderStep4Title', descKey: 'landing.premium.riderStep4Desc' },
] as const

export const creatorPerks = [
  { key: 'commission', icon: 'solar:percent-circle-bold', titleKey: 'landing.premium.creatorPerk1Title', descKey: 'landing.premium.creatorPerk1Desc' },
  { key: 'link', icon: 'solar:link-circle-bold', titleKey: 'landing.premium.creatorPerk2Title', descKey: 'landing.premium.creatorPerk2Desc' },
  { key: 'dashboard', icon: 'solar:chart-square-bold', titleKey: 'landing.premium.creatorPerk3Title', descKey: 'landing.premium.creatorPerk3Desc' },
] as const

export type TestimonialRole = 'buyer' | 'seller' | 'rider'

export const testimonialRoleTabs: { key: TestimonialRole; labelKey: string }[] = [
  { key: 'buyer', labelKey: 'landing.premium.testimonialsBuyersSay' },
  { key: 'seller', labelKey: 'landing.premium.testimonialsSellersSay' },
  { key: 'rider', labelKey: 'landing.premium.testimonialsRidersSay' },
]

export const testimonialRoleMap: Record<TestimonialRole, number[]> = {
  buyer: [1, 2, 3],
  seller: [4, 5, 6],
  rider: [7, 8],
}

export { bizSellerRegisterUrl }
