import heroImage from '@/assets/landing/hero.jpg'
import logoLight from '@/assets/images/logo-light.svg'
import logoDark from '@/assets/images/logo-dark.svg'
import shopImage from '@/assets/landing/services/shop.jpg'
import foodImage from '@/assets/landing/services/food.jpg'
import groceriesImage from '@/assets/landing/services/groceries.jpg'
import rideImage from '@/assets/landing/services/ride.jpg'
import { buyerRoutes, bizSellerDashboardUrl, bizCrmUrl } from '@/config/landing-links'
import { bizWebPath } from '@/config/cross-app-links'

/** Non-translatable brand / contact constants. Copy lives in i18n `landingHouse.*`. */
export const houseCopy = {
  brand: 'kkooApp',
  phone: '+255 700 000 000',
  phoneHref: 'tel:+255700000000',
} as const

export const houseServices = [
  {
    key: 'food',
    src: foodImage,
    to: buyerRoutes.restaurants,
    icon: 'solar:cup-hot-bold',
  },
  {
    key: 'grocery',
    src: groceriesImage,
    to: buyerRoutes.grocery,
    icon: 'solar:bag-2-bold',
  },
  {
    key: 'shop',
    src: shopImage,
    to: buyerRoutes.marketplace,
    icon: 'solar:cart-large-2-bold',
  },
  {
    key: 'send',
    src: rideImage,
    to: buyerRoutes.send,
    icon: 'solar:box-bold',
  },
] as const

export const houseRoles = [
  {
    key: 'sell',
    id: 'sell',
    tone: 'inverse' as const,
    link: { kind: 'route' as const, to: buyerRoutes.merchant },
    image: foodImage,
  },
  {
    key: 'pos',
    id: 'pos',
    tone: 'light' as const,
    link: { kind: 'href' as const, href: bizWebPath('/seller/pos') },
    image: groceriesImage,
  },
  {
    key: 'business',
    id: 'business',
    tone: 'inverse' as const,
    link: { kind: 'href' as const, href: bizCrmUrl },
    image: shopImage,
  },
  {
    key: 'ride',
    id: 'ride',
    tone: 'light' as const,
    link: { kind: 'route' as const, to: buyerRoutes.courier },
    image: rideImage,
  },
  {
    key: 'earn',
    id: 'earn',
    tone: 'inverse' as const,
    link: { kind: 'route' as const, to: buyerRoutes.shareEarn },
    image: foodImage,
  },
] as const

export const houseTrust = [
  { key: 'escrow', icon: 'solar:shield-check-bold' },
  { key: 'tracking', icon: 'solar:map-point-bold' },
  { key: 'ecosystem', icon: 'solar:widget-bold' },
] as const

export const houseHeroImage = heroImage
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
