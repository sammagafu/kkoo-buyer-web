import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { wishlistApi } from '@/api/wishlist'
import { useAuthStore } from '@/stores/auth'

type WishlistRow = {
  id: number
  product_id?: number
  product?: { id?: number }
}

export function useProductFavorite(productId: Ref<number | undefined | null>) {
  const auth = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const favorited = ref(false)
  const toggling = ref(false)
  const wishlistItemId = ref<number | null>(null)

  async function resolveWishlistItemId(): Promise<number | null> {
    if (wishlistItemId.value) return wishlistItemId.value
    if (!productId.value) return null
    const { data } = await wishlistApi.list()
    const items = (Array.isArray(data) ? data : []) as WishlistRow[]
    const found = items.find(
      (item) => item.product_id === productId.value || item.product?.id === productId.value,
    )
    if (found?.id) wishlistItemId.value = found.id
    return found?.id ?? null
  }

  async function syncStatus() {
    if (!auth.isAuthenticated || !productId.value) {
      favorited.value = false
      wishlistItemId.value = null
      return
    }
    try {
      const { data } = await wishlistApi.check(productId.value)
      favorited.value = Boolean(data.in_wishlist)
    } catch {
      favorited.value = false
    }
  }

  watch([productId, () => auth.isAuthenticated], () => void syncStatus(), { immediate: true })

  async function toggleFavorite() {
    if (!productId.value || toggling.value) return
    if (!auth.isAuthenticated) {
      await router.push({ name: 'auth.sign-in', query: { redirectedFrom: route.fullPath } })
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
      }
    } finally {
      toggling.value = false
    }
  }

  return { favorited, toggling, toggleFavorite }
}
