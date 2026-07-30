/**
 * Canonical routes and external app URLs for the buyer landing experience.
 */
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'
import { adminWebPath, bizWebPath } from '@/config/cross-app-links'

export const buyerRoutes = {
  marketplace: BUYER_DASHBOARD_ROUTE,
  dashboard: BUYER_DASHBOARD_ROUTE,
  eats: { name: 'buyer.eats' },
  grocery: { name: 'buyer.grocery' },
  send: { name: 'buyer.send' },
  parcel: { name: 'buyer.parcel' },
  ride: { name: 'buyer.ride' },
  booking: { name: 'buyer.booking' },
  pharmacy: { name: 'buyer.pharmacy' },
  checkout: { name: 'buyer.checkout' },
  favorites: { name: 'buyer.favorites' },
  compare: { name: 'buyer.compare' },
  account: { name: 'buyer.profile' },
  orders: { name: 'buyer.orders' },
  search: { name: 'buyer.search' },
  signIn: { name: 'auth.sign-in' },
  signUp: { name: 'auth.sign-up' },
  getStarted: { name: 'pages.get-started' },
  sellerRegister: { name: 'auth.seller-register' },
  landing: { name: 'pages.landing' },
  business: { name: 'pages.business' },
  community: { name: 'pages.community' },
  discover: { name: 'pages.discover' },
  careers: { name: 'pages.careers' },
  hustle: { name: 'pages.mchongo' },
  partnerRegister: { name: 'pages.partner-register' },
  personal: { name: 'pages.personal' },
  restaurants: { name: 'pages.restaurants' },
  hotels: { name: 'pages.hotels' },
  courier: { name: 'pages.courier' },
  vouchers: { name: 'pages.vouchers' },
  shareEarn: { name: 'pages.share-earn' },
  appHomepage: { name: 'pages.app-homepage' },
  merchant: { name: 'pages.merchant' },
  about: { name: 'pages.about' },
  safety: { name: 'pages.safety' },
  coverage: { name: 'pages.coverage' },
  press: { name: 'pages.press' },
  investors: { name: 'pages.investors' },
  news: { name: 'pages.news' },
  support: { name: 'pages.support' },
} as const

export const landingAnchors = {
  solutions: { name: 'pages.landing', hash: '#solutions' },
  hero: { name: 'pages.landing', hash: '#hero' },
  download: { name: 'pages.landing', hash: '#download' },
  sell: { name: 'pages.landing', hash: '#sell-section' },
  ridePartners: { name: 'pages.landing', hash: '#ride-partners' },
  creator: { name: 'pages.landing', hash: '#creator' },
  work: { name: 'pages.landing', hash: '#work' },
  businesses: { name: 'pages.landing', hash: '#businesses' },
  how: { name: 'pages.landing', hash: '#how' },
  features: { name: 'pages.landing', hash: '#features' },
  services: { name: 'pages.landing', hash: '#services' },
  preview: { name: 'pages.landing', hash: '#preview' },
  stories: { name: 'pages.landing', hash: '#stories' },
} as const

/** In-page section anchors for the premium landing header (shopper-first). */
export const landingSectionNavItems = [
  { key: 'buy', sectionId: 'services', pillar: 'buy' as const, labelKey: 'landing.superApp.pillarBuy' },
  { key: 'go', sectionId: 'services', pillar: 'go' as const, labelKey: 'landing.superApp.pillarGo' },
  { key: 'sell', sectionId: 'sell-section', pillar: 'sell' as const, labelKey: 'landing.superApp.pillarSell' },
  { key: 'stories', sectionId: 'stories', labelKey: 'landing.premium.navStories' },
] as const

/** Header nav on house landing chrome — real destinations, not scroll-only labels. */
export const houseHeaderNavItems = [
  {
    key: 'shop',
    route: buyerRoutes.marketplace,
    labelKey: 'landing.navShop',
    activeNames: ['buyer.marketplace', 'buyer.search', 'pages.personal', 'pages.app-homepage'],
  },
  {
    key: 'food',
    route: buyerRoutes.eats,
    labelKey: 'landing.navEats',
    activeNames: ['buyer.eats', 'buyer.grocery', 'pages.restaurants'],
  },
  {
    key: 'send',
    route: buyerRoutes.send,
    labelKey: 'landing.navSend',
    activeNames: ['buyer.send', 'buyer.parcel', 'pages.courier'],
  },
  {
    key: 'ride',
    route: buyerRoutes.ride,
    labelKey: 'landing.navRide',
    activeNames: ['buyer.ride', 'pages.hotels'],
  },
  {
    key: 'sell',
    route: buyerRoutes.merchant,
    labelKey: 'landing.navSell',
    activeNames: ['pages.merchant', 'auth.seller-register'],
  },
  {
    key: 'business',
    route: buyerRoutes.business,
    labelKey: 'landing.navBusinessTools',
    activeNames: ['pages.business'],
  },
] as const

/**
 * Bolt-style mega menu sections for landing header.
 * Left rail categories + product cards + optional promo tiles.
 */
export const houseMegaSections = [
  {
    key: 'products',
    labelKey: 'landing.megaProducts',
    items: [
      {
        key: 'shop',
        route: buyerRoutes.marketplace,
        labelKey: 'landing.navShop',
        descKey: 'landing.shopVerticalMarketplaceDesc',
        icon: 'solar:cart-large-2-bold',
        accent: 'market',
      },
      {
        key: 'eats',
        route: buyerRoutes.eats,
        labelKey: 'landing.navEats',
        descKey: 'landing.shopVerticalEatsDesc',
        icon: 'solar:cup-hot-bold',
        accent: 'eats',
      },
      {
        key: 'restaurants',
        route: buyerRoutes.restaurants,
        labelKey: 'landing.exploreRestaurants',
        descKey: 'landing.exploreRestaurantsDesc',
        icon: 'solar:chef-hat-bold',
        accent: 'restaurants',
      },
      {
        key: 'grocery',
        route: buyerRoutes.grocery,
        labelKey: 'landing.navGrocery',
        descKey: 'landing.shopVerticalGroceryDesc',
        icon: 'solar:bag-2-bold',
        accent: 'grocery',
      },
      {
        key: 'ride',
        route: buyerRoutes.ride,
        labelKey: 'landing.navRide',
        descKey: 'landing.shopVerticalRideDesc',
        icon: 'solar:scooter-bold',
        accent: 'ride',
      },
      {
        key: 'send',
        route: buyerRoutes.send,
        labelKey: 'landing.navSend',
        descKey: 'landing.shopVerticalSendDesc',
        icon: 'solar:box-bold',
        accent: 'send',
      },
      {
        key: 'hotels',
        route: buyerRoutes.booking,
        labelKey: 'landing.navBooking',
        descKey: 'landing.shopVerticalBookingDesc',
        icon: 'solar:bed-bold',
        accent: 'booking',
      },
      {
        key: 'discovery',
        route: buyerRoutes.discover,
        labelKey: 'landing.navDiscover',
        descKey: 'landing.navDiscoverDesc',
        icon: 'solar:compass-bold',
        accent: 'discover',
      },
      {
        key: 'hustle',
        route: buyerRoutes.hustle,
        labelKey: 'landing.navJobs',
        descKey: 'landing.megaJobsDesc',
        icon: 'solar:bolt-bold',
        accent: 'jobs',
      },
    ],
    promos: [
      {
        key: 'ride-promo',
        route: buyerRoutes.ride,
        titleKey: 'landing.megaPromoRideTitle',
        ctaKey: 'landing.megaPromoRideCta',
        accent: 'ride',
      },
      {
        key: 'food-promo',
        route: buyerRoutes.eats,
        titleKey: 'landing.megaPromoFoodTitle',
        ctaKey: 'landing.megaPromoFoodCta',
        accent: 'eats',
      },
    ],
  },
  {
    key: 'earn',
    labelKey: 'landing.megaEarn',
    items: [
      {
        key: 'sell',
        route: buyerRoutes.merchant,
        labelKey: 'landing.navSell',
        descKey: 'landing.exploreMerchantDesc',
        icon: 'solar:shop-2-bold',
        accent: 'merchant',
      },
      {
        key: 'courier',
        route: buyerRoutes.courier,
        labelKey: 'landing.exploreCourier',
        descKey: 'landing.exploreCourierDesc',
        icon: 'solar:delivery-bold',
        accent: 'courier',
      },
      {
        key: 'share',
        route: buyerRoutes.shareEarn,
        labelKey: 'landing.exploreShareEarn',
        descKey: 'landing.exploreShareEarnDesc',
        icon: 'solar:gift-bold',
        accent: 'share',
      },
      {
        key: 'biz-portal',
        href: bizWebPath('/seller'),
        labelKey: 'landing.footerNavBusinessTools',
        descKey: 'landing.exploreBizPortalDesc',
        icon: 'solar:widget-5-bold',
        accent: 'business',
      },
    ],
  },
  {
    key: 'company',
    labelKey: 'landing.megaCompany',
    items: [
      {
        key: 'about',
        route: buyerRoutes.about,
        labelKey: 'trust.navAbout',
        descKey: 'trust.megaAboutDesc',
        icon: 'solar:info-circle-bold',
        accent: 'community',
      },
      {
        key: 'safety',
        route: buyerRoutes.safety,
        labelKey: 'trust.navSafety',
        descKey: 'trust.megaSafetyDesc',
        icon: 'solar:shield-check-bold',
        accent: 'business',
      },
      {
        key: 'coverage',
        route: buyerRoutes.coverage,
        labelKey: 'trust.navCoverage',
        descKey: 'trust.megaCoverageDesc',
        icon: 'solar:map-point-bold',
        accent: 'market',
      },
      {
        key: 'support',
        route: buyerRoutes.support,
        labelKey: 'trust.navSupportHub',
        descKey: 'trust.megaSupportDesc',
        icon: 'solar:headphones-round-sound-bold',
        accent: 'courier',
      },
      {
        key: 'careers',
        route: buyerRoutes.careers,
        labelKey: 'landing.footerCareers',
        descKey: 'landing.superApp.careersDesc',
        icon: 'solar:case-round-bold',
        accent: 'jobs',
      },
      {
        key: 'news',
        route: buyerRoutes.news,
        labelKey: 'trust.navNews',
        descKey: 'trust.megaNewsDesc',
        icon: 'solar:document-text-bold',
        accent: 'discover',
      },
      {
        key: 'press',
        route: buyerRoutes.press,
        labelKey: 'trust.navPress',
        descKey: 'trust.megaPressDesc',
        icon: 'solar:gallery-bold',
        accent: 'vouchers',
      },
      {
        key: 'investors',
        route: buyerRoutes.investors,
        labelKey: 'trust.navInvestors',
        descKey: 'trust.megaInvestorsDesc',
        icon: 'solar:chart-2-bold',
        accent: 'share',
      },
      {
        key: 'community',
        route: buyerRoutes.community,
        labelKey: 'landing.navCommunity',
        descKey: 'landing.exploreCommunityDesc',
        icon: 'solar:users-group-rounded-bold',
        accent: 'community',
      },
      {
        key: 'business',
        route: buyerRoutes.business,
        labelKey: 'landing.navBusinessTools',
        descKey: 'landing.exploreBusinessDesc',
        icon: 'solar:widget-5-bold',
        accent: 'business',
      },
      {
        key: 'app',
        route: buyerRoutes.appHomepage,
        labelKey: 'landing.exploreApp',
        descKey: 'landing.exploreAppDesc',
        icon: 'solar:smartphone-2-bold',
        accent: 'app',
      },
    ],
  },
] as const

/** Header nav — shopper + send + one clear seller entry. */
export const primaryNavItems = [
  {
    key: 'shop',
    route: buyerRoutes.marketplace,
    labelKey: 'landing.navShop',
    icon: 'solar:cart-large-2-bold',
  },
  {
    key: 'send',
    route: buyerRoutes.send,
    labelKey: 'landing.navSend',
    icon: 'solar:box-bold',
  },
  {
    key: 'sell',
    route: buyerRoutes.merchant,
    labelKey: 'landing.navSell',
    icon: 'solar:shop-2-bold',
  },
] as const

/** Demoted to footer / mobile drawer — still reachable, not in the header bar. */
export const secondaryNavItems = [
  {
    key: 'discover',
    route: buyerRoutes.discover,
    labelKey: 'landing.navDiscover',
    icon: 'solar:calendar-bold',
  },
  {
    key: 'carrier',
    route: buyerRoutes.courier,
    labelKey: 'landing.navCarrier',
    icon: 'solar:delivery-bold',
  },
  {
    key: 'earn',
    route: buyerRoutes.shareEarn,
    labelKey: 'landing.navEarn',
    icon: 'solar:gift-bold',
  },
  {
    key: 'jobs',
    route: buyerRoutes.hustle,
    labelKey: 'landing.navJobs',
    icon: 'solar:bolt-bold',
  },
  {
    key: 'community',
    route: buyerRoutes.community,
    labelKey: 'landing.navCommunity',
    icon: 'solar:users-group-rounded-bold',
  },
] as const

/** Seller dashboard on biz web (biz `/` alone redirects to sign-in). */
export const bizSellerDashboardUrl = bizWebPath('/seller')

/** CRM workspace on biz web. */
export const bizCrmUrl = bizWebPath('/seller/crm')

/** Seller registration on biz web — business lives at biz.kkooapp.co.tz. */
export const bizSellerRegisterUrl = bizWebPath('/join')

/** Seller sign-in on biz web. */
export const bizSignInUrl = bizWebPath('/auth/sign-in')

/** Seller account hub on biz web — profile, roles, workspaces. */
export const bizSellerAccountUrl = bizWebPath('/account')

/** Admin dashboard on admin web — admin.kkooapp.co.tz. */
export const adminDashboardUrl = adminWebPath('/dashboard')

/** Footer / help links for sellers — marketing pages on buyer + tools on biz. */
export const sellerNavItems = {
  business: {
    labelKey: 'landing.navBusinessTools',
    route: buyerRoutes.business,
  },
  merchant: {
    labelKey: 'landing.navSell',
    route: buyerRoutes.merchant,
  },
  register: {
    labelKey: 'landing.footerBecomeSeller',
    href: bizSellerRegisterUrl,
  },
  account: {
    labelKey: 'landing.footerSellerAccount',
    href: bizSellerAccountUrl,
  },
  portal: {
    labelKey: 'landing.footerNavBusinessTools',
    href: bizSellerDashboardUrl,
  },
} as const

/** @deprecated Use bizSellerDashboardUrl — kept for older imports. */
export const bizWebUrl = bizSellerDashboardUrl

export const shopVerticals = [
  {
    key: 'marketplace',
    route: buyerRoutes.marketplace,
    labelKey: 'landing.navMarketplace',
    descKey: 'landing.shopVerticalMarketplaceDesc',
    icon: 'solar:cart-large-2-bold',
    accent: 'market',
  },
  {
    key: 'eats',
    route: buyerRoutes.eats,
    labelKey: 'landing.navEats',
    descKey: 'landing.shopVerticalEatsDesc',
    icon: 'solar:cup-hot-bold',
    accent: 'eats',
  },
  {
    key: 'grocery',
    route: buyerRoutes.grocery,
    labelKey: 'landing.navGrocery',
    descKey: 'landing.shopVerticalGroceryDesc',
    icon: 'solar:bag-2-bold',
    accent: 'grocery',
  },
  {
    key: 'send',
    route: buyerRoutes.send,
    labelKey: 'landing.navSend',
    descKey: 'landing.shopVerticalSendDesc',
    icon: 'solar:box-bold',
    accent: 'send',
  },
  {
    key: 'ride',
    route: buyerRoutes.ride,
    labelKey: 'landing.navRide',
    descKey: 'landing.shopVerticalRideDesc',
    icon: 'solar:scooter-bold',
    accent: 'ride',
  },
  {
    key: 'booking',
    route: buyerRoutes.booking,
    labelKey: 'landing.navBooking',
    descKey: 'landing.shopVerticalBookingDesc',
    icon: 'solar:bed-bold',
    accent: 'booking',
  },
] as const

/** Program / marketing subpages linked from the landing experience. */
export const marketingPrograms = [
  {
    key: 'personal',
    route: buyerRoutes.personal,
    labelKey: 'landing.navPersonal',
    descKey: 'landing.explorePersonalDesc',
    icon: 'solar:user-heart-bold',
    accent: 'personal',
  },
  {
    key: 'business',
    route: buyerRoutes.business,
    labelKey: 'landing.navBusinessTools',
    descKey: 'landing.exploreBusinessDesc',
    icon: 'solar:widget-5-bold',
    accent: 'business',
  },
  {
    key: 'merchant',
    route: buyerRoutes.merchant,
    labelKey: 'landing.navSell',
    descKey: 'landing.exploreMerchantDesc',
    icon: 'solar:shop-2-bold',
    accent: 'merchant',
  },
  {
    key: 'restaurants',
    route: buyerRoutes.restaurants,
    labelKey: 'landing.exploreRestaurants',
    descKey: 'landing.exploreRestaurantsDesc',
    icon: 'solar:cup-hot-bold',
    accent: 'restaurants',
  },
  {
    key: 'hotels',
    route: buyerRoutes.hotels,
    labelKey: 'landing.exploreHotels',
    descKey: 'landing.exploreHotelsDesc',
    icon: 'solar:bed-bold',
    accent: 'hotels',
  },
  {
    key: 'courier',
    route: buyerRoutes.courier,
    labelKey: 'landing.exploreCourier',
    descKey: 'landing.exploreCourierDesc',
    icon: 'solar:delivery-bold',
    accent: 'courier',
  },
  {
    key: 'vouchers',
    route: buyerRoutes.vouchers,
    labelKey: 'landing.exploreVouchers',
    descKey: 'landing.exploreVouchersDesc',
    icon: 'solar:ticket-bold',
    accent: 'vouchers',
  },
  {
    key: 'share-earn',
    route: buyerRoutes.shareEarn,
    labelKey: 'landing.exploreShareEarn',
    descKey: 'landing.exploreShareEarnDesc',
    icon: 'solar:gift-bold',
    accent: 'share',
  },
  {
    key: 'discover',
    route: buyerRoutes.discover,
    labelKey: 'landing.exploreDiscover',
    descKey: 'landing.exploreDiscoverDesc',
    icon: 'solar:calendar-bold',
    accent: 'discover',
  },
  {
    key: 'community',
    route: buyerRoutes.community,
    labelKey: 'landing.navCommunity',
    descKey: 'landing.exploreCommunityDesc',
    icon: 'solar:users-group-rounded-bold',
    accent: 'community',
  },
  {
    key: 'app',
    route: buyerRoutes.appHomepage,
    labelKey: 'landing.exploreApp',
    descKey: 'landing.exploreAppDesc',
    icon: 'solar:smartphone-2-bold',
    accent: 'app',
  },
] as const
