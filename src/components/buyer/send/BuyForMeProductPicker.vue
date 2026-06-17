<template>
  <Teleport to="body">
    <Transition name="buyer-cart-overlay">
      <div v-if="modelValue" class="buyer-cart-overlay" role="presentation" @click.self="close">
        <aside class="buyer-cart-overlay__panel send-picker" role="dialog" aria-modal="true" aria-label="Pick a product" @click.stop>
          <header class="buyer-cart-overlay__head">
            <h2 class="buyer-cart-overlay__title">Pick from stores</h2>
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
            <p v-else-if="!displayProducts.length" class="send-picker__status">No products found.</p>
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
import { resolveAssetUrl } from '@/utils/assetUrl'
import {
  distanceSurchargeTzs,
  formatDistanceLabel,
  lineTotal,
} from '@/utils/buyForMePricing'
import { useBuyForMeStoreIndex } from '@/composables/useBuyForMeStoreIndex'
import { useBuyForMePricingConfig } from '@/composables/useBuyForMePricingConfig'
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
  preferredSellerId?: number | null
}>()

const emit = defineEmits<{ select: [value: BuyForMeProductSelection] }>()

const { load, distanceForSeller, storeNameForSeller, storeSlugForSeller } = useBuyForMeStoreIndex()
const { load: loadPricingConfig } = useBuyForMePricingConfig()

const products = ref<CatalogProduct[]>([])
const loading = ref(false)
const error = ref('')
const search = ref('')

const displayProducts = computed(() => {
  if (!search.value) return products.value.slice(0, 60)
  const q = search.value.toLowerCase()
  return products.value.filter((p) => (p.title || '').toLowerCase().includes(q)).slice(0, 60)
})

function close() {
  modelValue.value = false
}

function productKey(prod: CatalogProduct) {
  return String(prod.id ?? prod.title)
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

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    await Promise.all([loadPricingConfig(), load(props.deliveryLat, props.deliveryLng)])
    const params: Record<string, unknown> = { page_size: 80, ordering: 'price_asc' }
    if (props.preferredSellerId) params.seller_id = props.preferredSellerId
    if (search.value) params.search = search.value
    const { data } = await catalogPublicApi.listProducts(params as never)
    products.value = (data?.results ?? []) as CatalogProduct[]
  } catch (e) {
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

watch(modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) void loadProducts()
})
</script>
