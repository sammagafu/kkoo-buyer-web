<template>
  <MarketingLayout v-if="!embed">
    <section class="lp-section web-market-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-market-grid">
          <div class="web-market-hero-copy">
            <p class="web-market-kicker">KKOO Marketplace · Web</p>
            <h1 class="web-market-title">Shop everything on the web — groceries, daily goods, and retail.</h1>
            <p class="web-market-copy">
              Browse curated categories, open any store, and drop items straight into your web cart. No app required;
              full checkout now works in-browser.
            </p>
            <div class="web-market-hero-actions">
              <RouterLink :to="{ name: 'web.checkout' }" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg">
                <span class="lp-btn-pill__label">Go to checkout</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
              <RouterLink :to="{ name: 'web.groceries' }" class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg">
                <span class="lp-btn-pill__label">Groceries</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:bag-2-bold" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
            </div>
            <div class="web-market-search">
              <Icon icon="solar:magnifer-linear" class="web-market-search-icon" />
              <input v-model.trim="searchTerm" type="search" placeholder="Search products or stores" />
              <b-button size="sm" variant="primary" @click="applySearch">Search</b-button>
            </div>
            <div class="web-market-badges">
              <span class="pill">Same-day delivery</span>
              <span class="pill pill--ghost">Checkout on web</span>
              <span class="pill pill--ghost">Multi-store cart</span>
            </div>
          </div>
          <div class="web-market-hero-visual">
            <div class="hero-visual-pill">Fresh picks</div>
            <div class="hero-visual-card">
              <div class="hero-visual-image" />
              <div class="hero-visual-text">
                <p class="mb-1 fw-semibold">Summer produce drop</p>
                <p class="small mb-0 text-muted">Seasonal fruits, veggies, and pantry refills.</p>
              </div>
            </div>
            <div class="hero-visual-meta">
              <div>
                <p class="label">Stores live</p>
                <strong>{{ stores.length || 0 }}</strong>
              </div>
              <div>
                <p class="label">Ready to ship</p>
                <strong>{{ products.length || 0 }}</strong>
              </div>
            </div>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="featured-categories">
          <div class="featured-head">
            <div>
              <p class="section-kicker">Featured categories</p>
              <h2 class="section-title">Pick a lane and keep browsing.</h2>
            </div>
            <RouterLink :to="{ name: 'web.groceries' }" class="see-all-link">See groceries</RouterLink>
          </div>
          <p v-if="categoryError" class="text-danger small mb-2">{{ categoryError }}</p>
          <p v-else-if="loadingCategories" class="text-muted small mb-2">Loading categories…</p>
          <div class="category-grid">
            <article v-for="cat in displayCategories" :key="cat.title" class="category-card">
              <div class="category-icon" :style="{ background: cat.bg }">
                <img v-if="cat.icon" :src="cat.icon" alt="" class="category-icon-img" />
                <span v-else>{{ cat.emoji }}</span>
              </div>
              <div class="category-body">
                <h3>{{ cat.title }}</h3>
                <p>{{ cat.copy }}</p>
              </div>
              <b-button size="sm" variant="outline-primary" @click="scrollToStores">Shop</b-button>
            </article>
          </div>
        </div>

        <div class="web-market-layout" id="stores">
          <div class="web-market-list">
            <header class="web-market-section-head">
              <div>
                <p class="section-kicker">Stores</p>
                <h2 class="section-title">Pick a store to view its products.</h2>
              </div>
              <b-button size="sm" variant="outline-primary" @click="loadStores" :disabled="loadingStores">
                <Icon icon="solar:refresh-bold" /> Reload
              </b-button>
            </header>
            <p v-if="loadingStores" class="text-muted small mb-3">Loading stores…</p>
            <p v-else-if="storeError" class="text-danger small mb-3">{{ storeError }}</p>
            <div v-else-if="!filteredStores.length" class="empty-card">
              <p class="mb-1 fw-semibold">No stores live yet</p>
              <p class="text-muted small mb-0">We’ll list grocery and marketplace stores here once they’re connected.</p>
            </div>
            <div v-else class="web-market-cards">
              <article
                v-for="store in filteredStores"
                :key="storeKey(store)"
                class="web-market-card"
                :class="{ 'web-market-card--active': store.seller_id === activeStoreId }"
                @click="selectStore(store)"
              >
                <div class="web-market-card-top">
                  <span class="store-chip">Store</span>
                  <span class="store-chip store-chip--soft">Web ready</span>
                </div>
                <h3 class="mb-1">{{ store.business_name || 'Store' }}</h3>
                <p class="web-market-card-copy mb-1">{{ store.business_address || 'Marketplace seller' }}</p>
                <p class="web-market-card-meta mb-0 text-muted small">Products ready to add to cart</p>
              </article>
            </div>
          </div>

          <div class="web-market-products">
            <header class="web-market-section-head">
              <div>
                <p class="section-kicker">Products</p>
                <h2 class="section-title">{{ activeStoreName }}</h2>
                <p class="section-copy small text-muted mb-0">Select an item to add it to your web cart.</p>
              </div>
            </header>
            <p v-if="loadingProducts" class="text-muted small mb-3">Loading products…</p>
            <p v-else-if="productError" class="text-danger small mb-3">{{ productError }}</p>
            <div v-else-if="!filteredProducts.length" class="empty-card empty-card--product">
              <p class="mb-1 fw-semibold">Select a store</p>
              <p class="text-muted small mb-0">Choose a store to load products you can add to the cart.</p>
            </div>
            <div v-else class="web-market-product-grid">
              <article v-for="prod in filteredProducts" :key="prod.id" class="web-market-product-card">
                <div class="product-media" :style="{ backgroundImage: mediaGradient(prod) }">
                  <span class="product-pill" v-if="prod.is_new || prod.badge">New</span>
                  <button class="fav-btn" type="button" :class="{ active: isFavorite(prod) }" @click.stop="toggleFavorite(prod)">
                    <Icon icon="solar:heart-linear" class="fav-icon" />
                  </button>
                </div>
                <h3 class="web-market-product-title">{{ prod.title || 'Product' }}</h3>
                <p class="web-market-product-desc text-muted mb-2">{{ prod.description || 'Marketplace item' }}</p>
                <p class="web-market-product-price">{{ formatPrice(prod.price ?? prod.base_price) }}</p>
                <div class="d-flex gap-2">
                  <b-button size="sm" variant="primary" :disabled="!prod.skus?.length || adding" @click="addProduct(prod)">
                    Add to web cart
                  </b-button>
                  <b-button size="sm" variant="outline-secondary" :to="{ name: 'store.microsite', params: { slugOrId: activeStoreMicrosite || activeStoreSlug } }">
                    View microsite
                  </b-button>
                </div>
              </article>
            </div>
            <p v-if="addMessage" class="text-success small mt-2 mb-0">{{ addMessage }}</p>
            <p v-if="addError" class="text-danger small mt-2 mb-0">{{ addError }}</p>
          </div>
        </div>

        <div class="web-market-products all-products" v-if="filteredAllProducts.length">
          <header class="web-market-section-head">
            <div>
              <p class="section-kicker">All products</p>
              <h2 class="section-title">Everything we’ve loaded from stores.</h2>
            </div>
            <span class="text-muted small">{{ filteredAllProducts.length }} items</span>
          </header>
          <div class="web-market-product-grid">
            <article v-for="prod in filteredAllProducts" :key="`${prod.store_id}-${prod.id}`" class="web-market-product-card">
              <div class="product-media" :style="{ backgroundImage: mediaGradient(prod) }">
                <span class="product-pill" v-if="prod.is_new || prod.badge">New</span>
                <button class="fav-btn" type="button" :class="{ active: isFavorite(prod) }" @click.stop="toggleFavorite(prod)">
                  <Icon icon="solar:heart-linear" class="fav-icon" />
                </button>
              </div>
              <h3 class="web-market-product-title">{{ prod.title || 'Product' }}</h3>
              <p class="web-market-product-desc text-muted mb-2">
                {{ prod.description || 'Marketplace item' }}
              </p>
              <p class="web-market-product-meta small text-muted mb-2">From {{ prod.store_name || 'store' }}</p>
              <p class="web-market-product-price">{{ formatPrice(prod.price ?? prod.base_price) }}</p>
              <div class="d-flex gap-2">
                <b-button size="sm" variant="primary" class="app-btn" :disabled="!prod.skus?.length || adding" @click="addProduct(prod)">
                  Add to web cart
                </b-button>
              </div>
            </article>
          </div>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
  <div v-else class="web-market-embed">
    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="featured-categories">
          <div class="featured-head">
            <div>
              <p class="section-kicker">Featured categories</p>
              <h2 class="section-title">Pick a lane and keep browsing.</h2>
            </div>
            <RouterLink :to="{ name: 'web.groceries' }" class="see-all-link">See groceries</RouterLink>
          </div>
          <p v-if="categoryError" class="text-danger small mb-2">{{ categoryError }}</p>
          <p v-else-if="loadingCategories" class="text-muted small mb-2">Loading categories…</p>
          <div class="category-grid">
            <article v-for="cat in displayCategories" :key="cat.title" class="category-card">
              <div class="category-icon" :style="{ background: cat.bg }">
                <img v-if="cat.icon" :src="cat.icon" alt="" class="category-icon-img" />
                <span v-else>{{ cat.emoji }}</span>
              </div>
              <div class="category-body">
                <h3>{{ cat.title }}</h3>
                <p>{{ cat.copy }}</p>
              </div>
              <b-button size="sm" variant="outline-primary" @click="scrollToStores">Shop</b-button>
            </article>
          </div>
        </div>

        <div class="web-market-layout" id="stores">
          <div class="web-market-list">
            <header class="web-market-section-head">
              <div>
                <p class="section-kicker">Stores</p>
                <h2 class="section-title">Pick a store to view its products.</h2>
              </div>
              <b-button size="sm" variant="outline-primary" @click="loadStores" :disabled="loadingStores">
                <Icon icon="solar:refresh-bold" /> Reload
              </b-button>
            </header>
            <p v-if="loadingStores" class="text-muted small mb-3">Loading stores…</p>
            <p v-else-if="storeError" class="text-danger small mb-3">{{ storeError }}</p>
            <div v-else-if="!filteredStores.length" class="empty-card">
              <p class="mb-1 fw-semibold">No stores live yet</p>
              <p class="text-muted small mb-0">We’ll list grocery and marketplace stores here once they’re connected.</p>
            </div>
            <div v-else class="web-market-cards">
              <article
                v-for="store in filteredStores"
                :key="storeKey(store)"
                class="web-market-card"
                :class="{ 'web-market-card--active': store.seller_id === activeStoreId }"
                @click="selectStore(store)"
              >
                <div class="web-market-card-top">
                  <span class="store-chip">Store</span>
                  <span class="store-chip store-chip--soft">Web ready</span>
                </div>
                <h3 class="mb-1">{{ store.business_name || 'Store' }}</h3>
                <p class="web-market-card-copy mb-1">{{ store.business_address || 'Marketplace seller' }}</p>
                <p class="web-market-card-meta mb-0 text-muted small">Products ready to add to cart</p>
              </article>
            </div>
          </div>

          <div class="web-market-products">
            <header class="web-market-section-head">
              <div>
                <p class="section-kicker">Products</p>
                <h2 class="section-title">{{ activeStoreName }}</h2>
                <p class="section-copy small text-muted mb-0">Select an item to add it to your web cart.</p>
              </div>
            </header>
            <p v-if="loadingProducts" class="text-muted small mb-3">Loading products…</p>
            <p v-else-if="productError" class="text-danger small mb-3">{{ productError }}</p>
            <div v-else-if="!filteredProducts.length" class="empty-card empty-card--product">
              <p class="mb-1 fw-semibold">Select a store</p>
              <p class="text-muted small mb-0">Choose a store to load products you can add to the cart.</p>
            </div>
            <div v-else class="web-market-product-grid">
              <article v-for="prod in filteredProducts" :key="prod.id" class="web-market-product-card">
                <div class="product-media" :style="{ backgroundImage: mediaGradient(prod) }">
                  <span class="product-pill" v-if="prod.is_new || prod.badge">New</span>
                  <button class="fav-btn" type="button" :class="{ active: isFavorite(prod) }" @click.stop="toggleFavorite(prod)">
                    <Icon icon="solar:heart-linear" class="fav-icon" />
                  </button>
                </div>
                <h3 class="web-market-product-title">{{ prod.title || 'Product' }}</h3>
                <p class="web-market-product-desc text-muted mb-2">{{ prod.description || 'Marketplace item' }}</p>
                <p class="web-market-product-price">{{ formatPrice(prod.price ?? prod.base_price) }}</p>
                <div class="d-flex gap-2">
                  <b-button size="sm" variant="primary" class="app-btn" :disabled="!prod.skus?.length || adding" @click="addProduct(prod)">
                    Add to web cart
                  </b-button>
                  <b-button size="sm" variant="outline-secondary" class="app-btn ghost" :to="{ name: 'store.microsite', params: { slugOrId: activeStoreSlug } }">
                    View microsite
                  </b-button>
                </div>
              </article>
            </div>
            <p v-if="addMessage" class="text-success small mt-2 mb-0">{{ addMessage }}</p>
            <p v-if="addError" class="text-danger small mt-2 mb-0">{{ addError }}</p>
          </div>
        </div>

        <div class="web-market-products all-products" v-if="filteredAllProducts.length">
          <header class="web-market-section-head">
            <div>
              <p class="section-kicker">All products</p>
              <h2 class="section-title">Everything we’ve loaded from stores.</h2>
            </div>
            <span class="text-muted small">{{ filteredAllProducts.length }} items</span>
          </header>
          <div class="web-market-product-grid">
            <article v-for="prod in filteredAllProducts" :key="`${prod.store_id}-${prod.id}`" class="web-market-product-card">
              <div class="product-media" :style="{ backgroundImage: mediaGradient(prod) }">
                <span class="product-pill" v-if="prod.is_new || prod.badge">New</span>
                <button class="fav-btn" type="button" :class="{ active: isFavorite(prod) }" @click.stop="toggleFavorite(prod)">
                  <Icon icon="solar:heart-linear" class="fav-icon" />
                </button>
              </div>
              <h3 class="web-market-product-title">{{ prod.title || 'Product' }}</h3>
              <p class="web-market-product-desc text-muted mb-2">
                {{ prod.description || 'Marketplace item' }}
              </p>
              <p class="web-market-product-meta small text-muted mb-2">From {{ prod.store_name || 'store' }}</p>
              <p class="web-market-product-price">{{ formatPrice(prod.price ?? prod.base_price) }}</p>
              <div class="d-flex gap-2">
                <b-button size="sm" variant="primary" class="app-btn" :disabled="!prod.skus?.length || adding" @click="addProduct(prod)">
                  Add to web cart
                </b-button>
              </div>
            </article>
          </div>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { superAppApi } from '@/api/superApp'
import { catalogPublicApi } from '@/api/catalog'
import { cartApi } from '@/api/cart'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'

const props = defineProps<{ embed?: boolean }>()

type Store = {
  seller_id?: number
  user_id?: number
  business_name?: string
  business_address?: string
  menu_slug?: string
  store_slug?: string
}
type Product = {
  id?: number
  title?: string
  description?: string
  price?: number
  base_price?: number
  skus?: { id?: number }[]
  is_new?: boolean
  badge?: string
  category_name?: string
  store_name?: string
  store_id?: number | string
}

type Category = { id?: number; name?: string; slug?: string; description?: string; icon?: string }
type DisplayCategory = {
  title: string
  copy: string
  emoji: string
  bg: string
  icon?: string
}

const auth = useAuthStore()
const stores = ref<Store[]>([])
const products = ref<Product[]>([])
const allProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const activeStoreId = ref<number | string | null>(null)
const activeStoreSlug = ref('')
const activeStoreMicrosite = ref('')
const loadingStores = ref(false)
const loadingProducts = ref(false)
const loadingAllProducts = ref(false)
const loadingCategories = ref(false)
const adding = ref(false)
const storeError = ref('')
const productError = ref('')
const categoryError = ref('')
const addMessage = ref('')
const addError = ref('')
const searchTerm = ref('')
const favorites = ref<Set<number>>(new Set())
const fallbackCategories: DisplayCategory[] = [
  { title: 'Fresh grocery', copy: 'Daily fruits and vegetables from nearby sellers.', emoji: '🥑', bg: 'linear-gradient(135deg, #fef6e4, #e9f7ef)' },
  { title: 'Home & living', copy: 'Home basics, cleaning, and kitchenware.', emoji: '🏠', bg: 'linear-gradient(135deg, #eef2ff, #f6f0ff)' },
  { title: 'Beauty & care', copy: 'Self-care, skincare, and hair care picks.', emoji: '💄', bg: 'linear-gradient(135deg, #fff5f7, #f2f2ff)' },
  { title: 'Electronics', copy: 'Accessories, gadgets, and everyday tech.', emoji: '🎧', bg: 'linear-gradient(135deg, #e7f5ff, #f9fbff)' },
]

const activeStoreName = computed(() => {
  const s = stores.value.find((x) => x.seller_id === activeStoreId.value)
  return s?.business_name || 'Select a store'
})

function storeKey(store: Store) {
  return String(store.seller_id || store.user_id || Math.random())
}

const filteredStores = computed(() => {
  if (!searchTerm.value) return stores.value
  const term = searchTerm.value.toLowerCase()
  return stores.value.filter((s) => (s.business_name || '').toLowerCase().includes(term))
})

const filteredProducts = computed(() => {
  if (!searchTerm.value) return products.value
  const term = searchTerm.value.toLowerCase()
  return products.value.filter(
    (p) => (p.title || '').toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term)
  )
})

const filteredAllProducts = computed(() => {
  if (!searchTerm.value) return allProducts.value
  const term = searchTerm.value.toLowerCase()
  return allProducts.value.filter(
    (p) =>
      (p.title || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term) ||
      (p.store_name || '').toLowerCase().includes(term)
  )
})

const displayCategories = computed<DisplayCategory[]>(() => {
  if (categories.value.length) {
    return categories.value.map((cat, idx) => ({
      title: cat.name ?? 'Category',
      copy: cat.description || 'Browse items in this category.',
      emoji: ['🥑', '🏠', '💄', '🎧', '🛍️', '🍽️'][idx % 6],
      bg: fallbackCategories[idx % fallbackCategories.length].bg,
      icon: cat.icon,
    }))
  }
  const derived = Array.from(
    new Set(
      filteredProducts.value
        .map((p) => p.category_name)
        .filter((v): v is string => Boolean(v && v.trim()))
    )
  ).map<DisplayCategory>((name, idx) => ({
    title: name,
    copy: 'Shop items in this category.',
    emoji: ['🛒', '🧺', '🧴', '📦', '🥬', '💡'][idx % 6],
    bg: fallbackCategories[idx % fallbackCategories.length].bg,
  }))
  return derived.length ? derived : fallbackCategories
})

async function loadStores() {
  loadingStores.value = true
  storeError.value = ''
  try {
    const { data } = await superAppApi.getGroceryStores({ limit: 10 })
    stores.value = data?.results as Store[] ?? []
    if (stores.value.length) {
      selectStore(stores.value[0])
    } else {
      products.value = []
      activeStoreId.value = null
      await loadCatalogProducts()
    }
    loadAllProducts()
  } catch (e) {
    storeError.value = formatApiError(e, 'Could not load stores')
    await loadCatalogProducts()
  } finally {
    loadingStores.value = false
  }
}

async function loadCategories() {
  loadingCategories.value = true
  categoryError.value = ''
  try {
    const { data } = await catalogPublicApi.listCategories()
    categories.value = (data?.results as Category[]) ?? []
  } catch (e) {
    categoryError.value = formatApiError(e, 'Could not load categories')
  } finally {
    loadingCategories.value = false
  }
}

async function selectStore(store: Store) {
  activeStoreId.value = store.seller_id ?? store.user_id ?? null
  activeStoreSlug.value = store.menu_slug || String(activeStoreId.value || '')
  activeStoreMicrosite.value = store.store_slug || activeStoreSlug.value
  await loadProducts()
}

async function loadProducts() {
  if (!activeStoreId.value) {
    products.value = []
    return
  }
  loadingProducts.value = true
  addMessage.value = ''
  addError.value = ''
  try {
    // Prefer catalog endpoint filtered by seller_id; fallback to super-app products if that fails.
    const { data } = await catalogPublicApi.listProducts({ seller_id: Number(activeStoreId.value), page_size: 24 } as any)
    const list = (data?.results as Product[]) ?? []
    if (list.length) {
      products.value = list.map((p) => ({
        ...p,
        store_id: activeStoreId.value || undefined,
        store_name: activeStoreName.value,
      }))
    } else {
      const superData = await superAppApi.getGroceryStoreProducts(activeStoreId.value)
      const results = (superData?.data?.results as Product[]) ?? (Array.isArray(superData?.data) ? (superData.data as Product[]) : [])
      products.value = results.map((p) => ({
        ...p,
        store_id: activeStoreId.value || undefined,
        store_name: activeStoreName.value,
      }))
    }
    productError.value = products.value.length ? '' : 'No products available.'
  } catch (e) {
    productError.value = formatApiError(e, 'Could not load products')
  } finally {
    loadingProducts.value = false
  }
}

async function loadAllProducts() {
  loadingAllProducts.value = true
  try {
    const { data } = await catalogPublicApi.listProducts({ page_size: 40 } as any)
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
  } catch (_) {
    // ignore
  } finally {
    loadingAllProducts.value = false
  }
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

async function addProduct(prod: Product) {
  addMessage.value = ''
  addError.value = ''
  if (!auth.isAuthenticated) {
    addError.value = 'Sign in to add items to your cart.'
    return
  }
  const skuId = prod.skus?.[0]?.id
  if (!skuId) {
    addError.value = 'No SKU available for this product.'
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

function toggleFavorite(prod: Product) {
  const set = new Set(favorites.value)
  if (prod.id && set.has(prod.id)) {
    set.delete(prod.id)
  } else if (prod.id) {
    set.add(prod.id)
  }
  favorites.value = set
  localStorage.setItem('webFavorites', JSON.stringify(Array.from(set)))
}

function isFavorite(prod: Product) {
  return prod.id ? favorites.value.has(prod.id) : false
}

function loadFavorites() {
  const raw = localStorage.getItem('webFavorites')
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      favorites.value = new Set(parsed)
    }
  } catch (e) {
    // ignore
  }
}

onMounted(() => {
  loadStores()
  loadFavorites()
  loadCategories()
})

function applySearch() {
  /* filtering handled by computed */
}

function scrollToStores() {
  const el = document.getElementById('stores')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function mediaGradient(prod: Product) {
  const seed = (prod.title || 'item').length
  const colors = [
    ['#fef6e4', '#f3d9fa'],
    ['#e7f5ff', '#d0ebff'],
    ['#e6fcf5', '#d3f9d8'],
    ['#fff5f5', '#ffe8cc'],
  ]
  const pair = colors[seed % colors.length]
  return `radial-gradient(circle at 30% 30%, ${pair[0]}, ${pair[1]})`
}
</script>

<style scoped>
.web-market-hero {
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.web-market-grid {
  display: grid;
  gap: 1.6rem;
  align-items: center;
}
.web-market-hero-copy {
  display: grid;
  gap: 1rem;
}
@media (min-width: 992px) {
  .web-market-grid {
    grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.8fr);
  }
}
.web-market-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.web-market-title {
  font-size: clamp(1.9rem, 4.2vw, 3.1rem);
  line-height: 1.05;
  margin: 0.6rem 0 0.7rem;
  max-width: 22ch;
}
.web-market-copy {
  max-width: 62ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
.web-market-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.web-market-search {
  display: grid;
  grid-template-columns: 1.25rem 1fr auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(92, 48, 143, 0.16);
  box-shadow: 0 12px 30px rgba(35, 20, 46, 0.12);
  max-width: 520px;
}
.web-market-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
}
.web-market-search-icon {
  color: #5c308f;
}
.web-market-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.pill {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.12);
  color: #5c308f;
  font-weight: 700;
  font-size: 0.78rem;
}
.pill--ghost {
  background: rgba(92, 48, 143, 0.08);
  color: #3b1a5a;
}
.web-market-hero-visual {
  position: relative;
  padding: 1.2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.08), transparent 40%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 36%),
    #ffffff;
  box-shadow: 0 20px 42px rgba(35, 20, 46, 0.14);
}
.hero-visual-pill {
  display: inline-flex;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.1);
  color: #5c308f;
  font-weight: 700;
  margin-bottom: 0.8rem;
}
.hero-visual-card {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) 1.2fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.9rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(92, 48, 143, 0.12);
}
.hero-visual-image {
  width: 100%;
  height: 140px;
  border-radius: 1.1rem;
  background: radial-gradient(circle at 30% 30%, #fef6e4, #f3d9fa);
}
.hero-visual-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}
.hero-visual-meta .label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  color: var(--bs-secondary-color);
  margin: 0 0 0.2rem;
}
.web-market-hero-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 1.25rem;
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.12);
}
.web-market-layout {
  display: grid;
  gap: 1rem;
}
@media (min-width: 1100px) {
  .web-market-layout {
    grid-template-columns: 1fr 1.4fr;
  }
}
.web-market-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.web-market-cards {
  display: grid;
  gap: 0.75rem;
}
.web-market-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.25rem;
  padding: 1rem;
  background: linear-gradient(180deg, #ffffff 0%, rgba(240, 236, 250, 0.92) 100%);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}
.web-market-card--active {
  border-color: rgba(92, 48, 143, 0.32);
  box-shadow: 0 12px 30px rgba(35, 20, 46, 0.12);
  transform: translateY(-2px);
}
.web-market-card-copy {
  margin: 0;
  line-height: 1.5;
}
.web-market-card-meta {
  margin: 0;
}
.web-market-products {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.25rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.08);
}
.web-market-product-grid {
  display: grid;
  gap: 0.8rem;
}
@media (min-width: 768px) {
  .web-market-product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.web-market-product-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.2rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 244, 255, 0.92));
  box-shadow: 0 14px 30px rgba(35, 20, 46, 0.12);
  display: grid;
  gap: 0.55rem;
}
.product-media {
  width: 100%;
  height: 160px;
  border-radius: 1rem;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
.product-pill {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
}
.fav-btn {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(92, 48, 143, 0.18);
  background: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5c308f;
  transition: all 0.15s ease;
}
.fav-btn.active {
  background: rgba(92, 48, 143, 0.14);
}
.fav-icon {
  font-size: 1.1rem;
}
.web-market-product-title {
  margin: 0;
  font-size: 1rem;
}
.web-market-product-desc {
  margin: 0;
}
.web-market-product-price {
  margin: 0;
  font-weight: 800;
  color: #5c308f;
}
.web-market-product-meta {
  margin: 0;
}
.all-products {
  margin-top: 1.5rem;
}
.app-btn {
  border-radius: 999px;
}
.app-btn.ghost {
  border-color: rgba(92, 48, 143, 0.18);
}

.featured-categories {
  margin-bottom: 2rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.5rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.08);
}
.featured-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.see-all-link {
  font-weight: 700;
  color: #5c308f;
  text-decoration: none;
}
.category-grid {
  display: grid;
  gap: 0.9rem;
}
@media (min-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.category-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.92);
}
.category-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 1.4rem;
}
.category-icon-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.category-body h3 {
  margin: 0 0 0.2rem;
}
.category-body p {
  margin: 0;
  color: var(--bs-secondary-color);
  font-size: 0.9rem;
}
.empty-card {
  border: 1px dashed rgba(92, 48, 143, 0.25);
  border-radius: 1.2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 0 0 1px rgba(92, 48, 143, 0.05);
}
.empty-card--product {
  min-height: 180px;
  display: grid;
  align-content: center;
}
.web-market-card-top {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}
.store-chip {
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.1);
  font-size: 0.72rem;
  font-weight: 700;
  color: #5c308f;
}
.store-chip--soft {
  background: rgba(247, 168, 41, 0.16);
  color: #8e5c00;
}
.store-chip,
.store-chip--soft {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
