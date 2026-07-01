<template>
  <div class="buyer-xp buyer-xp--wide" :class="{ 'buyer-xp--mhome': isHomeMode }">
    <!-- Home marketplace — mobile-first entry -->
    <template v-if="isHomeMode">
      <BuyerMobileHomeHeader
        :area-label="areaLabel"
        :unread-count="notificationUnreadCount"
        @notifications="openNotificationsPanel"
        @location="promptLocation"
      />

      <div class="buyer-mhome-greeting">
        <p class="buyer-mhome-greeting__line">
          {{ localizedGreeting }}, {{ displayNameResolved }}
          <span aria-hidden="true">👋</span>
        </p>
        <p class="buyer-mhome-greeting__prompt">{{ t('buyerXp.home.whatDoYouWant') }}</p>
      </div>

      <BuyerActionTileGrid />
      <BuyerTrackOrderBar />

      <BuyerHomeDiscovery :stores="stores" />

      <header class="d-none d-lg-block buyer-home-hero">
        <p class="buyer-home-hero__overline">{{ t('buyerXp.marketplace.overline') }}</p>
        <div>
          <p class="buyer-home-hero__greeting">{{ localizedGreeting }}</p>
          <h1 class="buyer-home-hero__name">{{ displayNameResolved }}</h1>
          <p class="buyer-home-hero__tagline">{{ t('buyerXp.marketplace.tagline') }}</p>
        </div>
        <BuyerSearchBar readonly :placeholder="t('buyerXp.marketplace.searchPlaceholder')" @tap="goSearch" />
      </header>

      <section
        v-if="popularTodayProducts.length"
        class="buyer-surface buyer-popular-today"
        :aria-label="t('buyerXp.home.popularToday')"
      >
        <BuyerSectionHeader
          :title="t('buyerXp.home.popularToday')"
          :action-label="t('buyerXp.common.seeAll')"
          :action-to="{ name: 'buyer.search' }"
        />
        <BuyerProductGridSection
          :products="popularTodayProducts"
          :loading="loadingAllProducts"
          :adding="adding"
          layout="popular-row"
          @add="addProduct"
        />
      </section>

      <section v-if="categories.length" class="buyer-surface buyer-surface--compact d-lg-none" :aria-label="t('buyerXp.marketplace.browseCategories')">
        <BuyerSectionHeader :title="t('buyerXp.marketplace.browseCategories')" />
        <div class="buyer-category-pills" role="tablist">
          <button
            type="button"
            class="buyer-category-pill"
            :class="{ 'buyer-category-pill--active': !activeCategory }"
            @click="activeCategory = ''"
          >
            {{ t('common.all') }}
          </button>
          <button
            v-for="cat in categories"
            :key="String(cat.id ?? cat.slug)"
            type="button"
            class="buyer-category-pill"
            :class="{ 'buyer-category-pill--active': activeCategory === catSlug(cat) }"
            @click="goCategory(cat)"
          >
            {{ cat.name || cat.title || t('buyerXp.marketplace.categoryFallback') }}
          </button>
        </div>
      </section>

      <section
        v-if="recommendedProducts.length"
        class="buyer-surface buyer-home-products"
        aria-label="Products"
      >
        <BuyerSectionHeader
          :title="t('buyerXp.marketplace.recommendedTitle')"
          :subtitle="t('buyerXp.marketplace.recommendedSubtitle')"
          :action-label="t('buyerXp.nav.search')"
          :action-to="{ name: 'buyer.search' }"
        />
        <BuyerProductGridSection
          :products="recommendedProducts"
          :loading="loadingProducts || loadingAllProducts"
          :error="productError"
          :message="addMessage"
          :add-error="addError"
          :adding="adding"
          @add="addProduct"
        />
      </section>
    </template>

    <!-- Groceries / compact shop -->
    <template v-else>
      <header v-if="viewMode === 'directory'" class="buyer-page-head">
        <h1 class="buyer-page-head__title">{{ compact ? t('buyerXp.marketplace.groceries') : t('buyerXp.marketplace.shop') }}</h1>
        <BuyerSearchBar
          v-model="searchTerm"
          :placeholder="compact ? t('buyerXp.marketplace.searchGroceryStores') : t('buyerXp.marketplace.searchProducts')"
        />
      </header>

      <header v-else class="buyer-page-head">
        <div class="buyer-page-head__row">
          <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.marketplace.backToStores')" @click="backToDirectory">
            <Icon icon="solar:arrow-left-linear" />
          </button>
          <div>
            <h1 class="buyer-page-head__title">{{ activeStoreName || t('buyerXp.marketplace.storeFallback') }}</h1>
            <p v-if="activeStoreRecord?.business_address" class="buyer-page-head__meta">
              {{ activeStoreRecord.business_address }}
            </p>
          </div>
        </div>
      </header>

      <BuyerFulfillmentBar
        v-if="fulfillment"
        v-model="fulfillmentMode"
        :modes="groceryFulfillmentModes"
        :label="t('buyerXp.marketplace.fulfillmentLabel')"
        :hint="fulfillmentHint"
      />

      <div v-if="fulfillment && fulfillmentMode === 'delivery' && activeStoreRecord" class="fulfillment-action">
        <Icon icon="solar:scooter-bold" class="fulfillment-action__icon" aria-hidden="true" />
        <div class="fulfillment-action__copy">
          <p class="fulfillment-action__title">{{ t('buyerXp.marketplace.riderDeliveryTitle') }}</p>
          <p class="fulfillment-action__text">
            {{ t('buyerXp.marketplace.riderDeliveryCopy', { store: activeStoreRecord.business_name || t('buyerXp.marketplace.storeFallback') }) }}
          </p>
        </div>
        <RouterLink :to="rideLink" class="fulfillment-action__btn">{{ t('buyerXp.marketplace.requestBoda') }}</RouterLink>
      </div>

      <section v-if="viewMode === 'directory'" class="buyer-venue-list" aria-label="Grocery stores">
        <p v-if="loadingStores" class="shop-products__status">{{ t('buyerXp.marketplace.loadingStores') }}</p>
        <p v-else-if="!filteredStores.length" class="shop-products__status">{{ t('buyerXp.marketplace.noStores') }}</p>
        <BuyerVenueCard
          v-for="store in filteredStores"
          :key="storeKey(store)"
          :name="store.business_name || t('buyerXp.marketplace.storeFallback')"
          :address="store.business_address"
          :image-url="venueImageUrl(store)"
          kind="grocery"
          icon="solar:cart-large-2-bold"
          :send-to="sendLinkForStore(store)"
          :ride-to="rideLinkForStore(store)"
          :detail-to="venueDetailLink('grocery', store.seller_id ?? store.user_id ?? '')"
          @view="openStore(store)"
        />
      </section>

      <section v-else class="shop-products" aria-label="Products">
        <BuyerProductGridSection
          :products="displayProducts"
          :loading="loadingProducts || loadingAllProducts"
          :error="productError"
          :message="addMessage"
          :add-error="addError"
          :adding="adding"
          :show-store-label="!compact"
          @add="addProduct"
        />
      </section>

      <footer v-if="fulfillment && viewMode === 'menu' && (hasCartItems || fulfillmentMode === 'delivery')" class="eats-footer-actions">
        <RouterLink v-if="fulfillmentMode === 'delivery'" :to="rideLink" class="eats-footer-actions__primary">
          <Icon icon="solar:scooter-bold" aria-hidden="true" />
          {{ t('buyerXp.marketplace.requestBodaFooter') }}
        </RouterLink>
        <RouterLink :to="checkoutLink" class="eats-footer-actions__secondary">
          <Icon icon="solar:cart-large-2-bold" aria-hidden="true" />
          {{ t('buyerXp.marketplace.checkout') }}
        </RouterLink>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { superAppApi } from '@/api/superApp'
import { catalogPublicApi } from '@/api/catalog'
import { useAddToCart } from '@/composables/useAddToCart'
import { buildCheckoutLink, buildRideLink } from '@/utils/fulfillmentLinks'
import { categoryDetailLink, venueDetailLink } from '@/utils/buyerDetailLinks'
import BuyerFulfillmentBar, { type FulfillmentModeId } from '@/components/buyer/BuyerFulfillmentBar.vue'
import BuyerMobileHomeHeader from '@/components/buyer/experience/BuyerMobileHomeHeader.vue'
import BuyerActionTileGrid from '@/components/buyer/experience/BuyerActionTileGrid.vue'
import BuyerTrackOrderBar from '@/components/buyer/experience/BuyerTrackOrderBar.vue'
import BuyerHomeDiscovery from '@/components/buyer/experience/BuyerHomeDiscovery.vue'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerVenueCard from '@/components/buyer/experience/BuyerVenueCard.vue'
import BuyerProductGridSection from '@/components/buyer/experience/BuyerProductGridSection.vue'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { useBuyerGreeting } from '@/composables/useBuyerGreeting'
import { useBuyerLocation } from '@/composables/useBuyerLocation'
import { formatApiError } from '@/utils/formatApiError'
import { useBuyerNotifications } from '@/composables/useBuyerNotifications'
import { useI18n } from 'vue-i18n'
import { venueImageUrl } from '@/utils/assetUrl'

const props = defineProps<{ compact?: boolean; fulfillment?: boolean }>()
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { greeting } = useBuyerGreeting()
const { areaLabel, setAreaLabel } = useBuyerLocation()
const { unreadCount: notificationUnreadCount } = useBuyerNotifications()
const openNotifications = inject<() => void>('openBuyerNotifications', () => {})
const { displayName, isAuthenticated } = useAuthDisplay()
const openBuyerCart = inject<() => void>('openBuyerCart', () => {})
const { adding, addError, addMessage, addProduct: addProductToCart } = useAddToCart()

type Store = {
  seller_id?: number
  user_id?: number
  business_name?: string
  business_address?: string
  cover_image?: string
  logo_url?: string
}
type Product = {
  id?: number
  title?: string
  description?: string
  price?: number
  base_price?: number
  cover_image?: string
  image_url?: string
  skus?: { id?: number }[]
  store_name?: string
  store_id?: number | string
}
type Category = { id?: number; name?: string; title?: string; slug?: string }

const stores = ref<Store[]>([])
const products = ref<Product[]>([])
const allProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const activeStoreId = ref<number | string | null>(null)
const activeCategory = ref('')
const viewMode = ref<'directory' | 'menu'>('directory')
const loadingStores = ref(false)
const loadingProducts = ref(false)
const loadingAllProducts = ref(false)
const productError = ref('')
const searchTerm = ref('')
const fulfillmentMode = ref<FulfillmentModeId>('pickup')
const hasCartItems = ref(false)

const isHomeMode = computed(() => !props.compact && !props.fulfillment)

const displayNameResolved = computed(() => {
  if (!isAuthenticated.value) return t('buyerXp.greetings.guest')
  const name = displayName.value.trim()
  if (!name || name.toLowerCase() === 'guest') return t('buyerXp.greetings.guest')
  return name.split(/\s+/)[0] || name
})

const localizedGreeting = computed(() => {
  if (locale.value === 'sw') return t('buyerXp.greetings.habari')
  return greeting.value
})

function promptLocation() {
  const next = window.prompt(t('buyerXp.home.locationPrompt'), areaLabel.value)
  if (next != null) setAreaLabel(next)
}

function openNotificationsPanel() {
  openNotifications()
}

const groceryFulfillmentModes = computed(() => [
  { id: 'pickup' as const, label: t('buyerXp.marketplace.pickup'), icon: 'solar:bag-3-bold' },
  { id: 'delivery' as const, label: t('buyerXp.marketplace.deliver'), icon: 'solar:scooter-bold' },
])

const fulfillmentHint = computed(() =>
  fulfillmentMode.value === 'delivery'
    ? t('buyerXp.marketplace.fulfillmentDeliveryHint')
    : t('buyerXp.marketplace.fulfillmentPickupHint'),
)

const activeStoreRecord = computed(() =>
  stores.value.find((s) => s.seller_id === activeStoreId.value) ?? stores.value[0] ?? null,
)

const rideLink = computed(() =>
  buildRideLink({
    pickup: activeStoreRecord.value?.business_address,
    notes: `Grocery delivery from ${activeStoreRecord.value?.business_name || 'store'}`,
    vehicleType: 'boda',
  }),
)

const checkoutLink = computed(() => buildCheckoutLink(fulfillmentMode.value))

const activeStoreName = computed(() => activeStoreRecord.value?.business_name || '')

const filteredStores = computed(() => {
  if (!searchTerm.value) return stores.value
  const term = searchTerm.value.toLowerCase()
  return stores.value.filter((s) => (s.business_name || '').toLowerCase().includes(term))
})

const filteredProducts = computed(() => filterProducts(products.value))
const filteredAllProducts = computed(() => filterProducts(allProducts.value))

const displayProducts = computed(() => {
  if (activeStoreId.value == null) {
    return filteredAllProducts.value.slice(0, 24)
  }
  const list = filteredProducts.value.length ? filteredProducts.value : filteredAllProducts.value
  return list.slice(0, 24)
})

const popularTodayProducts = computed(() => displayProducts.value.slice(0, 5))

const recommendedProducts = computed(() => {
  const all = displayProducts.value
  if (all.length <= 5) return []
  return all.slice(5)
})

function filterProducts(list: Product[]) {
  let out = list
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    out = out.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term) ||
        (p.store_name || '').toLowerCase().includes(term),
    )
  }
  return out
}

function catSlug(cat: Category) {
  return String(cat.slug || cat.id || '')
}

function storeKey(store: Store) {
  return String(store.seller_id || store.user_id || Math.random())
}

function goSearch() {
  void router.push({ name: 'buyer.search' })
}

function sendLinkForStore(store: Store) {
  return {
    name: 'buyer.send',
    query: {
      store: store.business_name,
      seller_id: store.seller_id ?? store.user_id,
    },
  }
}

function rideLinkForStore(store: Store) {
  return buildRideLink({
    pickup: store.business_address,
    notes: `From ${store.business_name || 'store'}`,
    vehicleType: 'boda',
  })
}

function goCategory(cat: Category) {
  const slug = catSlug(cat)
  if (!slug) return
  void router.push(categoryDetailLink(slug))
}

function openStore(store: Store) {
  const sid = store.seller_id ?? store.user_id
  if (!sid) return
  if (props.compact || props.fulfillment) {
    void router.push(venueDetailLink('grocery', sid))
    return
  }
  viewMode.value = 'menu'
  void selectStore(store)
}

function backToDirectory() {
  viewMode.value = 'directory'
  activeStoreId.value = null
  products.value = []
}

async function loadHomeStores() {
  try {
    const { data } = await superAppApi.getGroceryStores({ limit: 12 })
    stores.value = (data?.results as Store[]) ?? []
  } catch {
    stores.value = []
  }
}

async function loadStores() {
  loadingStores.value = true
  try {
    const { data } = await superAppApi.getGroceryStores({ limit: 24 })
    stores.value = (data?.results as Store[]) ?? []
    if (props.fulfillment) {
      viewMode.value = 'directory'
    } else if (!isHomeMode.value) {
      await loadAllProducts()
    }
  } catch {
    if (!isHomeMode.value) await loadCatalogProducts()
  } finally {
    loadingStores.value = false
  }
}

async function selectStore(store: Store) {
  activeStoreId.value = store.seller_id ?? store.user_id ?? null
  await loadProducts()
}

async function loadProducts() {
  if (!activeStoreId.value) {
    products.value = []
    return
  }
  loadingProducts.value = true
  productError.value = ''
  try {
    const { data } = await catalogPublicApi.listProducts({
      seller_id: Number(activeStoreId.value),
      page_size: 24,
      ...(activeCategory.value ? { category_slug: activeCategory.value } : {}),
    } as never)
    const list = (data?.results as Product[]) ?? []
    if (list.length) {
      products.value = list.map((p) => ({
        ...p,
        store_id: activeStoreId.value || undefined,
        store_name: activeStoreName.value,
      }))
    } else {
      const superData = await superAppApi.getGroceryStoreProducts(activeStoreId.value)
      const results =
        (superData?.data?.results as Product[]) ?? (Array.isArray(superData?.data) ? (superData.data as Product[]) : [])
      products.value = results.map((p) => ({
        ...p,
        store_id: activeStoreId.value || undefined,
        store_name: activeStoreName.value,
      }))
    }
    if (!products.value.length) productError.value = t('buyerXp.marketplace.noProductsInStore')
  } catch (e) {
    productError.value = formatApiError(e, t('buyerXp.marketplace.couldNotLoadProducts'))
  } finally {
    loadingProducts.value = false
  }
}

async function loadAllProducts() {
  loadingAllProducts.value = true
  try {
    const params: Record<string, unknown> = { page_size: 48 }
    if (activeCategory.value) params.category_slug = activeCategory.value
    if (searchTerm.value) params.search = searchTerm.value
    const { data } = await catalogPublicApi.listProducts(params as never)
    allProducts.value = (data?.results as Product[]) ?? []
  } finally {
    loadingAllProducts.value = false
  }
}

async function loadCatalogProducts() {
  loadingAllProducts.value = true
  try {
    const { data } = await catalogPublicApi.listProducts({ page_size: 24 })
    allProducts.value = (data?.results as Product[]) ?? []
  } catch {
    // ignore
  } finally {
    loadingAllProducts.value = false
  }
}

async function loadCategories() {
  try {
    const { data } = await catalogPublicApi.listCategories()
    categories.value = ((data?.results as Category[]) ?? []).slice(0, 12)
  } catch {
    categories.value = []
  }
}

async function addProduct(prod: Product) {
  addMessage.value = ''
  const skuId = prod.skus?.[0]?.id
  if (!skuId && !prod.id) {
    addError.value = t('buyerXp.marketplace.unavailable')
    return
  }
  const ok = await addProductToCart(prod)
  if (ok) {
    hasCartItems.value = true
    if (props.fulfillment && fulfillmentMode.value === 'delivery') {
      addMessage.value = t('buyerXp.marketplace.addedRequestBoda')
    }
  }
}

watch(activeCategory, () => {
  if (isHomeMode.value) void loadAllProducts()
})

onMounted(() => {
  const q = String(route.query.q ?? '').trim()
  if (q) searchTerm.value = q
  const mode = String(route.query.fulfillment ?? '').trim()
  if (mode === 'delivery' || mode === 'pickup') fulfillmentMode.value = mode
  const storeId = route.query.seller_id ?? route.query.store_id
  if (storeId && (props.compact || props.fulfillment)) {
    void router.replace(venueDetailLink('grocery', String(storeId), {
      ...(q ? { q } : {}),
      ...(mode ? { fulfillment: mode } : {}),
    }))
    return
  }
  if (isHomeMode.value) {
    void loadCategories()
    void loadAllProducts()
    void loadHomeStores()
  } else {
    void loadStores()
  }
})
</script>
