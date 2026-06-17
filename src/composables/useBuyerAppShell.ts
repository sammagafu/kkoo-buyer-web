import { computed, watchEffect } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'

export type BuyerTab = 'home' | 'search' | 'cart' | 'orders' | 'profile'

const HOME_ROUTES = new Set([
  'buyer.marketplace',
  'buyer.eats',
  'buyer.grocery',
  'buyer.ride',
  'buyer.booking',
  'buyer.send',
  'buyer.compare',
])

export function useBuyerAppShell() {
  const route = useRoute()

  const showShell = computed(() => route.matched.some((record) => record.meta.buyerShell === true))

  const activeTab = computed<BuyerTab>(() => {
    const name = String(route.name ?? '')
    if (name === 'buyer.search') return 'search'
    if (name === 'buyer.checkout') return 'cart'
    if (name === 'buyer.orders') return 'orders'
    if (name === 'buyer.profile') return 'profile'
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
  home: { name: 'buyer.marketplace' },
  search: { name: 'buyer.search' },
  cart: { name: 'buyer.checkout' },
  orders: { name: 'buyer.orders' },
  profile: { name: 'buyer.profile' },
}
