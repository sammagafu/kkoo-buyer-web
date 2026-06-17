export type BuyerPillarTone = 'primary' | 'orange' | 'purple' | 'teal' | 'pink' | 'gold'

export type BuyerPillar = {
  id: string
  label: string
  subtitle: string
  icon: string
  routeName: string
  tone: BuyerPillarTone
}

export const BUYER_PILLARS: BuyerPillar[] = [
  {
    id: 'buy',
    label: 'Buy',
    subtitle: 'Marketplace',
    icon: 'solar:shop-bold',
    routeName: 'buyer.marketplace',
    tone: 'primary',
  },
  {
    id: 'eat',
    label: 'Eat',
    subtitle: 'Restaurants',
    icon: 'solar:chef-hat-bold',
    routeName: 'buyer.eats',
    tone: 'orange',
  },
  {
    id: 'move',
    label: 'Move',
    subtitle: 'Rides',
    icon: 'solar:scooter-bold',
    routeName: 'buyer.ride',
    tone: 'purple',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    subtitle: 'Health',
    icon: 'solar:health-bold',
    routeName: 'buyer.pharmacy',
    tone: 'teal',
  },
  {
    id: 'send',
    label: 'Send me',
    subtitle: 'Shop for you',
    icon: 'solar:bag-heart-bold',
    routeName: 'buyer.send',
    tone: 'pink',
  },
  {
    id: 'more',
    label: 'More',
    subtitle: 'Groceries',
    icon: 'solar:widget-5-bold',
    routeName: 'buyer.services',
    tone: 'gold',
  },
]

export const BUYER_HOME_SHORTCUTS = [
  { id: 'orders', label: 'Orders', icon: 'solar:bag-check-bold', routeName: 'buyer.orders' },
  { id: 'rewards', label: 'Rewards', icon: 'solar:gift-bold', routeName: 'buyer.rewards' },
  { id: 'wishlist', label: 'Wishlist', icon: 'solar:heart-bold', routeName: 'buyer.favorites' },
  { id: 'send', label: 'Send me', icon: 'solar:plain-2-bold', routeName: 'buyer.send' },
] as const
