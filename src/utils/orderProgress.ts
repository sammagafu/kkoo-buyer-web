/** Shared store / parent order progress helpers for buyer order detail. */

export const STORE_PROGRESS_KEYS = ['pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered'] as const

export type StoreProgressKey = (typeof STORE_PROGRESS_KEYS)[number]

export function normalizeStoreStatus(status: unknown): string {
  const s = String(status ?? 'pending').toLowerCase().trim()
  if (s === 'processing') return 'preparing'
  if (s === 'completed') return 'delivered'
  return s || 'pending'
}

export function storeProgressIndex(status: unknown): number {
  const s = normalizeStoreStatus(status)
  if (s === 'cancelled') return -1
  const idx = (STORE_PROGRESS_KEYS as readonly string[]).indexOf(s)
  return idx >= 0 ? idx : 0
}

export function storeProgressStates(
  status: unknown,
  labels: Record<StoreProgressKey, string>,
): Array<{ key: string; label: string; state: 'todo' | 'active' | 'done' }> {
  const s = normalizeStoreStatus(status)
  if (s === 'cancelled') {
    return STORE_PROGRESS_KEYS.map((key) => ({
      key,
      label: labels[key],
      state: 'todo' as const,
    }))
  }
  const current = storeProgressIndex(status)
  return STORE_PROGRESS_KEYS.map((key, i) => ({
    key,
    label: labels[key],
    state: (i < current ? 'done' : i === current ? 'active' : 'todo') as 'todo' | 'active' | 'done',
  }))
}
