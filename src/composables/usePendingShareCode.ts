const PENDING_SHARE_CODE_KEY = 'kkoo_pending_share_code'

/** Persist product share attribution from ?ref= until checkout. */
export function setPendingShareCode(code?: string | null) {
  const c = String(code ?? '').trim()
  if (!c || typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(PENDING_SHARE_CODE_KEY, c)
}

/** Read and clear pending share code (call once at order create). */
export function takePendingShareCode(): string | undefined {
  if (typeof sessionStorage === 'undefined') return undefined
  const c = sessionStorage.getItem(PENDING_SHARE_CODE_KEY)?.trim()
  if (c) sessionStorage.removeItem(PENDING_SHARE_CODE_KEY)
  return c || undefined
}

export function peekPendingShareCode(): string | undefined {
  if (typeof sessionStorage === 'undefined') return undefined
  return sessionStorage.getItem(PENDING_SHARE_CODE_KEY)?.trim() || undefined
}
