<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <div>
          <h1 class="buyer-page-head__title">{{ t('buyerXp.nearby.title') }}</h1>
          <p class="buyer-page-head__meta">
            {{ locationLabel }}
          </p>
        </div>
        <div class="buyer-btn-row buyer-page-head__actions">
          <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" :disabled="loading" @click="load">
            {{ loading ? t('buyerXp.nearby.locating') : t('buyerXp.common.refresh') }}
          </button>
        </div>
      </div>
      <BuyerSearchBar v-model="searchTerm" :placeholder="t('buyerXp.nearby.searchPlaceholder')" />
      <div class="buyer-filter-row" role="tablist" aria-label="Category">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="buyer-filter-chip"
          :class="{ 'buyer-filter-chip--active': activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          <Icon :icon="tab.icon" aria-hidden="true" />
          {{ tab.label }}
          <span v-if="tab.count" class="buyer-side-nav__counter">{{ tab.count }}</span>
        </button>
      </div>
    </header>

    <p v-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>
    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>

    <template v-else>
      <section v-if="showRestaurants && filteredRestaurants.length" class="buyer-surface">
        <BuyerSectionHeader :title="t('buyerXp.nearby.restaurants')" :action-to="{ name: 'buyer.eats' }" :action-label="t('buyerXp.common.seeAll')" />
        <div class="buyer-venue-list">
          <BuyerVenueCard
            v-for="(r, i) in filteredRestaurants"
            :key="'r-' + i"
            :name="venueName(r)"
            :address="venueAddress(r)"
            :meta="venueMeta(r)"
            :image-url="venueImageUrl(r)"
            kind="restaurant"
            icon="solar:chef-hat-bold"
            :detail-to="venueLink('eats', r)"
          />
        </div>
      </section>

      <section v-if="showGroceries && filteredGroceries.length" class="buyer-surface">
        <BuyerSectionHeader :title="t('buyerXp.nearby.groceryStores')" :action-to="{ name: 'buyer.grocery' }" :action-label="t('buyerXp.common.seeAll')" />
        <div class="buyer-venue-list">
          <BuyerVenueCard
            v-for="(g, i) in filteredGroceries"
            :key="'g-' + i"
            :name="venueName(g)"
            :address="venueAddress(g)"
            :meta="venueMeta(g)"
            :image-url="venueImageUrl(g)"
            kind="grocery"
            icon="solar:cart-large-2-bold"
            :detail-to="venueLink('grocery', g)"
          />
        </div>
      </section>

      <section v-if="showHotels && filteredHotels.length" class="buyer-surface">
        <BuyerSectionHeader :title="t('buyerXp.nearby.staysNearby')" :action-to="{ name: 'buyer.booking' }" :action-label="t('buyerXp.common.mapAndBook')" />
        <div class="buyer-venue-list">
          <BuyerVenueCard
            v-for="(h, i) in filteredHotels"
            :key="'h-' + i"
            :name="venueName(h)"
            :address="venueAddress(h)"
            :meta="venueMeta(h)"
            :image-url="venueImageUrl(h)"
            kind="store"
            icon="solar:bed-bold"
            :detail-to="venueLink('hotel', h)"
          />
        </div>
      </section>

      <BuyerEmptyState
        v-if="!hasResults && !error"
        icon="solar:map-point-wave-bold"
        :title="t('buyerXp.nearby.emptyTitle')"
        :message="t('buyerXp.nearby.emptyMessage')"
      >
        <template #action>
          <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="load">{{ t('buyerXp.common.tryAgain') }}</button>
          <RouterLink :to="{ name: 'buyer.booking' }" class="buyer-venue__chip">{{ t('buyerXp.common.findStays') }}</RouterLink>
        </template>
      </BuyerEmptyState>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { discoveryApi } from '@/api/discovery'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerDistance } from '@/utils/buyerFormat'
import { venueImageUrl } from '@/utils/assetUrl'
import { venueDetailLink, type VenueVertical } from '@/utils/buyerDetailLinks'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerVenueCard from '@/components/buyer/experience/BuyerVenueCard.vue'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type TabId = 'all' | 'restaurants' | 'groceries' | 'hotels'

const loading = ref(false)
const error = ref('')
const { t } = useI18n()
const searchTerm = ref('')
const activeTab = ref<TabId>('all')
const usedGps = ref(false)
const restaurants = ref<Record<string, unknown>[]>([])
const groceries = ref<Record<string, unknown>[]>([])
const hotels = ref<Record<string, unknown>[]>([])

const FALLBACK = { lat: -6.8172, lng: 39.2833 }

const locationLabel = computed(() =>
  usedGps.value ? t('buyerXp.nearby.locationCurrent') : t('buyerXp.nearby.locationDefault'),
)

const tabs = computed(() => [
  { id: 'all' as TabId, label: t('buyerXp.nearby.tabAll'), icon: 'solar:widget-5-bold', count: totalCount.value || undefined },
  { id: 'restaurants' as TabId, label: t('buyerXp.nearby.tabEats'), icon: 'solar:chef-hat-bold', count: restaurants.value.length || undefined },
  { id: 'groceries' as TabId, label: t('buyerXp.nearby.tabGrocery'), icon: 'solar:cart-large-2-bold', count: groceries.value.length || undefined },
  { id: 'hotels' as TabId, label: t('buyerXp.nearby.tabStays'), icon: 'solar:bed-bold', count: hotels.value.length || undefined },
])

const totalCount = computed(() => restaurants.value.length + groceries.value.length + hotels.value.length)

const showRestaurants = computed(() => activeTab.value === 'all' || activeTab.value === 'restaurants')
const showGroceries = computed(() => activeTab.value === 'all' || activeTab.value === 'groceries')
const showHotels = computed(() => activeTab.value === 'all' || activeTab.value === 'hotels')

function matchesSearch(row: Record<string, unknown>) {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return true
  const hay = [row.business_name, row.name, row.business_address, row.address]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

const filteredRestaurants = computed(() => restaurants.value.filter(matchesSearch))
const filteredGroceries = computed(() => groceries.value.filter(matchesSearch))
const filteredHotels = computed(() => hotels.value.filter(matchesSearch))

const hasResults = computed(
  () =>
    (showRestaurants.value && filteredRestaurants.value.length > 0) ||
    (showGroceries.value && filteredGroceries.value.length > 0) ||
    (showHotels.value && filteredHotels.value.length > 0),
)

function venueName(row: Record<string, unknown>) {
  return String(row.business_name || row.name || t('buyerXp.common.venueFallback'))
}

function venueAddress(row: Record<string, unknown>) {
  return String(row.business_address || row.address || '')
}

function venueMeta(row: Record<string, unknown>) {
  const dist = formatBuyerDistance(row.distance_km ?? row.distance)
  const open = row.is_open === true ? t('buyerXp.common.openNow') : row.is_open === false ? t('buyerXp.common.closed') : ''
  return [dist, open].filter(Boolean).join(' · ')
}

function venueLink(vertical: VenueVertical, row: Record<string, unknown>) {
  const id = row.seller_id ?? row.user_id ?? row.id
  if (id == null) return undefined
  return venueDetailLink(vertical, id as number | string)
}

async function load() {
  loading.value = true
  error.value = ''
  let lat = FALLBACK.lat
  let lng = FALLBACK.lng
  usedGps.value = false
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 }),
    )
    lat = pos.coords.latitude
    lng = pos.coords.longitude
    usedGps.value = true
  } catch {
    // fallback coords
  }
  try {
    const { data } = await discoveryApi.nearby({ lat, lng, radius_km: 8 })
    restaurants.value = (data?.restaurants ?? []) as Record<string, unknown>[]
    groceries.value = (data?.grocery_stores ?? []) as Record<string, unknown>[]
    hotels.value = (data?.hotels ?? []) as Record<string, unknown>[]
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.nearby.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
