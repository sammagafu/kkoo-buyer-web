<template>
  <MarketingLayout>
    <section class="lp-section webcheckout-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="webcheckout-head">
          <div>
            <p class="webcheckout-kicker">Web checkout beta</p>
            <h1 class="webcheckout-title">Cart, address, and payment on the web.</h1>
            <p class="webcheckout-copy">
              Signed-in users can review their cart, adjust quantities, pick an address, and place an order without
              switching to mobile. Rides and delivery still follow the same order flow.
            </p>
          </div>
          <div class="webcheckout-summary">
            <p class="mb-2 fw-semibold">Cart summary</p>
            <p class="mb-1 small text-muted">Items: {{ cartItems.length }}</p>
            <p class="mb-1 small text-muted">Estimated total: {{ formattedTotal }}</p>
            <RouterLink :to="{ name: 'web.checkout' }" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm">
              <span class="lp-btn-pill__label">Refresh cart</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:refresh-bold" class="lp-btn-pill__icon" />
              </span>
            </RouterLink>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <b-alert v-if="!isAuthenticated" variant="warning" show class="mb-4 webcheckout-auth-alert">
          <p class="mb-3 mb-md-0">Sign in with your KKOO Account to place web orders — same phone number as the app.</p>
          <KkooAccountButton variant="primary" size="sm" redirect-from="/checkout" force-sign-in />
        </b-alert>

        <div class="webcheckout-grid">
          <b-card class="webcheckout-card">
            <header class="webcheckout-card-head">
              <div>
                <p class="webcheckout-section-kicker mb-1">Cart</p>
                <h3 class="webcheckout-section-title">Your items</h3>
              </div>
              <b-button size="sm" variant="outline-primary" @click="loadCart" :disabled="loadingCart">
                <Icon icon="solar:refresh-bold" /> Reload
              </b-button>
            </header>
            <p v-if="loadingCart" class="text-muted small mb-3">Loading cart…</p>
            <p v-else-if="cartItems.length === 0" class="text-muted mb-3">Cart is empty. Add items from any microsite and return here.</p>
            <div v-else class="cart-list">
              <article v-for="item in cartItems" :key="itemKey(item)" class="cart-line">
                <div class="cart-line-main">
                  <p class="cart-line-title mb-1">{{ item.product?.title || 'Item' }}</p>
                  <p class="cart-line-meta mb-0 text-muted small">
                    {{ formatPrice(item.product?.price ?? item.product?.base_price) }} · Qty {{ item.quantity }}
                  </p>
                </div>
                <div class="cart-line-actions">
                  <div class="cart-qty">
                    <b-button size="sm" variant="outline-secondary" @click="updateQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1 || updating">
                      -
                    </b-button>
                    <span class="cart-qty-value">{{ item.quantity }}</span>
                    <b-button size="sm" variant="outline-secondary" @click="updateQuantity(item, item.quantity + 1)" :disabled="updating">
                      +
                    </b-button>
                  </div>
                  <b-button size="sm" variant="outline-danger" @click="removeItem(item)" :disabled="updating">
                    Remove
                  </b-button>
                </div>
              </article>
            </div>
          </b-card>

          <b-card class="webcheckout-card">
            <header class="webcheckout-card-head">
              <div>
                <p class="webcheckout-section-kicker mb-1">Delivery</p>
                <h3 class="webcheckout-section-title">Address & payment</h3>
              </div>
              <b-button size="sm" variant="outline-secondary" @click="loadAddresses" :disabled="loadingAddresses">
                <Icon icon="solar:refresh-bold" /> Reload
              </b-button>
            </header>
            <p v-if="loadingAddresses" class="text-muted small mb-3">Loading addresses…</p>
            <b-form-group label="Select address" label-for="address" class="mb-3">
              <b-form-select
                id="address"
                v-model="selectedAddressId"
                :options="addressOptions"
                :disabled="!isAuthenticated || addressOptions.length === 0"
              />
              <small class="text-muted d-block mt-1">Use the Addresses section in your account to add more.</small>
            </b-form-group>
            <b-form-group label="Payment method" label-for="payment" class="mb-3">
              <b-form-select
                id="payment"
                v-model="paymentMethod"
                :options="paymentOptions"
                :disabled="!isAuthenticated"
              />
            </b-form-group>
            <b-button
              variant="primary"
              size="lg"
              class="lp-btn-pill lp-btn-pill--primary"
              :disabled="!isAuthenticated || placingOrder || cartItems.length === 0 || !selectedAddressId"
              @click="placeOrder"
            >
              {{ placingOrder ? 'Placing order…' : 'Place order' }}
            </b-button>
            <p v-if="orderMessage" class="text-success small mt-2 mb-0">{{ orderMessage }}</p>
            <p v-if="orderError" class="text-danger small mt-2 mb-0">{{ orderError }}</p>
          </b-card>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { cartApi, addressesApi, ordersUserApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { AddressPayload } from '@/api/addresses'

type CartItem = { id?: number; item_id?: number; quantity: number; product?: { title?: string; price?: number; base_price?: number } }

const auth = useAuthStore()
const loadingCart = ref(false)
const updating = ref(false)
const loadingAddresses = ref(false)
const placingOrder = ref(false)
const orderMessage = ref('')
const orderError = ref('')
const cartItems = ref<CartItem[]>([])
const addresses = ref<AddressPayload[]>([])
const selectedAddressId = ref<number | null>(null)
const paymentMethod = ref('card_on_delivery')

const isAuthenticated = computed(() => auth.isAuthenticated)
const addressOptions = computed(() =>
  addresses.value.map((a, idx) => ({
    value: (a as { id?: number }).id ?? idx,
    text: [a.street, a.district, a.region].filter(Boolean).join(', ') || 'Address',
  }))
)

const paymentOptions = [
  { value: 'card_on_delivery', text: 'Card on delivery' },
  { value: 'cash_on_delivery', text: 'Cash on delivery' },
]

const formattedTotal = computed(() => {
  const total = cartItems.value.reduce((sum, item) => {
    const price = item.product?.price ?? item.product?.base_price ?? 0
    return sum + price * (item.quantity || 1)
  }, 0)
  return formatPrice(total)
})

function formatPrice(val?: number) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function itemKey(item: CartItem) {
  return String(item.id ?? item.item_id ?? Math.random())
}

async function loadCart() {
  loadingCart.value = true
  orderError.value = ''
  try {
    const { data } = await cartApi.get()
    cartItems.value = (data?.items ?? []) as CartItem[]
  } catch (e: any) {
    orderError.value = e?.response?.data?.detail ?? 'Could not load cart.'
  } finally {
    loadingCart.value = false
  }
}

async function updateQuantity(item: CartItem, qty: number) {
  if (!item.id && !item.item_id) return
  if (qty < 1) return
  updating.value = true
  try {
    await cartApi.updateItem(item.id ?? item.item_id!, qty)
    await loadCart()
  } catch (e: any) {
    orderError.value = e?.response?.data?.detail ?? 'Could not update item.'
  } finally {
    updating.value = false
  }
}

async function removeItem(item: CartItem) {
  if (!item.id && !item.item_id) return
  updating.value = true
  try {
    await cartApi.removeItem(item.id ?? item.item_id!)
    await loadCart()
  } catch (e: any) {
    orderError.value = e?.response?.data?.detail ?? 'Could not remove item.'
  } finally {
    updating.value = false
  }
}

async function loadAddresses() {
  loadingAddresses.value = true
  try {
    const { data } = await addressesApi.list()
    addresses.value = (data?.results as AddressPayload[]) ?? []
    selectedAddressId.value = (addresses.value[0] as { id?: number })?.id ?? null
  } catch (e: any) {
    orderError.value = e?.response?.data?.detail ?? 'Could not load addresses.'
  } finally {
    loadingAddresses.value = false
  }
}

async function placeOrder() {
  orderError.value = ''
  orderMessage.value = ''
  if (!selectedAddressId.value) {
    orderError.value = 'Select an address first.'
    return
  }
  placingOrder.value = true
  try {
    await ordersUserApi.create({
      delivery_address_id: selectedAddressId.value,
      payment_method: paymentMethod.value,
    })
    orderMessage.value = 'Order placed. You can follow fulfilment from your account orders list.'
    await cartApi.clear()
    await loadCart()
  } catch (e: any) {
    orderError.value = e?.response?.data?.detail ?? e?.response?.data?.message ?? 'Could not place order.'
  } finally {
    placingOrder.value = false
  }
}

onMounted(() => {
  loadCart()
  if (isAuthenticated.value) loadAddresses()
})
</script>

<style scoped>
.webcheckout-auth-alert {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}
@media (min-width: 768px) {
  .webcheckout-auth-alert {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.webcheckout-hero {
  background:
    radial-gradient(circle at 18% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 80% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.webcheckout-head {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}
@media (min-width: 992px) {
  .webcheckout-head {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 0.8fr);
  }
}
.webcheckout-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.webcheckout-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.06;
  margin: 0.5rem 0 0.75rem;
  max-width: 24ch;
}
.webcheckout-copy {
  max-width: 64ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
.webcheckout-summary {
  border: 1px solid rgba(92, 48, 143, 0.14);
  border-radius: 1.25rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 16px 40px rgba(35, 20, 46, 0.12);
}
.webcheckout-grid {
  display: grid;
  gap: 1rem;
}
@media (min-width: 992px) {
  .webcheckout-grid {
    grid-template-columns: 2fr 1fr;
  }
}
.webcheckout-card {
  border-radius: 1.25rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  box-shadow: 0 14px 36px rgba(35, 20, 46, 0.1);
}
.webcheckout-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.webcheckout-section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.webcheckout-section-title {
  margin: 0;
  font-size: 1.2rem;
}
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.cart-line {
  border: 1px solid rgba(92, 48, 143, 0.1);
  border-radius: 0.9rem;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.96);
}
.cart-line-title {
  font-weight: 700;
}
.cart-line-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.cart-qty {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.cart-qty-value {
  min-width: 1.75rem;
  text-align: center;
  font-weight: 700;
}
</style>
