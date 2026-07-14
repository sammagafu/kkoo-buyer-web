export type GuestWishlistItem = {
  productId: number
  title?: string
  slug?: string
  price?: number
  basePrice?: number
  imageUrl?: string
  skuId?: number
  savedAt: number
}

const STORAGE_KEY = 'kkoo_guest_wishlist_v1'

export function readGuestWishlist(): GuestWishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as GuestWishlistItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((i) => i?.productId != null && Number(i.productId) > 0)
  } catch {
    return []
  }
}

export function writeGuestWishlist(items: GuestWishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore quota */
  }
}

export function clearGuestWishlist() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function isInGuestWishlist(productId: number): boolean {
  return readGuestWishlist().some((i) => i.productId === productId)
}

export function toggleGuestWishlistItem(item: Omit<GuestWishlistItem, 'savedAt'> & { savedAt?: number }): boolean {
  const items = readGuestWishlist()
  const idx = items.findIndex((i) => i.productId === item.productId)
  if (idx >= 0) {
    items.splice(idx, 1)
    writeGuestWishlist(items)
    return false
  }
  items.unshift({ ...item, savedAt: item.savedAt ?? Date.now() })
  writeGuestWishlist(items)
  return true
}

export function removeGuestWishlistItem(productId: number) {
  writeGuestWishlist(readGuestWishlist().filter((i) => i.productId !== productId))
}
