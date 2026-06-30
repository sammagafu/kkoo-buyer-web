import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWebCart } from '@/composables/useWebCart'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'

export type CartableProduct = {
  id?: number
  title?: string
  base_price?: number
  discount_price?: number | null
  display_price?: number
  primary_media_url?: string
  image_url?: string
  media?: Array<{ file?: string }>
  requires_prescription?: boolean
  skus?: Array<{ id?: number; price_override?: number | null }>
}

function resolveUnitPrice(prod: CartableProduct): number {
  const sku = prod.skus?.[0]
  if (sku?.price_override != null && sku.price_override >= 0) return sku.price_override
  if (prod.discount_price != null && prod.discount_price >= 0) return prod.discount_price
  if (prod.display_price != null && prod.display_price >= 0) return prod.display_price
  return prod.base_price ?? 0
}

function resolveImage(prod: CartableProduct): string | undefined {
  return prod.primary_media_url ?? prod.media?.[0]?.file ?? prod.image_url
}

export function useAddToCart() {
  const { t } = useI18n()
  const auth = useAuthStore()
  const { addToCart } = useWebCart()
  const refreshBuyerCart = inject<() => Promise<void>>('refreshBuyerCart', async () => {})
  const openBuyerCart = inject<() => void>('openBuyerCart', () => {})

  const adding = ref(false)
  const addError = ref('')
  const addMessage = ref('')

  async function addProduct(prod: CartableProduct, quantity = 1): Promise<boolean> {
    addError.value = ''
    addMessage.value = ''
    const productId = Number(prod.id)
    if (!productId) {
      addError.value = t('buyerXp.common.couldNotAdd')
      return false
    }
    const skuId = prod.skus?.[0]?.id ? Number(prod.skus[0].id) : undefined

    adding.value = true
    try {
      const ok = await addToCart({
        productId,
        skuId,
        title: prod.title ?? t('buyerXp.common.productFallback'),
        unitPrice: resolveUnitPrice(prod),
        imageUrl: resolveImage(prod),
        requiresPrescription: prod.requires_prescription,
        quantity,
      })
      if (!ok) {
        addError.value = t('buyerXp.common.couldNotAdd')
        return false
      }
      await refreshBuyerCart()
      openBuyerCart()
      addMessage.value = auth.isAuthenticated
        ? t('buyerXp.common.addedToCartShort')
        : t('buyerXp.cart.guestAdded')
      return true
    } catch (e) {
      addError.value = formatApiError(e, t('buyerXp.common.couldNotAdd'))
      return false
    } finally {
      adding.value = false
    }
  }

  return { adding, addError, addMessage, addProduct }
}
