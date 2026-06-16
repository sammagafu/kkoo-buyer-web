<template>
  <MarketingLayout>
    <div class="context-nav">
      <div class="context-nav-left">
        <RouterLink :to="{ name: 'web.eats' }" class="context-nav-link">Restaurants</RouterLink>
        <RouterLink :to="{ name: 'web.groceries' }" class="context-nav-link">Groceries</RouterLink>
        <RouterLink :to="{ name: 'web.market' }" class="context-nav-link">Marketplace</RouterLink>
      </div>
      <div class="context-nav-right">
        <RouterLink :to="{ name: 'web.checkout' }" class="context-nav-pill">Checkout</RouterLink>
        <RouterLink :to="{ name: 'web.ride' }" class="context-nav-pill">Ride</RouterLink>
      </div>
    </div>
    <section class="lp-section web-eats-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-eats-grid">
          <div>
            <p class="web-eats-kicker">KKOO Eats · Web</p>
            <h1 class="web-eats-title">Order food on the web when you don’t have the app.</h1>
            <p class="web-eats-copy">
              Browse restaurants, view menus, and add items to your web cart. Sign in once and finish checkout without
              switching devices.
            </p>
            <div class="web-eats-actions">
              <RouterLink :to="{ name: 'web.checkout' }" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg">
                <span class="lp-btn-pill__label">Go to web checkout</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
              <RouterLink
                :to="{ name: 'web.checkout' }"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label">See my cart</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:cart-large-2-bold" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
            </div>
          </div>
          <div class="web-eats-hero-card">
            <p class="mb-2 fw-semibold">Signed in?</p>
            <p class="small text-muted mb-0">{{ auth.isAuthenticated ? 'Yes — add items to your cart below.' : 'Sign in to add items to cart.' }}</p>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-eats-layout">
          <div class="web-eats-list">
            <header class="web-eats-section-head">
              <div>
                <p class="section-kicker">Restaurants</p>
                <h2 class="section-title">Pick a restaurant to load its menu.</h2>
              </div>
              <b-button size="sm" variant="outline-primary" @click="loadRestaurants" :disabled="loadingRestaurants">
                <Icon icon="solar:refresh-bold" /> Reload
              </b-button>
            </header>
            <p v-if="loadingRestaurants" class="text-muted small mb-3">Loading restaurants…</p>
            <p v-else-if="restaurantError" class="text-danger small mb-3">{{ restaurantError }}</p>
            <div class="web-eats-cards">
              <article
                v-for="restaurant in restaurants"
                :key="entryKey(restaurant)"
                class="web-eats-card"
                :class="{ 'web-eats-card--active': restaurant.seller_id === activeRestaurantId }"
                @click="selectRestaurant(restaurant)"
              >
                <div class="web-eats-card-head">
                  <h3 class="mb-1">{{ restaurant.business_name || 'Restaurant' }}</h3>
                  <span class="web-eats-badge">Open</span>
                </div>
                <p class="web-eats-card-copy mb-1">{{ restaurant.business_address || 'Delivery / pickup' }}</p>
                <p class="web-eats-card-meta mb-0 text-muted small">
                  {{ restaurant.prep_time_minutes ? restaurant.prep_time_minutes + ' min prep' : 'Prep time varies' }}
                </p>
              </article>
            </div>
          </div>

          <div class="web-eats-menu">
            <header class="web-eats-section-head">
              <div>
                <p class="section-kicker">Menu</p>
                <h2 class="section-title">{{ activeRestaurantName }}</h2>
                <p class="section-copy small text-muted mb-0">Select an item to add it to your web cart.</p>
              </div>
            </header>
            <p v-if="loadingMenu" class="text-muted small mb-3">Loading menu…</p>
            <p v-else-if="menuError" class="text-danger small mb-3">{{ menuError }}</p>
            <div v-else class="web-eats-menu-grid">
              <article v-for="item in menuItems" :key="item.id" class="web-eats-menu-card">
                <div class="app-card-media" :style="{ backgroundImage: mediaGradient(item) }">
                  <span class="app-pill" v-if="item.skus?.length">In stock</span>
                </div>
                <h3 class="web-eats-menu-title">{{ item.title || 'Item' }}</h3>
                <p class="web-eats-menu-desc text-muted mb-2">{{ item.description || 'Order on KKOO' }}</p>
                <div class="web-eats-menu-meta">
                  <p class="web-eats-menu-price">{{ formatPrice(item.price ?? item.base_price) }}</p>
                  <span class="web-eats-menu-chip">Kitchen ready</span>
                </div>
                <div class="web-eats-actions">
                  <b-button size="sm" variant="primary" class="app-btn" :disabled="!item.skus?.length || adding" @click="addToCart(item)">
                    Add to cart
                  </b-button>
                  <b-button size="sm" variant="outline-secondary" class="app-btn ghost" :to="{ name: 'store.microsite', params: { slugOrId: restaurantSlug } }">
                    View store
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
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { superAppApi, type RestaurantListItem, type RestaurantMenuResponse, type RestaurantMenuItem } from '@/api/superApp'
import { cartApi } from '@/api/cart'
import { formatApiError } from '@/utils/formatApiError'

const auth = useAuthStore()
const restaurants = ref<RestaurantListItem[]>([])
const menuItems = ref<RestaurantMenuItem[]>([])
const restaurantSlug = ref('')
const activeRestaurantId = ref<number | string | null>(null)
const loadingRestaurants = ref(false)
const loadingMenu = ref(false)
const adding = ref(false)
const restaurantError = ref('')
const menuError = ref('')
const addMessage = ref('')
const addError = ref('')
const activeRestaurantName = computed(() => {
  const r = restaurants.value.find((x) => x.seller_id === activeRestaurantId.value)
  return r?.business_name || 'Select a restaurant'
})

function entryKey(item: RestaurantListItem) {
  return String(item.seller_id || item.user_id || Math.random())
}

async function loadRestaurants() {
  loadingRestaurants.value = true
  restaurantError.value = ''
  try {
    const { data } = await superAppApi.getRestaurants({ limit: 20 })
    restaurants.value = data?.results ?? []
    if (restaurants.value.length) {
      selectRestaurant(restaurants.value[0])
    } else {
      menuItems.value = []
      activeRestaurantId.value = null
    }
  } catch (e) {
    restaurantError.value = formatApiError(e, 'Could not load restaurants')
  } finally {
    loadingRestaurants.value = false
  }
}

async function selectRestaurant(r: RestaurantListItem) {
  activeRestaurantId.value = r.seller_id ?? r.user_id ?? null
  restaurantSlug.value = r.menu_slug || String(activeRestaurantId.value || '')
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
  try {
    const { data } = await superAppApi.getRestaurantMenu(activeRestaurantId.value)
    menuItems.value = flattenMenu(data)
    menuError.value = menuItems.value.length ? '' : 'No menu items available.'
  } catch (e) {
    menuError.value = formatApiError(e, 'Could not load menu')
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

function mediaGradient(item: RestaurantMenuItem) {
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

async function addToCart(item: RestaurantMenuItem) {
  addMessage.value = ''
  addError.value = ''
  if (!auth.isAuthenticated) {
    addError.value = 'Sign in to add items to your cart.'
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
  loadRestaurants()
})
</script>

<style scoped>
.web-eats-hero {
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.web-eats-grid {
  display: grid;
  gap: 1.6rem;
  align-items: center;
}
@media (min-width: 992px) {
  .web-eats-grid {
    grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.8fr);
  }
}
.web-eats-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.web-eats-title {
  font-size: clamp(1.9rem, 4.2vw, 3.1rem);
  line-height: 1.05;
  margin: 0.6rem 0 0.7rem;
  max-width: 22ch;
}
.web-eats-copy {
  max-width: 62ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
.web-eats-actions {
  margin-top: 1rem;
}
.web-eats-hero-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 1.25rem;
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.12);
}
.web-eats-layout {
  display: grid;
  gap: 1rem;
}
@media (min-width: 1100px) {
  .web-eats-layout {
    grid-template-columns: 1.1fr 1.4fr;
  }
}
.web-eats-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.web-eats-cards {
  display: grid;
  gap: 0.75rem;
}
.web-eats-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.25rem;
  padding: 1rem;
  background: linear-gradient(180deg, #ffffff 0%, rgba(240, 236, 250, 0.9) 100%);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}
.web-eats-card--active {
  border-color: rgba(92, 48, 143, 0.32);
  box-shadow: 0 12px 30px rgba(35, 20, 46, 0.12);
  transform: translateY(-2px);
}
.web-eats-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.web-eats-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.12);
  color: #5c308f;
  font-weight: 700;
  font-size: 0.78rem;
}
.web-eats-card-copy {
  margin: 0;
  line-height: 1.5;
}
.web-eats-card-meta {
  margin: 0;
}
.web-eats-menu {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.25rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.08);
}
.web-eats-menu-grid {
  display: grid;
  gap: 0.8rem;
}
@media (min-width: 768px) {
  .web-eats-menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.web-eats-menu-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.2rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 244, 255, 0.92));
  box-shadow: 0 14px 30px rgba(35, 20, 46, 0.12);
  display: grid;
  gap: 0.5rem;
}
.web-eats-menu-title {
  margin: 0;
  font-size: 1rem;
}
.web-eats-menu-desc {
  margin: 0;
}
.web-eats-menu-price {
  margin: 0;
  font-weight: 800;
  color: #5c308f;
}
.web-eats-menu-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.web-eats-menu-chip {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.08);
  color: #5c308f;
  font-size: 0.78rem;
  font-weight: 700;
}
.web-eats-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.55rem;
}
.app-card-media {
  width: 100%;
  height: 150px;
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
