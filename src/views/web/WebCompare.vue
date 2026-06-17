<template>
  <div class="buyer-xp buyer-xp--wide web-compare-page">
    <header class="buyer-page-head">
      <p class="buyer-page-head__kicker">{{ t('buyerXp.compare.kicker') }}</p>
      <h1 class="buyer-page-head__title">{{ t('buyerXp.compare.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.compare.meta') }}</p>
    </header>

    <section class="buyer-detail-card compare-shell">
      <header class="compare-head">
        <div>
          <p class="compare-kicker">{{ t('buyerXp.compare.addProducts') }}</p>
          <h2 class="compare-title">{{ t('buyerXp.compare.addHint') }}</h2>
        </div>
        <span class="compare-count">{{ compareItems.length }} / 4</span>
      </header>

      <div class="compare-search">
        <Icon icon="solar:magnifer-linear" class="compare-search-icon" />
        <input
          v-model.trim="searchTerm"
          type="search"
          :placeholder="t('buyerXp.compare.searchPlaceholder')"
          @keyup.enter="runSearch"
        />
        <b-button size="sm" variant="primary" :disabled="loading" @click="runSearch">{{ t('buyerXp.compare.search') }}</b-button>
      </div>
      <p v-if="loading" class="compare-hint">{{ t('buyerXp.search.searchingCatalog') }}</p>
      <p v-else-if="searchError" class="compare-error">{{ searchError }}</p>

      <div class="compare-results">
        <article v-for="prod in results" :key="resultKey(prod)" class="compare-result-card">
          <div class="result-top">
            <span class="compare-pill compare-pill--ghost">{{ prod.category_name || t('buyerXp.compare.category') }}</span>
            <button class="compare-add-btn" type="button" :disabled="isFull || isAdded(prod)" @click="add(prod)">
              <Icon icon="solar:add-square-linear" class="compare-add-icon" />
            </button>
          </div>
          <h3 class="compare-item-title">{{ prod.title || t('buyerXp.compare.product') }}</h3>
          <p class="compare-item-meta">{{ prod.store_name || t('buyerXp.compare.store') }}</p>
          <p class="compare-item-price">{{ formatPrice(prod.price ?? prod.base_price) }}</p>
        </article>
        <article v-if="!results.length && !loading" class="compare-result-empty">
          <p class="compare-empty-title">{{ t('buyerXp.compare.noMatches') }}</p>
          <p class="compare-empty-copy">{{ t('buyerXp.compare.searchHint') }}</p>
        </article>
      </div>

      <div v-if="compareItems.length" class="compare-grid">
        <article v-for="item in compareItems" :key="item.id" class="compare-card">
          <div class="compare-card-top">
            <span class="compare-pill">{{ item.category_name || t('buyerXp.compare.category') }}</span>
            <b-button size="sm" variant="outline-danger" @click="remove(item.id)">{{ t('buyerXp.common.remove') }}</b-button>
          </div>
          <h3 class="compare-item-title">{{ item.title }}</h3>
          <p class="compare-item-meta">{{ item.store_name || t('buyerXp.compare.store') }}</p>
          <p class="compare-item-price">{{ formatPrice(item.price ?? item.base_price) }}</p>
          <ul class="compare-meta">
            <li><strong>{{ t('buyerXp.compare.id') }}</strong> <span>{{ item.id }}</span></li>
            <li><strong>{{ t('buyerXp.compare.badge') }}</strong> <span>{{ item.badge || '—' }}</span></li>
            <li><strong>{{ t('buyerXp.compare.stock') }}</strong> <span>{{ item.skus?.length ? t('buyerXp.compare.inStock') : t('buyerXp.compare.unknown') }}</span></li>
          </ul>
        </article>
      </div>
      <p v-else class="compare-hint mb-0">{{ t('buyerXp.compare.startComparing') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { catalogPublicApi } from '@/api/catalog'

const { t } = useI18n()

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
    searchError.value = e?.response?.data?.detail || t('buyerXp.search.couldNotSearch')
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
.compare-shell {
  padding: 1.25rem;
}

.compare-kicker {
  margin: 0 0 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--kkoo-primary);
}

.compare-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--buyer-ink);
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
  background: var(--buyer-chip-bg);
  color: var(--kkoo-primary);
  font-weight: 700;
}

.compare-search {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.6rem;
  align-items: center;
  padding: 0.65rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--buyer-border-strong);
  background: var(--buyer-input-bg);
  box-shadow: 0 10px 26px var(--buyer-shadow-color);
  margin-bottom: 0.75rem;
}

.compare-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--buyer-ink);
}

.compare-search-icon {
  color: var(--kkoo-primary);
}

.compare-hint {
  font-size: 0.875rem;
  color: var(--buyer-muted);
  margin-bottom: 0.5rem;
}

.compare-error {
  font-size: 0.875rem;
  color: var(--bs-danger);
  margin-bottom: 0.5rem;
}

.compare-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.compare-result-card,
.compare-card {
  border: 1px solid var(--buyer-border);
  border-radius: 1rem;
  padding: 0.9rem;
  background: var(--buyer-surface);
  box-shadow: 0 12px 26px var(--buyer-shadow-color);
  display: grid;
  gap: 0.35rem;
}

.compare-card {
  padding: 1rem;
  gap: 0.45rem;
}

.result-top,
.compare-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.compare-pill {
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--buyer-chip-bg);
  color: var(--kkoo-primary);
  font-weight: 700;
  font-size: 0.78rem;
}

.compare-pill--ghost {
  color: var(--buyer-ink);
}

.compare-add-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--buyer-border-strong);
  background: var(--buyer-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--kkoo-primary);
}

.compare-add-icon {
  font-size: 1.1rem;
}

.compare-result-empty {
  border: 1px dashed var(--buyer-border-strong);
  border-radius: 1rem;
  padding: 1rem;
  background: color-mix(in srgb, var(--buyer-surface) 92%, transparent);
}

.compare-empty-title {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: var(--buyer-ink);
}

.compare-empty-copy {
  margin: 0;
  font-size: 0.875rem;
  color: var(--buyer-muted);
}

.compare-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.compare-item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--buyer-ink);
}

.compare-item-meta {
  margin: 0;
  font-size: 0.875rem;
  color: var(--buyer-muted);
}

.compare-item-price {
  margin: 0;
  font-weight: 700;
  color: var(--buyer-ink);
}

.compare-meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.2rem;
  font-size: 0.9rem;
  color: var(--buyer-ink);
}

.compare-meta li {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
}
</style>
