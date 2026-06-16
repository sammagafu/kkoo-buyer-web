<template>
  <MarketingLayout>
    <div class="context-nav">
      <div class="context-nav-left">
        <RouterLink :to="{ name: 'web.booking' }" class="context-nav-link">Hotels</RouterLink>
        <RouterLink :to="{ name: 'web.eats' }" class="context-nav-link">Eats</RouterLink>
        <RouterLink :to="{ name: 'web.market' }" class="context-nav-link">Marketplace</RouterLink>
      </div>
      <div class="context-nav-right">
        <RouterLink :to="{ name: 'web.checkout' }" class="context-nav-pill">Checkout</RouterLink>
        <RouterLink :to="{ name: 'web.compare' }" class="context-nav-pill">Compare</RouterLink>
      </div>
    </div>
    <section class="lp-section web-book-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-book-grid">
          <div>
            <p class="web-book-kicker">Hotels · Web</p>
            <h1 class="web-book-title">Book a stay on the web.</h1>
            <p class="web-book-copy">Browse hotels, view rooms/services, add to cart, and check out on web.</p>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="web-book-head">
          <div>
            <p class="section-kicker">Hotels</p>
            <h2 class="section-title">Pick a hotel to load its rooms/services.</h2>
          </div>
          <b-button size="sm" variant="outline-primary" @click="loadHotels" :disabled="loadingHotels">
            <Icon icon="solar:refresh-bold" /> Reload
          </b-button>
        </header>
        <p v-if="loadingHotels" class="text-muted small mb-3">Loading hotels…</p>
        <p v-else-if="hotelError" class="text-danger small mb-3">{{ hotelError }}</p>
        <div class="web-book-grid-list">
          <div class="web-book-hotels">
            <article v-if="!hotels.length && !loadingHotels" class="web-book-empty">
              <p class="mb-1 fw-semibold">No hotels online yet</p>
              <p class="text-muted small mb-0">We’ll surface stays here as soon as partners go live.</p>
            </article>
            <article
              v-for="hotel in hotels"
              :key="hotelKey(hotel)"
              class="web-book-card"
              :class="{ 'web-book-card--active': hotel.seller_id === activeHotelId }"
              @click="selectHotel(hotel)"
            >
              <div class="web-book-card-top">
                <span class="web-book-chip web-book-chip--soft">Web ready</span>
                <span class="web-book-chip web-book-chip--pill">Rooms & services</span>
              </div>
              <h3 class="mb-1">{{ hotel.business_name || 'Hotel' }}</h3>
              <p class="text-muted mb-0 small">{{ hotel.business_address || 'Hospitality' }}</p>
            </article>
          </div>
          <div class="web-book-menu">
            <header class="web-book-section-head">
              <p class="section-kicker">Rooms & services</p>
              <h3 class="section-title">{{ activeHotelName }}</h3>
            </header>
            <p v-if="loadingMenu" class="text-muted small mb-3">Loading…</p>
            <p v-else-if="menuError" class="text-danger small mb-3">{{ menuError }}</p>
            <div v-else-if="!menuItems.length" class="web-book-empty web-book-empty--menu">
              <p class="mb-1 fw-semibold">Select a hotel</p>
              <p class="text-muted small mb-0">Pick a hotel on the left to see rooms and services.</p>
            </div>
            <div v-else class="web-book-menu-grid">
              <article v-for="item in menuItems" :key="item.id" class="web-book-menu-card">
                <div class="app-card-media" :style="{ backgroundImage: mediaGradient(item) }">
                  <span class="app-pill" v-if="item.skus?.length">Available</span>
                </div>
                <h4 class="mb-1">{{ item.title || 'Room' }}</h4>
                <p class="text-muted small mb-2">{{ item.description || 'Book with KKOO' }}</p>
                <div class="web-book-meta">
                  <p class="fw-bold mb-0">{{ formatPrice(item.price ?? item.base_price) }}</p>
                  <span class="web-book-chip">Web booking</span>
                </div>
                <div class="web-book-actions">
                  <b-button size="sm" variant="primary" class="app-btn" :disabled="!item.skus?.length || adding" @click="addToCart(item)">
                    Add to cart
                  </b-button>
                  <b-button size="sm" variant="outline-secondary" class="app-btn ghost" :to="{ name: 'store.microsite', params: { slugOrId: hotelSlug } }">
                    View microsite
                  </b-button>
                </div>
              </article>
            </div>
            <p v-if="addMessage" class="text-success small mt-2 mb-0">{{ addMessage }}</p>
            <p v-if="addError" class="text-danger small mt-2 mb-0">{{ addError }}</p>
          </div>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { superAppApi, type HotelListItem, type HotelMenuResponse, type RestaurantMenuItem } from '@/api/superApp'
import { cartApi } from '@/api/cart'
import { formatApiError } from '@/utils/formatApiError'
import { useAuthStore } from '@/stores/auth'

type MenuItem = RestaurantMenuItem & { description?: string }

const auth = useAuthStore()
const hotels = ref<HotelListItem[]>([])
const menuItems = ref<MenuItem[]>([])
const activeHotelId = ref<number | string | null>(null)
const hotelSlug = ref('')
const loadingHotels = ref(false)
const loadingMenu = ref(false)
const hotelError = ref('')
const menuError = ref('')
const adding = ref(false)
const addMessage = ref('')
const addError = ref('')

const fallbackHotels: HotelListItem[] = [
  { business_name: 'Harbor View Suites', business_address: 'Oceanfront · City center', seller_id: -1, menu_slug: 'harbor-view' },
  { business_name: 'Serengeti Stay', business_address: 'Safari-inspired rooms', seller_id: -2, menu_slug: 'serengeti-stay' },
  { business_name: 'Urban Loft', business_address: 'Boutique · Fast Wi‑Fi', seller_id: -3, menu_slug: 'urban-loft' },
]

const fallbackMenu: MenuItem[] = [
  { id: 1, title: 'Queen Room', description: 'Sleeps 2 · Breakfast included', base_price: 65000, skus: [{ id: 1 }] },
  { id: 2, title: 'Executive Suite', description: 'Sleeps 3 · Lounge access', base_price: 125000, skus: [{ id: 2 }] },
  { id: 3, title: 'Day Pass', description: 'Cowork + pool · 8am-6pm', base_price: 35000, skus: [{ id: 3 }] },
  { id: 4, title: 'Airport pickup', description: 'Private sedan · 24/7', base_price: 45000, skus: [{ id: 4 }] },
]

const activeHotelName = computed(() => hotels.value.find((h) => h.seller_id === activeHotelId.value)?.business_name || 'Select a hotel')

function hotelKey(h: HotelListItem) {
  return String(h.seller_id || h.user_id || Math.random())
}

async function loadHotels() {
  loadingHotels.value = true
  hotelError.value = ''
  try {
    const { data } = await superAppApi.getHotels({ limit: 20 })
    hotels.value = data?.results?.length ? data.results : fallbackHotels
    selectHotel(hotels.value[0])
  } catch (e) {
    hotelError.value = formatApiError(e, 'Could not load hotels')
    hotels.value = fallbackHotels
    selectHotel(hotels.value[0])
  } finally {
    loadingHotels.value = false
  }
}

async function selectHotel(h: HotelListItem) {
  const id = h.seller_id ?? h.user_id ?? null
  // Fallback/demo hotels have negative ids — show sample menu locally instead of calling API.
  if (id == null || (typeof id === 'number' && id <= 0)) {
    activeHotelId.value = null
    hotelSlug.value = h.menu_slug || ''
    menuItems.value = fallbackMenu
    menuError.value = 'Showing demo rooms until hotels go live.'
    return
  }
  activeHotelId.value = id
  hotelSlug.value = h.menu_slug || String(activeHotelId.value || '')
  await loadMenu()
}

async function loadMenu() {
  if (!activeHotelId.value) {
    menuItems.value = []
    return
  }
  loadingMenu.value = true
  addMessage.value = ''
  addError.value = ''
  try {
    const { data } = await superAppApi.getHotelMenu(activeHotelId.value)
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

function mediaGradient(item: MenuItem) {
  const seed = (item.title || 'item').length
  const colors = [
    ['#fef6e4', '#f3d9fa'],
    ['#e7f5ff', '#d0ebff'],
    ['#e6fcf5', '#d3f9d8'],
    ['#fff5f5', '#ffe8cc'],
  ]
  const pair = colors[seed % colors.length]
  return `radial-gradient(circle at 30% 30%, ${pair[0]}, ${pair[1]})`
}

async function addToCart(item: MenuItem) {
  addMessage.value = ''
  addError.value = ''
  if (!auth.isAuthenticated) {
    addError.value = 'Sign in to add items to cart.'
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
    addMessage.value = 'Added to cart. Open web checkout to finish.'
  } catch (e: any) {
    addError.value = e?.response?.data?.detail ?? 'Could not add to cart.'
  } finally {
    adding.value = false
  }
}

onMounted(() => {
  loadHotels()
})
</script>

<style scoped>
.web-book-hero {
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.web-book-grid {
  display: grid;
  gap: 1.5rem;
}
.web-book-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.web-book-title {
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.05;
  margin: 0.6rem 0 0.7rem;
}
.web-book-copy {
  max-width: 60ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
.web-book-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.web-book-grid-list {
  display: grid;
  gap: 1rem;
  align-items: start;
}
@media (min-width: 1100px) {
  .web-book-grid-list {
    grid-template-columns: 1fr 1.4fr;
  }
}
.web-book-hotels {
  display: grid;
  gap: 0.75rem;
  align-content: start;
}
.web-book-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1rem;
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.web-book-card--active {
  border-color: rgba(92, 48, 143, 0.32);
  box-shadow: 0 12px 30px rgba(35, 20, 46, 0.12);
}
.web-book-card-top {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
}
.web-book-menu {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.25rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.08);
}
.web-book-menu-grid {
  display: grid;
  gap: 0.8rem;
}
@media (min-width: 768px) {
  .web-book-menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.web-book-menu-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.2rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 244, 255, 0.92));
  box-shadow: 0 14px 30px rgba(35, 20, 46, 0.12);
  display: grid;
  gap: 0.6rem;
}
.web-book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.web-book-chip {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.08);
  color: #5c308f;
  font-size: 0.78rem;
  font-weight: 700;
}
.web-book-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.55rem;
}
.web-book-empty {
  border: 1px dashed rgba(92, 48, 143, 0.25);
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 0 0 1px rgba(92, 48, 143, 0.05);
}
.web-book-empty--menu {
  min-height: 200px;
  display: grid;
  align-content: center;
}
.app-card-media {
  width: 100%;
  height: 160px;
  border-radius: 1rem;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
.app-pill {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
}
.app-btn {
  border-radius: 999px;
}
.app-btn.ghost {
  border-color: rgba(92, 48, 143, 0.18);
}
</style>
