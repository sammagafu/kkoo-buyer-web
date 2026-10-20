<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <div class="buyer-page-head__copy">
          <h1 class="buyer-page-head__title">{{ t('buyerXp.payments.title') }}</h1>
          <p class="buyer-page-head__meta">{{ t('buyerXp.payments.meta') }}</p>
        </div>
        <div class="buyer-btn-row buyer-page-head__actions">
          <button type="button" class="buyer-venue__chip" :disabled="loading" @click="load">
            {{ loading ? t('buyerXp.common.refreshing') : t('buyerXp.common.refresh') }}
          </button>
        </div>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.payments.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="rows.length" class="buyer-orders-list">
      <article v-for="row in rows" :key="row.id" class="buyer-order-card-v2">
        <div class="buyer-order-card-v2__body">
          <div class="buyer-order-card-v2__thumb" aria-hidden="true">
            <Icon :icon="typeIcon(row.payment_type)" />
          </div>
          <div class="buyer-order-card-v2__info">
            <div class="buyer-order-card-v2__info-top">
              <p class="buyer-order-card-v2__title">{{ typeLabel(row.payment_type) }}</p>
            </div>
            <p class="buyer-order-card-v2__variant">{{ row.payment_ref }}</p>
            <p v-if="summaryLine(row)" class="buyer-order-card-v2__variant">{{ summaryLine(row) }}</p>
            <p class="buyer-order-card-v2__price">{{ formatBuyerMoney(row.amount) }}</p>
          </div>
        </div>
        <div class="buyer-order-card-v2__foot">
          <div class="buyer-order-card-v2__total">
            <span class="buyer-order-card-v2__total-label">{{ formatWhen(row.created_at) }}</span>
            <strong>{{ whatsappLabel(row.whatsapp_status) }}</strong>
          </div>
          <div class="buyer-order-card-v2__actions">
            <button
              v-if="row.whatsapp_status !== 'sent'"
              type="button"
              class="buyer-venue__chip buyer-venue__chip--primary"
              :disabled="sendingId === row.id"
              @click="sendWhatsApp(row)"
            >
              {{ sendingId === row.id ? t('buyerXp.payments.sending') : t('buyerXp.payments.sendWhatsApp') }}
            </button>
            <span v-else class="buyer-order-card-v2__status">{{ t('buyerXp.payments.whatsappSent') }}</span>
          </div>
        </div>
      </article>
    </section>

    <BuyerEmptyState
      v-else
      icon="solar:bill-list-bold"
      :title="t('buyerXp.payments.emptyTitle')"
      :message="t('buyerXp.payments.emptyMessage')"
    />
    <p v-if="sendError" class="buyer-xp-toast buyer-xp-toast--err">{{ sendError }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { paymentsApi, type PaymentReceiptRow } from '@/api/payments'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerMoney } from '@/utils/buyerFormat'

const { t } = useI18n()
const rows = ref<PaymentReceiptRow[]>([])
const loading = ref(false)
const error = ref('')
const sendError = ref('')
const sendingId = ref<number | null>(null)

function typeLabel(type?: string) {
  const key = `buyerXp.payments.types.${type || 'order'}`
  const label = t(key)
  return label === key ? type || t('buyerXp.payments.types.order') : label
}

function typeIcon(type?: string) {
  switch (type) {
    case 'ride':
      return 'solar:scooter-bold'
    case 'buy_for_me':
      return 'solar:bag-heart-bold'
    case 'hotel_reservation':
      return 'solar:bed-bold'
    case 'event_ticket':
      return 'solar:ticket-bold'
    case 'table_reservation':
      return 'solar:calendar-bold'
    default:
      return 'solar:bag-check-bold'
  }
}

function whatsappLabel(status?: string) {
  if (status === 'sent') return t('buyerXp.payments.whatsappSent')
  if (status === 'failed') return t('buyerXp.payments.whatsappFailed')
  return t('buyerXp.payments.whatsappPending')
}

function summaryLine(row: PaymentReceiptRow) {
  const raw = row.summary_json
  const summary = typeof raw === 'string' ? parseSummary(raw) : raw
  if (!summary) return ''
  const title = stringField(summary, 'title')
  if (title) return title
  const orderNumber = stringField(summary, 'order_number')
  if (orderNumber) return orderNumber
  const pickup = stringField(summary, 'pickup')
  const dropoff = stringField(summary, 'dropoff')
  if (pickup && dropoff) return `${pickup} → ${dropoff}`
  return ''
}

function parseSummary(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function stringField(summary: Record<string, unknown>, key: string) {
  const value = summary[key]
  return typeof value === 'string' ? value.trim() : ''
}

function formatWhen(iso?: string) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await paymentsApi.listReceipts()
    rows.value = data.results ?? []
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.payments.couldNotLoad'))
    rows.value = []
  } finally {
    loading.value = false
  }
}

async function sendWhatsApp(row: PaymentReceiptRow) {
  sendingId.value = row.id
  sendError.value = ''
  try {
    const { data } = await paymentsApi.resendReceiptWhatsApp(row.id)
    row.whatsapp_status = data.whatsapp_status || row.whatsapp_status
  } catch (e) {
    sendError.value = formatApiError(e, t('buyerXp.payments.couldNotSend'))
  } finally {
    sendingId.value = null
  }
}

onMounted(load)
</script>
