<template>
  <div class="buyer-xp buyer-xp--wide eats-main">
    <header v-if="viewMode === 'directory'" class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.eats.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.eats.meta') }}</p>
      <BuyerSearchBar v-model="searchTerm" :placeholder="t('buyerXp.eats.searchPlaceholder')" />
    </header>

    <header v-else class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.eats.backToRestaurants')" @click="backToDirectory">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div>
          <h1 class="buyer-page-head__title">{{ activeRestaurant?.business_name || t('buyerXp.common.restaurantFallback') }}</h1>
          <p v-if="activeRestaurantMeta" class="buyer-page-head__meta">{{ activeRestaurantMeta }}</p>
        </div>
      </div>
    </header>

    <BuyerFulfillmentBar
      v-if="viewMode === 'menu'"
      v-model="fulfillmentMode"
      :modes="fulfillmentModes"
      :label="t('buyerXp.eats.fulfillmentLabel')"
      :hint="fulfillmentHint"
    />

    <div v-if="viewMode === 'menu' && fulfillmentMode === 'delivery' && activeRestaurant" class="fulfillment-action">
      <Icon icon="solar:scooter-bold" class="fulfillment-action__icon" aria-hidden="true" />
      <div class="fulfillment-action__copy">
        <p class="fulfillment-action__title">{{ t('buyerXp.common.riderDeliveryTitle') }}</p>
        <p class="fulfillment-action__text">
          {{ t('buyerXp.eats.riderDeliveryCopy', { store: activeRestaurant.business_name || t('buyerXp.common.restaurantFallback') }) }}
        </p>
      </div>
      <RouterLink :to="rideLink" class="fulfillment-action__btn">{{ t('buyerXp.common.requestBoda') }}</RouterLink>
    </div>

    <BuyerTableBookingPanel
      v-if="viewMode === 'menu' && fulfillmentMode === 'dine_in' && activeRestaurant"
      :seller-user-id="activeRestaurant.user_id ?? null"
      :restaurant-name="activeRestaurant.business_name"
    />

    <section v-if="viewMode === 'directory'" class="buyer-venue-list" aria-label="Restaurants">
      <p v-if="loadingRestaurants" class="shop-products__status">{{ t('buyerXp.eats.loadingRestaurants') }}</p>
      <p v-else-if="restaurantError" class="shop-products__status shop-products__status--error">{{ restaurantError }}</p>
      <p v-else-if="!filteredRestaurants.length" class="shop-products__status">{{ t('buyerXp.eats.noRestaurants') }}</p>
      <BuyerVenueCard
        v-for="restaurant in filteredRestaurants"
        :key="entryKey(restaurant)"
        :name="restaurant.business_name || t('buyerXp.common.restaurantFallback')"
        :address="restaurant.business_address"
        :meta="restaurantMeta(restaurant)"
        kind="restaurant"
        icon="solar:chef-hat-bold"
        :send-to="sendLink(restaurant)"
        :ride-to="rideLinkFor(restaurant)"
        :detail-to="venueDetailLink('eats', restaurant.seller_id ?? restaurant.user_id ?? '')"
      />
    </section>

    <section v-else class="shop-products" aria-label="Menu">
      <p v-if="loadingMenu" class="shop-products__status">{{ t('buyerXp.eats.loadingMenu') }}</p>
      <p v-else-if="menuError" class="shop-products__status shop-products__status--error">{{ menuError }}</p>
      <p v-else-if="!displayMenuItems.length" class="shop-products__status">{{ t('buyerXp.eats.noDishes') }}</p>

      <div v-else class="shop-product-grid">
        <BuyerStoreProductCard
          v-for="item in displayMenuItems"
          :key="String(item.id)"
          :title="item.title"
          :description="item.description"
          :price-label="formatPrice(item.price ?? item.base_price ?? item.discount_price)"
          :image-url="menuItemImage(item)"
          :category-label="item.skus?.length ? t('buyerXp.common.ready') : undefined"
          :disabled="!item.skus?.length"
          :adding="adding"
          @add="addToCart(item)"
          @open="openProduct(item)"
        />
      </div>

      <p v-if="addMessage" class="buyer-xp-toast buyer-xp-toast--ok">{{ addMessage }}</p>
      <p v-if="addError" class="buyer-xp-toast buyer-xp-toast--err">{{ addError }}</p>
    </section>

    <footer v-if="viewMode === 'menu' && showFooterActions" class="eats-footer-actions">
      <RouterLink v-if="fulfillmentMode === 'delivery'" :to="rideLink" class="eats-footer-actions__primary">
        <Icon icon="solar:scooter-bold" aria-hidden="true" />
        {{ t('buyerXp.common.requestBodaFooter') }}
      </RouterLink>
      <RouterLink :to="checkoutLink" class="eats-footer-actions__secondary">
        <Icon icon="solar:cart-large-2-bold" aria-hidden="true" />
        {{ fulfillmentMode === 'dine_in' ? t('buyerXp.eats.preOrderCheckout') : t('buyerXp.common.checkout') }}
      </RouterLink>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import {
  superAppApi,
  type RestaurantListItem,
  type RestaurantMenuItem,
  type RestaurantMenuResponse,
} from '@/api/superApp'
import { cartApi } from '@/api/cart'
import { formatApiError } from '@/utils/formatApiError'
import { buildCheckoutLink, buildRideLink } from '@/utils/fulfillmentLinks'
import BuyerFulfillmentBar, { type FulfillmentModeId } from '@/components/buyer/BuyerFulfillmentBar.vue'
import BuyerTableBookingPanel from '@/components/buyer/BuyerTableBookingPanel.vue'
import BuyerStoreProductCard from '@/components/buyer/BuyerStoreProductCard.vue'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerVenueCard from '@/components/buyer/experience/BuyerVenueCard.vue'
import { resolveAssetUrl } from '@/utils/assetUrl'
import { venueDetailLink } from '@/utils/buyerDetailLinks'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const refreshBuyerCart = inject<() => Promise<void>>('refreshBuyerCart', async () => {})
const openBuyerCart = inject<() => void>('openBuyerCart', () => {})

const restaurants = ref<RestaurantListItem[]>([])
const menuItems = ref<RestaurantMenuItem[]>([])
const activeRestaurantId = ref<number | string | null>(null)
const viewMode = ref<'directory' | 'menu'>('directory')
const loadingRestaurants = ref(false)
const loadingMenu = ref(false)
const adding = ref(false)
const restaurantError = ref('')
const menuError = ref('')
const addMessage = ref('')
const addError = ref('')
const searchTerm = ref('')
const fulfillmentMode = ref<FulfillmentModeId>('pickup')
const hasCartItems = ref(false)

const fulfillmentModes = computed(() => [
  { id: 'dine_in' as const, label: t('buyerXp.eats.dineIn'), icon: 'solar:chair-2-bold' },
  { id: 'pickup' as const, label: t('buyerXp.eats.pickup'), icon: 'solar:bag-3-bold' },
  { id: 'delivery' as const, label: t('buyerXp.eats.deliver'), icon: 'solar:scooter-bold' },
])

const activeRestaurant = computed(() =>
  restaurants.value.find((r) => r.seller_id === activeRestaurantId.value) ?? null,
)

const filteredRestaurants = computed(() => {
  if (!searchTerm.value) return restaurants.value
  const term = searchTerm.value.toLowerCase()
  return restaurants.value.filter((r) => (r.business_name || '').toLowerCase().includes(term))
})

const displayMenuItems = computed(() => {
  if (!searchTerm.value || viewMode.value === 'directory') return menuItems.value
  const term = searchTerm.value.toLowerCase()
  return menuItems.value.filter(
    (item) =>
      (item.title || '').toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term),
  )
})

const activeRestaurantMeta = computed(() => {
  const r = activeRestaurant.value
  if (!r) return ''
  return restaurantMeta(r)
})

function restaurantMeta(r: RestaurantListItem) {
  const parts: string[] = []
  if (r.prep_time_minutes) parts.push(`${r.prep_time_minutes} min`)
  if (r.opening_hours) parts.push(r.opening_hours)
  if (r.average_rating) parts.push(`★ ${r.average_rating.toFixed(1)}`)
  return parts.join(' · ')
}

const fulfillmentHint = computed(() => {
  if (fulfillmentMode.value === 'dine_in') return t('buyerXp.eats.dineInHint')
  if (fulfillmentMode.value === 'delivery') return t('buyerXp.eats.deliveryHint')
  return t('buyerXp.eats.pickupHint')
})

const rideLink = computed(() =>
  buildRideLink({
    pickup: activeRestaurant.value?.business_address,
    notes: `Food delivery from ${activeRestaurant.value?.business_name || 'restaurant'}`,
    vehicleType: 'boda',
  }),
)

const checkoutLink = computed(() => buildCheckoutLink(fulfillmentMode.value))

const showFooterActions = computed(
  () => hasCartItems.value || fulfillmentMode.value === 'delivery' || fulfillmentMode.value === 'dine_in',
)

function entryKey(item: RestaurantListItem) {
  return String(item.seller_id || item.user_id || Math.random())
}

function sendLink(r: RestaurantListItem) {
  return {
    name: 'buyer.send',
    query: { store: r.business_name, seller_id: r.seller_id ?? r.user_id, category: 'food' },
  }
}

function rideLinkFor(r: RestaurantListItem) {
  return buildRideLink({
    pickup: r.business_address,
    notes: `Food from ${r.business_name || 'restaurant'}`,
    vehicleType: 'boda',
  })
}

function openProduct(item: RestaurantMenuItem) {
  if (!item.id) return
  void router.push({ name: 'buyer.product', params: { id: String(item.id) } })
}

function openRestaurant(r: RestaurantListItem) {
  const sid = r.seller_id ?? r.user_id
  if (!sid) return
  void router.push(venueDetailLink('eats', sid))
}

function backToDirectory() {
  viewMode.value = 'directory'
  activeRestaurantId.value = null
  menuItems.value = []
}

async function loadRestaurants() {
  loadingRestaurants.value = true
  restaurantError.value = ''
  try {
    const { data } = await superAppApi.getRestaurants({ limit: 24 })
    restaurants.value = data?.results ?? []
  } catch (e) {
    restaurantError.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loadingRestaurants.value = false
  }
}

async function selectRestaurant(r: RestaurantListItem) {
  activeRestaurantId.value = r.seller_id ?? r.user_id ?? null
  await loadMenu()
}

async function loadMenu() {
  if (!activeRestaurantId.value) {
    menuItems.value = []
    return
  }
  loadingMenu.value = true
  addMessage.value = ''
  addError.value = ''
  menuError.value = ''
  try {
    const { data } = await superAppApi.getRestaurantMenu(activeRestaurantId.value)
    menuItems.value = flattenMenu(data)
    if (!menuItems.value.length) menuError.value = t('buyerXp.eats.noDishes')
  } catch (e) {
    menuError.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loadingMenu.value = false
  }
}

function flattenMenu(data: RestaurantMenuResponse): RestaurantMenuItem[] {
  const items: RestaurantMenuItem[] = []
  for (const cat of data.categories ?? []) {
    for (const p of cat.products ?? []) {
      items.push({ ...p })
    }
  }
  return items
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function menuItemImage(item: RestaurantMenuItem) {
  return resolveAssetUrl(item.cover_image) ?? null
}

async function addToCart(item: RestaurantMenuItem) {
  addMessage.value = ''
  addError.value = ''
  if (!auth.isAuthenticated) {
    addError.value = t('buyerXp.common.signInToAdd')
    return
  }
  const skuId = item.skus?.[0]?.id
  if (!skuId) {
    addError.value = t('buyerXp.common.unavailable')
    return
  }
  adding.value = true
  try {
    await cartApi.add(Number(skuId), 1)
    hasCartItems.value = true
    if (fulfillmentMode.value === 'delivery') {
      addMessage.value = t('buyerXp.eats.addedDelivery')
    } else if (fulfillmentMode.value === 'dine_in') {
      addMessage.value = t('buyerXp.eats.addedDineIn')
    } else {
      addMessage.value = t('buyerXp.eats.addedPickup')
    }
    await refreshBuyerCart()
    openBuyerCart()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string } } }
    addError.value = err.response?.data?.detail ?? t('buyerXp.common.couldNotAdd')
  } finally {
    adding.value = false
  }
}

onMounted(() => {
  const q = String(route.query.q ?? '').trim()
  if (q) searchTerm.value = q
  const mode = String(route.query.fulfillment ?? '').trim()
  if (mode === 'dine_in' || mode === 'delivery' || mode === 'pickup') {
    fulfillmentMode.value = mode
  }
  const sellerId = route.query.seller_id ?? route.query.store_id
  if (sellerId) {
    void router.replace(venueDetailLink('eats', String(sellerId), {
      ...(q ? { q } : {}),
      ...(mode ? { fulfillment: mode } : {}),
    }))
    return
  }
  void loadRestaurants()
})
</script>
