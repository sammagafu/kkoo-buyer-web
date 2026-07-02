import type { useAuthStore } from '@/stores/auth'
import { readAdminAuthTokens } from '@/utils/adminAuthSessionStorage'
import { jwtExpiresAtMs, refreshAccessTokenSingleFlight } from '@/utils/tokenRefresh'

type AuthStore = ReturnType<typeof useAuthStore>

/** Validates tokens before entering auth-required routes (expired refresh → sign-in). */
export async function ensureAuthSessionValid(auth: AuthStore): Promise<boolean> {
  await auth.initialize()
  if (!auth.isAuthenticated) return false

  const { access, refresh } = readAdminAuthTokens()
  if (!access || !refresh) {
    await auth.clearSession()
    return false
  }

  const now = Date.now()
  const refreshExp = jwtExpiresAtMs(refresh)
  if (refreshExp != null && refreshExp <= now) {
    await auth.clearSession()
    return false
  }

  const accessExp = jwtExpiresAtMs(access)
  if (accessExp != null && accessExp <= now + 30_000) {
    const rotated = await refreshAccessTokenSingleFlight()
    if (!rotated?.access) {
      await auth.clearSession()
      return false
    }
  }

  return auth.isAuthenticated
}
