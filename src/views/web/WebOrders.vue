<template>
  <MarketingLayout>
    <section class="lp-section web-orders-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <p class="web-orders-kicker mb-2">Your orders</p>
        <h1 class="web-orders-title mb-2">Track deliveries and order history</h1>
        <p class="text-muted mb-0">Same orders as the KKOO mobile app — status updates appear here when you are signed in.</p>
      </b-container>
    </section>

    <section class="lp-section pt-0">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
          <b-form-input
            v-model="search"
            placeholder="Search order #"
            class="flex-grow-1"
            style="max-width: 16rem"
          />
          <b-form-select v-model="statusFilter" :options="statusOptions" class="w-auto" />
          <b-button variant="outline-primary" size="sm" :disabled="loading" @click="load">Refresh</b-button>
        </div>

        <p v-if="loading" class="text-muted">Loading orders…</p>
        <b-alert v-else-if="error" variant="danger" show>{{ error }}</b-alert>
        <p v-else-if="!displayItems.length" class="text-muted">No orders yet. Browse the marketplace and checkout when you are ready.</p>

        <div v-else class="web-orders-list">
          <article v-for="order in displayItems" :key="String(order.id)" class="web-orders-card">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div>
                <p class="web-orders-card-id mb-1">#{{ order.order_number || order.id }}</p>
                <p class="text-muted small mb-0">{{ formatDate(order.created_at) }}</p>
              </div>
              <span class="badge rounded-pill" :class="statusClass(order.status)">{{ order.status || 'pending' }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <p class="mb-0 fw-semibold">{{ formatMoney(order.final_total ?? order.total_amount) }}</p>
              <b-button size="sm" variant="outline-primary" @click="openOrder(order)">Details</b-button>
            </div>
          </article>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { ordersUserApi } from '@/api'
import { formatApiError } from '@/utils/formatApiError'

type OrderRow = Record<string, unknown>

const search = ref('')
const statusFilter = ref('')
const items = ref<OrderRow[]>([])
const loading = ref(false)
const error = ref('')
const selectedOrder = ref<OrderRow | null>(null)

const statusOptions = [
  { value: '', text: 'All statuses' },
  { value: 'pending', text: 'Pending' },
  { value: 'confirmed', text: 'Confirmed' },
  { value: 'processing', text: 'Processing' },
  { value: 'shipped', text: 'Shipped' },
  { value: 'delivered', text: 'Delivered' },
  { value: 'completed', text: 'Completed' },
  { value: 'cancelled', text: 'Cancelled' },
]

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

function formatDate(value: unknown) {
  if (!value) return '—'
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString()
}

function formatMoney(value: unknown) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n)
}

function statusClass(status: unknown) {
  const s = String(status ?? '').toLowerCase()
  if (s === 'delivered' || s === 'completed') return 'text-bg-success'
  if (s === 'cancelled') return 'text-bg-secondary'
  if (s === 'shipped' || s === 'processing') return 'text-bg-primary'
  return 'text-bg-warning'
}

function openOrder(order: OrderRow) {
  selectedOrder.value = order
  const id = order.id
  if (id != null) window.alert(`Order #${order.order_number || id}\nStatus: ${order.status}\nTotal: ${formatMoney(order.final_total ?? order.total_amount)}`)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await ordersUserApi.list({ page_size: 100 })
    items.value = normalizeList(data)
  } catch (e: unknown) {
    error.value = formatApiError(e, 'Failed to load orders')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.web-orders-kicker {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--bs-primary);
}

.web-orders-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
}

.web-orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.web-orders-card {
  padding: 1rem 1.125rem;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.1);
  border-radius: 1rem;
  background: var(--bs-body-bg);
}

.web-orders-card-id {
  font-weight: 700;
}
</style>
