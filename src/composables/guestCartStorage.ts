export type GuestCartLine = {
  guestId: number
  productId: number
  skuId: number
  quantity: number
  title: string
  unitPrice: number
  imageUrl?: string
  requiresPrescription?: boolean
}

const STORAGE_KEY = 'kkoo_guest_cart_v1'

let guestIdSeq = -1

export function nextGuestLineId(): number {
  guestIdSeq -= 1
  return guestIdSeq
}

export function readGuestCart(): GuestCartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as GuestCartLine[]
    if (!Array.isArray(parsed)) return []
    const minId = parsed.reduce((m, l) => Math.min(m, l.guestId ?? 0), 0)
    if (minId < guestIdSeq) guestIdSeq = minId - 1
    return parsed
  } catch {
    return []
  }
}

export function writeGuestCart(lines: GuestCartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    /* ignore */
  }
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function isGuestCartLineId(id?: number | null): boolean {
  return id != null && id < 0
}
