import { bizSellerRegisterUrl } from '@/config/landing-links'

export type BuyerHomeAction = {
  id: 'buy' | 'send' | 'parcel' | 'eat' | 'sell'
  icon: string
  tone: 'buy' | 'send' | 'parcel' | 'eat' | 'sell'
  labelKey: string
  subKey: string
  routeName?: string
  href?: string
  wide?: boolean
}

export const BUYER_HOME_ACTIONS: BuyerHomeAction[] = [
  {
    id: 'buy',
    icon: 'solar:bag-3-bold',
    tone: 'buy',
    labelKey: 'buyerXp.home.actions.buy',
    subKey: 'buyerXp.home.actions.buySub',
    routeName: 'buyer.search',
  },
  {
    id: 'send',
    icon: 'solar:cart-large-2-bold',
    tone: 'send',
    labelKey: 'buyerXp.home.actions.send',
    subKey: 'buyerXp.home.actions.sendSub',
    routeName: 'buyer.send',
  },
  {
    id: 'parcel',
    icon: 'solar:box-bold',
    tone: 'parcel',
    labelKey: 'buyerXp.home.actions.parcel',
    subKey: 'buyerXp.home.actions.parcelSub',
    routeName: 'buyer.parcel',
  },
  {
    id: 'eat',
    icon: 'solar:cup-hot-bold',
    tone: 'eat',
    labelKey: 'buyerXp.home.actions.eat',
    subKey: 'buyerXp.home.actions.eatSub',
    routeName: 'buyer.eats',
  },
  {
    id: 'sell',
    icon: 'solar:shop-2-bold',
    tone: 'sell',
    labelKey: 'buyerXp.home.actions.sell',
    subKey: 'buyerXp.home.actions.sellSub',
    href: bizSellerRegisterUrl,
    wide: true,
  },
]
