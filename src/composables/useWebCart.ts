import { computed, ref } from 'vue'
import { cartApi } from '@/api/cart'

type CartProduct = {
  title?: string
  base_price?: number
  discount_price?: number | null
  image_url?: string
  media?: Array<{ file?: string }>
}

type CartSku = {
  id?: number
  price_override?: number | null
  product?: CartProduct
}

type CartApiItem = {
  id: number
  sku_id?: number
  quantity: number
  total_price?: number
  sku?: CartSku
  product?: CartProduct
  unavailable?: boolean
}

export type WebCartItem = {
  id?: number
  item_id?: number
  sku_id?: number
  quantity: number
  total_price?: number
  unavailable?: boolean
  product?: { title?: string; price?: number; base_price?: number; image_url?: string }
  sku?: CartSku
}

const cartItems = ref<WebCartItem[]>([])
const cartFinalTotal = ref<number | null>(null)
const loading = ref(false)
const error = ref('')

function unitPriceFromApiItem(raw: CartApiItem): number {
  const sku = raw.sku
  const product = sku?.product ?? raw.product
  if (sku?.price_override != null && sku.price_override >= 0) return sku.price_override
  if (product?.discount_price != null && product.discount_price >= 0) return product.discount_price
  if (product?.base_price != null) return product.base_price
  const qty = raw.quantity || 1
  if (raw.total_price != null && qty > 0) return raw.total_price / qty
  return 0
}

function normalizeCartItem(raw: CartApiItem): WebCartItem {
  const product = raw.sku?.product ?? raw.product
  const unitPrice = unitPriceFromApiItem(raw)
  const imageUrl = product?.media?.[0]?.file ?? product?.image_url

  return {
    id: raw.id,
    sku_id: raw.sku_id,
    quantity: raw.quantity,
    total_price: raw.total_price,
    unavailable: raw.unavailable,
    sku: raw.sku,
    product: product
      ? {
          title: product.title,
          base_price: unitPrice,
          price: unitPrice,
          image_url: imageUrl,
        }
      : undefined,
  }
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

export function useWebCart() {
  const itemCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0),
  )

  const formattedTotal = computed(() => {
    if (cartFinalTotal.value != null) return formatPrice(cartFinalTotal.value)
    const total = cartItems.value.reduce((sum, item) => {
      if (item.total_price != null) return sum + item.total_price
      const price = item.product?.price ?? item.product?.base_price ?? 0
      return sum + price * (item.quantity || 1)
    }, 0)
    return formatPrice(total)
  })

  const subtotal = computed(() => formattedTotal.value)

  async function loadCart() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await cartApi.get()
      cartFinalTotal.value = data?.final_total ?? data?.original_total ?? null
      cartItems.value = (data?.items ?? []).map(normalizeCartItem)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } }
      error.value = err.response?.data?.detail ?? 'Could not load cart.'
      cartItems.value = []
      cartFinalTotal.value = null
    } finally {
      loading.value = false
    }
  }

  async function updateQuantity(item: WebCartItem, qty: number) {
    if (!item.id && !item.item_id) return
    if (qty < 1) return
    await cartApi.updateItem(item.id ?? item.item_id!, qty)
    await loadCart()
  }

  async function removeItem(item: WebCartItem) {
    if (!item.id && !item.item_id) return
    await cartApi.removeItem(item.id ?? item.item_id!)
    await loadCart()
  }

  function itemKey(item: WebCartItem) {
    return String(item.id ?? item.item_id ?? Math.random())
  }

  return {
    cartItems,
    loading,
    error,
    itemCount,
    formattedTotal,
    subtotal,
    loadCart,
    updateQuantity,
    removeItem,
    itemKey,
    formatPrice,
  }
}
