<template>
  <div class="buyer-xp buyer-xp--wide webcheckout-page">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.checkout.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.checkout.meta') }}</p>
    </header>

    <b-alert v-if="!isAuthenticated" variant="warning" show class="mb-4">
      <p class="mb-3 mb-md-0">{{ t('auth.checkoutSignInPrompt') }}</p>
      <div class="buyer-btn-row">
        <KkooAccountButton variant="primary" size="sm" redirect-from="/checkout" force-sign-in />
      </div>
    </b-alert>

    <section class="buyer-detail-card webcheckout-card">
      <header class="webcheckout-card-head mb-3">
        <div>
          <p class="webcheckout-section-kicker mb-1">{{ t('buyerXp.checkout.deliveryKicker') }}</p>
          <h3 class="webcheckout-section-title mb-0">{{ t('buyerXp.checkout.addressPayment') }}</h3>
          <p v-if="fulfillmentLabel" class="webcheckout-fulfillment small text-muted mb-0 mt-1">
            {{ fulfillmentLabel }}
          </p>
        </div>
        <button
          type="button"
          class="buyer-venue__chip"
          :disabled="loadingAddresses"
          @click="loadAddresses"
        >
          <Icon icon="solar:refresh-bold" /> {{ t('buyerXp.checkout.reload') }}
        </button>
      </header>

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

      <b-form-group v-if="fulfillmentType === 'dine_in'" :label="t('buyerXp.checkout.partySize')" label-for="party-size" class="mb-3">
        <b-form-input
          id="party-size"
          v-model.number="partySize"
          type="number"
          min="1"
          max="200"
          :disabled="!isAuthenticated"
        />
      </b-form-group>

      <b-form-group :label="t('buyerXp.checkout.payment')" label-for="payment" class="mb-3">
        <b-form-select id="payment" v-model="paymentMethod" :options="paymentOptions" :disabled="!isAuthenticated" />
      </b-form-group>

      <p class="small text-muted mb-3">{{ t('buyerXp.checkout.cartSummary', { count: itemCount, total: formattedTotal }) }}</p>

      <div class="buyer-btn-row webcheckout-actions">
        <button
          type="button"
          class="buyer-venue__chip buyer-venue__chip--primary buyer-venue__chip--lg"
          :disabled="!canPlaceOrder"
          @click="placeOrder"
        >
          {{ placingOrder ? t('buyerXp.checkout.placingOrder') : t('buyerXp.checkout.placeOrder') }}
        </button>
      </div>

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
import { addressesApi, ordersUserApi, cartApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useWebCart } from '@/composables/useWebCart'
import { formatApiError } from '@/utils/formatApiError'
import type { AddressPayload } from '@/api/addresses'

type FulfillmentType = 'delivery' | 'pickup' | 'dine_in' | ''

const auth = useAuthStore()
const route = useRoute()
const { t } = useI18n()
const { itemCount, formattedTotal, loadCart } = useWebCart()

const loadingAddresses = ref(false)
const placingOrder = ref(false)
const orderMessage = ref('')
const orderError = ref('')
const addresses = ref<AddressPayload[]>([])
const selectedAddressId = ref<number | null>(null)
const deliveryLocationText = ref('')
const partySize = ref(2)
const paymentMethod = ref('card_on_delivery')

const isAuthenticated = computed(() => auth.isAuthenticated)

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

const canPlaceOrder = computed(() => {
  if (!isAuthenticated.value || placingOrder.value || itemCount.value === 0) return false
  if (needsDeliveryLocation.value) {
    return Boolean(selectedAddressId.value || deliveryLocationText.value.trim())
  }
  if (fulfillmentType.value === 'dine_in') {
    return partySize.value >= 1 && partySize.value <= 200
  }
  return true
})

const paymentOptions = computed(() => [
  { value: 'card_on_delivery', text: t('buyerXp.checkout.cardOnDelivery') },
  { value: 'cash_on_delivery', text: t('buyerXp.checkout.cashOnDelivery') },
])

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

async function placeOrder() {
  orderError.value = ''
  orderMessage.value = ''

  if (!canPlaceOrder.value) {
    if (needsDeliveryLocation.value) {
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

    await ordersUserApi.create(payload)
    orderMessage.value = t('buyerXp.checkout.orderPlaced')
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

onMounted(() => {
  void loadCart()
  void loadAddresses()
})
</script>

<style scoped>
.webcheckout-card {
  padding: 0;
}
.webcheckout-section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--kkoo-primary);
}
.webcheckout-section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--buyer-ink);
}
.webcheckout-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.webcheckout-actions {
  padding-top: 0.25rem;
}
</style>
