/** Whole days remaining until `endAt` (inclusive of partial day). Null if undated. */
export function daysUntil(endAt?: string | null, nowMs = Date.now()): number | null {
  if (!endAt) return null
  const end = Date.parse(endAt)
  if (!Number.isFinite(end)) return null
  return Math.max(0, Math.ceil((end - nowMs) / 86_400_000))
}

export function isPreorderCampaign(camp: { action_type?: string; badge?: string } | null | undefined): boolean {
  if (!camp) return false
  const action = String(camp.action_type ?? '').trim().toLowerCase()
  if (action === 'preorder') return true
  return String(camp.badge ?? '').trim().toLowerCase() === 'preorder'
}
