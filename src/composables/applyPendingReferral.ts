import { referralApi } from '@/api/referral'
import {
  peekPendingReferralCode,
  setPendingReferralCode,
  takePendingReferralCode,
} from '@/composables/usePendingReferralCode'

/** Capture ?ref= into sessionStorage for later apply. */
export function captureReferralRefFromQuery(ref: unknown) {
  const code =
    typeof ref === 'string'
      ? ref.trim()
      : Array.isArray(ref)
        ? String(ref[0] ?? '').trim()
        : ''
  if (code) setPendingReferralCode(code)
  return code || undefined
}

/**
 * Apply pending referral code (from ?ref= or sessionStorage) when authenticated.
 * Returns the code that was applied, or undefined if none / failed.
 */
export async function applyPendingReferralCode(opts?: {
  /** Prefer this code over sessionStorage peek. */
  code?: string | null
  /** Keep code in storage on failure so user can retry. */
  keepOnFailure?: boolean
}): Promise<{ ok: boolean; code?: string; message?: string }> {
  const preferred = String(opts?.code ?? '').trim()
  const code = preferred || peekPendingReferralCode()
  if (!code) return { ok: false }

  try {
    const { data } = await referralApi.apply(code)
    takePendingReferralCode()
    return { ok: true, code, message: data?.message }
  } catch {
    if (!opts?.keepOnFailure) {
      // leave pending so WebReferral / next auth can retry
    }
    return { ok: false, code }
  }
}
