<template>
  <div class="buyer-ride">
    <header class="buyer-ride-hero">
      <p class="buyer-ride-hero__kicker">{{ t('buyerXp.ride.overline') }}</p>
      <h1 class="buyer-ride-hero__title">{{ t('buyerXp.ride.title') }}</h1>
    </header>

    <div class="buyer-ride-card">
      <RidePlaceField
        :id="'pickup'"
        v-model:label="pickup.label"
        v-model:lat="pickup.lat"
        v-model:lng="pickup.lng"
        v-model:map-place-id="pickup.mapPlaceId"
        :title="t('buyerXp.ride.pickup')"
        :placeholder="t('buyerXp.ride.pickupPlaceholder')"
      />
      <button type="button" class="buyer-ride-swap" :aria-label="t('buyerXp.ride.swap')" @click="swapRoute">
        <Icon icon="solar:transfer-vertical-bold" />
      </button>
      <RidePlaceField
        :id="'dropoff'"
        v-model:label="dropoff.label"
        v-model:lat="dropoff.lat"
        v-model:lng="dropoff.lng"
        v-model:map-place-id="dropoff.mapPlaceId"
        :title="t('buyerXp.ride.dropoff')"
        :placeholder="t('buyerXp.ride.dropoffPlaceholder')"
      />
    </div>

    <div class="buyer-ride-card">
      <p class="buyer-section-head__overline mb-2">{{ t('buyerXp.ride.vehicle') }}</p>
      <div class="buyer-ride-vehicles" role="radiogroup">
        <button
          v-for="v in vehicles"
          :key="v.id"
          type="button"
          class="buyer-ride-vehicle"
          :class="{ 'buyer-ride-vehicle--active': vehicleType === v.id }"
          @click="vehicleType = v.id"
        >
          <Icon :icon="v.icon" class="buyer-ride-vehicle__icon" aria-hidden="true" />
          {{ v.label }}
        </button>
      </div>
    </div>

    <div v-if="estimatedFare != null" class="buyer-ride-fare">
      <span class="buyer-ride-fare__label">{{ t('buyerXp.ride.estimatedFare') }}</span>
      <strong class="buyer-ride-fare__amount">{{ formatPrice(estimatedFare) }}</strong>
    </div>

    <p v-if="rideError" class="buyer-ride-msg buyer-ride-msg--err">{{ rideError }}</p>

    <div class="buyer-ride-bar">
      <button
        type="button"
        class="buyer-ride-bar__btn"
        :disabled="submitting || !canBook"
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
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ridesApi } from '@/api/rides'
import RidePlaceField from '@/components/buyer/RidePlaceField.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

type PlacePin = { label: string; lat: number | null; lng: number | null; mapPlaceId: number | null }

const pickup = reactive<PlacePin>({ label: '', lat: null, lng: null, mapPlaceId: null })
const dropoff = reactive<PlacePin>({ label: '', lat: null, lng: null, mapPlaceId: null })
const vehicleType = ref('boda')
const notes = ref('')
const submitting = ref(false)
const rideError = ref('')
const estimatedFare = ref<number | null>(null)

const vehicles = computed(() => [
  { id: 'boda', label: t('buyerXp.ride.boda'), icon: 'solar:scooter-bold' },
  { id: 'bajaj', label: t('buyerXp.ride.bajaj'), icon: 'solar:bus-bold' },
  { id: 'car', label: t('buyerXp.ride.car'), icon: 'solar:car-bold' },
])

const canBook = computed(
  () =>
    pickup.label.trim() &&
    dropoff.label.trim() &&
    pickup.lat != null &&
    pickup.lng != null &&
    dropoff.lat != null &&
    dropoff.lng != null &&
    estimatedFare.value != null &&
    estimatedFare.value > 0,
)

function formatPrice(val: number) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function swapRoute() {
  const p = { ...pickup }
  pickup.label = dropoff.label
  pickup.lat = dropoff.lat
  pickup.lng = dropoff.lng
  pickup.mapPlaceId = dropoff.mapPlaceId
  dropoff.label = p.label
  dropoff.lat = p.lat
  dropoff.lng = p.lng
  dropoff.mapPlaceId = p.mapPlaceId
}

async function refreshQuote() {
  if (pickup.lat == null || pickup.lng == null || dropoff.lat == null || dropoff.lng == null) {
    estimatedFare.value = null
    return
  }
  try {
    const { data } = await ridesApi.getQuote({
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      dropoff_lat: dropoff.lat,
      dropoff_lng: dropoff.lng,
      vehicle_type: vehicleType.value,
    })
    const fee = (data as { total_fee?: number })?.total_fee
    estimatedFare.value = typeof fee === 'number' ? fee : null
  } catch {
    estimatedFare.value = null
  }
}

async function submit() {
  rideError.value = ''
  if (!canBook.value || estimatedFare.value == null) return
  submitting.value = true
  try {
    const { data } = await ridesApi.requestRide({
      pickup_address: pickup.label.trim(),
      dropoff_address: dropoff.label.trim(),
      pickup_lat: pickup.lat!,
      pickup_lng: pickup.lng!,
      dropoff_lat: dropoff.lat!,
      dropoff_lng: dropoff.lng!,
      pickup_map_place_id: pickup.mapPlaceId ?? undefined,
      dropoff_map_place_id: dropoff.mapPlaceId ?? undefined,
      fare: estimatedFare.value,
      vehicle_type: vehicleType.value,
      rider_notes: notes.value.trim() || undefined,
    })
    const id = (data as { id?: number })?.id
    if (id) {
      await router.push({ name: 'buyer.ride.detail', params: { id: String(id) } })
    }
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string; error?: string } } }
    rideError.value = err.response?.data?.detail ?? err.response?.data?.error ?? 'Could not send ride request.'
  } finally {
    submitting.value = false
  }
}

watch(
  () => [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng, vehicleType.value] as const,
  () => void refreshQuote(),
)

onMounted(() => {
  const p = String(route.query.pickup ?? '').trim()
  const d = String(route.query.dropoff ?? '').trim()
  if (p) pickup.label = p
  if (d) dropoff.label = d
})
</script>
