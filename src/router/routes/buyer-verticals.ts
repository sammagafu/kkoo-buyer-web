import { setTitle } from './meta'

const buyerShell = { buyerShell: true }

/** Canonical buyer vertical paths on kkooapp.co.tz (one SPA). */
export const buyerVerticalRoutes = [
  { path: '/home', redirect: '/marketplace' },
  {
    path: '/marketplace',
    name: 'buyer.marketplace',
    meta: { title: setTitle('Marketplace'), ...buyerShell },
    component: () => import('@/views/web/WebMarket.vue'),
  },
  {
    path: '/search',
    name: 'buyer.search',
    meta: { title: setTitle('Search'), ...buyerShell },
    component: () => import('@/views/web/WebSearch.vue'),
  },
  {
    path: '/eats',
    name: 'buyer.eats',
    meta: { title: setTitle('Eats'), ...buyerShell },
    component: () => import('@/views/web/WebEats.vue'),
  },
  {
    path: '/grocery',
    name: 'buyer.grocery',
    meta: { title: setTitle('Groceries'), ...buyerShell },
    component: () => import('@/views/web/WebGroceries.vue'),
  },
  {
    path: '/send',
    name: 'buyer.send',
    meta: { title: setTitle('Send — Buy for me'), ...buyerShell },
    component: () => import('@/views/web/WebApp.vue'),
  },
  {
    path: '/ride',
    name: 'buyer.ride',
    meta: { title: setTitle('Ride'), ...buyerShell },
    component: () => import('@/views/web/WebRide.vue'),
  },
  {
    path: '/booking',
    name: 'buyer.booking',
    meta: { title: setTitle('Booking'), ...buyerShell },
    component: () => import('@/views/web/WebBooking.vue'),
  },
  {
    path: '/checkout',
    name: 'buyer.checkout',
    meta: { title: setTitle('Checkout'), ...buyerShell },
    component: () => import('@/views/web/WebCheckout.vue'),
  },
  {
    path: '/orders',
    name: 'buyer.orders',
    meta: { title: setTitle('Orders'), authRequired: true, ...buyerShell },
    component: () => import('@/views/web/WebOrders.vue'),
  },
  {
    path: '/profile',
    name: 'buyer.profile',
    meta: { title: setTitle('Profile'), authRequired: true, ...buyerShell },
    component: () => import('@/views/web/WebBuyerProfile.vue'),
  },
  {
    path: '/favorites',
    name: 'buyer.favorites',
    meta: { title: setTitle('Favorites'), authRequired: true, ...buyerShell },
    component: () => import('@/views/web/WebFavorites.vue'),
  },
  {
    path: '/compare',
    name: 'buyer.compare',
    meta: { title: setTitle('Compare'), ...buyerShell },
    component: () => import('@/views/web/WebCompare.vue'),
  },
  // Legacy /web/* paths and route names → canonical buyer routes
  { path: '/web', name: 'web.hub', redirect: '/marketplace' },
  { path: '/web/market', name: 'web.market', redirect: '/marketplace' },
  { path: '/web/eats', name: 'web.eats', redirect: '/eats' },
  { path: '/web/groceries', name: 'web.groceries', redirect: '/grocery' },
  { path: '/web/ride', name: 'web.ride', redirect: '/ride' },
  { path: '/web/booking', name: 'web.booking', redirect: '/booking' },
  { path: '/web/checkout', name: 'web.checkout', redirect: '/checkout' },
  { path: '/web/favorites', name: 'web.favorites', redirect: '/favorites' },
  { path: '/web/compare', name: 'web.compare', redirect: '/compare' },
]
