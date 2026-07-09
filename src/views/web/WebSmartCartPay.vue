<template>
  <div class="buyer-xp buyer-xp--wide smart-cart-pay-page">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">Pay in store</h1>
      <p v-if="session?.business_name" class="buyer-page-head__meta">{{ session.business_name }}</p>
    </header>

    <b-alert v-if="loading" variant="light" show class="mb-4">Loading cart…</b-alert>
    <b-alert v-else-if="loadError" variant="danger" show class="mb-4">{{ loadError }}</b-alert>
    <b-alert v-else-if="paid" variant="success" show class="mb-4">
      Payment successful. You can close this page or show your receipt to staff.
    </b-alert>
    <b-alert v-else-if="expired" variant="warning" show class="mb-4">
      This checkout QR has expired. Ask staff to generate a new one.
    </b-alert>

    <template v-if="session && !paid && !expired">
      <section class="buyer-detail-card mb-4">
        <h2 class="h5 mb-3">Your cart</h2>
        <ul class="list-unstyled mb-3">
          <li
            v-for="item in session.items"
            :key="item.id"
            class="d-flex justify-content-between py-2 border-bottom"
          >
            <span>{{ item.product_name }} × {{ item.quantity }}</span>
            <strong>{{ formatMoney(item.unit_price * item.quantity) }}</strong>
          </li>
        </ul>
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-muted">Total</span>
          <strong class="fs-5">{{ formatMoney(session.subtotal) }}</strong>
        </div>
      </section>

      <b-alert v-if="!isAuthenticated" variant="warning" show class="mb-4">
        <p class="mb-3 mb-md-0">Sign in to pay with your KKOO Wallet.</p>
        <KkooAccountButton variant="primary" size="sm" :redirect-from="redirectFrom" force-sign-in />
      </b-alert>

      <section v-else class="buyer-detail-card">
        <h2 class="h5 mb-3">Payment</h2>
        <p v-if="walletBalance != null" class="small text-muted mb-3">
          Wallet balance: <strong>{{ formatMoney(walletBalance) }}</strong>
        </p>
        <b-form-group label="Payment method" class="mb-3">
          <b-form-select v-model="paymentMethod" :options="paymentOptions" />
        </b-form-group>
        <b-button variant="primary" size="lg" class="w-100" :disabled="paying" @click="pay">
          {{ paying ? 'Processing…' : `Pay ${formatMoney(session.subtotal)}` }}
        </b-button>
        <p v-if="payError" class="text-danger small mt-2 mb-0">{{ payError }}</p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { getPublicSmartCart, paySmartCart, type SmartCartSession } from '@/api/smartCart'
import { getWalletBalance } from '@/api/wallet'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'

const route = useRoute()
const auth = useAuthStore()

const token = computed(() => String(route.params.token ?? ''))
const redirectFrom = computed(() => `/pay/cart/${token.value}`)

const isAuthenticated = computed(() => auth.isAuthenticated)

const session = ref<SmartCartSession | null>(null)
const loading = ref(true)
const loadError = ref('')
const paying = ref(false)
const payError = ref('')
const walletBalance = ref<number | null>(null)
const paymentMethod = ref('wallet')
let pollTimer: ReturnType<typeof setInterval> | null = null

const paymentOptions = [
  { value: 'wallet', text: 'KKOO Wallet' },
  { value: 'selcom', text: 'Mobile money (Selcom)' },
]

const paid = computed(() => session.value?.status === 'paid' || route.query.paid === '1')
const expired = computed(() => session.value?.status === 'expired')

function formatMoney(val: number) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(
    val || 0
  )
}

async function loadCart() {
  if (!token.value) {
    loadError.value = 'Invalid checkout link'
    loading.value = false
    return
  }
  try {
    session.value = await getPublicSmartCart(token.value)
    loadError.value = ''
  } catch (e) {
    loadError.value = formatApiError(e, 'Cart not found')
  } finally {
    loading.value = false
  }
}

async function loadWallet() {
  if (!isAuthenticated.value) return
  try {
    const { wallet } = await getWalletBalance()
    walletBalance.value = wallet.balance
  } catch {
    walletBalance.value = null
  }
}

async function pay() {
  if (!session.value || !token.value) return
  paying.value = true
  payError.value = ''
  try {
    const origin = window.location.origin
    const result = await paySmartCart(token.value, {
      payment_method: paymentMethod.value,
      redirect_url: `${origin}${redirectFrom.value}?paid=1`,
      cancel_url: `${origin}${redirectFrom.value}`,
    })
    if (result.payment_gateway_url) {
      window.location.href = result.payment_gateway_url
      return
    }
    await loadCart()
  } catch (e) {
    payError.value = formatApiError(e, 'Payment failed')
  } finally {
    paying.value = false
  }
}

watch(isAuthenticated, () => {
  void loadWallet()
})

onMounted(async () => {
  await loadCart()
  await loadWallet()
  pollTimer = setInterval(loadCart, 3000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.smart-cart-pay-page {
  max-width: 36rem;
  margin: 0 auto;
}
</style>
