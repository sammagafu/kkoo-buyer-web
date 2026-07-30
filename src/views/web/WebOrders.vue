<template>
  <div class="buyer-xp buyer-xp--wide buyer-orders-page">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <div class="buyer-page-head__copy">
          <h1 class="buyer-page-head__title">{{ t('buyerXp.orders.title') }}</h1>
          <p class="buyer-page-head__meta">{{ t('buyerXp.orders.meta') }}</p>
        </div>
        <div class="buyer-btn-row buyer-page-head__actions">
          <button type="button" class="buyer-venue__chip" :disabled="loading" @click="load">
            {{ loading ? t('buyerXp.common.refreshing') : t('buyerXp.common.refresh') }}
          </button>
          <RouterLink :to="BUYER_DASHBOARD_ROUTE" class="buyer-venue__chip buyer-venue__chip--primary d-none d-md-inline-flex">
            {{ t('buyerXp.common.startShopping') }}
          </RouterLink>
        </div>
      </div>
      <RouterLink :to="BUYER_DASHBOARD_ROUTE" class="buyer-venue__chip buyer-venue__chip--primary d-md-none">
        {{ t('buyerXp.common.startShopping') }}
      </RouterLink>
    </header>

    <div class="buyer-orders-toolbar">
      <BuyerSearchBar v-model="search" :placeholder="t('buyerXp.orders.searchPlaceholder')" />
    </div>

    <div class="buyer-filter-row" role="tablist" :aria-label="t('buyerXp.orders.statusFilterLabel')">
      <button
        v-for="opt in statusOptions"
        :key="opt.value"
        type="button"
        role="tab"
        class="buyer-filter-chip"
        :class="{ 'buyer-filter-chip--active': statusFilter === opt.value }"
        :aria-selected="statusFilter === opt.value"
        @click="statusFilter = opt.value"
      >
        {{ opt.text }}
      </button>
    </div>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.orders.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="displayItems.length" class="buyer-orders-list">
      <article v-for="order in displayItems" :key="String(order.id)" class="buyer-order-card-v2">
        <RouterLink :to="orderLink(order)" class="buyer-order-card-v2__link">
          <div class="buyer-order-card-v2__body">
            <div class="buyer-order-card-v2__thumb" aria-hidden="true">
              <Icon icon="solar:bag-check-bold" />
            </div>
            <div class="buyer-order-card-v2__info">
              <div class="buyer-order-card-v2__info-top">
                <p class="buyer-order-card-v2__title">{{ firstItemName(order) }}</p>
                <span v-if="firstItemQty(order) > 0" class="buyer-order-card-v2__qty">x{{ firstItemQty(order) }}</span>
              </div>
              <p v-if="firstItemVariant(order)" class="buyer-order-card-v2__variant">{{ firstItemVariant(order) }}</p>
              <p v-else-if="orderSummary(order)" class="buyer-order-card-v2__variant">{{ orderSummary(order) }}</p>
              <p class="buyer-order-card-v2__price">{{ formatBuyerMoney(firstItemPrice(order)) }}</p>
            </div>
          </div>
          <div class="buyer-order-card-v2__foot">
            <div class="buyer-order-card-v2__total">
              <span class="buyer-order-card-v2__total-label">{{ t('buyerXp.common.estimateTotal') }}</span>
              <strong>{{ formatBuyerMoney(order.final_total ?? order.total_amount) }}</strong>
            </div>
            <div class="buyer-order-card-v2__actions">
              <span class="buyer-order-card-v2__status" :class="orderStatusButtonClass(order.status)">
                {{ formatOrderStatus(order.status) }}
              </span>
              <span class="buyer-order-card-v2__icon-btn" aria-hidden="true">
                <Icon icon="solar:sale-bold" />
              </span>
            </div>
          </div>
        </RouterLink>
      </article>
    </section>

    <BuyerEmptyState
      v-else
      icon="solar:bag-check-bold"
      :title="t('buyerXp.orders.emptyTitle')"
      :message="t('buyerXp.orders.emptyMessage')"
    >
      <template #action>
        <RouterLink :to="BUYER_DASHBOARD_ROUTE" class="buyer-venue__chip buyer-venue__chip--primary">
          {{ t('buyerXp.common.startShopping') }}
        </RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ordersUserApi } from '@/api'
import { formatApiError } from '@/utils/formatApiError'
import {
  formatBuyerMoney,
  formatOrderStatus,
} from '@/utils/buyerFormat'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'

type OrderRow = Record<string, unknown>

const { t } = useI18n()
const search = ref('')
const statusFilter = ref('')
const items = ref<OrderRow[]>([])
const loading = ref(false)
const error = ref('')

const statusOptions = computed(() => [
  { value: '', text: t('buyerXp.orders.allStatuses') },
  { value: 'pending', text: t('buyerXp.orders.pending') },
  { value: 'confirmed', text: t('buyerXp.orders.confirmed') },
  { value: 'processing', text: t('buyerXp.orders.processing') },
  { value: 'shipped', text: t('buyerXp.orders.shipped') },
  { value: 'delivered', text: t('buyerXp.orders.delivered') },
  { value: 'completed', text: t('buyerXp.orders.completed') },
  { value: 'cancelled', text: t('buyerXp.orders.cancelled') },
])

function normalizeList(data: unknown): OrderRow[] {
  if (Array.isArray(data)) return data
  const obj = data as { results?: unknown[] }
  return (obj?.results ?? []) as OrderRow[]
}

function orderItemCount(order: OrderRow) {
  const raw = order.items ?? order.order_items
  if (Array.isArray(raw)) return raw.length
  const n = Number(order.item_count)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function orderSummary(order: OrderRow) {
  const count = orderItemCount(order)
  if (count > 1) return t('buyerXp.orders.itemCount', { count })
  return ''
}

function firstItemName(order: OrderRow) {
  const raw = order.items ?? order.order_items
  if (Array.isArray(raw) && raw.length > 0) {
    const it = raw[0] as Record<string, unknown>
    return String(it.product_title ?? it.title ?? it.name ?? `#${order.order_number || order.id}`)
  }
  return `#${order.order_number || order.id}`
}

function firstItemQty(order: OrderRow) {
  const raw = order.items ?? order.order_items
  if (Array.isArray(raw) && raw.length > 0) {
    const n = Number((raw[0] as Record<string, unknown>).quantity ?? 1)
    return Number.isFinite(n) ? n : 1
  }
  return 0
}

function firstItemVariant(order: OrderRow) {
  const raw = order.items ?? order.order_items
  if (!Array.isArray(raw) || !raw.length) return ''
  const it = raw[0] as Record<string, unknown>
  const attrs = it.variant_attributes ?? it.variant_label ?? it.sku_label
  if (typeof attrs === 'string' && attrs.trim()) {
    try {
      const parsed = JSON.parse(attrs) as Record<string, string>
      const parts = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`)
      if (parts.length) return parts.join(' · ')
    } catch {
      return attrs.trim()
    }
  }
  if (attrs && typeof attrs === 'object') {
    const parts = Object.entries(attrs as Record<string, string>).map(([k, v]) => `${k}: ${v}`)
    if (parts.length) return parts.join(' · ')
  }
  return ''
}

function firstItemPrice(order: OrderRow) {
  const raw = order.items ?? order.order_items
  if (Array.isArray(raw) && raw.length > 0) {
    const it = raw[0] as Record<string, unknown>
    return it.unit_price ?? it.total_price ?? it.line_total ?? order.total_amount ?? 0
  }
  return order.total_amount ?? 0
}

function orderStatusButtonClass(status: unknown) {
  const s = String(status ?? '').toLowerCase()
  if (['delivered', 'completed'].includes(s)) return 'buyer-order-card-v2__status--filled'
  if (s === 'cancelled') return 'buyer-order-card-v2__status--muted'
  return 'buyer-order-card-v2__status--outline'
}

function orderLink(order: OrderRow): RouteLocationRaw {
  return { name: 'buyer.order', params: { id: String(order.id) } }
}

const displayItems = computed(() => {
  let list = items.value
  if (statusFilter.value) {
    list = list.filter((o) => String(o.status ?? '').toLowerCase() === statusFilter.value.toLowerCase())
  }
  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (o) =>
        String(o.order_number ?? '').toLowerCase().includes(q) ||
        String(o.id ?? '').toLowerCase().includes(q),
    )
  }
  return list
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await ordersUserApi.list({ page_size: 100 })
    items.value = normalizeList(data)
  } catch (e: unknown) {
    error.value = formatApiError(e, t('buyerXp.orders.loadFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
