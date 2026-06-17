<template>
  <div class="buyer-ride">
    <header class="buyer-ride-hero">
      <p class="buyer-ride-hero__kicker">{{ t('buyerXp.ride.overline') }}</p>
      <h1 class="buyer-ride-hero__title">{{ t('buyerXp.ride.title') }}</h1>
      <div class="buyer-ride-steps" aria-hidden="true">
        <span class="buyer-ride-step buyer-ride-step--active">{{ t('buyerXp.ride.stepWhere') }}</span>
        <span class="buyer-ride-step" :class="{ 'buyer-ride-step--active': form.pickup_address && form.dropoff_address }">
          {{ t('buyerXp.ride.stepRide') }}
        </span>
        <span class="buyer-ride-step" :class="{ 'buyer-ride-step--active': rideMessage }">{{ t('buyerXp.ride.stepGo') }}</span>
      </div>
    </header>

    <div class="buyer-ride-card">
      <div class="buyer-ride-route">
        <div class="buyer-ride-field">
          <label for="pickup">{{ t('buyerXp.ride.pickup') }}</label>
          <input
            id="pickup"
            v-model="form.pickup_address"
            type="text"
            required
            :placeholder="t('buyerXp.ride.pickupPlaceholder')"
            autocomplete="street-address"
          />
        </div>
        <button type="button" class="buyer-ride-swap" :aria-label="t('buyerXp.ride.swap')" @click="swapAddresses">
          <Icon icon="solar:transfer-vertical-bold" />
        </button>
        <div class="buyer-ride-field">
          <label for="dropoff">{{ t('buyerXp.ride.dropoff') }}</label>
          <input
            id="dropoff"
            v-model="form.dropoff_address"
            type="text"
            required
            :placeholder="t('buyerXp.ride.dropoffPlaceholder')"
            autocomplete="street-address"
          />
        </div>
      </div>
    </div>

    <div class="buyer-ride-card">
      <p class="buyer-section-head__overline mb-2">{{ t('buyerXp.ride.vehicle') }}</p>
      <div class="buyer-ride-vehicles" role="radiogroup" :aria-label="t('buyerXp.ride.vehicle')">
        <button
          v-for="v in vehicles"
          :key="v.id"
          type="button"
          class="buyer-ride-vehicle"
          :class="{ 'buyer-ride-vehicle--active': form.vehicle_type === v.id }"
          @click="form.vehicle_type = v.id"
        >
          <Icon :icon="v.icon" class="buyer-ride-vehicle__icon" aria-hidden="true" />
          {{ v.label }}
        </button>
      </div>
    </div>

    <div class="buyer-ride-card">
      <div class="buyer-ride-field">
        <label for="notes">{{ t('buyerXp.ride.notes') }}</label>
        <textarea
          id="notes"
          v-model="form.rider_notes"
          rows="2"
          :placeholder="t('buyerXp.ride.notesPlaceholder')"
        />
      </div>
      <div class="buyer-ride-field mt-2">
        <label for="payment">{{ t('buyerXp.ride.payment') }}</label>
        <select id="payment" v-model="form.payment_method">
          <option value="cash">{{ t('buyerXp.ride.cash') }}</option>
          <option value="card">{{ t('buyerXp.ride.card') }}</option>
          <option value="wallet">{{ t('buyerXp.ride.wallet') }}</option>
        </select>
      </div>
    </div>

    <div v-if="estimatedFare != null" class="buyer-ride-fare">
      <span class="buyer-ride-fare__label">{{ t('buyerXp.ride.estimatedFare') }}</span>
      <strong class="buyer-ride-fare__amount">{{ formatPrice(estimatedFare) }}</strong>
    </div>

    <p v-if="rideMessage" class="buyer-ride-msg buyer-ride-msg--ok">{{ rideMessage }}</p>
    <p v-if="rideError" class="buyer-ride-msg buyer-ride-msg--err">{{ rideError }}</p>

    <div class="buyer-ride-bar">
      <button
        type="button"
        class="buyer-ride-bar__btn"
        :disabled="submitting || !form.pickup_address || !form.dropoff_address"
        @click="submit"
      >
        <Icon icon="solar:scooter-bold" aria-hidden="true" />
        {{ submitting ? t('buyerXp.ride.requesting') : t('buyerXp.ride.requestRide') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ridesApi, type RideRequestPayload } from '@/api/rides'

const route = useRoute()
const { t } = useI18n()

const form = reactive<RideRequestPayload>({
  pickup_address: '',
  dropoff_address: '',
  rider_notes: '',
  vehicle_type: 'boda',
  payment_method: 'cash',
})

const vehicles = computed(() => [
  { id: 'boda', label: t('buyerXp.ride.boda'), icon: 'solar:scooter-bold' },
  { id: 'bajaj', label: t('buyerXp.ride.bajaj'), icon: 'solar:bus-bold' },
  { id: 'car', label: t('buyerXp.ride.car'), icon: 'solar:car-bold' },
])

const submitting = ref(false)
const rideMessage = ref('')
const rideError = ref('')
const estimatedFare = ref<number | null>(null)

// Dar es Salaam fallback coords for quote when only addresses typed
const FALLBACK_PICKUP = { lat: -6.8172, lng: 39.2833 }
const FALLBACK_DROPOFF = { lat: -6.7924, lng: 39.2083 }

function formatPrice(val: number) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function swapAddresses() {
  const p = form.pickup_address
  form.pickup_address = form.dropoff_address
  form.dropoff_address = p
}

async function refreshQuote() {
  if (!form.pickup_address || !form.dropoff_address) {
    estimatedFare.value = null
    return
  }
  try {
    const { data } = await ridesApi.getQuote({
      pickup_lat: FALLBACK_PICKUP.lat,
      pickup_lng: FALLBACK_PICKUP.lng,
      dropoff_lat: FALLBACK_DROPOFF.lat,
      dropoff_lng: FALLBACK_DROPOFF.lng,
      vehicle_type: form.vehicle_type,
    })
    const fee = (data as { total_fee?: number })?.total_fee
    if (typeof fee === 'number') estimatedFare.value = fee
  } catch {
    estimatedFare.value = null
  }
}

async function submit() {
  rideMessage.value = ''
  rideError.value = ''
  submitting.value = true
  try {
    const { data } = await ridesApi.requestRide(form)
    rideMessage.value = data?.message ?? 'Ride requested. A driver will be assigned shortly.'
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string; error?: string } } }
    rideError.value = err.response?.data?.detail ?? err.response?.data?.error ?? 'Could not send ride request.'
  } finally {
    submitting.value = false
  }
}

watch(
  () => [form.pickup_address, form.dropoff_address, form.vehicle_type] as const,
  () => void refreshQuote(),
)

onMounted(() => {
  const pickup = String(route.query.pickup ?? '').trim()
  const dropoff = String(route.query.dropoff ?? '').trim()
  const notes = String(route.query.notes ?? route.query.rider_notes ?? '').trim()
  const vehicle = String(route.query.vehicle_type ?? route.query.vehicle ?? '').trim()
  if (pickup) form.pickup_address = pickup
  if (dropoff) form.dropoff_address = dropoff
  if (notes) form.rider_notes = notes
  if (vehicle === 'boda' || vehicle === 'bajaj' || vehicle === 'car' || vehicle === 'bike') {
    form.vehicle_type = vehicle === 'bike' ? 'boda' : vehicle
  }
  void refreshQuote()
})
</script>
