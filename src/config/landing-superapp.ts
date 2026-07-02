import type { RouteLocationRaw } from 'vue-router'
import {
  bizCrmUrl,
  bizSellerAccountUrl,
  bizSellerDashboardUrl,
  bizSellerRegisterUrl,
  buyerRoutes,
} from '@/config/landing-links'

export type SuperAppAudienceId = 'consumer' | 'merchant' | 'rider' | 'business'
export type SuperAppPillarId = 'eat' | 'buy' | 'go' | 'sell'

export type SuperAppLink = {
  key: string
  labelKey: string
  descKey: string
  icon: string
  to?: RouteLocationRaw
  href?: string
}

export type SuperAppServiceGroup = {
  key: string
  titleKey: string
  items: SuperAppLink[]
}

export const superAppAudiences: {
  id: SuperAppAudienceId
  labelKey: string
  descKey: string
  icon: string
}[] = [
  { id: 'consumer', labelKey: 'landing.superApp.audienceConsumer', descKey: 'landing.superApp.audienceConsumerDesc', icon: 'solar:cart-large-2-bold' },
  { id: 'merchant', labelKey: 'landing.superApp.audienceMerchant', descKey: 'landing.superApp.audienceMerchantDesc', icon: 'solar:shop-2-bold' },
  { id: 'rider', labelKey: 'landing.superApp.audienceRider', descKey: 'landing.superApp.audienceRiderDesc', icon: 'solar:scooter-bold' },
  { id: 'business', labelKey: 'landing.superApp.audienceBusiness', descKey: 'landing.superApp.audienceBusinessDesc', icon: 'solar:buildings-3-bold' },
]

const consumerGroups: SuperAppServiceGroup[] = [
  {
    key: 'deliveries',
    titleKey: 'landing.superApp.groupDeliveries',
    items: [
      { key: 'eats', labelKey: 'landing.navEats', descKey: 'landing.superApp.eatsDesc', icon: 'solar:cup-hot-bold', to: buyerRoutes.eats },
      { key: 'grocery', labelKey: 'landing.navGrocery', descKey: 'landing.superApp.groceryDesc', icon: 'solar:bag-2-bold', to: buyerRoutes.grocery },
      { key: 'marketplace', labelKey: 'landing.navMarketplace', descKey: 'landing.superApp.marketplaceDesc', icon: 'solar:cart-large-2-bold', to: buyerRoutes.marketplace },
      { key: 'send', labelKey: 'landing.navSend', descKey: 'landing.superApp.sendDesc', icon: 'solar:box-bold', to: buyerRoutes.send },
    ],
  },
  {
    key: 'mobility',
    titleKey: 'landing.superApp.groupMobility',
    items: [
      { key: 'ride', labelKey: 'landing.navRide', descKey: 'landing.superApp.rideDesc', icon: 'solar:scooter-bold', to: buyerRoutes.ride },
      { key: 'courier', labelKey: 'landing.exploreCourier', descKey: 'landing.superApp.courierDesc', icon: 'solar:delivery-bold', to: buyerRoutes.courier },
    ],
  },
  {
    key: 'stay',
    titleKey: 'landing.superApp.groupStay',
    items: [
      { key: 'restaurants', labelKey: 'landing.exploreRestaurants', descKey: 'landing.superApp.restaurantsDesc', icon: 'solar:chef-hat-bold', to: buyerRoutes.restaurants },
      { key: 'hotels', labelKey: 'landing.exploreHotels', descKey: 'landing.superApp.hotelsDesc', icon: 'solar:bed-bold', to: buyerRoutes.hotels },
      { key: 'booking', labelKey: 'landing.navBooking', descKey: 'landing.superApp.bookingDesc', icon: 'solar:calendar-bold', to: buyerRoutes.booking },
    ],
  },
  {
    key: 'rewards',
    titleKey: 'landing.superApp.groupRewards',
    items: [
      { key: 'vouchers', labelKey: 'landing.exploreVouchers', descKey: 'landing.superApp.vouchersDesc', icon: 'solar:ticket-bold', to: buyerRoutes.vouchers },
      { key: 'share-earn', labelKey: 'landing.exploreShareEarn', descKey: 'landing.superApp.shareEarnDesc', icon: 'solar:gift-bold', to: buyerRoutes.shareEarn },
      { key: 'community', labelKey: 'landing.navCommunity', descKey: 'landing.superApp.communityDesc', icon: 'solar:users-group-rounded-bold', to: buyerRoutes.community },
    ],
  },
]

const merchantGroups: SuperAppServiceGroup[] = [
  {
    key: 'sell',
    titleKey: 'landing.superApp.groupSell',
    items: [
      { key: 'register', labelKey: 'landing.footerBecomeSeller', descKey: 'landing.superApp.registerDesc', icon: 'solar:add-circle-bold', href: bizSellerRegisterUrl },
      { key: 'portal', labelKey: 'landing.footerNavBusinessTools', descKey: 'landing.superApp.portalDesc', icon: 'solar:widget-5-bold', href: bizSellerDashboardUrl },
      { key: 'account', labelKey: 'landing.footerSellerAccount', descKey: 'landing.superApp.accountDesc', icon: 'solar:user-circle-bold', href: bizSellerAccountUrl },
      { key: 'crm', labelKey: 'landing.superApp.crmTitle', descKey: 'landing.superApp.crmDesc', icon: 'solar:buildings-3-bold', href: bizCrmUrl },
    ],
  },
  {
    key: 'grow',
    titleKey: 'landing.superApp.groupGrowMerchant',
    items: [
      { key: 'business', labelKey: 'landing.navBusiness', descKey: 'landing.exploreBusinessDesc', icon: 'solar:shop-2-bold', to: buyerRoutes.business },
      { key: 'merchant', labelKey: 'landing.exploreMerchant', descKey: 'landing.exploreMerchantDesc', icon: 'solar:bag-5-bold', to: buyerRoutes.merchant },
    ],
  },
]

const riderGroups: SuperAppServiceGroup[] = [
  {
    key: 'earn',
    titleKey: 'landing.superApp.groupEarnRider',
    items: [
      { key: 'courier', labelKey: 'landing.superApp.driveCourier', descKey: 'landing.superApp.driveCourierDesc', icon: 'solar:delivery-bold', to: buyerRoutes.courier },
      { key: 'ride', labelKey: 'landing.superApp.driveRide', descKey: 'landing.superApp.driveRideDesc', icon: 'solar:scooter-bold', to: buyerRoutes.ride },
    ],
  },
]

const businessGroups: SuperAppServiceGroup[] = [
  {
    key: 'enterprise',
    titleKey: 'landing.superApp.groupEnterprise',
    items: [
      { key: 'business', labelKey: 'landing.navBusiness', descKey: 'landing.superApp.enterpriseBusinessDesc', icon: 'solar:shop-2-bold', to: buyerRoutes.business },
      { key: 'partner', labelKey: 'landing.footerPartnerApi', descKey: 'landing.superApp.partnerDesc', icon: 'solar:code-square-bold', to: { name: 'pages.partner-register' } },
      { key: 'careers', labelKey: 'landing.footerCareers', descKey: 'landing.superApp.careersDesc', icon: 'solar:case-round-bold', to: buyerRoutes.careers },
    ],
  },
]

export const superAppServiceGroups: Record<SuperAppAudienceId, SuperAppServiceGroup[]> = {
  consumer: consumerGroups,
  merchant: merchantGroups,
  rider: riderGroups,
  business: businessGroups,
}

/** Brand pillars — Eat · Buy · Go · Sell */
export const superAppPillars: {
  id: SuperAppPillarId
  labelKey: string
  taglineKey: string
  descKey: string
  icon: string
  tone: SuperAppPillarId
}[] = [
  {
    id: 'eat',
    labelKey: 'landing.superApp.pillarEat',
    taglineKey: 'landing.superApp.pillarEatTag',
    descKey: 'landing.superApp.pillarEatDesc',
    icon: 'solar:cup-hot-bold',
    tone: 'eat',
  },
  {
    id: 'buy',
    labelKey: 'landing.superApp.pillarBuy',
    taglineKey: 'landing.superApp.pillarBuyTag',
    descKey: 'landing.superApp.pillarBuyDesc',
    icon: 'solar:cart-large-2-bold',
    tone: 'buy',
  },
  {
    id: 'go',
    labelKey: 'landing.superApp.pillarGo',
    taglineKey: 'landing.superApp.pillarGoTag',
    descKey: 'landing.superApp.pillarGoDesc',
    icon: 'solar:scooter-bold',
    tone: 'go',
  },
  {
    id: 'sell',
    labelKey: 'landing.superApp.pillarSell',
    taglineKey: 'landing.superApp.pillarSellTag',
    descKey: 'landing.superApp.pillarSellDesc',
    icon: 'solar:shop-2-bold',
    tone: 'sell',
  },
]

const eatGroups: SuperAppServiceGroup[] = [
  {
    key: 'deliveries',
    titleKey: 'landing.superApp.groupDeliveries',
    items: [
      { key: 'eats', labelKey: 'landing.navEats', descKey: 'landing.superApp.eatsDesc', icon: 'solar:cup-hot-bold', to: buyerRoutes.eats },
      { key: 'grocery', labelKey: 'landing.navGrocery', descKey: 'landing.superApp.groceryDesc', icon: 'solar:bag-2-bold', to: buyerRoutes.grocery },
    ],
  },
  {
    key: 'stay',
    titleKey: 'landing.superApp.groupStay',
    items: [
      { key: 'restaurants', labelKey: 'landing.exploreRestaurants', descKey: 'landing.superApp.restaurantsDesc', icon: 'solar:chef-hat-bold', to: buyerRoutes.restaurants },
      { key: 'booking', labelKey: 'landing.navBooking', descKey: 'landing.superApp.bookingDesc', icon: 'solar:calendar-bold', to: buyerRoutes.booking },
    ],
  },
]

const buyGroups: SuperAppServiceGroup[] = [
  {
    key: 'shop',
    titleKey: 'landing.superApp.groupShop',
    items: [
      { key: 'marketplace', labelKey: 'landing.navMarketplace', descKey: 'landing.superApp.marketplaceDesc', icon: 'solar:cart-large-2-bold', to: buyerRoutes.marketplace },
      { key: 'hotels', labelKey: 'landing.exploreHotels', descKey: 'landing.superApp.hotelsDesc', icon: 'solar:bed-bold', to: buyerRoutes.hotels },
      { key: 'vouchers', labelKey: 'landing.exploreVouchers', descKey: 'landing.superApp.vouchersDesc', icon: 'solar:ticket-bold', to: buyerRoutes.vouchers },
      { key: 'community', labelKey: 'landing.navCommunity', descKey: 'landing.superApp.communityDesc', icon: 'solar:users-group-rounded-bold', to: buyerRoutes.community },
    ],
  },
  {
    key: 'rewards',
    titleKey: 'landing.superApp.groupRewards',
    items: [
      { key: 'share-earn', labelKey: 'landing.exploreShareEarn', descKey: 'landing.superApp.shareEarnDesc', icon: 'solar:gift-bold', to: buyerRoutes.shareEarn },
    ],
  },
]

const goGroups: SuperAppServiceGroup[] = [
  {
    key: 'mobility',
    titleKey: 'landing.superApp.groupMobility',
    items: [
      { key: 'ride', labelKey: 'landing.navRide', descKey: 'landing.superApp.rideDesc', icon: 'solar:scooter-bold', to: buyerRoutes.ride },
      { key: 'courier', labelKey: 'landing.exploreCourier', descKey: 'landing.superApp.courierDesc', icon: 'solar:delivery-bold', to: buyerRoutes.courier },
      { key: 'send', labelKey: 'landing.navSend', descKey: 'landing.superApp.sendDesc', icon: 'solar:box-bold', to: buyerRoutes.send },
    ],
  },
]

const sellGroups: SuperAppServiceGroup[] = [
  ...merchantGroups,
  ...riderGroups,
  ...businessGroups,
]

export const superAppPillarGroups: Record<SuperAppPillarId, SuperAppServiceGroup[]> = {
  eat: eatGroups,
  buy: buyGroups,
  go: goGroups,
  sell: sellGroups,
}

export const superAppEarnCards: SuperAppLink[] = [
  { key: 'sell', labelKey: 'landing.superApp.earnSell', descKey: 'landing.superApp.earnSellDesc', icon: 'solar:shop-2-bold', href: bizSellerRegisterUrl },
  { key: 'deliver', labelKey: 'landing.superApp.earnDeliver', descKey: 'landing.superApp.earnDeliverDesc', icon: 'solar:delivery-bold', to: buyerRoutes.courier },
  { key: 'share', labelKey: 'landing.superApp.earnShare', descKey: 'landing.superApp.earnShareDesc', icon: 'solar:gift-bold', to: buyerRoutes.shareEarn },
]
