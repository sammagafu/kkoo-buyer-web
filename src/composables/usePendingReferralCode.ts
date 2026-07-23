const PENDING_REFERRAL_CODE_KEY = 'kkoo_pending_referral_code'

/** Persist invite/referral code from ?ref= until apply after auth. */
export function setPendingReferralCode(code?: string | null) {
  const c = String(code ?? '').trim()
  if (!c || typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(PENDING_REFERRAL_CODE_KEY, c)
}

/** Read and clear pending referral code (call once after successful apply). */
export function takePendingReferralCode(): string | undefined {
  if (typeof sessionStorage === 'undefined') return undefined
  const c = sessionStorage.getItem(PENDING_REFERRAL_CODE_KEY)?.trim()
  if (c) sessionStorage.removeItem(PENDING_REFERRAL_CODE_KEY)
  return c || undefined
}

export function peekPendingReferralCode(): string | undefined {
  if (typeof sessionStorage === 'undefined') return undefined
  return sessionStorage.getItem(PENDING_REFERRAL_CODE_KEY)?.trim() || undefined
}

export function clearPendingReferralCode() {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(PENDING_REFERRAL_CODE_KEY)
}
