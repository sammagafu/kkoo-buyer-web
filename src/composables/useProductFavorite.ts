import { ref, watch, type Ref } from 'vue'
import { wishlistApi } from '@/api/wishlist'
import { useAuthStore } from '@/stores/auth'
import {
  isInGuestWishlist,
  readGuestWishlist,
  removeGuestWishlistItem,
  toggleGuestWishlistItem,
  clearGuestWishlist,
  type GuestWishlistItem,
} from '@/composables/guestWishlistStorage'

type WishlistRow = {
  id: number
  product_id?: number
  product?: { id?: number }
}

export type FavoriteProductMeta = {
  title?: string
  slug?: string
  price?: number
  basePrice?: number
  imageUrl?: string
  skuId?: number
}

export function useProductFavorite(
  productId: Ref<number | undefined | null>,
  meta?: Ref<FavoriteProductMeta | null | undefined>,
) {
  const auth = useAuthStore()
  const favorited = ref(false)
  const toggling = ref(false)
  const wishlistItemId = ref<number | null>(null)

  async function resolveWishlistItemId(): Promise<number | null> {
    if (wishlistItemId.value) return wishlistItemId.value
    if (!productId.value) return null
    const { data } = await wishlistApi.list()
    const items = (Array.isArray(data) ? data : (data as { results?: WishlistRow[] })?.results ?? []) as WishlistRow[]
    const found = items.find(
      (item) => item.product_id === productId.value || item.product?.id === productId.value,
    )
    if (found?.id) wishlistItemId.value = found.id
    return found?.id ?? null
  }

  async function syncStatus() {
    if (!productId.value) {
      favorited.value = false
      wishlistItemId.value = null
      return
    }
    if (!auth.isAuthenticated) {
      favorited.value = isInGuestWishlist(productId.value)
      wishlistItemId.value = null
      return
    }
    try {
      const { data } = await wishlistApi.check(productId.value)
      const row = data as { in_wishlist?: boolean; is_in_wishlist?: boolean }
      favorited.value = Boolean(row.in_wishlist ?? row.is_in_wishlist)
    } catch {
      favorited.value = false
    }
  }

  watch([productId, () => auth.isAuthenticated], () => void syncStatus(), { immediate: true })

  async function toggleFavorite() {
    if (!productId.value || toggling.value) return

    // IKEA: guests can save locally; soft gate only when syncing to server
    if (!auth.isAuthenticated) {
      const m = meta?.value
      favorited.value = toggleGuestWishlistItem({
        productId: productId.value,
        title: m?.title,
        slug: m?.slug,
        price: m?.price,
        basePrice: m?.basePrice,
        imageUrl: m?.imageUrl,
        skuId: m?.skuId,
      })
      return
    }

    toggling.value = true
    try {
      if (favorited.value) {
        const id = wishlistItemId.value ?? (await resolveWishlistItemId())
        if (id) {
          await wishlistApi.remove(id)
          favorited.value = false
          wishlistItemId.value = null
        }
      } else {
        const { data } = await wishlistApi.add(productId.value)
        const item = (data as { item?: { id: number } })?.item
        if (item?.id) wishlistItemId.value = item.id
        favorited.value = true
        removeGuestWishlistItem(productId.value)
      }
    } finally {
      toggling.value = false
    }
  }

  return { favorited, toggling, toggleFavorite }
}

/** Push local guest favorites to the API after sign-in (best effort). */
export async function syncGuestWishlistToServer(): Promise<void> {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) return
  const guestItems = readGuestWishlist()
  if (!guestItems.length) return
  clearGuestWishlist()
  for (const item of guestItems) {
    try {
      await wishlistApi.add(item.productId)
    } catch {
      /* best-effort */
    }
  }
}

export type { GuestWishlistItem }
