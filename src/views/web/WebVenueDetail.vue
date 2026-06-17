<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.venue.backTo', { label: config.listLabel })" @click="goBack">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div>
          <h1 class="buyer-page-head__title">{{ venueName }}</h1>
          <p v-if="venueMeta" class="buyer-page-head__meta">{{ venueMeta }}</p>
          <p v-if="venueAddress" class="buyer-page-head__meta">{{ venueAddress }}</p>
        </div>
      </div>
    </header>

    <BuyerFulfillmentBar
      v-if="showFulfillment"
      v-model="fulfillmentMode"
      :modes="fulfillmentModes"
      :label="config.fulfillmentLabel"
      :hint="fulfillmentHint"
    />

    <div v-if="showFulfillment && fulfillmentMode === 'delivery'" class="fulfillment-action">
      <Icon icon="solar:scooter-bold" class="fulfillment-action__icon" aria-hidden="true" />
      <div class="fulfillment-action__copy">
        <p class="fulfillment-action__title">{{ t('buyerXp.common.riderDeliveryTitle') }}</p>
        <p class="fulfillment-action__text">{{ config.deliveryCopy }}</p>
      </div>
      <RouterLink :to="rideLink" class="fulfillment-action__btn">{{ t('buyerXp.common.requestBoda') }}</RouterLink>
    </div>

    <BuyerTableBookingPanel
      v-if="vertical === 'eats' && fulfillmentMode === 'dine_in' && sellerUserId"
      :seller-user-id="sellerUserId"
      :restaurant-name="venueName"
    />

    <section class="buyer-surface" aria-label="Catalog">
      <BuyerSearchBar v-if="showSearch" v-model="search" :placeholder="config.searchPlaceholder" />
      <BuyerProductGridSection
        :products="displayProducts"
        :loading="loading"
        :error="error"
        :message="addMessage"
        :add-error="addError"
        :adding="adding"
        :show-store-label="false"
        @add="addProduct"
      />
    </section>

    <footer v-if="showFooter" class="eats-footer-actions">
      <RouterLink v-if="fulfillmentMode === 'delivery'" :to="rideLink" class="eats-footer-actions__primary">
        <Icon icon="solar:scooter-bold" aria-hidden="true" />
        {{ t('buyerXp.common.requestBodaFooter') }}
      </RouterLink>
      <RouterLink :to="checkoutLink" class="eats-footer-actions__secondary">
        <Icon icon="solar:cart-large-2-bold" aria-hidden="true" />
        {{ t('buyerXp.common.checkout') }}
      </RouterLink>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import {
  superAppApi,
  type RestaurantMenuItem,
  type RestaurantMenuResponse,
  type HotelMenuResponse,
} from '@/api/superApp'
import { catalogPublicApi } from '@/api/catalog'
import { cartApi } from '@/api/cart'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'
import { buildCheckoutLink, buildRideLink } from '@/utils/fulfillmentLinks'
import type { VenueVertical } from '@/utils/buyerDetailLinks'
import BuyerFulfillmentBar, { type FulfillmentModeId } from '@/components/buyer/BuyerFulfillmentBar.vue'
import BuyerTableBookingPanel from '@/components/buyer/BuyerTableBookingPanel.vue'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'

const props = defineProps<{ sellerId: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const refreshBuyerCart = inject<() => Promise<void>>('refreshBuyerCart', async () => {})
const openBuyerCart = inject<() => void>('openBuyerCart', () => {})

const vertical = computed(() => String(route.meta.venueVertical ?? 'eats') as VenueVertical)

const products = ref<GridProduct[]>([])
const venueName = ref('')
const venueAddress = ref('')
const venueMeta = ref('')
const sellerUserId = ref<number | null>(null)
const loading = ref(false)
const error = ref('')
const adding = ref(false)
const addMessage = ref('')
const addError = ref('')
const search = ref('')
const fulfillmentMode = ref<FulfillmentModeId>('pickup')
const hasCartItems = ref(false)

const config = computed(() => {
  const v = vertical.value
  const store = venueName.value || t('buyerXp.common.storeFallback')
  const configs = {
    eats: {
      listLabel: t('buyerXp.venue.listRestaurants'),
      listRoute: 'buyer.eats',
      fulfillmentLabel: t('buyerXp.venue.fulfillmentEats'),
      deliveryCopy: t('buyerXp.venue.deliveryEats', { store }),
      searchPlaceholder: t('buyerXp.venue.searchDishes'),
      showFulfillment: true,
      showSearch: true,
    },
    grocery: {
      listLabel: t('buyerXp.venue.listStores'),
      listRoute: 'buyer.grocery',
      fulfillmentLabel: t('buyerXp.venue.fulfillmentGrocery'),
      deliveryCopy: t('buyerXp.venue.deliveryGrocery', { store }),
      searchPlaceholder: t('buyerXp.venue.searchProducts'),
      showFulfillment: true,
      showSearch: true,
    },
    pharmacy: {
      listLabel: t('buyerXp.venue.listPharmacy'),
      listRoute: 'buyer.pharmacy',
      fulfillmentLabel: '',
      deliveryCopy: '',
      searchPlaceholder: t('buyerXp.venue.searchMedicines'),
      showFulfillment: false,
      showSearch: true,
    },
    hotel: {
      listLabel: t('buyerXp.venue.listHotels'),
      listRoute: 'buyer.booking',
      fulfillmentLabel: '',
      deliveryCopy: '',
      searchPlaceholder: t('buyerXp.venue.searchRooms'),
      showFulfillment: false,
      showSearch: true,
    },
  } as const
  return configs[v]
})

const eatsFulfillmentModes = computed(() => [
  { id: 'dine_in' as const, label: t('buyerXp.eats.dineIn'), icon: 'solar:chair-2-bold' },
  { id: 'pickup' as const, label: t('buyerXp.eats.pickup'), icon: 'solar:bag-3-bold' },
  { id: 'delivery' as const, label: t('buyerXp.eats.deliver'), icon: 'solar:scooter-bold' },
])

const groceryFulfillmentModes = computed(() => [
  { id: 'pickup' as const, label: t('buyerXp.marketplace.pickup'), icon: 'solar:bag-3-bold' },
  { id: 'delivery' as const, label: t('buyerXp.marketplace.deliver'), icon: 'solar:scooter-bold' },
])

const fulfillmentModes = computed(() =>
  vertical.value === 'eats' ? eatsFulfillmentModes.value : groceryFulfillmentModes.value,
)

const showFulfillment = computed(() => config.value.showFulfillment)
const showSearch = computed(() => config.value.showSearch)

const displayProducts = computed(() => {
  if (!search.value.trim()) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter(
    (p) =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q),
  )
})

const fulfillmentHint = computed(() => {
  if (vertical.value === 'eats') {
    if (fulfillmentMode.value === 'dine_in') return t('buyerXp.eats.dineInHint')
    if (fulfillmentMode.value === 'delivery') return t('buyerXp.eats.deliveryHint')
    return t('buyerXp.eats.pickupHint')
  }
  if (fulfillmentMode.value === 'delivery') return t('buyerXp.marketplace.fulfillmentDeliveryHint')
  return t('buyerXp.marketplace.fulfillmentPickupHint')
})

const rideLink = computed(() =>
  buildRideLink({
    pickup: venueAddress.value,
    notes: `From ${venueName.value}`,
    vehicleType: 'boda',
  }),
)

const checkoutLink = computed(() => buildCheckoutLink(fulfillmentMode.value))
const showFooter = computed(
  () =>
    showFulfillment.value &&
    (hasCartItems.value || fulfillmentMode.value === 'delivery' || fulfillmentMode.value === 'dine_in'),
)

function goBack() {
  void router.push({ name: config.value.listRoute })
}

function flattenMenu(data: RestaurantMenuResponse | HotelMenuResponse): GridProduct[] {
  const items: GridProduct[] = []
  for (const cat of data.categories ?? []) {
    for (const p of cat.products ?? []) {
      items.push({ ...p } as GridProduct)
    }
  }
  return items
}

function setVenueFromMenu(data: RestaurantMenuResponse | HotelMenuResponse) {
  const entity = data.restaurant ?? data.hotel
  if (entity) {
    venueName.value = entity.business_name || venueName.value
    venueAddress.value = entity.business_address || ''
    sellerUserId.value = entity.user_id ?? entity.seller_id ?? null
    const parts: string[] = []
    if ('prep_time_minutes' in entity && entity.prep_time_minutes) {
      parts.push(`${entity.prep_time_minutes} min`)
    }
    if (entity.opening_hours) parts.push(entity.opening_hours)
    venueMeta.value = parts.join(' · ')
  }
}

async function loadVenue() {
  const sid = props.sellerId || String(route.params.sellerId ?? '')
  if (!sid) {
    error.value = t('buyerXp.venue.storeNotFound')
    return
  }
  loading.value = true
  error.value = ''
  try {
    if (vertical.value === 'eats') {
      const { data } = await superAppApi.getRestaurantMenu(sid)
      setVenueFromMenu(data)
      products.value = flattenMenu(data)
    } else if (vertical.value === 'hotel') {
      const { data } = await superAppApi.getHotelMenu(sid)
      setVenueFromMenu(data)
      products.value = flattenMenu(data)
    } else if (vertical.value === 'grocery') {
      const { data } = await superAppApi.getGroceryStoreProducts(sid)
      const store = (data as { store?: { business_name?: string; business_address?: string; user_id?: number } })?.store
      if (store) {
        venueName.value = store.business_name || venueName.value
        venueAddress.value = store.business_address || ''
        sellerUserId.value = store.user_id ?? null
      }
      const list =
        (data as { products?: GridProduct[] })?.products ??
        (data as { results?: GridProduct[] })?.results ??
        []
      products.value = Array.isArray(list) ? list : []
    } else {
      const { data } = await catalogPublicApi.listProducts({
        seller_id: Number(sid),
        category_slug: 'pharmacy',
        page_size: 48,
        in_stock: true,
      } as never)
      products.value = ((data as { results?: GridProduct[] })?.results ?? []) as GridProduct[]
    }
    if (!products.value.length) error.value = t('buyerXp.venue.noItems')
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function addProduct(prod: GridProduct) {
  addMessage.value = ''
  addError.value = ''
  if (!auth.isAuthenticated) {
    addError.value = t('buyerXp.common.signInToAdd')
    return
  }
  const skuId = prod.skus?.[0]?.id
  if (!skuId) {
    addError.value = t('buyerXp.common.unavailable')
    return
  }
  adding.value = true
  try {
    await cartApi.add(Number(skuId), 1)
    hasCartItems.value = true
    addMessage.value = t('buyerXp.common.addedToCart')
    await refreshBuyerCart()
    openBuyerCart()
  } catch (e) {
    addError.value = formatApiError(e, t('buyerXp.common.couldNotAdd'))
  } finally {
    adding.value = false
  }
}

watch(
  () => route.params.sellerId,
  () => void loadVenue(),
)

onMounted(() => {
  const mode = String(route.query.fulfillment ?? '').trim()
  if (mode === 'dine_in' || mode === 'delivery' || mode === 'pickup') {
    fulfillmentMode.value = mode
  }
  const q = String(route.query.q ?? '').trim()
  if (q) search.value = q
  void loadVenue()
})
</script>
