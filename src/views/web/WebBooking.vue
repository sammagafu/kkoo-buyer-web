<template>
  <div class="buyer-xp buyer-xp--wide booking-stays-page">
    <header class="booking-stays-hero">
      <div class="booking-stays-hero__top">
        <div>
          <p class="booking-stays-hero__overline">{{ t('buyerXp.booking.heroOverline') }}</p>
          <h1 class="booking-stays-hero__title">{{ t('buyerXp.booking.title') }}</h1>
          <p class="booking-stays-hero__tagline">{{ t('buyerXp.booking.meta') }}</p>
        </div>
        <div class="booking-stays-hero__actions">
          <RouterLink :to="{ name: 'buyer.reservations' }" class="booking-stays-hero__link">
            <Icon icon="solar:calendar-bold" aria-hidden="true" />
            {{ t('buyerXp.booking.myReservations') }}
          </RouterLink>
          <button type="button" class="booking-stays-hero__link" :disabled="loadingHotels" @click="loadHotels">
            <Icon icon="solar:refresh-bold" aria-hidden="true" />
            {{ loadingHotels ? t('buyerXp.common.refreshing') : t('buyerXp.common.refresh') }}
          </button>
        </div>
      </div>
      <BuyerSearchBar v-model="searchTerm" class="booking-stays-hero__search" :placeholder="t('buyerXp.booking.searchPlaceholder')" />
      <div class="booking-stays-hero__controls">
        <div class="booking-stays-segment" role="tablist" :aria-label="t('buyerXp.booking.viewModeLabel')">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            type="button"
            role="tab"
            class="booking-stays-segment__btn"
            :class="{ 'booking-stays-segment__btn--active': browseMode === mode.id }"
            :aria-selected="browseMode === mode.id"
            @click="browseMode = mode.id"
          >
            <Icon :icon="mode.icon" aria-hidden="true" />
            {{ mode.label }}
          </button>
        </div>
        <label class="booking-stays-hero__filter">
          <input v-model="openOnly" type="checkbox" />
          {{ t('buyerXp.booking.openNow') }}
        </label>
        <span class="booking-stays-hero__count">{{ t('buyerXp.booking.staysCount', { count: visibleHotels.length }) }}</span>
      </div>
    </header>

    <p v-if="hotelError" class="buyer-xp-toast buyer-xp-toast--err">{{ hotelError }}</p>
    <p v-if="loadingHotels" class="shop-products__status">{{ t('buyerXp.booking.loadingHotels') }}</p>

    <template v-else-if="visibleHotels.length">
      <div v-if="browseMode === 'map'" class="booking-stays-map-stage">
        <BuyerHotelsMap
          class="booking-stays-map-stage__map"
          :hotels="visibleHotels"
          :center-lat="mapLat"
          :center-lng="mapLng"
          :selected-hotel-id="activeHotelId"
          expand
          @select="selectHotel"
        />
        <div class="booking-stays-map-stage__picker" role="list" aria-label="Hotels">
          <button
            v-for="hotel in mapHotels.length ? mapHotels : visibleHotels"
            :key="hotelKey(hotel)"
            type="button"
            class="booking-stays-chip"
            :class="{ 'booking-stays-chip--active': hotelId(hotel) === activeHotelId }"
            role="listitem"
            @click="selectHotel(hotel)"
          >
            {{ hotelName(hotel) }}
          </button>
        </div>
        <BookingRoomsPanel
          v-if="selectedHotel"
          class="booking-stays-map-stage__rooms"
          :title="activeHotelName"
          :loading="loadingMenu"
          :menu-error="menuError"
          :menu-items="menuItems"
          :adding="adding"
          :add-message="addMessage"
          :add-error="addError"
          :hotel-slug="hotelSlug"
          :show-header="false"
          @add-to-cart="addToCart"
        />
      </div>

      <div v-else class="booking-stays-shell" :class="{ 'booking-stays-shell--split': browseMode === 'split' }">
        <aside class="booking-stays-picker" aria-label="Hotels">
          <button
            v-for="hotel in visibleHotels"
            :key="hotelKey(hotel)"
            type="button"
            class="booking-stay-option"
            :class="{ 'booking-stay-option--active': hotelId(hotel) === activeHotelId }"
            @click="selectHotel(hotel)"
          >
            <span class="booking-stay-option__cover" :style="hotelCoverStyle(hotel)" aria-hidden="true">
              <Icon icon="solar:buildings-2-bold" />
            </span>
            <span class="booking-stay-option__copy">
              <strong class="booking-stay-option__name">{{ hotelName(hotel) }}</strong>
              <span class="booking-stay-option__addr">{{ hotelAddress(hotel) || t('buyerXp.booking.hospitality') }}</span>
              <span class="booking-stay-option__meta">
                <span v-if="hotel.open_now">{{ t('buyerXp.booking.open') }}</span>
                <span v-if="formatHotelDistance(hotelDistanceMeters(hotel))">{{ formatHotelDistance(hotelDistanceMeters(hotel)) }}</span>
              </span>
            </span>
          </button>
        </aside>

        <div v-if="browseMode === 'split'" class="booking-stays-shell__map">
          <BuyerHotelsMap
            :hotels="visibleHotels"
            :center-lat="mapLat"
            :center-lng="mapLng"
            :selected-hotel-id="activeHotelId"
            expand
            @select="selectHotel"
          />
        </div>

        <main class="booking-stays-detail" aria-label="Rooms and services">
          <div v-if="selectedHotel" class="booking-stays-detail__hero" :style="hotelCoverStyle(selectedHotel)">
            <div class="booking-stays-detail__hero-overlay">
              <div>
                <h2 class="booking-stays-detail__title">{{ hotelName(selectedHotel) }}</h2>
                <p class="booking-stays-detail__addr">{{ hotelAddress(selectedHotel) || t('buyerXp.booking.hospitality') }}</p>
                <div class="booking-stays-detail__tags">
                  <span v-if="selectedHotel.open_now" class="booking-stays-tag booking-stays-tag--open">{{ t('buyerXp.booking.open') }}</span>
                  <span v-if="formatHotelDistance(hotelDistanceMeters(selectedHotel))" class="booking-stays-tag">
                    {{ formatHotelDistance(hotelDistanceMeters(selectedHotel)) }}
                  </span>
                </div>
              </div>
              <RouterLink
                v-if="canOpenDetail(selectedHotel)"
                :to="venueDetailLink('hotel', hotelId(selectedHotel)!)"
                class="booking-stays-detail__link"
              >
                {{ t('buyerXp.booking.fullDetails') }}
                <Icon icon="solar:arrow-right-up-linear" aria-hidden="true" />
              </RouterLink>
            </div>
          </div>

          <BookingRoomsPanel
            :title="activeHotelName"
            :loading="loadingMenu"
            :menu-error="menuError"
            :menu-items="menuItems"
            :adding="adding"
            :add-message="addMessage"
            :add-error="addError"
            :hotel-slug="hotelSlug"
            :show-header="!selectedHotel"
            @add-to-cart="addToCart"
          />
        </main>
      </div>
    </template>

    <BuyerEmptyState
      v-else
      icon="solar:buildings-2-bold"
      :title="t('buyerXp.booking.noHotels')"
      :message="t('buyerXp.booking.emptyHint')"
    >
      <template #action>
        <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="openOnly = false; searchTerm = ''">
          {{ t('buyerXp.common.refresh') }}
        </button>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import { superAppApi, type HotelMenuResponse, type RestaurantMenuItem } from '@/api/superApp'
import { discoveryApi } from '@/api/discovery'
import { formatApiError } from '@/utils/formatApiError'
import { useAddToCart } from '@/composables/useAddToCart'
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
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type MenuItem = RestaurantMenuItem & { description?: string }
type BrowseMode = 'list' | 'map' | 'split'

const { t } = useI18n()
const { adding, addMessage, addError, addProduct: addProductToCart } = useAddToCart()

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
const searchTerm = ref('')
const openOnly = ref(false)
const browseMode = ref<BrowseMode>('list')
const mapLat = ref(defaultMapCenter().lat)
const mapLng = ref(defaultMapCenter().lng)

const coverPalettes = [
  ['#0f766e', '#134e4a'],
  ['#b45309', '#92400e'],
  ['#5b21b6', '#4c1d95'],
  ['#0369a1', '#0c4a6e'],
  ['#be123c', '#9f1239'],
]

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
const activeHotelName = computed(() => (selectedHotel.value ? hotelName(selectedHotel.value) : t('buyerXp.booking.selectHotel')))

function hotelKey(h: HotelRow) {
  return String(hotelId(h) ?? h.menu_slug ?? h.business_name)
}

function canOpenDetail(hotel: HotelRow) {
  const id = hotelId(hotel)
  return id != null && id > 0
}

function hotelCoverStyle(hotel: HotelRow) {
  const seed = hotelName(hotel).length + Number(hotelId(hotel) ?? 0)
  const [from, to] = coverPalettes[seed % coverPalettes.length]
  return {
    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  }
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
    menuError.value = t('buyerXp.booking.demoRoomsLive')
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
      menuError.value = t('buyerXp.booking.demoRoomsNote')
    } else {
      menuError.value = ''
    }
  } catch (e) {
    menuError.value = formatApiError(e, t('buyerXp.booking.couldNotLoad'))
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
  await addProductToCart({
    id: item.id,
    title: item.title,
    base_price: item.base_price ?? item.price,
    skus: item.skus,
  })
}

watch(browseMode, (mode) => {
  if (mode === 'map' && activeHotelId.value == null && mapHotels.value.length) {
    activeHotelId.value = hotelId(mapHotels.value[0])
  }
})

watch(visibleHotels, (list) => {
  if (!list.length) {
    activeHotelId.value = null
    menuItems.value = []
    return
  }
  if (activeHotelId.value == null || !list.some((h) => hotelId(h) === activeHotelId.value)) {
    pickInitialHotel()
  }
})

onMounted(async () => {
  await initLocation()
  await loadHotels()
})
</script>
