import { computed, watchEffect } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'

export type BuyerTab = 'home' | 'shop' | 'orders' | 'profile'

const HOME_ROUTES = new Set([
  'buyer.marketplace',
  'buyer.dashboard',
  'buyer.market',
  'buyer.eats',
  'buyer.grocery',
  'buyer.pharmacy',
  'buyer.ride',
  'buyer.parcel',
  'buyer.booking',
  'buyer.send',
  'buyer.compare',
  'buyer.services',
  'buyer.nearby',
  'buyer.flash-sales',
  'buyer.search',
  'buyer.wholesale',
  'buyer.premium',
])

export function useBuyerAppShell() {
  const route = useRoute()

  const showShell = computed(() => route.matched.some((record) => record.meta.buyerShell === true))

  const activeTab = computed<BuyerTab>(() => {
    const name = String(route.name ?? '')
    if (name === 'buyer.search' || name === 'buyer.product' || name === 'buyer.category') return 'shop'
    if (name === 'buyer.orders' || name === 'buyer.order') return 'orders'
    if (name === 'buyer.profile' || name === 'buyer.settings') return 'profile'
    if (name === 'buyer.marketplace' || name === 'buyer.dashboard' || name === 'buyer.market') return 'home'
    if (HOME_ROUTES.has(name)) return 'home'
    return 'home'
  })

  watchEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('buyer-shell-active', showShell.value)
  })

  return { showShell, activeTab }
}

export const buyerTabRoutes: Record<BuyerTab, RouteLocationRaw> = {
  home: BUYER_DASHBOARD_ROUTE,
  shop: { name: 'buyer.search' },
  orders: { name: 'buyer.orders' },
  profile: { name: 'buyer.profile' },
}
