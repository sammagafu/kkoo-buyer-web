import heroImage from '@/assets/landing/hero.jpg'
import logoLight from '@/assets/images/logo-light.svg'
import logoDark from '@/assets/images/logo-dark.svg'
import shopImage from '@/assets/landing/services/shop.jpg'
import foodImage from '@/assets/landing/services/food.jpg'
import groceriesImage from '@/assets/landing/services/groceries.jpg'
import rideImage from '@/assets/landing/services/ride.jpg'
import { buyerRoutes, bizSellerDashboardUrl, bizCrmUrl } from '@/config/landing-links'
import { bizWebPath } from '@/config/cross-app-links'

/** Apple-style product narrative — one promise, then each role of the ecosystem. */
export const houseCopy = {
  brand: 'KKOO',
  phone: '+255 700 000 000',
  phoneHref: 'tel:+255700000000',
  nav: {
    buy: 'Buy',
    sell: 'Sell',
    pos: 'iShop POS',
    business: 'Business',
    ride: 'Ride',
    earn: 'Earn',
  },
  cta: 'Get started',
  ctaPrimary: 'Start shopping',
  ctaSecondary: 'Create account',
  ctaCatalog: 'Open',
  hero: {
    brand: 'KKOO',
    title: 'Buy. Sell. Deliver. Earn.',
    lead: 'One trusted commerce platform for shoppers, merchants, riders, and teams — with escrow, live tracking, and rewards.',
    imageAlt: 'KKOO commerce for buyers, sellers, and riders',
  },
  buy: {
    title: 'Everyday commerce',
    lead: 'Food, groceries, local shops, and parcels — same account, same protection.',
  },
  rolesIntro: {
    title: 'Built for everyone in the chain',
    lead: 'Pick your lane. The platform connects them.',
  },
  trust: {
    title: 'Trust is the product',
    lead: 'Escrow checkout, live tracking, and clear payouts — so buyers, sellers, and riders can move without anxiety.',
  },
  footer: {
    title: 'Your place in Kariakoo',
    lead: 'Shop today. Sell when you are ready. Deliver when you want to earn. Run the shop on the web.',
    meta: 'East Africa · buyers · sellers · riders · teams',
  },
  modal: {
    eyebrow: 'Almost done · step 1 of 2',
    title: 'Create your KKOO account',
    hint: 'One account for shopping, referrals, and rewards. Merchants and riders finish setup in the business app.',
    submit: 'Continue to sign up',
    successEyebrow: 'Ready',
    successTitle: 'Finish on the sign-up page',
    successHint: 'Your city is saved — create an account to keep it.',
    successCta: 'Go to sign up',
  },
} as const

export const houseServices = [
  {
    key: 'food',
    src: foodImage,
    title: 'Food',
    action: 'Order from restaurants',
    to: buyerRoutes.restaurants,
    icon: 'solar:cup-hot-bold',
  },
  {
    key: 'grocery',
    src: groceriesImage,
    title: 'Groceries',
    action: 'Get daily essentials',
    to: buyerRoutes.grocery,
    icon: 'solar:bag-2-bold',
  },
  {
    key: 'shop',
    src: shopImage,
    title: 'Shop',
    action: 'Buy from local stores',
    to: buyerRoutes.marketplace,
    icon: 'solar:cart-large-2-bold',
  },
  {
    key: 'send',
    src: rideImage,
    title: 'Send',
    action: 'Deliver a parcel',
    to: buyerRoutes.send,
    icon: 'solar:box-bold',
  },
] as const

/** Full-bleed solution strips — one job each (Apple product-page cadence). Buy is covered by the services band above. */
export const houseRoles = [
  {
    key: 'sell',
    id: 'sell',
    tone: 'inverse' as const,
    name: 'Sell',
    title: 'Open your shop on KKOO.',
    lead: 'List products, take orders, and get paid when the customer confirms — online and in-store.',
    cta: 'Start selling',
    link: { kind: 'route' as const, to: buyerRoutes.merchant },
    image: foodImage,
    imageAlt: 'Selling on KKOO',
  },
  {
    key: 'pos',
    id: 'pos',
    tone: 'light' as const,
    name: 'iShop POS',
    title: 'Counter sales that sync.',
    lead: 'In-shop POS for walk-in customers — same catalog, stock, and CRM notebook as your online store.',
    cta: 'Open iShop POS',
    link: { kind: 'href' as const, href: bizWebPath('/seller/pos') },
    image: groceriesImage,
    imageAlt: 'iShop POS counter sales',
  },
  {
    key: 'business',
    id: 'business',
    tone: 'inverse' as const,
    name: 'Business',
    title: 'Run the back office.',
    lead: 'Invoices, deni, staff, inventory, and reports — business tools for teams that already sell.',
    cta: 'Open business tools',
    link: { kind: 'href' as const, href: bizCrmUrl },
    image: shopImage,
    imageAlt: 'KKOO business tools',
  },
  {
    key: 'ride',
    id: 'ride',
    tone: 'light' as const,
    name: 'Ride',
    title: 'Deliver. Get paid.',
    lead: 'Accept deliveries, navigate live jobs, and earn on every completed drop — parcels and marketplace orders.',
    cta: 'Become a rider',
    link: { kind: 'route' as const, to: buyerRoutes.courier },
    image: rideImage,
    imageAlt: 'KKOO rider delivery',
  },
  {
    key: 'earn',
    id: 'earn',
    tone: 'inverse' as const,
    name: 'Earn',
    title: 'Share. Level up. Cash out.',
    lead: 'Referrals, share links, loyalty points, streaks, and achievements — growth that rewards real activity.',
    cta: 'See Share & Earn',
    link: { kind: 'route' as const, to: buyerRoutes.shareEarn },
    image: foodImage,
    imageAlt: 'KKOO earnings and rewards',
  },
] as const

export const houseTrust = [
  {
    title: 'Escrow checkout',
    text: 'Sellers and riders get paid after the buyer accepts.',
    icon: 'solar:shield-check-bold',
  },
  {
    title: 'Live tracking',
    text: 'Orders and parcels move in real time — for everyone watching.',
    icon: 'solar:map-point-bold',
  },
  {
    title: 'One ecosystem',
    text: 'Buyers, sellers, POS, business tools, and riders share the same KKOO.',
    icon: 'solar:widget-bold',
  },
] as const

export const houseHeroImage = heroImage
export const houseLogoLight = logoLight
export const houseLogoDark = logoDark

export const houseRegions = [
  'Dar es Salaam',
  'Nairobi',
  'Kampala',
  'Other city',
] as const

/** Seller dashboard entry used by footer partner strip. */
export const housePartnerLinks = {
  sellerDashboard: bizSellerDashboardUrl,
  pos: bizWebPath('/seller/pos'),
  crm: bizCrmUrl,
} as const
