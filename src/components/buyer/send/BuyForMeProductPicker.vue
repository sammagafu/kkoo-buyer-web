<template>
  <Teleport to="body">
    <Transition name="buyer-cart-overlay">
      <div v-if="modelValue" class="buyer-cart-overlay" role="presentation" @click.self="close">
        <aside class="buyer-cart-overlay__panel send-picker" role="dialog" aria-modal="true" aria-label="Pick a product" @click.stop>
          <header class="buyer-cart-overlay__head">
            <h2 class="buyer-cart-overlay__title">{{ pickerTitle }}</h2>
            <button type="button" class="buyer-cart-overlay__close" aria-label="Close" @click="close">
              <Icon icon="solar:close-circle-bold" />
            </button>
          </header>

          <div class="send-picker__search">
            <Icon icon="solar:magnifer-linear" aria-hidden="true" />
            <input v-model.trim="search" type="search" placeholder="Search products…" autocomplete="off" />
          </div>

          <div class="send-picker__body">
            <p v-if="loading" class="send-picker__status">Loading products…</p>
            <p v-else-if="error" class="send-picker__status send-picker__status--err">{{ error }}</p>
            <p v-else-if="!displayProducts.length" class="send-picker__status">{{ emptyMessage }}</p>
            <ul v-else class="send-picker__list">
              <li v-for="prod in displayProducts" :key="productKey(prod)">
                <button type="button" class="send-picker__row" @click="selectProduct(prod)">
                  <div class="send-picker__thumb" aria-hidden="true">
                    <img v-if="imageSrc(prod)" :src="imageSrc(prod)" alt="" loading="lazy" />
                    <Icon v-else icon="solar:box-bold-duotone" />
                  </div>
                  <div class="send-picker__copy">
                    <p class="send-picker__title">{{ prod.title || 'Product' }}</p>
                    <p class="send-picker__store">{{ offerLabel(prod) }}</p>
                  </div>
                  <strong class="send-picker__price">{{ formatPrice(offerPrice(prod)) }}</strong>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { catalogPublicApi } from '@/api/catalog'
import { superAppApi, type RestaurantListItem, type RestaurantMenuItem } from '@/api/superApp'
import { resolveAssetUrl } from '@/utils/assetUrl'
import {
  distanceSurchargeTzs,
  formatDistanceLabel,
  lineTotal,
} from '@/utils/buyForMePricing'
import { useBuyForMeStoreIndex } from '@/composables/useBuyForMeStoreIndex'
import { useBuyForMePricingConfig } from '@/composables/useBuyForMePricingConfig'
import { buyForMeCategoryById, type BuyForMeCategoryId } from '@/constants/buyForMeCategories'
import type { BuyForMeProductSelection } from '@/types/buyForMe'

type CatalogProduct = {
  id?: number
  title?: string
  seller_id?: number
  price?: number
  base_price?: number
  discount_price?: number
  cover_image?: string
  image_url?: string
  menu_slug?: string
}

const modelValue = defineModel<boolean>({ default: false })

const props = defineProps<{
  deliveryLat: number
  deliveryLng: number
  categoryId?: BuyForMeCategoryId
  preferredSellerId?: number | null
}>()

const emit = defineEmits<{ select: [value: BuyForMeProductSelection] }>()

const { load, storeIndex, distanceForSeller, storeNameForSeller, storeSlugForSeller } = useBuyForMeStoreIndex()
const { load: loadPricingConfig } = useBuyForMePricingConfig()

const products = ref<CatalogProduct[]>([])
const loading = ref(false)
const error = ref('')
const search = ref('')

const activeCategory = computed(() => buyForMeCategoryById(props.categoryId ?? 'store'))

const pickerTitle = computed(() => `Pick from ${activeCategory.value.shoppingArea.toLowerCase()}`)

const emptyMessage = computed(() => {
  switch (activeCategory.value.id) {
    case 'food':
      return 'No restaurant items found nearby. Try another category or add a custom item.'
    case 'grocery':
      return 'No grocery items found nearby. Try another category or add a custom item.'
    default:
      return 'No products found.'
  }
})

const displayProducts = computed(() => {
  const list = products.value
  if (!search.value) return list.slice(0, 60)
  const q = search.value.toLowerCase()
  return list.filter((p) => (p.title || '').toLowerCase().includes(q)).slice(0, 60)
})

function close() {
  modelValue.value = false
}

function productKey(prod: CatalogProduct) {
  return `${prod.seller_id ?? 'x'}-${prod.id ?? prod.title}`
}

function productImage(prod: CatalogProduct) {
  return resolveAssetUrl(prod.cover_image ?? prod.image_url)
}

function imageSrc(prod: CatalogProduct) {
  return productImage(prod) ?? ''
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function basePrice(prod: CatalogProduct) {
  return prod.discount_price ?? prod.price ?? prod.base_price ?? 0
}

function offerPrice(prod: CatalogProduct) {
  const sellerId = prod.seller_id
  if (!sellerId) return basePrice(prod)
  const dist = distanceForSeller(sellerId, props.deliveryLat, props.deliveryLng)
  return lineTotal(basePrice(prod), dist)
}

function offerLabel(prod: CatalogProduct) {
  const sellerId = prod.seller_id
  if (!sellerId) return 'Marketplace'
  const dist = distanceForSeller(sellerId, props.deliveryLat, props.deliveryLng)
  return `${storeNameForSeller(sellerId)} · ${formatDistanceLabel(dist)}`
}

function selectProduct(prod: CatalogProduct) {
  const sellerId = prod.seller_id
  const productPrice = basePrice(prod)
  const distanceMeters = sellerId
    ? distanceForSeller(sellerId, props.deliveryLat, props.deliveryLng)
    : 5000
  const distanceSurcharge = distanceSurchargeTzs(distanceMeters)
  const selection: BuyForMeProductSelection = {
    productId: prod.id,
    productTitle: prod.title || 'Product',
    productPrice,
    sellerId,
    storeName: sellerId ? storeNameForSeller(sellerId) : undefined,
    storeSlug: sellerId ? storeSlugForSeller(sellerId) : prod.menu_slug,
    distanceMeters,
    distanceSurcharge,
    lineTotal: productPrice + distanceSurcharge,
    distanceLabel: formatDistanceLabel(distanceMeters),
  }
  emit('select', selection)
  close()
}

function readSellerId(row: Record<string, unknown>) {
  const sid = row.seller_id ?? row.user_id
  return typeof sid === 'number' && sid > 0 ? sid : null
}

function menuItemToProduct(item: RestaurantMenuItem, sellerId: number, menuSlug?: string): CatalogProduct | null {
  if (!item.id) return null
  return {
    id: item.id,
    title: item.title,
    seller_id: sellerId,
    base_price: item.base_price ?? item.price,
    discount_price: item.discount_price,
    cover_image: item.cover_image,
    menu_slug: menuSlug,
  }
}

function flattenMenuProducts(menu: { categories?: { products?: RestaurantMenuItem[] }[] }, sellerId: number, menuSlug?: string) {
  const rows: CatalogProduct[] = []
  for (const cat of menu.categories ?? []) {
    for (const item of cat.products ?? []) {
      const row = menuItemToProduct(item, sellerId, menuSlug)
      if (row) rows.push(row)
    }
  }
  return rows
}

function sellerVertical(sellerId?: number) {
  if (!sellerId) return ''
  return String(storeIndex.value.get(sellerId)?.seller_type ?? '')
}

function filterCatalogByVertical(rows: CatalogProduct[], categoryId: BuyForMeCategoryId) {
  return rows.filter((prod) => {
    const type = sellerVertical(prod.seller_id)
    switch (categoryId) {
      case 'store':
        return type !== 'restaurant' && type !== 'grocery'
      default:
        return true
    }
  })
}

function resolveSellerIds(rows: Array<Record<string, unknown>>, preferred?: number | null) {
  const ids = rows.map(readSellerId).filter((id): id is number => id != null)
  if (preferred != null && preferred > 0) {
    const rest = ids.filter((id) => id !== preferred)
    return [preferred, ...rest]
  }
  return ids
}

async function loadRestaurantProducts() {
  const { data } = await superAppApi.getRestaurants({ limit: 40 })
  const sellerIds = resolveSellerIds((data?.results ?? []) as RestaurantListItem[], props.preferredSellerId)
  const rows: CatalogProduct[] = []

  await Promise.all(
    sellerIds.slice(0, 12).map(async (sellerId) => {
      try {
        const { data: menu } = await superAppApi.getRestaurantMenu(sellerId)
        rows.push(...flattenMenuProducts(menu, sellerId, menu.restaurant?.menu_slug))
      } catch {
        // skip unavailable menus
      }
    }),
  )

  return rows
}

async function loadGroceryProducts() {
  const { data } = await superAppApi.getGroceryStores({ limit: 40 })
  const sellerIds = resolveSellerIds((data?.results ?? []) as Record<string, unknown>[], props.preferredSellerId)
  const rows: CatalogProduct[] = []

  await Promise.all(
    sellerIds.slice(0, 12).map(async (sellerId) => {
      try {
        const { data: payload } = await superAppApi.getGroceryStoreProducts(sellerId)
        const list =
          (payload as { products?: CatalogProduct[] })?.products ??
          (payload as { results?: CatalogProduct[] })?.results ??
          []
        for (const item of list) {
          if (!item.id) continue
          rows.push({
            ...item,
            seller_id: sellerId,
          })
        }
      } catch {
        // skip unavailable stores
      }
    }),
  )

  return rows
}

async function loadCatalogProducts(categoryId: BuyForMeCategoryId) {
  const params: Record<string, unknown> = {
    page_size: 80,
    ordering: 'price_asc',
  }
  if (categoryId === 'pharmacy') params.category_slug = 'pharmacy'
  if (props.preferredSellerId) params.seller_id = props.preferredSellerId
  if (search.value) params.search = search.value
  const { data } = await catalogPublicApi.listProducts(params as never)
  const rows = (data?.results ?? []) as CatalogProduct[]
  return filterCatalogByVertical(rows, categoryId)
}

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    await Promise.all([loadPricingConfig(), load(props.deliveryLat, props.deliveryLng)])
    const categoryId = props.categoryId ?? 'store'

    if (categoryId === 'food') {
      products.value = await loadRestaurantProducts()
    } else if (categoryId === 'grocery') {
      products.value = await loadGroceryProducts()
    } else {
      products.value = await loadCatalogProducts(categoryId)
    }
  } catch {
    error.value = 'Could not load products.'
    products.value = []
  } finally {
    loading.value = false
  }
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (!modelValue.value) return
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => void loadProducts(), 350)
})

watch(
  () => props.categoryId,
  () => {
    if (modelValue.value) void loadProducts()
  },
)

watch(modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    search.value = ''
    void loadProducts()
  }
})
</script>
