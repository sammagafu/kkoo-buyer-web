<template>
  <div class="buyer-xp buyer-xp--wide buyer-order-detail-page">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div class="buyer-page-head__copy">
          <h1 class="buyer-page-head__title">{{ t('buyerXp.common.orderNumber', { number: order?.order_number || id }) }}</h1>
          <p v-if="order?.status" class="buyer-page-head__meta">
            <span :class="orderStatusPillClass(order.status)">{{ formatOrderStatus(order.status) }}</span>
            <span v-if="order.payment_status" class="buyer-order-card__meta ms-2">{{ order.payment_status }}</span>
          </p>
        </div>
      </div>
    </header>

    <p v-if="loading && !order" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <template v-else-if="order">
      <section v-if="justPlaced" class="buyer-just-placed">
        <p class="buyer-just-placed__title">{{ t('buyerXp.orders.justPlacedTitle') }}</p>
        <p class="buyer-just-placed__body">{{ t('buyerXp.orders.justPlacedBody') }}</p>
        <BuyerPostSuccessTrust channel="buy" :subject-id="id" />
      </section>

      <section class="buyer-order-receipt-ticket" aria-label="Order receipt">
        <p class="buyer-order-receipt-ticket__total">{{ formatMoney(order.final_total ?? order.total_amount) }}</p>
        <p v-if="order.created_at" class="buyer-order-receipt-ticket__meta">{{ formatDate(order.created_at) }}</p>
        <div class="buyer-order-receipt-ticket__rows">
          <div class="buyer-order-receipt-ticket__row">
            <span class="buyer-order-receipt-ticket__row-label">{{ t('buyerXp.common.orderNumberLabel') }}</span>
            <span class="buyer-order-receipt-ticket__row-value">{{ order.order_number || id }}</span>
          </div>
          <div v-if="order.payment_method" class="buyer-order-receipt-ticket__row">
            <span class="buyer-order-receipt-ticket__row-label">{{ t('buyerXp.common.payment') }}</span>
            <span class="buyer-order-receipt-ticket__row-value">{{ order.payment_method }}</span>
          </div>
          <div v-if="pointsEarned > 0" class="buyer-order-receipt-ticket__row">
            <span class="buyer-order-receipt-ticket__row-label">{{ t('buyerXp.orders.pointsEarned') }}</span>
            <span class="buyer-order-receipt-ticket__row-value">+{{ pointsEarned }} {{ t('buyerXp.orders.pointsUnit') }}</span>
          </div>
        </div>
      </section>

      <section class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.orders.summary')" />
        <div class="buyer-order-detail-rows">
          <div class="buyer-order-detail-row">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.common.placed') }}</span>
            <span class="buyer-order-detail-row__value">{{ formatDate(order.created_at) }}</span>
          </div>
          <div v-if="order.payment_method" class="buyer-order-detail-row">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.common.payment') }}</span>
            <span class="buyer-order-detail-row__value">{{ order.payment_method }}</span>
          </div>
          <div v-if="order.fulfillment_type" class="buyer-order-detail-row">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.fulfillment') }}</span>
            <span class="buyer-order-detail-row__value">{{ String(order.fulfillment_type).replace(/_/g, ' ') }}</span>
          </div>
          <div v-if="order.delivery_fee != null" class="buyer-order-detail-row">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.deliveryFee') }}</span>
            <span class="buyer-order-detail-row__value">{{ formatMoney(order.delivery_fee) }}</span>
          </div>
          <div v-if="order.discount_amount" class="buyer-order-detail-row">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.discount') }}</span>
            <span class="buyer-order-detail-row__value">-{{ formatMoney(order.discount_amount) }}</span>
          </div>
          <div
            v-if="pointsEarned > 0"
            class="buyer-order-detail-row buyer-order-detail-row--points"
          >
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.pointsEarned') }}</span>
            <span class="buyer-order-detail-row__value buyer-order-detail-row__value--points">
              +{{ pointsEarned }} {{ t('buyerXp.orders.pointsUnit') }}
            </span>
          </div>
          <div
            v-else-if="awaitingPoints"
            class="buyer-order-detail-row"
          >
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.pointsEarned') }}</span>
            <span class="buyer-order-detail-row__value">{{ t('buyerXp.orders.pointsPending') }}</span>
          </div>
          <div v-if="order.delivery_zone" class="buyer-order-detail-row">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.zone') }}</span>
            <span class="buyer-order-detail-row__value">{{ order.delivery_zone }}</span>
          </div>
          <div v-if="order.delivery_location_text" class="buyer-order-detail-row buyer-order-detail-row--stack">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.deliveryAddress') }}</span>
            <span class="buyer-order-detail-row__value">{{ order.delivery_location_text }}</span>
          </div>
        </div>
      </section>

      <section v-if="subOrders.length" class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.orders.storeProgress')" />
        <article v-for="(so, i) in subOrders" :key="i" class="buyer-order-subcard">
          <div class="buyer-order-detail-row">
            <strong class="buyer-order-detail-row__value">{{ subOrderLabel(so) }}</strong>
            <span
              v-if="normalizeStoreStatus(so.status) === 'cancelled'"
              class="buyer-status-pill buyer-status-pill--danger"
            >
              {{ t('buyerXp.orders.progressCancelled') }}
            </span>
            <span v-else :class="orderStatusPillClass(so.status)">{{ formatOrderStatus(so.status) }}</span>
          </div>
          <BuyerOrderProgress
            v-if="normalizeStoreStatus(so.status) !== 'cancelled'"
            class="buyer-order-subcard__progress"
            :steps="stepsForSubOrder(so)"
            :aria-label="subOrderLabel(so)"
          />
          <div v-if="so.seller_notes" class="buyer-order-detail-row buyer-order-detail-row--stack">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.storeNote') }}</span>
            <span class="buyer-order-detail-row__value">{{ so.seller_notes }}</span>
          </div>
          <div v-if="so.estimated_ready_at" class="buyer-order-detail-row">
            <span class="buyer-order-detail-row__label">{{ t('buyerXp.orders.estimatedReady') }}</span>
            <span class="buyer-order-detail-row__value">{{ formatDate(so.estimated_ready_at) }}</span>
          </div>
        </article>
      </section>

      <section v-else-if="order" class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.orders.storeProgress')" />
        <BuyerOrderProgress :steps="parentProgressSteps" :aria-label="t('buyerXp.orders.storeProgress')" />
      </section>

      <section v-if="tracking" class="buyer-detail-card buyer-order-detail-tracking">
        <BuyerSectionHeader :title="t('buyerXp.orders.tracking')" />
        <div class="buyer-order-detail-tracking__grid">
          <div class="buyer-order-detail-stat">
            <span class="buyer-order-detail-stat__label">{{ t('buyerXp.common.status') }}</span>
            <span class="buyer-order-detail-stat__value">{{ tracking.status || '—' }}</span>
          </div>
        </div>
        <a
          v-if="tracking.gps_track_link"
          :href="String(tracking.gps_track_link)"
          target="_blank"
          rel="noopener"
          class="buyer-venue__chip buyer-venue__chip--primary buyer-order-detail-tracking__map"
        >
          <Icon icon="solar:map-point-bold" aria-hidden="true" />
          {{ t('buyerXp.orders.liveMap') }}
        </a>
      </section>

      <section v-if="items.length" class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.orders.items')" />
        <div class="buyer-order-item-cards">
          <div v-for="(item, i) in items" :key="i" class="buyer-order-item-card">
            <div class="buyer-order-item-card__thumb" aria-hidden="true">
              <Icon icon="solar:bag-check-bold" />
            </div>
            <div class="buyer-order-item-card__info">
              <p class="buyer-order-item-card__title">{{ item.product_title ?? item.title ?? item.name ?? t('buyerXp.common.itemFallback') }}</p>
              <span class="buyer-order-item-card__qty">x{{ item.quantity ?? 1 }}</span>
            </div>
            <p class="buyer-order-item-card__price">{{ formatMoney(item.total_price ?? item.line_total ?? item.unit_price) }}</p>
          </div>
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
          v-if="!justPlaced"
          :title="t('buyerXp.orders.openDispute')"
          :subtitle="t('buyerXp.orders.openDisputeSub')"
          icon="solar:shield-warning-bold"
          tone="pink"
          :to="{ name: 'buyer.disputes', query: { order_id: id } }"
        />
      </div>

      <div class="buyer-order-detail-actions">
        <button
          v-if="canCancel"
          type="button"
          class="buyer-venue__chip buyer-order-detail-actions__cancel"
          :disabled="cancelling"
          @click="cancelOrder"
        >
          {{ cancelling ? t('buyerXp.orders.cancelling') : t('buyerXp.orders.cancelOrder') }}
        </button>
        <RouterLink :to="{ name: 'buyer.orders' }" class="buyer-venue__chip">
          {{ t('buyerXp.orders.title') }}
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ordersUserApi, logisticsBuyerApi } from '@/api'
import { formatApiError } from '@/utils/formatApiError'
import { formatOrderStatus, orderStatusPillClass } from '@/utils/buyerFormat'
import { normalizeStoreStatus, storeProgressStates, type StoreProgressKey } from '@/utils/orderProgress'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'
import BuyerPostSuccessTrust from '@/components/buyer/experience/BuyerPostSuccessTrust.vue'
import BuyerOrderProgress from '@/components/buyer/BuyerOrderProgress.vue'

const props = defineProps<{ id: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

type OrderRow = Record<string, unknown>
type SubOrderRow = Record<string, unknown>

const justPlaced = computed(() => String(route.query.placed ?? '') === '1')

const order = ref<OrderRow | null>(null)
const subOrders = ref<SubOrderRow[]>([])
const tracking = ref<Record<string, unknown> | null>(null)
const loading = ref(false)
const error = ref('')
const cancelling = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null

const progressLabels = computed(() => {
  const keys: StoreProgressKey[] = ['pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered']
  const map = {} as Record<StoreProgressKey, string>
  const labelKey: Record<StoreProgressKey, string> = {
    pending: 'buyerXp.orders.progressPlaced',
    confirmed: 'buyerXp.orders.progressAccepted',
    preparing: 'buyerXp.orders.progressPreparing',
    ready: 'buyerXp.orders.progressReady',
    shipped: 'buyerXp.orders.progressOut',
    delivered: 'buyerXp.orders.progressDelivered',
  }
  for (const k of keys) map[k] = t(labelKey[k])
  return map
})

const parentProgressSteps = computed(() =>
  storeProgressStates(order.value?.status, progressLabels.value),
)

function stepsForSubOrder(so: SubOrderRow) {
  return storeProgressStates(so.status, progressLabels.value)
}

const items = computed(() => {
  const raw = order.value?.items ?? order.value?.order_items
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : []
})

const canCancel = computed(() => {
  const s = String(order.value?.status ?? '').toLowerCase()
  return ['pending', 'confirmed', 'processing'].includes(s)
})

const canReturn = computed(() => {
  const s = String(order.value?.status ?? '').toLowerCase()
  return ['delivered', 'completed', 'shipped'].includes(s)
})

const pointsEarned = computed(() => {
  const n = Number(order.value?.loyalty_points_earned ?? order.value?.points_earned ?? 0)
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0
})

const awaitingPoints = computed(() => {
  if (pointsEarned.value > 0) return false
  const pay = String(order.value?.payment_status ?? '').toLowerCase()
  const mode = String(order.value?.flexible_payment_mode ?? '').toLowerCase()
  if (pay === 'paid') return false
  return mode === 'pay_on_delivery' || mode === 'cash_plus_points' || pay === 'pending' || pay === 'partial'
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

function subOrderLabel(so: SubOrderRow) {
  const name = typeof so.business_name === 'string' ? so.business_name.trim() : ''
  if (name) return name
  const channel = so.channel ? String(so.channel) : 'Store'
  const sid = so.seller_id != null ? `#${so.seller_id}` : ''
  return `${channel}${sid ? ` ${sid}` : ''}`
}

function shouldPoll(): boolean {
  const parent = normalizeStoreStatus(order.value?.status)
  if (['delivered', 'cancelled', 'completed'].includes(parent)) return false
  if (subOrders.value.length) {
    return subOrders.value.some((so) => {
      const s = normalizeStoreStatus(so.status)
      return s !== 'delivered' && s !== 'cancelled'
    })
  }
  return true
}

async function load(silent = false) {
  if (!silent) {
    loading.value = true
    error.value = ''
  }
  const orderId = Number(props.id || route.params.id)
  try {
    const { data } = await ordersUserApi.get(orderId)
    order.value = data as OrderRow
    try {
      const subRes = await ordersUserApi.listSubOrders(orderId)
      const list = subRes.data?.sub_orders
      subOrders.value = Array.isArray(list) ? (list as SubOrderRow[]) : []
    } catch {
      if (!silent) subOrders.value = []
    }
    try {
      const tr = await logisticsBuyerApi.getTracking(orderId)
      tracking.value = (tr.data ?? {}) as Record<string, unknown>
    } catch {
      if (!silent) tracking.value = null
    }
  } catch (e) {
    if (!silent) error.value = formatApiError(e, t('buyerXp.orders.couldNotLoad'))
  } finally {
    if (!silent) loading.value = false
  }
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(() => {
    if (shouldPoll()) void load(true)
    else stopPolling()
  }, 12000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
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

onMounted(async () => {
  await load()
  if (shouldPoll()) startPolling()
})
onUnmounted(stopPolling)
</script>

<style scoped>
.buyer-order-item-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.buyer-order-item-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--buyer-border, #e5e7eb);
  border-radius: 16px;
  background: var(--buyer-card-bg, #fff);
}
.buyer-order-item-card__thumb {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--buyer-muted-bg, #f3f3f3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--buyer-text-muted, #9ca3af);
}
.buyer-order-item-card__info {
  flex: 1;
  min-width: 0;
}
.buyer-order-item-card__title {
  font-weight: 600;
  font-size: 15px;
  margin: 0;
}
.buyer-order-item-card__qty {
  display: inline-block;
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--buyer-primary-light, rgba(37, 99, 235, 0.1));
  color: var(--buyer-primary, #2563eb);
}
.buyer-order-item-card__price {
  font-weight: 700;
  font-size: 15px;
  margin: 0;
  white-space: nowrap;
  align-self: center;
}
</style>
