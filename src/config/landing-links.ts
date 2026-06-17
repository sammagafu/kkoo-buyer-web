/**
 * Canonical routes and external app URLs for the buyer landing experience.
 */
export const buyerRoutes = {
  marketplace: { name: 'buyer.marketplace' },
  eats: { name: 'buyer.eats' },
  grocery: { name: 'buyer.grocery' },
  send: { name: 'buyer.send' },
  ride: { name: 'buyer.ride' },
  booking: { name: 'buyer.booking' },
  checkout: { name: 'buyer.checkout' },
  favorites: { name: 'buyer.favorites' },
  compare: { name: 'buyer.compare' },
  account: { name: 'buyer.profile' },
  orders: { name: 'buyer.orders' },
  search: { name: 'buyer.search' },
  signIn: { name: 'auth.sign-in' },
  signUp: { name: 'auth.sign-up' },
  sellerRegister: { name: 'auth.seller-register' },
  landing: { name: 'pages.landing' },
  business: { name: 'pages.business' },
  community: { name: 'pages.community' },
  discover: { name: 'pages.discover' },
  careers: { name: 'pages.careers' },
  partnerRegister: { name: 'pages.partner-register' },
  personal: { name: 'pages.personal' },
  restaurants: { name: 'pages.restaurants' },
  hotels: { name: 'pages.hotels' },
  courier: { name: 'pages.courier' },
  vouchers: { name: 'pages.vouchers' },
  shareEarn: { name: 'pages.share-earn' },
  appHomepage: { name: 'pages.app-homepage' },
  merchant: { name: 'pages.merchant' },
} as const

export const landingAnchors = {
  solutions: { name: 'pages.landing', hash: '#solutions' },
  download: { name: 'pages.landing', hash: '#download' },
  work: { name: 'pages.landing', hash: '#work' },
  businesses: { name: 'pages.landing', hash: '#businesses' },
} as const

/** Primary marketing nav — focused consumer links (no admin/biz or vertical dropdowns). */
export const primaryNavItems = [
  {
    key: 'discover',
    route: buyerRoutes.discover,
    labelKey: 'landing.navDiscover',
    icon: 'solar:calendar-bold',
  },
  {
    key: 'shop',
    route: buyerRoutes.marketplace,
    labelKey: 'landing.navShop',
    icon: 'solar:cart-large-2-bold',
  },
  {
    key: 'eat',
    route: buyerRoutes.eats,
    labelKey: 'landing.navEats',
    icon: 'solar:cup-hot-bold',
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
    route: buyerRoutes.careers,
    labelKey: 'landing.navJobs',
    icon: 'solar:case-round-bold',
  },
  {
    key: 'community',
    route: buyerRoutes.community,
    labelKey: 'landing.navCommunity',
    icon: 'solar:users-group-rounded-bold',
  },
] as const

/** Seller / CRM web app (separate deploy). */
export const bizWebUrl =
  (import.meta.env.VITE_BIZ_WEB_ORIGIN as string | undefined) || 'https://biz.kkooapp.co.tz'

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
    labelKey: 'landing.navBusiness',
    descKey: 'landing.exploreBusinessDesc',
    icon: 'solar:shop-2-bold',
    accent: 'business',
  },
  {
    key: 'merchant',
    route: buyerRoutes.merchant,
    labelKey: 'landing.exploreMerchant',
    descKey: 'landing.exploreMerchantDesc',
    icon: 'solar:bag-5-bold',
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
