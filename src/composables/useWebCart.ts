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
  seller_id?: number | null
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
  is_preorder?: boolean
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
  isPreorder?: boolean
  /** Product owner (seller user id) from API `product.seller_id`. */
  seller_id?: number | null
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
    isPreorder: Boolean(raw.is_preorder),
    seller_id: product?.seller_id ?? null,
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
    seller_id: line.sellerId ?? null,
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
      sellerId: i.seller_id ?? null,
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
  sellerId?: number | null
  /** marketplace (default) | microsite — must match product channel flags */
  channel?: 'marketplace' | 'microsite'
}

export type CartSellerGroup = {
  sellerId: number | null
  items: WebCartItem[]
}

export function groupCartBySeller(items: WebCartItem[]): CartSellerGroup[] {
  const map = new Map<string, CartSellerGroup>()
  for (const item of items) {
    const sid = item.seller_id != null && Number(item.seller_id) > 0 ? Number(item.seller_id) : null
    const key = sid != null ? String(sid) : 'unknown'
    const existing = map.get(key)
    if (existing) existing.items.push(item)
    else map.set(key, { sellerId: sid, items: [item] })
  }
  return Array.from(map.values())
}

export function buildSellerConfigs(
  items: WebCartItem[],
  opts?: { fulfillmentType?: string; deliveryFeeTotal?: number; notes?: string },
): Array<{ seller_id: number; fulfillment_type?: string; delivery_fee?: number; notes?: string }> {
  const groups = groupCartBySeller(items).filter((g) => g.sellerId != null && g.sellerId > 0)
  if (!groups.length) return []
  const ft = opts?.fulfillmentType?.trim() || undefined
  const needsDelivery = !ft || ft === 'delivery'
  const totalFee = needsDelivery && (opts?.deliveryFeeTotal ?? 0) > 0 ? Number(opts!.deliveryFeeTotal) : 0
  const perFee = groups.length > 0 && totalFee > 0 ? Math.round((totalFee / groups.length) * 100) / 100 : 0
  let allocated = 0
  return groups.map((g, i) => {
    let fee = 0
    if (perFee > 0) {
      if (i === groups.length - 1) fee = Math.round((totalFee - allocated) * 100) / 100
      else {
        fee = perFee
        allocated += perFee
      }
    }
    return {
      seller_id: g.sellerId!,
      ...(ft ? { fulfillment_type: ft } : {}),
      ...(fee > 0 ? { delivery_fee: fee } : {}),
      ...(opts?.notes ? { notes: opts.notes } : {}),
    }
  })
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
        seller_id: input.sellerId ?? null,
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
      const channel = input.channel ?? 'marketplace'
      if (input.skuId && input.skuId > 0) {
        await cartApi.add({ sku_id: input.skuId, quantity: input.quantity ?? 1, channel })
      } else {
        await cartApi.add({ product_id: input.productId, quantity: input.quantity ?? 1, channel })
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

  const sellerGroups = computed(() => groupCartBySeller(cartItems.value))

  return {
    cartItems,
    sellerGroups,
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
