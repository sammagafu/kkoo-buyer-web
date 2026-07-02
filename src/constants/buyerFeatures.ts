import type { RouteLocationRaw } from 'vue-router'

export type BuyerFeatureTile = {
  id: string
  title: string
  subtitle: string
  icon: string
  routeName: string
  tone?: 'primary' | 'orange' | 'teal' | 'pink' | 'purple' | 'gold'
  auth?: boolean
}

/** Mirrors Flutter super_app_services_hub + home shortcuts. */
export const BUYER_SERVICE_TILES: BuyerFeatureTile[] = [
  { id: 'market', title: 'Buy', subtitle: 'Marketplace', icon: 'solar:shop-bold', routeName: 'buyer.marketplace', tone: 'primary' },
  { id: 'eats', title: 'Eat', subtitle: 'Restaurants', icon: 'solar:chef-hat-bold', routeName: 'buyer.eats', tone: 'orange' },
  { id: 'grocery', title: 'Groceries', subtitle: 'Stores near you', icon: 'solar:cart-large-2-bold', routeName: 'buyer.grocery', tone: 'teal' },
  { id: 'pharmacy', title: 'Pharmacy', subtitle: 'Medicines & reminders', icon: 'solar:health-bold', routeName: 'buyer.pharmacy', tone: 'teal' },
  { id: 'ride', title: 'Move', subtitle: 'Rides & delivery', icon: 'solar:scooter-bold', routeName: 'buyer.ride', tone: 'purple' },
  { id: 'send', title: 'Send me', subtitle: 'Shop for you', icon: 'solar:bag-heart-bold', routeName: 'buyer.send', tone: 'pink' },
  { id: 'hotels', title: 'Stays', subtitle: 'Hotels & booking', icon: 'solar:bed-bold', routeName: 'buyer.booking', tone: 'purple' },
  { id: 'nearby', title: 'Nearby', subtitle: 'Discover around you', icon: 'solar:map-point-bold', routeName: 'buyer.nearby', tone: 'gold' },
  { id: 'flash', title: 'Flash sales', subtitle: 'Limited-time deals', icon: 'solar:fire-bold', routeName: 'buyer.flash-sales', tone: 'orange' },
  { id: 'wholesale', title: 'Wholesale', subtitle: 'Bulk buying', icon: 'solar:box-bold', routeName: 'buyer.wholesale' },
]

export const BUYER_ACCOUNT_TILES: BuyerFeatureTile[] = [
  { id: 'orders', title: 'Orders', subtitle: 'Track & history', icon: 'solar:bag-check-bold', routeName: 'buyer.orders', auth: true },
  { id: 'reservations', title: 'Reservations', subtitle: 'Tables & hotels', icon: 'solar:calendar-bold', routeName: 'buyer.reservations', auth: true },
  { id: 'wallet', title: 'Wallet', subtitle: 'Balance & top-up', icon: 'solar:wallet-bold', routeName: 'buyer.wallet', auth: true },
  { id: 'rewards', title: 'Rewards', subtitle: 'Points & vouchers', icon: 'solar:gift-bold', routeName: 'buyer.rewards', auth: true },
  { id: 'gamification', title: 'XP & streaks', subtitle: 'Achievements', icon: 'solar:medal-ribbons-star-bold', routeName: 'buyer.gamification', auth: true },
  { id: 'weekly-pass', title: 'Weekly pass', subtitle: 'Challenges', icon: 'solar:ticket-bold', routeName: 'buyer.weekly-pass', auth: true },
  { id: 'referral', title: 'Refer friends', subtitle: 'Earn together', icon: 'solar:users-group-rounded-bold', routeName: 'buyer.referral', auth: true },
  { id: 'share-earn', title: 'Share & earn', subtitle: 'Influencer earnings', icon: 'solar:share-bold', routeName: 'buyer.share-earn', auth: true },
  { id: 'premium', title: 'Premium', subtitle: 'Membership perks', icon: 'solar:crown-bold', routeName: 'buyer.premium' },
  { id: 'returns', title: 'Returns', subtitle: 'Refund requests', icon: 'solar:restart-bold', routeName: 'buyer.returns', auth: true },
  { id: 'disputes', title: 'Disputes', subtitle: 'Order issues', icon: 'solar:shield-warning-bold', routeName: 'buyer.disputes', auth: true },
  { id: 'messages', title: 'Messages', subtitle: 'Chat with sellers', icon: 'solar:chat-round-bold', routeName: 'buyer.messages', auth: true },
  { id: 'settings', title: 'Settings', subtitle: 'Privacy & help', icon: 'solar:settings-bold', routeName: 'buyer.settings', auth: true },
]

export function featureRoute(tile: BuyerFeatureTile): RouteLocationRaw {
  return { name: tile.routeName }
}
