import type { RouteLocationGeneric } from 'vue-router'
import { setTitle } from './meta'
import { bizCrmUrl, bizSellerAccountUrl, bizSellerDashboardUrl, bizSellerRegisterUrl } from '@/config/landing-links'

function redirectToBiz(url: string, to: RouteLocationGeneric) {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(to.query as Record<string, string>).toString()
    window.location.replace(q ? `${url}?${q}` : url)
    return { name: 'pages.business' }
  }
  return { name: 'pages.business' }
}

export const urlAliasRoutes = [
    { path: '/login', redirect: { name: 'auth.sign-in' } },
    { path: '/register', redirect: { name: 'auth.sign-up' } },
    {
        path: '/join',
        redirect: (to: RouteLocationGeneric) => redirectToBiz(bizSellerRegisterUrl, to),
    },
    {
        path: '/seller/account',
        name: 'redirect.seller-account',
        meta: { title: setTitle('Seller Account') },
        redirect: () => redirectToBiz(bizSellerAccountUrl, { query: {} } as RouteLocationGeneric),
    },
    {
        path: '/seller/crm',
        name: 'redirect.seller-crm',
        meta: { title: setTitle('Business CRM') },
        redirect: () => redirectToBiz(bizCrmUrl, { query: {} } as RouteLocationGeneric),
    },
    {
        path: '/seller',
        name: 'redirect.seller-portal',
        meta: { title: setTitle('Seller Dashboard') },
        redirect: () => redirectToBiz(bizSellerDashboardUrl, { query: {} } as RouteLocationGeneric),
    },
    // Rider/driver flows live in the rider mobile app (not this panel)
    { path: '/drive', redirect: { name: 'auth.sign-in' } },
    { path: '/signin', redirect: { name: 'auth.sign-in' } },
];
