import type { RouteLocationRaw } from 'vue-router'

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

/** True when an API error indicates the user should sign in again. */
export function isAuthSessionError(err: unknown): boolean {
  const e = err as { response?: { status?: number; data?: { detail?: string; error?: string } } }
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
