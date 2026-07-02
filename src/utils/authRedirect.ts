import type { RouteLocationRaw } from 'vue-router'
import { isPublicAppPath } from '@/constants/publicRoutes'

/** Safe post-login redirect from ?redirectedFrom= query. */
export function resolvePostAuthRedirect(
  redirectedFrom: unknown,
  fallback: RouteLocationRaw,
): RouteLocationRaw {
  if (typeof redirectedFrom !== 'string' || !redirectedFrom.startsWith('/')) {
    return fallback
  }
  if (redirectedFrom.startsWith('//') || redirectedFrom.includes('://')) {
    return fallback
  }
  return redirectedFrom
}

export const AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED'

type AuthMarkedError = {
  __authSessionExpired?: boolean
  response?: { status?: number; data?: { detail?: string; error?: string } }
  code?: string
}

let authRedirectInProgress = false

export function isAuthRedirectInProgress(): boolean {
  return authRedirectInProgress
}

export function markAuthSessionError(err: unknown): void {
  if (err && typeof err === 'object') {
    ;(err as AuthMarkedError).__authSessionExpired = true
  }
}

export function isAuthSessionError(err: unknown): boolean {
  if (authRedirectInProgress) return true
  const e = err as AuthMarkedError
  if (e?.__authSessionExpired) return true
  if (e?.code === AUTH_SESSION_EXPIRED) return true
  if (e?.response?.status === 401) return true
  const msg = String(e?.response?.data?.detail ?? e?.response?.data?.error ?? '').toLowerCase()
  return (
    msg.includes('authorization header required') ||
    msg.includes('authentication credentials') ||
    msg.includes('not authenticated') ||
    msg.includes('invalid token') ||
    msg.includes('token expired')
  )
}

export function appPathFromLocation(): string {
  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length) || '/'
    : window.location.pathname
}

export function isAuthRequiredApiUrl(url: string, method: string): boolean {
  const path = url.toLowerCase()
  const verb = method.toLowerCase()
  if (path.includes('/logistics/passenger/quote')) return false
  if (path.includes('/logistics/passenger/rides')) return true
  if (path.includes('/buy-for-me')) return verb !== 'get'
  if (path.includes('/cart/')) return true
  if (path.includes('/orders/')) return true
  if (path.includes('/wishlist/')) return true
  if (path.includes('/notifications/')) return true
  if (path.includes('/users/me')) return true
  return false
}

/** Whether a failed auth should redirect to sign-in instead of showing an API error. */
export function shouldRedirectToSignIn(originalUrl: string, method: string, appPath: string): boolean {
  if (appPath.startsWith('/auth/')) return false
  if (isAuthRequiredApiUrl(originalUrl, method)) return true
  if (method !== 'get') return true
  if (!isPublicAppPath(appPath)) return true
  return false
}

export function redirectToSignIn(returnPath?: string): void {
  if (typeof window === 'undefined') return
  if (authRedirectInProgress) return
  authRedirectInProgress = true

  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const path = returnPath ?? `${appPathFromLocation()}${window.location.search || ''}`
  const signInUrl = new URL(`${basePath}/auth/sign-in`, window.location.origin)
  signInUrl.searchParams.set('redirectedFrom', path)
  window.location.assign(signInUrl.toString())
}
