<template>
  <div class="buyer-ride buyer-ride--map">
    <div class="buyer-ride-stage" aria-hidden="false">
      <GoogleMap
        v-if="mapsApiKey"
        ref="mapRef"
        class="buyer-ride-map"
        :api-key="mapsApiKey"
        :center="mapCenter"
        :zoom="mapZoom"
        :clickable-icons="false"
      >
        <Marker v-if="pickupMarker" :options="pickupMarker" />
        <Marker v-if="dropoffMarker" :options="dropoffMarker" />
      </GoogleMap>
      <div v-else class="buyer-ride-map buyer-ride-map--fallback">
        <div class="buyer-ride-map__fallback-grid" />
        <div v-if="pickup.lat != null && pickup.lng != null" class="buyer-ride-map__pin buyer-ride-map__pin--pickup" :style="fallbackPinStyle(pickup)">
          <span />
        </div>
        <div v-if="dropoff.lat != null && dropoff.lng != null" class="buyer-ride-map__pin buyer-ride-map__pin--dropoff" :style="fallbackPinStyle(dropoff)">
          <span />
        </div>
        <p class="buyer-ride-map__fallback-note">{{ t('buyerXp.ride.mapPreviewHint') }}</p>
      </div>
    </div>

    <div class="buyer-ride-panel" :class="{ 'buyer-ride-panel--options': phase === 'options' }">
      <header class="buyer-ride-panel__head">
        <div class="buyer-ride-panel__brand">
          <span class="buyer-ride-panel__logo" aria-hidden="true">KKOO</span>
          <span class="buyer-ride-panel__mode">{{ isParcel ? t('buyerXp.parcel.overline') : t('buyerXp.ride.overline') }}</span>
        </div>
        <RouterLink
          :to="{ name: 'buyer.rides' }"
          class="buyer-ride-panel__trips"
          @click="onHistoryNav"
        >
          {{ historyLabel }}
        </RouterLink>
      </header>

      <!-- Plan phase -->
      <section v-if="phase === 'plan'" class="buyer-ride-panel__body" :aria-label="isParcel ? t('buyerXp.parcel.title') : t('buyerXp.ride.findTrip')">
        <h1 class="buyer-ride-panel__title">{{ isParcel ? t('buyerXp.parcel.title') : t('buyerXp.ride.findTrip') }}</h1>

        <div class="buyer-ride-route">
          <div class="buyer-ride-route__rail" aria-hidden="true">
            <span class="buyer-ride-route__mark buyer-ride-route__mark--pickup" />
            <span class="buyer-ride-route__stem" />
            <span class="buyer-ride-route__mark buyer-ride-route__mark--dropoff" />
          </div>
          <div class="buyer-ride-route__fields">
            <RidePlaceField
              id="pickup"
              v-model:label="pickup.label"
              v-model:lat="pickup.lat"
              v-model:lng="pickup.lng"
              v-model:map-place-id="pickup.mapPlaceId"
              :title="pickupTitle"
              :placeholder="pickupPlaceholder"
              marker="pickup"
              dense
            />
            <RidePlaceField
              id="dropoff"
              v-model:label="dropoff.label"
              v-model:lat="dropoff.lat"
              v-model:lng="dropoff.lng"
              v-model:map-place-id="dropoff.mapPlaceId"
              :title="dropoffTitle"
              :placeholder="dropoffPlaceholder"
              marker="dropoff"
              dense
            />
          </div>
          <button
            type="button"
            class="buyer-ride-swap"
            :aria-label="swapLabel"
            :disabled="!canSwap"
            @click="swapRoute"
          >
            <Icon icon="solar:transfer-vertical-bold" />
          </button>
        </div>

        <div class="buyer-ride-chips" role="group" :aria-label="t('buyerXp.ride.tripOptions')">
          <button type="button" class="buyer-ride-chip buyer-ride-chip--active" disabled>
            <Icon icon="solar:clock-circle-bold" aria-hidden="true" />
            {{ t('buyerXp.ride.pickUpNow') }}
          </button>
          <button type="button" class="buyer-ride-chip buyer-ride-chip--active" disabled>
            <Icon icon="solar:user-bold" aria-hidden="true" />
            {{ t('buyerXp.ride.forMe') }}
          </button>
        </div>

        <div v-if="isParcel" class="buyer-ride-notes-wrap">
          <label class="buyer-ride-notes-label" for="parcel-notes">{{ descriptionLabel }}</label>
          <textarea
            id="parcel-notes"
            v-model="notes"
            class="buyer-ride-notes"
            rows="2"
            :placeholder="descriptionPlaceholder"
          />
        </div>

        <p v-if="stepError" class="buyer-ride-msg buyer-ride-msg--err">{{ stepError }}</p>

        <button
          type="button"
          class="buyer-ride-cta"
          :disabled="!hasRoute || quoting"
          @click="onSearch"
        >
          {{ quoting ? t('buyerXp.ride.quoteLoading') : t('buyerXp.ride.search') }}
        </button>
      </section>

      <!-- Options phase -->
      <section v-else class="buyer-ride-panel__body" :aria-label="t('buyerXp.ride.stepRideTitle')">
        <button type="button" class="buyer-ride-back" :disabled="submitting" @click="backToPlan">
          <Icon icon="solar:arrow-left-linear" aria-hidden="true" />
          {{ t('buyerXp.ride.stepBack') }}
        </button>

        <BuyerRideRouteSummary
          flat
          :pickup-title="pickupTitle"
          :dropoff-title="dropoffTitle"
          :pickup-address="pickup.label"
          :dropoff-address="dropoff.label"
          :aria-label="t('buyerXp.ride.routeSummary')"
        />

        <div v-if="!isParcel" class="buyer-ride-vehicles" role="radiogroup" :aria-label="vehicleLabel">
          <button
            v-for="v in vehicles"
            :key="v.id"
            type="button"
            class="buyer-ride-vehicle"
            :class="{ 'buyer-ride-vehicle--active': vehicleType === v.id }"
            :aria-pressed="vehicleType === v.id"
            @click="onVehicleSelect(v.id)"
          >
            <Icon :icon="v.icon" class="buyer-ride-vehicle__icon" aria-hidden="true" />
            {{ v.label }}
          </button>
        </div>

        <div v-if="quoting" class="buyer-ride-fare">
          <span class="buyer-ride-fare__label">{{ t('buyerXp.ride.quoteLoading') }}</span>
        </div>
        <div v-else-if="estimatedFare != null" class="buyer-ride-fare">
          <span class="buyer-ride-fare__label">{{ fareLabel }}</span>
          <strong class="buyer-ride-fare__amount">{{ formatPrice(estimatedFare) }}</strong>
        </div>

        <p v-if="!auth.isAuthenticated" class="buyer-ride-msg buyer-ride-msg--hint">
          {{ isParcel ? t('buyerXp.parcel.signInPrompt') : t('buyerXp.ride.signInPrompt') }}
        </p>
        <p v-if="bookingError" class="buyer-ride-msg buyer-ride-msg--err">{{ bookingError }}</p>

        <button
          type="button"
          class="buyer-ride-cta"
          :disabled="primaryDisabled"
          @click="onPrimaryAction"
        >
          <Icon :icon="primaryIcon" aria-hidden="true" />
          {{ primaryLabel }}
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { ridesApi } from '@/api/rides'
import RidePlaceField from '@/components/buyer/RidePlaceField.vue'
import BuyerRideRouteSummary from '@/components/buyer/experience/BuyerRideRouteSummary.vue'
import { useAuthStore } from '@/stores/auth'
import { isAuthSessionError } from '@/utils/authRedirect'

const props = withDefaults(
  defineProps<{
    mode?: 'ride' | 'parcel'
  }>(),
  { mode: 'ride' },
)

const DSM = { lat: -6.7924, lng: 39.2083 }
const mapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || ''

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()

type PlacePin = { label: string; lat: number | null; lng: number | null; mapPlaceId: number | null }
type Phase = 'plan' | 'options'

const pickup = reactive<PlacePin>({ label: '', lat: null, lng: null, mapPlaceId: null })
const dropoff = reactive<PlacePin>({ label: '', lat: null, lng: null, mapPlaceId: null })
const vehicleType = ref('boda')
const notes = ref('')
const submitting = ref(false)
const quoting = ref(false)
const bookingError = ref('')
const stepError = ref('')
const estimatedFare = ref<number | null>(null)
const phase = ref<Phase>('plan')
const mapRef = ref<{ map?: { fitBounds: (b: unknown, p?: number) => void; panTo: (c: { lat: number; lng: number }) => void; setZoom: (z: number) => void } } | null>(null)
const mapZoom = ref(13)

const isParcel = computed(() => props.mode === 'parcel')

const pickupTitle = computed(() => (isParcel.value ? t('buyerXp.parcel.pickup') : t('buyerXp.ride.pickup')))
const dropoffTitle = computed(() => (isParcel.value ? t('buyerXp.parcel.dropoff') : t('buyerXp.ride.dropoff')))
const pickupPlaceholder = computed(() =>
  isParcel.value ? t('buyerXp.parcel.pickupPlaceholder') : t('buyerXp.ride.pickupPlaceholder'),
)
const dropoffPlaceholder = computed(() =>
  isParcel.value ? t('buyerXp.parcel.dropoffPlaceholder') : t('buyerXp.ride.dropoffPlaceholder'),
)
const swapLabel = computed(() => (isParcel.value ? t('buyerXp.parcel.swap') : t('buyerXp.ride.swap')))
const descriptionLabel = computed(() => t('buyerXp.parcel.description'))
const descriptionPlaceholder = computed(() => t('buyerXp.parcel.descriptionPlaceholder'))
const vehicleLabel = computed(() => t('buyerXp.ride.vehicle'))
const fareLabel = computed(() =>
  isParcel.value ? t('buyerXp.parcel.estimatedFare') : t('buyerXp.ride.estimatedFare'),
)
const submitLabel = computed(() =>
  isParcel.value ? t('buyerXp.parcel.sendParcel') : t('buyerXp.ride.requestRide'),
)
const submittingLabel = computed(() =>
  isParcel.value ? t('buyerXp.parcel.sending') : t('buyerXp.ride.requesting'),
)
const submitIcon = computed(() => (isParcel.value ? 'solar:box-bold' : 'solar:scooter-bold'))
const historyLabel = computed(() => t('buyerXp.ride.historyTitle'))

const vehicles = computed(() => [
  { id: 'boda', label: t('buyerXp.ride.boda'), icon: 'solar:scooter-bold' },
  { id: 'bajaj', label: t('buyerXp.ride.bajaj'), icon: 'solar:bus-bold' },
  { id: 'car', label: t('buyerXp.ride.car'), icon: 'solar:car-bold' },
])

const hasRoute = computed(
  () =>
    Boolean(pickup.label.trim()) &&
    Boolean(dropoff.label.trim()) &&
    pickup.lat != null &&
    pickup.lng != null &&
    dropoff.lat != null &&
    dropoff.lng != null,
)

const canSwap = computed(
  () => Boolean(pickup.label.trim() || dropoff.label.trim() || pickup.lat != null || dropoff.lat != null),
)

const canBook = computed(
  () => hasRoute.value && estimatedFare.value != null && estimatedFare.value > 0,
)

const primaryLabel = computed(() => {
  if (submitting.value) return submittingLabel.value
  if (!auth.isAuthenticated) {
    return isParcel.value ? t('buyerXp.parcel.signInToSend') : t('buyerXp.ride.signInToBook')
  }
  return submitLabel.value
})

const primaryIcon = computed(() => submitIcon.value)

const primaryDisabled = computed(() => submitting.value || quoting.value || !canBook.value)

const mapCenter = computed(() => {
  if (pickup.lat != null && pickup.lng != null && dropoff.lat == null) {
    return { lat: pickup.lat, lng: pickup.lng }
  }
  if (dropoff.lat != null && dropoff.lng != null && pickup.lat == null) {
    return { lat: dropoff.lat, lng: dropoff.lng }
  }
  if (pickup.lat != null && pickup.lng != null && dropoff.lat != null && dropoff.lng != null) {
    return {
      lat: (pickup.lat + dropoff.lat) / 2,
      lng: (pickup.lng + dropoff.lng) / 2,
    }
  }
  return DSM
})

const pickupMarker = computed(() => {
  if (pickup.lat == null || pickup.lng == null) return null
  return {
    position: { lat: pickup.lat, lng: pickup.lng },
    title: pickup.label || 'Pickup',
  }
})

const dropoffMarker = computed(() => {
  if (dropoff.lat == null || dropoff.lng == null) return null
  return {
    position: { lat: dropoff.lat, lng: dropoff.lng },
    title: dropoff.label || 'Dropoff',
  }
})

function fallbackPinStyle(pin: PlacePin) {
  const lat = pin.lat ?? DSM.lat
  const lng = pin.lng ?? DSM.lng
  const latSpan = 0.08
  const lngSpan = 0.08
  const top = ((DSM.lat + latSpan / 2 - lat) / latSpan) * 100
  const left = ((lng - (DSM.lng - lngSpan / 2)) / lngSpan) * 100
  return {
    top: `${Math.min(92, Math.max(8, top))}%`,
    left: `${Math.min(92, Math.max(8, left))}%`,
  }
}

function fitMapToRoute() {
  const map = mapRef.value?.map
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = (window as any).google
  if (!map || !g?.maps) return
  if (pickup.lat != null && pickup.lng != null && dropoff.lat != null && dropoff.lng != null) {
    const bounds = new g.maps.LatLngBounds()
    bounds.extend({ lat: pickup.lat, lng: pickup.lng })
    bounds.extend({ lat: dropoff.lat, lng: dropoff.lng })
    map.fitBounds(bounds, 72)
    return
  }
  if (pickup.lat != null && pickup.lng != null) {
    map.panTo({ lat: pickup.lat, lng: pickup.lng })
    map.setZoom(14)
  } else if (dropoff.lat != null && dropoff.lng != null) {
    map.panTo({ lat: dropoff.lat, lng: dropoff.lng })
    map.setZoom(14)
  }
}

function onHistoryNav(event: MouseEvent) {
  if (auth.isAuthenticated) return
  event.preventDefault()
  void router.push({
    name: 'auth.sign-in',
    query: { redirectedFrom: router.resolve({ name: 'buyer.rides' }).fullPath },
  })
}

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
  estimatedFare.value = null
  if (phase.value === 'options') void refreshQuote()
}

function backToPlan() {
  stepError.value = ''
  bookingError.value = ''
  phase.value = 'plan'
}

async function refreshQuote() {
  if (!hasRoute.value) {
    estimatedFare.value = null
    return false
  }
  quoting.value = true
  try {
    const { data } = await ridesApi.getQuote({
      pickup_lat: pickup.lat!,
      pickup_lng: pickup.lng!,
      dropoff_lat: dropoff.lat!,
      dropoff_lng: dropoff.lng!,
      vehicle_type: vehicleType.value,
    })
    const fee = (data as { total_fee?: number })?.total_fee
    estimatedFare.value = typeof fee === 'number' ? fee : null
    return estimatedFare.value != null && estimatedFare.value > 0
  } catch {
    estimatedFare.value = null
    return false
  } finally {
    quoting.value = false
  }
}

async function onSearch() {
  stepError.value = ''
  bookingError.value = ''
  if (!hasRoute.value) {
    stepError.value = t('buyerXp.ride.routeRequired')
    return
  }
  const ok = await refreshQuote()
  if (!ok) {
    stepError.value = t('buyerXp.ride.quoteUnavailable')
    return
  }
  phase.value = 'options'
}

function onVehicleSelect(id: string) {
  vehicleType.value = id
  void refreshQuote()
}

function onPrimaryAction() {
  void submit()
}

async function submit() {
  bookingError.value = ''
  if (!canBook.value || estimatedFare.value == null) return

  if (!auth.isAuthenticated) {
    await router.push({ name: 'auth.sign-in', query: { redirectedFrom: route.fullPath } })
    return
  }

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
      trip_type: isParcel.value ? 'parcel' : 'passenger',
      rider_notes: notes.value.trim() || undefined,
    })
    const id = (data as { id?: number })?.id
    if (id) {
      await router.push({ name: 'buyer.ride.detail', params: { id: String(id) } })
    }
  } catch (e: unknown) {
    if (isAuthSessionError(e)) return
    const err = e as { response?: { data?: { detail?: string; error?: string } } }
    bookingError.value =
      err.response?.data?.detail ??
      err.response?.data?.error ??
      (isParcel.value ? t('buyerXp.parcel.couldNotSend') : t('buyerXp.ride.couldNotBook'))
  } finally {
    submitting.value = false
  }
}

watch(
  () => [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng] as const,
  () => {
    estimatedFare.value = null
    if (phase.value === 'options') {
      phase.value = 'plan'
    }
    fitMapToRoute()
  },
)

watch(hasRoute, (ok) => {
  if (!ok) {
    phase.value = 'plan'
    estimatedFare.value = null
  }
})

watch(mapRef, (el) => {
  if (el?.map) fitMapToRoute()
})

onMounted(() => {
  const p = String(route.query.pickup ?? '').trim()
  const d = String(route.query.dropoff ?? '').trim()
  if (p) pickup.label = p
  if (d) dropoff.label = d
})
</script>
