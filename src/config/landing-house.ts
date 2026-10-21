import logoLight from '@/assets/images/logo-light.svg'
import logoDark from '@/assets/images/logo-dark.svg'
import { buyerRoutes, bizSellerDashboardUrl, bizCrmUrl } from '@/config/landing-links'
import { bizWebPath } from '@/config/cross-app-links'
import { landingHeroImage, serviceCardImage } from '@/config/landing-images'

/** Non-translatable brand / contact constants. Copy lives in i18n `landingHouse.*`. */
export const houseCopy = {
  brand: 'KkooApp',
  phone: '+255 788 419 991',
  phoneHref: 'tel:+255788419991',
} as const

/** Full buyer verticals shown on the homepage catalog. */
export const houseServices = [
  {
    key: 'shop',
    image: serviceCardImage('shop'),
    to: buyerRoutes.marketplace,
    icon: 'solar:cart-large-2-bold',
  },
  {
    key: 'food',
    image: serviceCardImage('food'),
    to: buyerRoutes.eats,
    icon: 'solar:cup-hot-bold',
  },
  {
    key: 'restaurants',
    image: serviceCardImage('restaurants'),
    to: buyerRoutes.restaurants,
    icon: 'solar:chef-hat-bold',
  },
  {
    key: 'grocery',
    image: serviceCardImage('groceries'),
    to: buyerRoutes.grocery,
    icon: 'solar:bag-2-bold',
  },
  {
    key: 'ride',
    image: serviceCardImage('ride'),
    to: buyerRoutes.ride,
    icon: 'solar:scooter-bold',
  },
  {
    key: 'hotels',
    image: serviceCardImage('hotels'),
    to: buyerRoutes.booking,
    icon: 'solar:bed-bold',
  },
  {
    key: 'pharmacy',
    image: serviceCardImage('pharmacy'),
    to: buyerRoutes.pharmacy,
    icon: 'solar:health-bold',
  },
  {
    key: 'send',
    image: serviceCardImage('send'),
    to: buyerRoutes.send,
    icon: 'solar:bag-heart-bold',
  },
  {
    key: 'discovery',
    image: serviceCardImage('discovery'),
    to: buyerRoutes.discover,
    icon: 'solar:compass-bold',
  },
  {
    key: 'hustle',
    image: serviceCardImage('hustle'),
    to: buyerRoutes.hustle,
    icon: 'solar:bolt-bold',
  },
] as const

export const houseRoles = [
  {
    key: 'sell',
    id: 'sell',
    tone: 'inverse' as const,
    link: { kind: 'route' as const, to: buyerRoutes.merchant },
    image: serviceCardImage('food'),
  },
  {
    key: 'pos',
    id: 'pos',
    tone: 'light' as const,
    link: { kind: 'href' as const, href: bizWebPath('/seller/pos') },
    image: serviceCardImage('groceries'),
  },
  {
    key: 'business',
    id: 'business',
    tone: 'inverse' as const,
    link: { kind: 'href' as const, href: bizCrmUrl },
    image: serviceCardImage('shop'),
  },
  {
    key: 'ride',
    id: 'ride',
    tone: 'light' as const,
    link: { kind: 'route' as const, to: buyerRoutes.courier },
    image: serviceCardImage('ride'),
  },
  {
    key: 'earn',
    id: 'earn',
    tone: 'inverse' as const,
    link: { kind: 'route' as const, to: buyerRoutes.shareEarn },
    image: serviceCardImage('food'),
  },
] as const

export const houseTrust = [
  { key: 'escrow', icon: 'solar:shield-check-bold' },
  { key: 'tracking', icon: 'solar:map-point-bold' },
  { key: 'ecosystem', icon: 'solar:widget-bold' },
  { key: 'registered', icon: 'solar:buildings-bold' },
] as const

export const houseHeroImage = landingHeroImage
export const houseLogoLight = logoLight
export const houseLogoDark = logoDark

/** Region keys — labels via `landingHouse.regions.*`. */
export const houseRegionKeys = ['dar', 'nairobi', 'kampala', 'other'] as const

/** @deprecated use houseRegionKeys + i18n */
export const houseRegions = ['Dar es Salaam', 'Nairobi', 'Kampala', 'Other city'] as const

export const housePartnerLinks = {
  sellerDashboard: bizSellerDashboardUrl,
  pos: bizWebPath('/seller/pos'),
  crm: bizCrmUrl,
} as const
