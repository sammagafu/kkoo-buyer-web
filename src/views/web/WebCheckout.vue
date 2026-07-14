<template>
  <div class="buyer-xp buyer-xp--wide webcheckout-page">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.checkout.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.checkout.meta') }}</p>
    </header>

    <nav class="webcheckout-steps" :aria-label="t('buyerXp.checkout.checkoutProgressLabel')">
      <ol class="webcheckout-steps__list">
        <li
          v-for="step in checkoutSteps"
          :key="step.id"
          class="webcheckout-steps__item"
          :class="{
            'is-done': stepStatus(step.id) === 'done',
            'is-current': stepStatus(step.id) === 'current',
          }"
        >
          <span class="webcheckout-steps__dot" aria-hidden="true" />
          <span class="webcheckout-steps__label">{{ step.label }}</span>
        </li>
      </ol>
    </nav>

    <b-alert v-if="!isAuthenticated" variant="warning" show class="mb-3">
      <p class="mb-2 mb-md-0">{{ t('auth.checkoutSignInPrompt') }}</p>
      <div class="buyer-btn-row mt-2">
        <KkooAccountButton variant="primary" size="sm" redirect-from="/checkout" force-sign-in />
      </div>
    </b-alert>

    <section class="buyer-detail-card webcheckout-card">
      <div class="webcheckout-block">
        <header class="webcheckout-block__head">
          <h2 class="webcheckout-block__title">{{ t('buyerXp.checkout.deliveryKicker') }}</h2>
          <button
            type="button"
            class="buyer-venue__chip"
            :disabled="loadingAddresses"
            @click="loadAddresses"
          >
            <Icon icon="solar:refresh-bold" /> {{ t('buyerXp.checkout.reload') }}
          </button>
        </header>
        <p v-if="fulfillmentLabel" class="webcheckout-block__meta">{{ fulfillmentLabel }}</p>

        <p v-if="loadingAddresses" class="text-muted small mb-3">{{ t('buyerXp.checkout.loadingAddresses') }}</p>

        <b-form-group v-if="addressOptions.length" :label="t('buyerXp.checkout.savedAddress')" label-for="address" class="mb-3">
          <b-form-select
            id="address"
            v-model="selectedAddressId"
            :options="addressSelectOptions"
            :disabled="!isAuthenticated"
          />
        </b-form-group>

        <b-form-group
          v-if="needsDeliveryLocation"
          :label="addressOptions.length ? t('buyerXp.checkout.orDeliveryLocation') : t('buyerXp.checkout.deliveryLocation')"
          label-for="delivery-text"
          class="mb-3"
        >
          <b-form-input
            id="delivery-text"
            v-model="deliveryLocationText"
            type="text"
            :placeholder="t('buyerXp.checkout.deliveryPlaceholder')"
            :disabled="!isAuthenticated"
          />
        </b-form-group>

        <b-form-group v-if="fulfillmentType === 'dine_in'" :label="t('buyerXp.checkout.partySize')" label-for="party-size" class="mb-0">
          <b-form-input
            id="party-size"
            v-model.number="partySize"
            type="number"
            min="1"
            max="200"
            :disabled="!isAuthenticated"
          />
        </b-form-group>
      </div>

      <div v-if="needsRx" class="webcheckout-block">
        <b-alert variant="info" show class="mb-3">
          <p class="mb-2 fw-semibold">{{ t('buyerXp.checkout.rxRequired') }}</p>
          <p class="mb-0 small">{{ t('buyerXp.checkout.rxHint') }}</p>
        </b-alert>
        <b-form-group :label="t('buyerXp.checkout.uploadRx')" class="mb-0">
          <div class="buyer-btn-row">
            <label class="buyer-venue__chip mb-0" :class="{ 'opacity-50': uploadingRx || !isAuthenticated }">
              <Icon icon="solar:camera-add-bold" class="me-1" />
              {{ uploadingRx ? t('buyerXp.checkout.uploadingRx') : t('buyerXp.checkout.uploadRx') }}
              <input
                type="file"
                accept="image/*,.pdf"
                class="d-none"
                :disabled="uploadingRx || !isAuthenticated"
                @change="onRxFile"
              />
            </label>
          </div>
          <p v-if="prescriptionIds.length" class="small text-success mb-0 mt-2">
            {{ t('buyerXp.checkout.rxAttached', { count: prescriptionIds.length }) }}
          </p>
        </b-form-group>
      </div>

      <div class="webcheckout-block">
        <h2 class="webcheckout-block__title mb-3">{{ t('buyerXp.checkout.payment') }}</h2>
        <p v-if="paymentMethodsLoading" class="text-muted small mb-2">{{ t('buyerXp.checkout.loadingPayments') }}</p>
        <b-form-select
          v-else
          id="payment"
          v-model="paymentMethod"
          :options="paymentSelectOptions"
          :disabled="!isAuthenticated || paymentSelectOptions.length === 0"
        />
      </div>

      <div class="webcheckout-block webcheckout-block--muted">
        <button
          type="button"
          class="webcheckout-extras-toggle"
          :aria-expanded="showExtras"
          @click="showExtras = !showExtras"
        >
          <span>{{ showExtras ? t('buyerXp.checkout.hideExtras') : t('buyerXp.checkout.showExtras') }}</span>
          <Icon :icon="showExtras ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'" aria-hidden="true" />
        </button>
        <div v-if="showExtras" class="webcheckout-extras">
          <b-form-group :label="t('buyerXp.checkout.giftVoucher')" label-for="gift-voucher" class="mb-3">
            <b-form-input
              id="gift-voucher"
              v-model="giftVoucherCode"
              type="text"
              :placeholder="t('buyerXp.checkout.giftVoucherPlaceholder')"
              :disabled="!isAuthenticated"
            />
          </b-form-group>
          <b-form-checkbox
            v-if="loyaltyPointsAvailable"
            v-model="useLoyaltyPoints"
            class="mb-2"
            :disabled="!isAuthenticated"
          >
            {{ t('buyerXp.checkout.useLoyaltyPoints', { points: loyaltyBalance }) }}
          </b-form-checkbox>
          <p v-if="loyaltyPointsAvailable" class="small text-muted mb-0">
            {{ t('buyerXp.checkout.loyaltyPolicyNote') }}
          </p>
        </div>
      </div>

      <footer class="webcheckout-footer">
        <div class="webcheckout-footer__summary">
          <span class="webcheckout-footer__count">{{ t('buyerXp.checkout.itemsCount', { count: itemCount }) }}</span>
          <strong class="webcheckout-footer__total">{{ formattedTotal }}</strong>
        </div>
        <button
          type="button"
          class="buyer-venue__chip buyer-venue__chip--primary buyer-venue__chip--lg webcheckout-footer__cta"
          :disabled="!canPlaceOrder"
          @click="placeOrder"
        >
          {{ placingOrder ? t('buyerXp.checkout.placingOrder') : t('buyerXp.checkout.placeOrder') }}
        </button>
      </footer>

      <p v-if="orderMessage" class="buyer-xp-toast buyer-xp-toast--ok mt-2 mb-0">{{ orderMessage }}</p>
      <p v-if="orderError" class="buyer-xp-toast buyer-xp-toast--err mt-2 mb-0">{{ orderError }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { addressesApi, ordersUserApi, cartApi, paymentsApi } from '@/api'
import { rewardsUserApi } from '@/api/rewards'
import { pharmacyApi } from '@/api/pharmacy'
import type { PaymentMethodRow } from '@/api/payments'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useWebCart } from '@/composables/useWebCart'
import { formatApiError } from '@/utils/formatApiError'
import type { AddressPayload } from '@/api/addresses'

type FulfillmentType = 'delivery' | 'pickup' | 'dine_in' | ''

const auth = useAuthStore()
const route = useRoute()
const { t } = useI18n()
const { itemCount, formattedTotal, loadCart, cartItems } = useWebCart()

const loadingAddresses = ref(false)
const placingOrder = ref(false)
const uploadingRx = ref(false)
const paymentMethodsLoading = ref(false)
const orderMessage = ref('')
const orderError = ref('')
const addresses = ref<AddressPayload[]>([])
const selectedAddressId = ref<number | null>(null)
const deliveryLocationText = ref('')
const partySize = ref(2)
const paymentMethod = ref('selcom')
const paymentMethods = ref<PaymentMethodRow[]>([])
const prescriptionIds = ref<number[]>([])
const giftVoucherCode = ref('')
const useLoyaltyPoints = ref(false)
const loyaltyBalance = ref(0)
const maxLoyaltyPoints = ref(0)
const loyaltyLoading = ref(false)
const showExtras = ref(false)

const isAuthenticated = computed(() => auth.isAuthenticated)

const needsRx = computed(() => cartItems.value.some((i) => i.requiresPrescription))

const loyaltyPointsAvailable = computed(
  () => isAuthenticated.value && loyaltyBalance.value >= 100 && maxLoyaltyPoints.value >= 100,
)

function checkoutVertical(): string {
  const path = route.path.toLowerCase()
  if (path.includes('/pharmacy') || needsRx.value) return 'pharmacy'
  if (path.includes('/eats') || path.includes('/restaurant')) return 'food'
  if (path.includes('/grocery')) return 'grocery'
  return 'marketplace'
}

async function loadLoyalty() {
  if (!isAuthenticated.value) return
  loyaltyLoading.value = true
  try {
    const { data } = await rewardsUserApi.getBalance()
    loyaltyBalance.value = Math.round(data?.available_balance ?? data?.total_balance ?? 0)
    await refreshLoyaltyQuote()
  } catch {
    loyaltyBalance.value = Math.round(auth.user?.loyalty_points_balance ?? 0)
  } finally {
    loyaltyLoading.value = false
  }
}

async function refreshLoyaltyQuote() {
  if (!isAuthenticated.value || loyaltyBalance.value < 100) {
    maxLoyaltyPoints.value = 0
    return
  }
  const subtotal = cartItems.value.reduce((sum, item) => {
    if (item.total_price != null) return sum + Number(item.total_price)
    const price = Number(item.product?.base_price ?? item.product?.price ?? 0)
    return sum + price * Number(item.quantity ?? 1)
  }, 0)
  if (subtotal <= 0) {
    maxLoyaltyPoints.value = 0
    return
  }
  try {
    const { data } = await rewardsUserApi.quoteRedemption({
      vertical: checkoutVertical(),
      subtotal,
      fees: 0,
    })
    if (data?.eligible) {
      maxLoyaltyPoints.value = Math.floor(Number(data.max_points_usable ?? 0))
    } else {
      maxLoyaltyPoints.value = 0
    }
  } catch {
    maxLoyaltyPoints.value = loyaltyBalance.value
  }
}

const fulfillmentType = computed<FulfillmentType>(() => {
  const raw = String(route.query.fulfillment || '').toLowerCase()
  if (raw === 'delivery' || raw === 'pickup' || raw === 'dine_in') return raw
  return ''
})

const needsDeliveryLocation = computed(() => fulfillmentType.value === 'delivery')

const fulfillmentLabel = computed(() => {
  switch (fulfillmentType.value) {
    case 'delivery':
      return t('buyerXp.checkout.fulfillmentDelivery')
    case 'pickup':
      return t('buyerXp.checkout.fulfillmentPickup')
    case 'dine_in':
      return t('buyerXp.checkout.fulfillmentDineIn')
    default:
      return ''
  }
})

const addressOptions = computed(() =>
  addresses.value
    .filter((a) => a.id != null)
    .map((a) => ({
      value: a.id as number,
      text: [a.street, a.district, a.region].filter(Boolean).join(', ') || 'Address',
    })),
)

const addressSelectOptions = computed(() => [
  { value: null, text: needsDeliveryLocation.value ? 'Choose a saved address (optional)' : 'No saved address' },
  ...addressOptions.value,
])

const paymentSelectOptions = computed(() =>
  paymentMethods.value
    .filter((m) => m.is_enabled !== false)
    .map((m, i) => ({
      value: m.code,
      text:
        i === 0
          ? `${m.label || m.code} · ${t('buyerXp.checkout.paymentRecommended')}`
          : m.label || m.code,
    })),
)

const selectedPaymentMethod = computed(() =>
  paymentMethods.value.find((m) => m.code === paymentMethod.value),
)

const canPlaceOrder = computed(() => {
  if (!isAuthenticated.value || placingOrder.value || itemCount.value === 0) return false
  if (needsRx.value && prescriptionIds.value.length === 0) return false
  if (needsDeliveryLocation.value) {
    return Boolean(selectedAddressId.value || deliveryLocationText.value.trim())
  }
  if (fulfillmentType.value === 'dine_in') {
    return partySize.value >= 1 && partySize.value <= 200
  }
  return paymentSelectOptions.value.length > 0
})

const deliveryReady = computed(() => {
  if (needsDeliveryLocation.value) {
    return Boolean(selectedAddressId.value || deliveryLocationText.value.trim())
  }
  if (fulfillmentType.value === 'dine_in') {
    return partySize.value >= 1
  }
  return true
})

const checkoutSteps = computed(() => [
  { id: 'cart' as const, label: t('buyerXp.checkout.stepCart') },
  { id: 'delivery' as const, label: t('buyerXp.checkout.stepDelivery') },
  { id: 'pay' as const, label: t('buyerXp.checkout.stepPay') },
])

type StepId = 'cart' | 'delivery' | 'pay'

function stepStatus(id: StepId): 'done' | 'current' | 'todo' {
  const cartDone = itemCount.value > 0
  const deliveryDone = cartDone && isAuthenticated.value && deliveryReady.value
  const payDone = canPlaceOrder.value

  if (id === 'cart') {
    if (cartDone && (deliveryDone || !isAuthenticated.value)) return 'done'
    return cartDone ? 'done' : 'current'
  }
  if (id === 'delivery') {
    if (deliveryDone) return 'done'
    if (cartDone) return 'current'
    return 'todo'
  }
  if (payDone) return 'done'
  if (deliveryDone || (cartDone && isAuthenticated.value && !needsDeliveryLocation.value)) return 'current'
  return 'todo'
}

async function loadAddresses() {
  loadingAddresses.value = true
  orderError.value = ''
  try {
    const { data } = await addressesApi.list()
    addresses.value = (data?.results as AddressPayload[]) ?? []
    const defaultAddr = addresses.value.find((a) => a.is_default) ?? addresses.value[0]
    selectedAddressId.value = defaultAddr?.id ?? null
  } catch (e: unknown) {
    orderError.value = formatApiError(e, 'Could not load addresses.')
  } finally {
    loadingAddresses.value = false
  }
}

async function loadPaymentMethods() {
  if (!isAuthenticated.value) return
  paymentMethodsLoading.value = true
  try {
    const { data } = await paymentsApi.listMethods({ country_code: 'TZ' })
    const rows = (data?.results ?? []).filter((m) => m.is_enabled !== false)
    paymentMethods.value = rows.length
      ? rows
      : [
          { code: 'selcom', label: 'Pay online (M-Pesa / Card)', kind: 'online', provider: 'selcom', is_enabled: true },
          { code: 'pay_on_delivery', label: t('buyerXp.checkout.payOnDelivery'), kind: 'offline', is_enabled: true },
          { code: 'cash', label: t('buyerXp.checkout.cashOnDelivery'), kind: 'offline', is_enabled: true },
        ]
    const preferred =
      paymentMethods.value.find((m) => m.code === 'selcom' && m.is_enabled !== false) ??
      paymentMethods.value.find((m) => (m.provider === 'selcom' || m.kind === 'online') && m.is_enabled !== false) ??
      paymentMethods.value[0]
    if (preferred?.code) {
      paymentMethods.value = [
        preferred,
        ...paymentMethods.value.filter((m) => m.code !== preferred.code),
      ]
      paymentMethod.value = preferred.code
    }
  } catch {
    paymentMethods.value = [
      { code: 'selcom', label: 'Pay online (M-Pesa / Card)', kind: 'online', provider: 'selcom', is_enabled: true },
      { code: 'pay_on_delivery', label: t('buyerXp.checkout.payOnDelivery'), kind: 'offline', is_enabled: true },
      { code: 'cash', label: t('buyerXp.checkout.cashOnDelivery'), kind: 'offline', is_enabled: true },
    ]
    paymentMethod.value = 'selcom'
  } finally {
    paymentMethodsLoading.value = false
  }
}

async function onRxFile(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingRx.value = true
  orderError.value = ''
  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await pharmacyApi.uploadPrescription(formData)
    if (data?.id) prescriptionIds.value = [...prescriptionIds.value, data.id]
  } catch (e: unknown) {
    orderError.value = formatApiError(e, 'Could not upload prescription.')
  } finally {
    uploadingRx.value = false
    input.value = ''
  }
}

async function placeOrder() {
  orderError.value = ''
  orderMessage.value = ''

  if (!canPlaceOrder.value) {
    if (needsRx.value && prescriptionIds.value.length === 0) {
      orderError.value = 'Upload a valid prescription for Rx medicines.'
    } else if (needsDeliveryLocation.value) {
      orderError.value = 'Add a saved address or type a delivery location.'
    } else if (fulfillmentType.value === 'dine_in') {
      orderError.value = 'Enter a valid party size (1–200).'
    } else if (itemCount.value === 0) {
      orderError.value = 'Your cart is empty.'
    }
    return
  }

  placingOrder.value = true
  try {
    const payload: Parameters<typeof ordersUserApi.create>[0] = {
      payment_method: paymentMethod.value,
      idempotency_key: crypto.randomUUID(),
    }

    if (selectedAddressId.value) {
      payload.delivery_address_id = selectedAddressId.value
    } else if (deliveryLocationText.value.trim()) {
      payload.delivery_location_text = deliveryLocationText.value.trim()
    }

    if (fulfillmentType.value) {
      payload.fulfillment_type = fulfillmentType.value
    }
    if (fulfillmentType.value === 'dine_in') {
      payload.party_size = partySize.value
    }

    if (giftVoucherCode.value.trim()) {
      payload.gift_voucher_code = giftVoucherCode.value.trim()
    }
    if (useLoyaltyPoints.value && maxLoyaltyPoints.value > 0) {
      payload.use_loyalty_points = maxLoyaltyPoints.value
    }
    if (prescriptionIds.value.length) {
      payload.prescription_ids = [...prescriptionIds.value]
    }

    const { data: order } = await ordersUserApi.create(payload)

    const method = selectedPaymentMethod.value
    if (method?.kind === 'online' && method.is_enabled !== false) {
      const orderRef =
        (order as { id?: number })?.id ??
        (order as { order_number?: string })?.order_number
      if (orderRef != null) {
        try {
          const { data: pay } = await paymentsApi.initiateSelcom(orderRef)
          if (pay?.payment_gateway_url) {
            window.location.href = pay.payment_gateway_url
            return
          }
        } catch {
          orderMessage.value = t('buyerXp.checkout.orderPlaced') + ' Online payment could not start — pay on delivery if offered.'
          await cartApi.clear()
          await loadCart()
          return
        }
      }
    }

    orderMessage.value = t('buyerXp.checkout.orderPlaced')
    prescriptionIds.value = []
    giftVoucherCode.value = ''
    useLoyaltyPoints.value = false
    await cartApi.clear()
    await loadCart()
    deliveryLocationText.value = ''
  } catch (e: unknown) {
    orderError.value = formatApiError(e, t('buyerXp.checkout.couldNotPlace'))
  } finally {
    placingOrder.value = false
  }
}

watch(selectedAddressId, (id) => {
  if (id != null) deliveryLocationText.value = ''
})

watch(cartItems, () => {
  void refreshLoyaltyQuote()
}, { deep: true })

watch(isAuthenticated, (authed) => {
  if (authed) void loadLoyalty()
})

onMounted(() => {
  void loadCart().then(() => refreshLoyaltyQuote())
  void loadAddresses()
  void loadPaymentMethods()
  void loadLoyalty()
})
</script>

<style scoped>
.webcheckout-steps {
  margin: 0 0 1.1rem;
}

.webcheckout-steps__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.35rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.webcheckout-steps__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  position: relative;
  text-align: center;
}

.webcheckout-steps__item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 0.4rem;
  left: calc(50% + 0.55rem);
  width: calc(100% - 1.1rem);
  height: 2px;
  background: rgba(92, 48, 143, 0.14);
}

.webcheckout-steps__item.is-done:not(:last-child)::after,
.webcheckout-steps__item.is-current:not(:last-child)::after {
  background: var(--kkoo-secondary, #f7a829);
}

.webcheckout-steps__dot {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  background: rgba(92, 48, 143, 0.14);
  border: 2px solid transparent;
  z-index: 1;
}

.webcheckout-steps__item.is-done .webcheckout-steps__dot {
  background: var(--kkoo-secondary, #f7a829);
}

.webcheckout-steps__item.is-current .webcheckout-steps__dot {
  background: var(--kkoo-primary, #5c308f);
  box-shadow: 0 0 0 3px rgba(92, 48, 143, 0.16);
}

.webcheckout-steps__label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--buyer-muted, #6a4c86);
}

.webcheckout-steps__item.is-done .webcheckout-steps__label,
.webcheckout-steps__item.is-current .webcheckout-steps__label {
  color: var(--buyer-ink, #3b1a5a);
}

.webcheckout-card {
  padding: 0;
  overflow: hidden;
}

.webcheckout-block {
  padding: 1.1rem 1.15rem;
  border-bottom: 1px solid rgba(92, 48, 143, 0.1);
}

.webcheckout-block--muted {
  background: rgba(92, 48, 143, 0.03);
}

.webcheckout-block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.webcheckout-block__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--buyer-ink);
}

.webcheckout-block__meta {
  margin: 0 0 0.85rem;
  font-size: 0.82rem;
  color: var(--buyer-muted, #6a4c86);
}

.webcheckout-extras-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--kkoo-primary, #5c308f);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.webcheckout-extras {
  margin-top: 0.85rem;
}

.webcheckout-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 1rem 1.15rem 1.15rem;
  background: rgba(248, 242, 236, 0.65);
}

.webcheckout-footer__summary {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.webcheckout-footer__count {
  font-size: 0.78rem;
  color: var(--buyer-muted, #6a4c86);
}

.webcheckout-footer__total {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--buyer-ink, #3b1a5a);
}

.webcheckout-footer__cta {
  margin-left: auto;
}

@media (max-width: 575px) {
  .webcheckout-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .webcheckout-footer__cta {
    margin-left: 0;
    width: 100%;
  }
}
</style>
