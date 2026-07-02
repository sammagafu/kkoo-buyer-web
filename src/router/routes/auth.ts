import type { RouteLocationGeneric } from 'vue-router'
import { setTitle } from './meta'
import { bizSellerRegisterUrl } from '@/config/landing-links'

function redirectSellerRegisterToBiz(to: RouteLocationGeneric) {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(to.query as Record<string, string>).toString()
    window.location.replace(q ? `${bizSellerRegisterUrl}?${q}` : bizSellerRegisterUrl)
    return false
  }
  return { name: 'auth.sign-in' }
}

function redirectSignUpSellerIntent(to: RouteLocationGeneric) {
  const v = typeof to.query.as === 'string' ? to.query.as.toLowerCase().trim() : ''
  if (v === 'seller' || v === 'sell' || v === 'business') {
    return redirectSellerRegisterToBiz(to)
  }
  return true
}

export const authRoutes = [
    {
        path: '/auth/sign-in',
        name: 'auth.sign-in',
        meta: {
            title: setTitle('Sign In'),
            description: "Sign in to KKOO Admin or Business. One account, the right dashboard."
        },
        component: () => import('@/views/auth/sign-in.vue')
    },
    {
        path: '/auth/sign-up',
        name: 'auth.sign-up',
        meta: {
            title: setTitle('Sign Up'),
            description: "Create your KKOO account. Shop, send, and move from one trusted platform."
        },
        beforeEnter: redirectSignUpSellerIntent,
        component: () => import('@/views/auth/sign-up.vue')
    },
    {
        path: '/auth/seller-register',
        name: 'auth.seller-register',
        meta: {
            title: setTitle('Become a Seller'),
            description:
                "Register for KKOO Business. List products, manage orders, request delivery, and get paid in one place.",
        },
        redirect: (to: RouteLocationGeneric) => {
            if (typeof window !== 'undefined') {
                const q = new URLSearchParams(to.query as Record<string, string>).toString()
                window.location.replace(q ? `${bizSellerRegisterUrl}?${q}` : bizSellerRegisterUrl)
            }
            return { name: 'auth.sign-in' }
        },
    },
    {
        path: '/auth/oauth/callback',
        name: 'auth.oauth-callback',
        meta: { title: setTitle('Signing in') },
        component: () => import('@/views/auth/oauth-callback.vue'),
    },
    {
        path: '/account/oauth',
        name: 'account.oauth',
        meta: { title: setTitle('KKOO Account') },
        component: () => import('@/views/account/OAuthAuthorize.vue'),
    },
    {
        path: '/mobile/oauth/callback',
        name: 'mobile.oauth-callback',
        meta: { title: setTitle('Mobile sign-in') },
        component: () => import('@/views/auth/mobile-oauth-callback.vue'),
    },
    {
        path: '/auth/lock-screen',
        name: 'auth.lock-screen',
        meta: {
            title: setTitle('Lock Screen')
        },
        component: () => import('@/views/auth/lock-screen.vue')
    }
];
