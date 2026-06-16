<template>
  <MarketingLayout>
    <section class="lp-section web-compare-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-compare-grid">
          <div>
            <p class="web-compare-kicker">Compare</p>
            <h1 class="web-compare-title">Pick products to compare side by side.</h1>
            <p class="web-compare-copy">
              Search the catalog or paste a product ID, add up to four items, and view their price and details at a glance.
            </p>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="compare-shell">
          <header class="compare-head">
            <div>
              <p class="section-kicker">Add products</p>
              <h2 class="section-title">Search listings or paste an ID.</h2>
            </div>
            <span class="compare-count">{{ compareItems.length }} / 4</span>
          </header>

          <div class="compare-search">
            <Icon icon="solar:magnifer-linear" class="compare-search-icon" />
            <input
              v-model.trim="searchTerm"
              type="search"
              placeholder="Search products or paste a product ID"
              @keyup.enter="runSearch"
            />
            <b-button size="sm" variant="primary" :disabled="loading" @click="runSearch">Search</b-button>
          </div>
          <p v-if="loading" class="text-muted small mb-2">Searching catalog…</p>
          <p v-else-if="searchError" class="text-danger small mb-2">{{ searchError }}</p>

          <div class="compare-results">
            <article v-for="prod in results" :key="resultKey(prod)" class="compare-result-card">
              <div class="result-top">
                <span class="pill pill--ghost">{{ prod.category_name || 'Category' }}</span>
                <button class="fav-btn" type="button" :disabled="isFull || isAdded(prod)" @click="add(prod)">
                  <Icon icon="solar:add-square-linear" class="fav-icon" />
                </button>
              </div>
              <h3 class="mb-1">{{ prod.title || 'Product' }}</h3>
              <p class="text-muted small mb-1">{{ prod.store_name || 'Store' }}</p>
              <p class="fw-bold mb-0">{{ formatPrice(prod.price ?? prod.base_price) }}</p>
            </article>
            <article v-if="!results.length && !loading" class="compare-result-empty">
              <p class="mb-1 fw-semibold">No matches yet</p>
              <p class="text-muted small mb-0">Try a shorter search or paste a product ID from the catalog.</p>
            </article>
          </div>

          <div class="compare-grid" v-if="compareItems.length">
            <article v-for="item in compareItems" :key="item.id" class="compare-card">
              <div class="compare-card-top">
                <span class="pill">{{ item.category_name || 'Category' }}</span>
                <b-button size="sm" variant="outline-danger" @click="remove(item.id)">Remove</b-button>
              </div>
              <h3 class="mb-1">{{ item.title }}</h3>
              <p class="text-muted small mb-1">{{ item.store_name || 'Store' }}</p>
              <p class="fw-bold mb-2">{{ formatPrice(item.price ?? item.base_price) }}</p>
              <ul class="compare-meta">
                <li><strong>ID</strong> <span>{{ item.id }}</span></li>
                <li><strong>Badge</strong> <span>{{ item.badge || '—' }}</span></li>
                <li><strong>Stock</strong> <span>{{ item.skus?.length ? 'In stock' : 'Unknown' }}</span></li>
              </ul>
            </article>
          </div>
          <p v-else class="text-muted small mb-0">Add products above to start comparing.</p>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { catalogPublicApi } from '@/api/catalog'

type CompareItem = {
  id: number | string
  title?: string
  price?: number
  base_price?: number
  category_name?: string
  store_name?: string
  badge?: string
  skus?: { id?: number }[]
}

const searchTerm = ref('')
const loading = ref(false)
const searchError = ref('')
const results = ref<CompareItem[]>([])
const compareItems = ref<CompareItem[]>([])
const isFull = ref(false)

function resultKey(p: CompareItem) {
  return String(p.id ?? Math.random())
}

async function runSearch() {
  loading.value = true
  searchError.value = ''
  results.value = []
  try {
    const params = searchTerm.value
      ? { search: searchTerm.value, page_size: 12 }
      : { page_size: 12 }
    const { data } = await catalogPublicApi.listProducts(params as any)
    results.value = (data?.results as CompareItem[]) ?? []
  } catch (e: any) {
    searchError.value = e?.response?.data?.detail || 'Could not search products'
  } finally {
    loading.value = false
  }
}

function isAdded(p: CompareItem) {
  return compareItems.value.some((i) => i.id === p.id)
}

function add(p: CompareItem) {
  if (isAdded(p) || compareItems.value.length >= 4) return
  compareItems.value.push(p)
  isFull.value = compareItems.value.length >= 4
}

function remove(id: number | string) {
  compareItems.value = compareItems.value.filter((x) => x.id !== id)
  isFull.value = compareItems.value.length >= 4
}

function formatPrice(val?: number | null) {
  if (val == null) return 'TZS —'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}
</script>

<style scoped>
.web-compare-hero {
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.web-compare-grid {
  display: grid;
  gap: 1.5rem;
}
.web-compare-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.web-compare-title {
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.05;
  margin: 0.6rem 0 0.7rem;
}
.web-compare-copy {
  max-width: 60ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
.compare-shell {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1.4rem;
  padding: 1.25rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 242, 255, 0.94));
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.08);
}
.compare-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.compare-count {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.08);
  color: #5c308f;
  font-weight: 700;
}
.compare-search {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.6rem;
  align-items: center;
  padding: 0.65rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(92, 48, 143, 0.16);
  background: white;
  box-shadow: 0 10px 26px rgba(35, 20, 46, 0.1);
  margin-bottom: 0.75rem;
}
.compare-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
}
.compare-search-icon {
  color: #5c308f;
}
.compare-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.compare-result-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1rem;
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 26px rgba(35, 20, 46, 0.08);
  display: grid;
  gap: 0.35rem;
}
.result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pill {
  padding: 0.3rem 0.6rem;
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
.fav-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(92, 48, 143, 0.18);
  background: rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5c308f;
}
.fav-icon {
  font-size: 1.1rem;
}
.compare-result-empty {
  border: 1px dashed rgba(92, 48, 143, 0.25);
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 0 0 1px rgba(92, 48, 143, 0.05);
}
.compare-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.compare-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 244, 255, 0.92));
  box-shadow: 0 14px 30px rgba(35, 20, 46, 0.12);
  display: grid;
  gap: 0.45rem;
}
.compare-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}
.compare-meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.2rem;
  font-size: 0.9rem;
}
.compare-meta li {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
}
</style>
