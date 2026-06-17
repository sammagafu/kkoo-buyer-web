<template>
  <div class="buyer-xp buyer-xp--wide booking-page">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row booking-page__head-row">
        <div>
          <h1 class="buyer-page-head__title">{{ t('buyerXp.booking.title') }}</h1>
          <p class="buyer-page-head__meta">{{ t('buyerXp.booking.meta') }}</p>
        </div>
        <div class="booking-page__head-actions buyer-btn-row">
          <RouterLink :to="{ name: 'buyer.reservations' }" class="buyer-venue__chip">{{ t('buyerXp.booking.myReservations') }}</RouterLink>
          <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" :disabled="loadingHotels" @click="loadHotels">
            {{ loadingHotels ? t('buyerXp.common.loading') : t('buyerXp.common.refresh') }}
          </button>
        </div>
      </div>
      <BuyerSearchBar v-model="searchTerm" :placeholder="t('buyerXp.booking.searchPlaceholder')" />
    </header>

    <div class="booking-page__toolbar">
      <div class="booking-page__modes" role="tablist" aria-label="View mode">
        <button
          v-for="mode in viewModes"
          :key="mode.id"
          type="button"
          role="tab"
          class="booking-page__mode"
          :class="{ 'booking-page__mode--active': browseMode === mode.id }"
          :aria-selected="browseMode === mode.id"
          @click="browseMode = mode.id"
        >
          <Icon :icon="mode.icon" aria-hidden="true" />
          {{ mode.label }}
        </button>
      </div>
      <label class="booking-page__filter">
        <input v-model="openOnly" type="checkbox" />
        {{ t('buyerXp.booking.openNow') }}
      </label>
      <span class="booking-page__count">{{ t('buyerXp.booking.staysCount', { count: visibleHotels.length }) }}</span>
    </div>

    <p v-if="hotelError" class="buyer-xp-toast buyer-xp-toast--err">{{ hotelError }}</p>

    <div v-if="loadingHotels" class="shop-products__status">{{ t('buyerXp.booking.loadingHotels') }}</div>

    <template v-else-if="visibleHotels.length">
      <div v-if="browseMode === 'list'" class="booking-page__list-layout">
        <section class="buyer-surface booking-page__hotel-list" aria-label="Hotels">
          <article
            v-for="hotel in visibleHotels"
            :key="hotelKey(hotel)"
            class="booking-hotel-card"
            :class="{ 'booking-hotel-card--active': hotelId(hotel) === activeHotelId }"
            @click="selectHotel(hotel)"
          >
            <div class="booking-hotel-card__top">
              <span v-if="hotel.open_now" class="booking-hotel-card__pill booking-hotel-card__pill--open">{{ t('buyerXp.booking.open') }}</span>
              <span v-if="formatHotelDistance(hotelDistanceMeters(hotel))" class="booking-hotel-card__pill">
                {{ formatHotelDistance(hotelDistanceMeters(hotel)) }}
              </span>
            </div>
            <h3 class="booking-hotel-card__name">{{ hotelName(hotel) }}</h3>
            <p class="booking-hotel-card__addr">{{ hotelAddress(hotel) || t('buyerXp.booking.hospitality') }}</p>
            <div class="booking-hotel-card__actions">
              <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click.stop="selectHotel(hotel)">
                {{ t('buyerXp.booking.rooms') }}
              </button>
              <RouterLink
                v-if="canOpenDetail(hotel)"
                :to="venueDetailLink('hotel', hotelId(hotel)!)"
                class="buyer-venue__chip"
                @click.stop
              >
                {{ t('buyerXp.booking.details') }}
              </RouterLink>
            </div>
          </article>
        </section>
        <section class="buyer-surface booking-page__rooms" aria-label="Rooms and services">
          <BookingRoomsPanel
            :title="activeHotelName"
            :loading="loadingMenu"
            :menu-error="menuError"
            :menu-items="menuItems"
            :adding="adding"
            :add-message="addMessage"
            :add-error="addError"
            :hotel-slug="hotelSlug"
            @add-to-cart="addToCart"
          />
        </section>
      </div>

      <div v-else-if="browseMode === 'map'" class="booking-page__map-layout">
        <BuyerHotelsMap
          class="booking-page__map"
          :hotels="visibleHotels"
          :center-lat="mapLat"
          :center-lng="mapLng"
          :selected-hotel-id="activeHotelId"
          expand
          @select="selectHotel"
        />
        <div v-if="selectedHotel" class="booking-page__map-preview">
          <article class="booking-hotel-card booking-hotel-card--compact">
            <h3 class="booking-hotel-card__name">{{ hotelName(selectedHotel) }}</h3>
            <p class="booking-hotel-card__addr">{{ hotelAddress(selectedHotel) }}</p>
            <div class="booking-hotel-card__actions">
              <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="selectHotel(selectedHotel)">
                {{ t('buyerXp.booking.viewRooms') }}
              </button>
              <RouterLink
                v-if="canOpenDetail(selectedHotel)"
                :to="venueDetailLink('hotel', hotelId(selectedHotel)!)"
                class="buyer-venue__chip"
              >
                {{ t('buyerXp.booking.details') }}
              </RouterLink>
            </div>
          </article>
        </div>
        <div class="booking-page__map-carousel" role="list" aria-label="Hotels on map">
          <article
            v-for="hotel in mapHotels"
            :key="hotelKey(hotel)"
            class="booking-hotel-card booking-hotel-card--carousel"
            :class="{ 'booking-hotel-card--active': hotelId(hotel) === activeHotelId }"
            role="listitem"
            @click="selectHotel(hotel)"
          >
            <h3 class="booking-hotel-card__name">{{ hotelName(hotel) }}</h3>
            <p class="booking-hotel-card__addr">{{ hotelAddress(hotel) }}</p>
          </article>
        </div>
        <section v-if="activeHotelId != null" class="buyer-surface booking-page__rooms booking-page__rooms--map">
          <BookingRoomsPanel
            :title="activeHotelName"
            :loading="loadingMenu"
            :menu-error="menuError"
            :menu-items="menuItems"
            :adding="adding"
            :add-message="addMessage"
            :add-error="addError"
            :hotel-slug="hotelSlug"
            @add-to-cart="addToCart"
          />
        </section>
      </div>

      <div v-else class="booking-page__split-layout">
        <section class="buyer-surface booking-page__hotel-list booking-page__hotel-list--split" aria-label="Hotels">
          <article
            v-for="hotel in visibleHotels"
            :key="hotelKey(hotel)"
            class="booking-hotel-card booking-hotel-card--compact"
            :class="{ 'booking-hotel-card--active': hotelId(hotel) === activeHotelId }"
            @click="selectHotel(hotel)"
          >
            <h3 class="booking-hotel-card__name">{{ hotelName(hotel) }}</h3>
            <p class="booking-hotel-card__addr">{{ hotelAddress(hotel) }}</p>
          </article>
        </section>
        <BuyerHotelsMap
          class="booking-page__map booking-page__map--split"
          :hotels="visibleHotels"
          :center-lat="mapLat"
          :center-lng="mapLng"
          :selected-hotel-id="activeHotelId"
          expand
          @select="selectHotel"
        />
        <section class="buyer-surface booking-page__rooms booking-page__rooms--split" aria-label="Rooms and services">
          <BookingRoomsPanel
            :title="activeHotelName"
            :loading="loadingMenu"
            :menu-error="menuError"
            :menu-items="menuItems"
            :adding="adding"
            :add-message="addMessage"
            :add-error="addError"
            :hotel-slug="hotelSlug"
            @add-to-cart="addToCart"
          />
        </section>
      </div>
    </template>

    <p v-else class="shop-products__status">{{ t('buyerXp.booking.noHotels') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import { superAppApi, type HotelMenuResponse, type RestaurantMenuItem } from '@/api/superApp'
import { discoveryApi } from '@/api/discovery'
import { cartApi } from '@/api/cart'
import { formatApiError } from '@/utils/formatApiError'
import { useAuthStore } from '@/stores/auth'
import { venueDetailLink } from '@/utils/buyerDetailLinks'
import {
  defaultMapCenter,
  demoHotelsWithCoords,
  formatHotelDistance,
  hotelAddress,
  hotelDistanceMeters,
  hotelHasCoordinates,
  hotelId,
  hotelName,
  mergeHotelCatalog,
  type HotelRow,
} from '@/utils/hotelListing'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerHotelsMap from '@/components/buyer/experience/BuyerHotelsMap.vue'
import BookingRoomsPanel from '@/components/buyer/experience/BookingRoomsPanel.vue'

type MenuItem = RestaurantMenuItem & { description?: string }
type BrowseMode = 'list' | 'map' | 'split'

const auth = useAuthStore()
const { t } = useI18n()

const viewModes = computed(() => [
  { id: 'list' as BrowseMode, label: t('buyerXp.booking.list'), icon: 'solar:list-bold' },
  { id: 'map' as BrowseMode, label: t('buyerXp.booking.map'), icon: 'solar:map-bold' },
  { id: 'split' as BrowseMode, label: t('buyerXp.booking.split'), icon: 'solar:widget-5-bold' },
])
const hotels = ref<HotelRow[]>([])
const menuItems = ref<MenuItem[]>([])
const activeHotelId = ref<number | null>(null)
const hotelSlug = ref('')
const loadingHotels = ref(false)
const loadingMenu = ref(false)
const hotelError = ref('')
const menuError = ref('')
const adding = ref(false)
const addMessage = ref('')
const addError = ref('')
const searchTerm = ref('')
const openOnly = ref(false)
const browseMode = ref<BrowseMode>('list')
const mapLat = ref(defaultMapCenter().lat)
const mapLng = ref(defaultMapCenter().lng)

const fallbackMenu: MenuItem[] = [
  { id: 1, title: 'Queen Room', description: 'Sleeps 2 · Breakfast included', base_price: 65000, skus: [{ id: 1 }] },
  { id: 2, title: 'Executive Suite', description: 'Sleeps 3 · Lounge access', base_price: 125000, skus: [{ id: 2 }] },
  { id: 3, title: 'Day Pass', description: 'Cowork + pool · 8am-6pm', base_price: 35000, skus: [{ id: 3 }] },
  { id: 4, title: 'Airport pickup', description: 'Private sedan · 24/7', base_price: 45000, skus: [{ id: 4 }] },
]

const visibleHotels = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  return hotels.value.filter((hotel) => {
    if (openOnly.value && hotel.open_now !== true) return false
    if (!q) return true
    return hotelName(hotel).toLowerCase().includes(q) || hotelAddress(hotel).toLowerCase().includes(q)
  })
})

const mapHotels = computed(() => visibleHotels.value.filter(hotelHasCoordinates))

const selectedHotel = computed(() => visibleHotels.value.find((h) => hotelId(h) === activeHotelId.value) ?? null)

const activeHotelName = computed(() => selectedHotel.value ? hotelName(selectedHotel.value) : t('buyerXp.booking.selectHotel'))

function hotelKey(h: HotelRow) {
  return String(hotelId(h) ?? h.menu_slug ?? h.business_name)
}

function canOpenDetail(hotel: HotelRow) {
  const id = hotelId(hotel)
  return id != null && id > 0
}

async function initLocation() {
  if (!navigator.geolocation) return
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 8000 })
    })
    mapLat.value = pos.coords.latitude
    mapLng.value = pos.coords.longitude
  } catch {
    // keep Dar default
  }
}

async function loadHotels() {
  loadingHotels.value = true
  hotelError.value = ''
  try {
    const [{ data: catalogData }, nearbyResult] = await Promise.all([
      superAppApi.getHotels({ limit: 100 }),
      discoveryApi.hotelsNearby({ lat: mapLat.value, lng: mapLng.value }).catch(() => ({ data: { results: [] } })),
    ])
    const catalog = (catalogData?.results?.length ? catalogData.results : demoHotelsWithCoords()) as HotelRow[]
    const nearby = (nearbyResult.data?.results ?? []) as HotelRow[]
    hotels.value = mergeHotelCatalog(catalog, nearby)
    if (!hotels.value.length) hotels.value = demoHotelsWithCoords()
    pickInitialHotel()
  } catch (e) {
    hotelError.value = formatApiError(e, t('buyerXp.booking.couldNotLoad'))
    hotels.value = demoHotelsWithCoords()
    pickInitialHotel()
  } finally {
    loadingHotels.value = false
  }
}

function pickInitialHotel() {
  const first = visibleHotels.value.find(hotelHasCoordinates) ?? visibleHotels.value[0]
  if (first) void selectHotel(first)
}

async function selectHotel(h: HotelRow) {
  const id = hotelId(h)
  activeHotelId.value = id
  hotelSlug.value = String(h.menu_slug || h.store_slug || id || '')
  addMessage.value = ''
  addError.value = ''

  if (id == null || id <= 0) {
    menuItems.value = fallbackMenu
    menuError.value = 'Showing demo rooms until hotels go live.'
    return
  }
  await loadMenu(id)
}

async function loadMenu(id: number) {
  loadingMenu.value = true
  try {
    const { data } = await superAppApi.getHotelMenu(id)
    menuItems.value = flattenMenu(data)
    if (!menuItems.value.length) {
      menuItems.value = fallbackMenu
      menuError.value = 'Showing sample rooms until hotels publish inventory.'
    } else {
      menuError.value = ''
    }
  } catch (e) {
    menuError.value = formatApiError(e, 'Could not load rooms/services')
    menuItems.value = fallbackMenu
  } finally {
    loadingMenu.value = false
  }
}

function flattenMenu(data: HotelMenuResponse): MenuItem[] {
  const items: MenuItem[] = []
  for (const cat of data.categories ?? []) {
    for (const p of cat.products ?? []) items.push({ ...p })
  }
  return items
}

async function addToCart(item: MenuItem) {
  addMessage.value = ''
  addError.value = ''
  if (!auth.isAuthenticated) {
    addError.value = t('buyerXp.common.signInToAdd')
    return
  }
  const skuId = item.skus?.[0]?.id
  if (!skuId) {
    addError.value = 'No SKU available for this item.'
    return
  }
  adding.value = true
  try {
    await cartApi.add(Number(skuId), 1)
    addMessage.value = t('buyerXp.common.addedToCartShort')
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string } } }
    addError.value = err?.response?.data?.detail ?? t('buyerXp.common.couldNotAdd')
  } finally {
    adding.value = false
  }
}

watch(browseMode, (mode) => {
  if (mode === 'map' && activeHotelId.value == null && mapHotels.value.length) {
    activeHotelId.value = hotelId(mapHotels.value[0])
  }
})

onMounted(async () => {
  await initLocation()
  await loadHotels()
})
</script>

<style scoped>
.booking-page__head-row {
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.booking-page__head-actions {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.booking-page__toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.booking-page__modes {
  display: inline-flex;
  padding: 0.2rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.08);
  gap: 0.15rem;
}

.booking-page__mode {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  background: transparent;
  color: var(--kkoo-primary);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.booking-page__mode--active {
  background: var(--buyer-surface);
  box-shadow: 0 4px 12px var(--buyer-shadow-color);
}

.booking-page__filter {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--buyer-muted);
  margin: 0;
}

.booking-page__count {
  margin-left: auto;
  font-size: 0.82rem;
  color: var(--buyer-muted);
}

.booking-page__list-layout {
  display: grid;
  gap: 1rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .booking-page__list-layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
  }
}

.booking-page__hotel-list {
  display: grid;
  gap: 0.65rem;
}

.booking-page__hotel-list--split {
  max-height: 420px;
  overflow: auto;
}

.booking-hotel-card {
  border: 1px solid var(--buyer-border);
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  background: var(--buyer-surface);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.booking-hotel-card--active {
  border-color: rgba(92, 48, 143, 0.35);
  box-shadow: 0 8px 24px rgba(59, 26, 90, 0.1);
}

.booking-hotel-card__top {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.35rem;
}

.booking-hotel-card__pill {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: var(--buyer-chip-bg);
  color: var(--kkoo-primary);
  font-size: 0.72rem;
  font-weight: 700;
}

.booking-hotel-card__pill--open {
  background: rgba(34, 139, 34, 0.12);
  color: #1f6b1f;
}

.booking-hotel-card__name {
  margin: 0 0 0.2rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--buyer-ink);
}

.booking-hotel-card__addr {
  margin: 0;
  font-size: 0.8rem;
  color: var(--buyer-muted);
}

.booking-hotel-card__actions {
  display: flex;
  gap: 0.45rem;
  margin-top: 0.65rem;
  flex-wrap: wrap;
  justify-content: center;
}

.booking-hotel-card--compact {
  padding: 0.7rem 0.85rem;
}

.booking-hotel-card--carousel {
  flex: 0 0 220px;
  scroll-snap-align: start;
}

.booking-page__map-layout {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 520px;
}

.booking-page__map {
  flex: 1;
  min-height: 320px;
}

.booking-page__map-preview {
  padding: 0 0.15rem;
}

.booking-page__map-carousel {
  display: flex;
  gap: 0.65rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scroll-snap-type: x mandatory;
}

.booking-page__split-layout {
  display: grid;
  gap: 1rem;
  min-height: 480px;
}

@media (min-width: 1024px) {
  .booking-page__split-layout {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    grid-template-rows: 1fr auto;
  }

  .booking-page__map--split {
    grid-row: 1 / span 2;
    grid-column: 2;
    min-height: 420px;
  }

  .booking-page__rooms--split {
    grid-column: 1;
  }
}
</style>
