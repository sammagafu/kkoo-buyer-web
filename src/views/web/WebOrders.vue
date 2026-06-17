<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <div>
          <h1 class="buyer-page-head__title">{{ t('buyerXp.orders.title') }}</h1>
          <p class="buyer-page-head__meta">{{ t('buyerXp.orders.meta') }}</p>
        </div>
        <div class="buyer-btn-row buyer-page-head__actions">
          <button type="button" class="buyer-venue__chip" :disabled="loading" @click="load">
            {{ loading ? t('buyerXp.common.refreshing') : t('buyerXp.common.refresh') }}
          </button>
        </div>
      </div>
    </header>

    <div class="buyer-orders-toolbar">
      <BuyerSearchBar v-model="search" :placeholder="t('buyerXp.orders.searchPlaceholder')" />
      <select v-model="statusFilter" aria-label="Filter by status">
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
      </select>
    </div>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.orders.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="displayItems.length" class="buyer-hub-list">
      <article
        v-for="order in displayItems"
        :key="String(order.id)"
        class="buyer-detail-card buyer-detail-card--clickable"
        role="button"
        tabindex="0"
        @click="openOrder(order)"
        @keydown.enter="openOrder(order)"
      >
        <div class="buyer-detail-row">
          <strong>#{{ order.order_number || order.id }}</strong>
          <span :class="orderStatusPillClass(order.status)">{{ order.status || 'pending' }}</span>
        </div>
        <div class="buyer-detail-row">
          <span>{{ t('buyerXp.common.placed') }}</span>
          <span>{{ formatBuyerDateTime(order.created_at) }}</span>
        </div>
        <div class="buyer-detail-row">
          <span>{{ t('buyerXp.common.total') }}</span>
          <strong>{{ formatBuyerMoney(order.final_total ?? order.total_amount) }}</strong>
        </div>
        <div class="buyer-btn-row mt-2">
          <span class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.common.viewDetails') }}</span>
        </div>
      </article>
    </section>

    <BuyerEmptyState
      v-else
      icon="solar:bag-check-bold"
      :title="t('buyerXp.orders.emptyTitle')"
      :message="t('buyerXp.orders.emptyMessage')"
    >
      <template #action>
        <RouterLink :to="BUYER_DASHBOARD_ROUTE" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.common.startShopping') }}</RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ordersUserApi } from '@/api'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerDateTime, formatBuyerMoney, orderStatusPillClass } from '@/utils/buyerFormat'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'

type OrderRow = Record<string, unknown>

const router = useRouter()
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

function openOrder(order: OrderRow) {
  const id = order.id
  if (id != null) void router.push({ name: 'buyer.order', params: { id: String(id) } })
}

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
