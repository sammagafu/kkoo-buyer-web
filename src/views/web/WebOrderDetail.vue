<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div>
          <h1 class="buyer-page-head__title">{{ t('buyerXp.common.orderNumber', { number: order?.order_number || id }) }}</h1>
          <p v-if="order?.status" class="buyer-page-head__meta">
            <span class="buyer-status-pill" :class="statusClass">{{ order.status }}</span>
          </p>
        </div>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <template v-else-if="order">
      <section class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.orders.summary')" />
        <div class="buyer-detail-row"><span>{{ t('buyerXp.common.placed') }}</span><span>{{ formatDate(order.created_at) }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.common.total') }}</span><strong>{{ formatMoney(order.final_total ?? order.total_amount) }}</strong></div>
        <div v-if="order.payment_method" class="buyer-detail-row"><span>{{ t('buyerXp.common.payment') }}</span><span>{{ order.payment_method }}</span></div>
      </section>

      <section v-if="tracking" class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.orders.tracking')" />
        <div class="buyer-detail-row"><span>{{ t('buyerXp.common.status') }}</span><span>{{ tracking.status || '—' }}</span></div>
        <a v-if="tracking.gps_track_link" :href="String(tracking.gps_track_link)" target="_blank" rel="noopener" class="buyer-section-head__action">
          {{ t('buyerXp.orders.liveMap') }}
        </a>
      </section>

      <section v-if="items.length" class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.orders.items')" />
        <div v-for="(item, i) in items" :key="i" class="buyer-detail-row">
          <span>{{ itemLabel(item) }}</span>
          <span>{{ formatMoney(item.line_total ?? item.price) }}</span>
        </div>
      </section>

      <div class="buyer-hub-list">
        <BuyerHubCard
          v-if="canReturn"
          :title="t('buyerXp.orders.requestReturn')"
          :subtitle="t('buyerXp.orders.requestReturnSub')"
          icon="solar:restart-bold"
          tone="teal"
          :to="{ name: 'buyer.returns', query: { order_id: id } }"
        />
        <BuyerHubCard
          :title="t('buyerXp.orders.openDispute')"
          :subtitle="t('buyerXp.orders.openDisputeSub')"
          icon="solar:shield-warning-bold"
          tone="pink"
          :to="{ name: 'buyer.disputes', query: { order_id: id } }"
        />
      </div>

      <button
        v-if="canCancel"
        type="button"
        class="buyer-venue__chip mt-2"
        style="color: #b91c1c"
        :disabled="cancelling"
        @click="cancelOrder"
      >
        {{ cancelling ? t('buyerXp.orders.cancelling') : t('buyerXp.orders.cancelOrder') }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ordersUserApi, logisticsBuyerApi } from '@/api'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'

const props = defineProps<{ id: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

type OrderRow = Record<string, unknown>
const order = ref<OrderRow | null>(null)
const tracking = ref<Record<string, unknown> | null>(null)
const loading = ref(false)
const error = ref('')
const cancelling = ref(false)

const items = computed(() => {
  const raw = order.value?.items ?? order.value?.order_items
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : []
})

const statusClass = computed(() => {
  const s = String(order.value?.status ?? '').toLowerCase()
  if (s === 'delivered' || s === 'completed') return 'buyer-status-pill--ok'
  if (s === 'cancelled') return ''
  return 'buyer-status-pill--warn'
})

const canCancel = computed(() => {
  const s = String(order.value?.status ?? '').toLowerCase()
  return ['pending', 'confirmed', 'processing'].includes(s)
})

const canReturn = computed(() => {
  const s = String(order.value?.status ?? '').toLowerCase()
  return ['delivered', 'completed', 'shipped'].includes(s)
})

function formatDate(v: unknown) {
  if (!v) return '—'
  const d = new Date(String(v))
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString()
}

function formatMoney(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n)
}

function itemLabel(item: Record<string, unknown>) {
  const qty = item.quantity ?? 1
  const name = item.product_title ?? item.title ?? item.name ?? t('buyerXp.common.itemFallback')
  return `${qty}× ${name}`
}

async function load() {
  loading.value = true
  error.value = ''
  const orderId = Number(props.id || route.params.id)
  try {
    const { data } = await ordersUserApi.get(orderId)
    order.value = data as OrderRow
    try {
      const tr = await logisticsBuyerApi.getTracking(orderId)
      tracking.value = (tr.data ?? {}) as Record<string, unknown>
    } catch {
      tracking.value = null
    }
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.orders.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function cancelOrder() {
  if (!order.value?.id) return
  cancelling.value = true
  try {
    await ordersUserApi.cancel(Number(order.value.id))
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.orders.couldNotCancel'))
  } finally {
    cancelling.value = false
  }
}

onMounted(load)
</script>
