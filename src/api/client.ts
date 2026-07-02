/**
 * KKOO API client for the seller & admin panel.
 * Base URL from import.meta.env.VITE_API_BASE_URL (e.g. http://localhost:8000/api/v1).
 * Per API.md: Bearer token, refresh on 401, clear tokens when refresh fails.
 * (Buyers use the mobile app and customer website.)
 */
import axios, { type AxiosInstance } from 'axios'
import {
  clearAdminAuthSession,
  readAdminAuthTokens,
} from '@/utils/adminAuthSessionStorage'
import {
  appPathFromLocation,
  isAuthRequiredApiUrl,
  markAuthSessionError,
  redirectToSignIn,
  shouldRedirectToSignIn,
} from '@/utils/authRedirect'
import { resolveApiBaseUrl } from '@/utils/apiBaseUrl'
import { refreshAccessTokenSingleFlight } from '@/utils/tokenRefresh'
import { resetPiniaAuthAfterRefreshFailure } from '@/utils/syncPiniaAuthFromStorage'

export { isAuthRequiredApiUrl } from '@/utils/authRedirect'

const baseURL = resolveApiBaseUrl()

/** Clear stored auth (e.g. when refresh fails). Caller should redirect to login. */
export function clearStoredAuth() {
  clearAdminAuthSession()
  void resetPiniaAuthAfterRefreshFailure()
}

const client: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

client.interceptors.request.use((config) => {
  const url = String(config.url ?? '')
  const isPublicEndpoint = url.includes('/public/')
  const { access } = readAdminAuthTokens()
  if (access && !isPublicEndpoint) config.headers.Authorization = `Bearer ${access}`
  if (config.data instanceof FormData) delete config.headers['Content-Type']
  return config
})

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    // API.md: 403 — seller_profile_required; admin_use_admin_endpoints (admin hit seller/rider-only endpoint → redirect to admin UI)
    if (err.response?.status === 403) {
      const code = err.response?.data?.error_code
      // admin_required / superuser_required: surfaces to UI (no global redirect — wrong role vs wrong credentials)
      if (code === 'seller_profile_required') {
        try {
          const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
          const path = window.location.pathname || ''
          // Staff on admin catalog routes should see the error, not leave the page.
          if (
            !path.includes('/seller/profile') &&
            !path.includes('/auth/') &&
            !path.includes('/admin/catalog')
          ) {
            window.location.href = (window.location.origin || '') + base + '/seller/profile'
            return Promise.reject(err)
          }
        } catch (_) {
          // ignore
        }
      }
      if (code === 'admin_use_admin_endpoints') {
        try {
          const path = window.location.pathname || ''
          if (!path.includes('/admin/')) {
            const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
            window.location.href = (window.location.origin || '') + base + '/admin/logistics'
            return Promise.reject(err)
          }
        } catch (_) {
          // ignore
        }
      }
    }
    // Never attempt refresh-token retry for auth endpoints.
    const originalUrl = String(original?.url ?? '')
    const isAuthEndpoint =
      originalUrl.includes('/users/login/') ||
      originalUrl.includes('/users/register/') ||
      originalUrl.includes('/users/otp/') ||
      originalUrl.includes('/users/auth/otp-') ||
      originalUrl.includes('/users/password/reset-') ||
      originalUrl.includes('/users/token/refresh/')

    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true
      const rotated = await refreshAccessTokenSingleFlight()
      if (rotated?.access) {
        original.headers.Authorization = `Bearer ${rotated.access}`
        return client(original)
      }
      clearStoredAuth()
      const appPath = appPathFromLocation()
      const method = String(original.method ?? 'get').toLowerCase()
      const needsSignIn = shouldRedirectToSignIn(originalUrl, method, appPath)
      if (needsSignIn) {
        markAuthSessionError(err)
        const returnPath = `${appPath}${window.location.search || ''}`
        redirectToSignIn(returnPath)
        return Promise.reject(err)
      }
      // Stale token on a guest-browse page: retry once without Authorization (public catalog only).
      const authRequiredUrl =
        originalUrl.includes('/cart/') ||
        originalUrl.includes('/orders/') ||
        originalUrl.includes('/wishlist/') ||
        originalUrl.includes('/notifications/') ||
        originalUrl.includes('/logistics/passenger/rides')
      if (original && !original._guestRetry && method === 'get' && !authRequiredUrl) {
        original._guestRetry = true
        delete original.headers.Authorization
        return client(original)
      }
    }
    return Promise.reject(err)
  }
)

export default client
