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
      <article v-for="order in displayItems" :key="String(order.id)" class="buyer-order-card">
        <RouterLink :to="orderLink(order)" class="buyer-order-card__main">
          <div class="buyer-order-card__head">
            <div class="buyer-order-card__title-block">
              <div class="buyer-order-card__icon" aria-hidden="true">
                <Icon icon="solar:bag-check-bold" />
              </div>
              <div>
                <p class="buyer-order-card__id">#{{ order.order_number || order.id }}</p>
                <p v-if="order.created_at" class="buyer-order-card__when">{{ formatWhen(order.created_at) }}</p>
              </div>
            </div>
            <span :class="orderStatusPillClass(order.status)">{{ formatOrderStatus(order.status) }}</span>
          </div>

          <div v-if="orderSummary(order)" class="buyer-order-card__summary">
            {{ orderSummary(order) }}
          </div>

          <div class="buyer-order-card__foot">
            <div class="buyer-order-card__total">
              <span class="buyer-order-card__total-label">{{ t('buyerXp.common.total') }}</span>
              <strong>{{ formatBuyerMoney(order.final_total ?? order.total_amount) }}</strong>
            </div>
            <span class="buyer-order-card__cta">
              {{ t('buyerXp.orders.viewOrder') }}
              <Icon icon="solar:alt-arrow-right-linear" aria-hidden="true" />
            </span>
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
  orderStatusPillClass,
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

function formatWhen(value: unknown) {
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function orderItemCount(order: OrderRow) {
  const raw = order.items ?? order.order_items
  if (Array.isArray(raw)) return raw.length
  const n = Number(order.item_count)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function orderSummary(order: OrderRow) {
  const count = orderItemCount(order)
  if (count > 0) return t('buyerXp.orders.itemCount', { count })
  const fulfillment = String(order.fulfillment_type ?? '').trim()
  if (fulfillment) return fulfillment.replace(/_/g, ' ')
  const vertical = String(order.vertical ?? order.channel ?? '').trim()
  if (vertical) return vertical.replace(/_/g, ' ')
  return ''
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
