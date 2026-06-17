<template>
  <div class="buyer-search-page">
    <header class="buyer-search-page__hero">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.search.overline') }}</p>
      <h1 class="buyer-search-page__title">{{ t('buyerXp.search.title') }}</h1>
      <BuyerSearchBar
        v-model="query"
        :placeholder="t('buyerXp.search.placeholder')"
        @submit="runSearch"
      />
    </header>

    <div v-if="showSuggest && suggestions.length" class="buyer-search-suggest" role="listbox">
      <button
        v-for="(item, i) in suggestions"
        :key="`${item.type}-${item.label}-${i}`"
        type="button"
        class="buyer-search-suggest__item"
        role="option"
        @click="pickSuggestion(item.label)"
      >
        <Icon :icon="suggestIcon(item.type)" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </button>
    </div>

    <section v-if="!hasResults && !searching">
      <BuyerSectionHeader v-if="history.length" :title="t('buyerXp.search.recent')" />
      <div v-if="history.length" class="buyer-search-chips mb-3">
        <button
          v-for="term in history"
          :key="term"
          type="button"
          class="buyer-search-chip"
          @click="pickSuggestion(term)"
        >
          <Icon icon="solar:history-linear" aria-hidden="true" />
          {{ term }}
        </button>
        <button type="button" class="buyer-search-chip buyer-search-chip--clear" @click="clearHistory">
          {{ t('buyerXp.search.clear') }}
        </button>
      </div>

      <BuyerSectionHeader :title="t('buyerXp.search.popular')" />
      <div class="buyer-search-chips">
        <button
          v-for="term in popular"
          :key="term"
          type="button"
          class="buyer-search-chip"
          @click="pickSuggestion(term)"
        >
          {{ term }}
        </button>
      </div>

      <div class="buyer-search-chips mt-3">
        <RouterLink :to="{ name: 'buyer.eats' }" class="buyer-search-chip">{{ t('buyerXp.search.browseRestaurants') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.grocery' }" class="buyer-search-chip">{{ t('buyerXp.search.groceryStores') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.ride' }" class="buyer-search-chip">{{ t('buyerXp.search.bookRide') }}</RouterLink>
      </div>
    </section>

    <section v-if="searching" class="buyer-surface">
      <p class="shop-products__status">{{ t('buyerXp.search.searching') }}</p>
    </section>

    <section v-else-if="hasResults" class="buyer-surface" aria-label="Search results">
      <BuyerSectionHeader
        :title="t('buyerXp.search.results', { count: results.length })"
        :subtitle="t('buyerXp.search.resultsFor', { query: query })"
      />
      <div v-if="results.length" class="shop-product-grid">
        <BuyerStoreProductCard
          v-for="prod in results"
          :key="String(prod.id)"
          :title="prod.title"
          :description="prod.description"
          :price-label="formatPrice(prod.price ?? prod.base_price)"
          :image-url="productImage(prod)"
          :disabled="!prod.skus?.length"
          :adding="addingId === prod.id"
          @add="addProduct(prod)"
          @open="openProduct(prod)"
        />
      </div>
      <p v-else class="shop-products__status">{{ t('buyerXp.search.noProductMatch') }}</p>
      <div class="buyer-search-chips mt-3">
        <RouterLink :to="{ name: 'buyer.eats', query: { q: query } }" class="buyer-search-chip">
          {{ t('buyerXp.search.searchInEats') }}
        </RouterLink>
        <RouterLink :to="{ name: 'buyer.grocery', query: { q: query } }" class="buyer-search-chip">
          {{ t('buyerXp.search.searchInGroceries') }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { catalogPublicApi, catalogSearchApi } from '@/api/catalog'
import { cartApi } from '@/api/cart'
import { useAuthStore } from '@/stores/auth'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerStoreProductCard from '@/components/buyer/BuyerStoreProductCard.vue'
import { resolveAssetUrl } from '@/utils/assetUrl'
import { productDetailLink } from '@/utils/buyerDetailLinks'

type Product = {
  id?: number
  title?: string
  description?: string
  price?: number
  base_price?: number
  cover_image?: string
  image_url?: string
  skus?: { id?: number }[]
}

type SuggestItem = { label: string; type: string }

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const query = ref('')
const results = ref<Product[]>([])
const suggestions = ref<SuggestItem[]>([])
const popular = ref<string[]>(['Rice', 'Chicken', 'Bread', 'Milk', 'Phone charger'])
const history = ref<string[]>([])
const searching = ref(false)
const showSuggest = ref(false)
const addingId = ref<number | null>(null)
let suggestTimer: ReturnType<typeof setTimeout> | null = null

const hasResults = computed(() => query.value.length > 0 && (results.value.length > 0 || searching.value === false))

function suggestIcon(type: string) {
  if (type === 'category') return 'solar:widget-4-bold'
  if (type === 'brand') return 'solar:tag-bold'
  return 'solar:box-bold'
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function productImage(prod: Product) {
  return resolveAssetUrl(prod.cover_image ?? prod.image_url) ?? null
}

async function loadPopular() {
  try {
    const { data } = await catalogSearchApi.popular()
    if (data?.popular_searches?.length) popular.value = data.popular_searches.slice(0, 8)
  } catch {
    // keep defaults
  }
}

async function loadHistory() {
  if (!auth.isAuthenticated) return
  try {
    const { data } = await catalogSearchApi.getHistory()
    history.value = (data?.search_history ?? []).slice(0, 8)
  } catch {
    history.value = []
  }
}

async function clearHistory() {
  try {
    await catalogSearchApi.clearHistory()
    history.value = []
  } catch {
    history.value = []
  }
}

async function fetchSuggestions(q: string) {
  if (q.length < 2) {
    suggestions.value = []
    showSuggest.value = false
    return
  }
  try {
    const { data } = await catalogSearchApi.autocomplete({ q, limit: 8 })
    const items: SuggestItem[] = []
    for (const p of (data?.products as { title?: string }[]) ?? []) {
      if (p.title) items.push({ label: p.title, type: 'product' })
    }
    for (const c of (data?.categories as { name?: string }[]) ?? []) {
      if (c.name) items.push({ label: c.name, type: 'category' })
    }
    for (const b of (data?.brands as { name?: string }[]) ?? []) {
      if (b.name) items.push({ label: b.name, type: 'brand' })
    }
    suggestions.value = items.slice(0, 8)
    showSuggest.value = items.length > 0
  } catch {
    suggestions.value = []
    showSuggest.value = false
  }
}

async function runSearch() {
  const q = query.value.trim()
  if (!q) return
  showSuggest.value = false
  searching.value = true
  results.value = []
  try {
    if (auth.isAuthenticated) {
      try {
        await catalogSearchApi.saveHistory(q)
        await loadHistory()
      } catch {
        // ignore
      }
    }
    const { data } = await catalogPublicApi.listProducts({ search: q, page_size: 24 })
    results.value = (data?.results as Product[]) ?? []
  } finally {
    searching.value = false
  }
}

function pickSuggestion(term: string) {
  query.value = term
  showSuggest.value = false
  void runSearch()
}

function openProduct(prod: Product) {
  if (!prod.id) return
  void router.push(productDetailLink(prod.id))
}

async function addProduct(prod: Product) {
  if (!auth.isAuthenticated || !prod.id) return
  const skuId = prod.skus?.[0]?.id
  if (!skuId) return
  addingId.value = prod.id
  try {
    await cartApi.add(Number(skuId), 1)
  } finally {
    addingId.value = null
  }
}

watch(query, (q) => {
  if (suggestTimer) clearTimeout(suggestTimer)
  if (!q.trim()) {
    results.value = []
    suggestions.value = []
    showSuggest.value = false
    return
  }
  suggestTimer = setTimeout(() => void fetchSuggestions(q.trim()), 280)
})

onMounted(() => {
  void loadPopular()
  void loadHistory()
})
</script>
