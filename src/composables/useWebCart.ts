import { computed, ref } from 'vue'
import { cartApi } from '@/api/cart'
import { useAuthStore } from '@/stores/auth'
import {
  clearGuestCart,
  isGuestCartLineId,
  nextGuestLineId,
  readGuestCart,
  writeGuestCart,
  type GuestCartLine,
} from '@/composables/guestCartStorage'

type CartProduct = {
  title?: string
  base_price?: number
  discount_price?: number | null
  image_url?: string
  media?: Array<{ file?: string }>
  requires_prescription?: boolean
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
  guestId?: number
  sku_id?: number
  product_id?: number
  quantity: number
  total_price?: number
  unavailable?: boolean
  requiresPrescription?: boolean
  product?: { title?: string; price?: number; base_price?: number; image_url?: string }
  sku?: CartSku
}

const cartItems = ref<WebCartItem[]>([])
const cartFinalTotal = ref<number | null>(null)
const loading = ref(false)
const error = ref('')
const isGuestCart = ref(false)

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
    requiresPrescription: product?.requires_prescription,
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

function guestLineToWebItem(line: GuestCartLine): WebCartItem {
  return {
    id: line.guestId,
    guestId: line.guestId,
    sku_id: line.skuId,
    product_id: line.productId,
    quantity: line.quantity,
    total_price: line.unitPrice * line.quantity,
    requiresPrescription: line.requiresPrescription,
    product: {
      title: line.title,
      price: line.unitPrice,
      base_price: line.unitPrice,
      image_url: line.imageUrl,
    },
  }
}

function loadGuestCartIntoState() {
  const lines = readGuestCart()
  cartItems.value = lines.map(guestLineToWebItem)
  cartFinalTotal.value = null
  isGuestCart.value = lines.length > 0
}

function persistGuestFromState() {
  const lines: GuestCartLine[] = cartItems.value
    .filter((i) => isGuestCartLineId(i.id ?? i.guestId))
    .map((i) => ({
      guestId: i.guestId ?? i.id!,
      productId: i.product_id ?? 0,
      skuId: i.sku_id ?? 0,
      quantity: i.quantity,
      title: i.product?.title ?? 'Item',
      unitPrice: i.product?.price ?? i.product?.base_price ?? 0,
      imageUrl: i.product?.image_url,
      requiresPrescription: i.requiresPrescription,
    }))
  writeGuestCart(lines)
  isGuestCart.value = lines.length > 0
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

export type AddToCartInput = {
  productId: number
  skuId?: number
  title: string
  unitPrice: number
  imageUrl?: string
  requiresPrescription?: boolean
  quantity?: number
}

export function useWebCart() {
  const itemCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0),
  )

  const formattedTotal = computed(() => {
    if (!isGuestCart.value && cartFinalTotal.value != null) return formatPrice(cartFinalTotal.value)
    const total = cartItems.value.reduce((sum, item) => {
      if (item.total_price != null) return sum + item.total_price
      const price = item.product?.price ?? item.product?.base_price ?? 0
      return sum + price * (item.quantity || 1)
    }, 0)
    return formatPrice(total)
  })

  const subtotal = computed(() => formattedTotal.value)

  async function loadCart() {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      loading.value = false
      error.value = ''
      loadGuestCartIntoState()
      return
    }

    isGuestCart.value = false
    loading.value = true
    error.value = ''
    try {
      const { data } = await cartApi.get()
      cartFinalTotal.value = data?.final_total ?? data?.original_total ?? null
      cartItems.value = (data?.items ?? []).map(normalizeCartItem)
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { detail?: string } } }
      if (err.response?.status === 401) {
        loadGuestCartIntoState()
        error.value = ''
        return
      }
      error.value = err.response?.data?.detail ?? 'Could not load cart.'
      loadGuestCartIntoState()
    } finally {
      loading.value = false
    }
  }

  function addGuestItem(input: AddToCartInput) {
    const qty = Math.max(1, input.quantity ?? 1)
    const skuId = input.skuId ?? 0
    const existing = cartItems.value.find(
      (i) => i.product_id === input.productId || (skuId > 0 && i.sku_id === skuId),
    )
    if (existing) {
      existing.quantity += qty
      existing.total_price =
        (existing.product?.price ?? existing.product?.base_price ?? 0) * existing.quantity
    } else {
      const guestId = nextGuestLineId()
      cartItems.value.push({
        id: guestId,
        guestId,
        product_id: input.productId,
        sku_id: skuId,
        quantity: qty,
        total_price: input.unitPrice * qty,
        requiresPrescription: input.requiresPrescription,
        product: {
          title: input.title,
          price: input.unitPrice,
          base_price: input.unitPrice,
          image_url: input.imageUrl,
        },
      })
    }
    isGuestCart.value = true
    cartFinalTotal.value = null
    persistGuestFromState()
  }

  async function addToCart(input: AddToCartInput): Promise<boolean> {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      addGuestItem(input)
      return true
    }
    try {
      if (input.skuId && input.skuId > 0) {
        await cartApi.add({ sku_id: input.skuId, quantity: input.quantity ?? 1 })
      } else {
        await cartApi.add({ product_id: input.productId, quantity: input.quantity ?? 1 })
      }
      await loadCart()
      return true
    } catch {
      return false
    }
  }

  async function syncGuestCartToServer(): Promise<void> {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return
    const guestLines = readGuestCart()
    if (!guestLines.length) return
    clearGuestCart()
    for (const line of guestLines) {
      try {
        if (line.skuId > 0) {
          await cartApi.add({ sku_id: line.skuId, quantity: line.quantity })
        } else if (line.productId > 0) {
          await cartApi.add({ product_id: line.productId, quantity: line.quantity })
        }
      } catch {
        /* best-effort */
      }
    }
    await loadCart()
  }

  async function updateQuantity(item: WebCartItem, qty: number) {
    if (qty < 1) return
    const lineId = item.id ?? item.item_id ?? item.guestId
    if (lineId == null) return

    if (isGuestCart.value || isGuestCartLineId(lineId)) {
      item.quantity = qty
      item.total_price = (item.product?.price ?? item.product?.base_price ?? 0) * qty
      persistGuestFromState()
      return
    }

    await cartApi.updateItem(lineId, qty)
    await loadCart()
  }

  async function removeItem(item: WebCartItem) {
    const lineId = item.id ?? item.item_id ?? item.guestId
    if (lineId == null) return

    if (isGuestCart.value || isGuestCartLineId(lineId)) {
      cartItems.value = cartItems.value.filter((i) => (i.id ?? i.guestId) !== lineId)
      persistGuestFromState()
      if (!cartItems.value.length) isGuestCart.value = false
      return
    }

    await cartApi.removeItem(lineId)
    await loadCart()
  }

  function itemKey(item: WebCartItem) {
    return String(item.id ?? item.item_id ?? item.guestId ?? Math.random())
  }

  return {
    cartItems,
    loading,
    error,
    itemCount,
    formattedTotal,
    subtotal,
    isGuestCart,
    loadCart,
    addToCart,
    addGuestItem,
    syncGuestCartToServer,
    updateQuantity,
    removeItem,
    itemKey,
    formatPrice,
  }
}
