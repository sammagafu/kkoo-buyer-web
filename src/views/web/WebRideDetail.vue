<template>
  <div class="buyer-xp buyer-xp--wide buyer-ride-detail-page">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div>
          <h1 class="buyer-page-head__title">{{ t('buyerXp.common.rideNumber', { number: ride?.id || id }) }}</h1>
          <p v-if="displayStatus" class="buyer-page-head__meta">
            <span :class="rideStatusPillClass(rideStatus)">{{ displayStatus }}</span>
            <span v-if="tripTypeLabel" class="buyer-ride-trip-card__type ms-2">{{ tripTypeLabel }}</span>
          </p>
        </div>
      </div>
    </header>

    <p v-if="loading && !ride" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <template v-else-if="ride">
      <section class="buyer-ride-detail-hero">
        <p class="buyer-ride-detail-hero__label">{{ t('buyerXp.ride.fare') }}</p>
        <p class="buyer-ride-detail-hero__fare">{{ formatMoney(ride.fare ?? ride.fare_amount ?? ride.estimated_fare) }}</p>
        <p v-if="ride.created_at" class="buyer-ride-detail-hero__meta">{{ formatWhen(ride.created_at) }}</p>
      </section>

      <section class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.ride.tripSummary')" />
        <BuyerRideRouteSummary
          class="mt-2"
          :pickup-title="t('buyerXp.ride.pickupLabel')"
          :dropoff-title="t('buyerXp.ride.dropoffLabel')"
          :pickup-address="String(ride.pickup_address ?? '')"
          :dropoff-address="String(ride.dropoff_address ?? '')"
          :aria-label="t('buyerXp.ride.routeSummary')"
        />
        <div v-if="vehicleLabel" class="buyer-ride-detail-meta mt-3">
          <span class="buyer-ride-detail-meta__label">{{ t('buyerXp.ride.vehicleLabel') }}</span>
          <span class="buyer-ride-detail-meta__value">{{ vehicleLabel }}</span>
        </div>
      </section>

      <section v-if="tracking || isActiveTrip" class="buyer-detail-card buyer-ride-detail-tracking">
        <BuyerSectionHeader :title="t('buyerXp.ride.liveTracking')" />
        <div class="buyer-ride-detail-tracking__grid">
          <div class="buyer-ride-detail-stat">
            <span class="buyer-ride-detail-stat__label">{{ t('buyerXp.common.status') }}</span>
            <span :class="rideStatusPillClass(rideStatus)">{{ displayStatus }}</span>
          </div>
          <div v-if="riderName" class="buyer-ride-detail-stat">
            <span class="buyer-ride-detail-stat__label">{{ t('buyerXp.ride.rider') }}</span>
            <span class="buyer-ride-detail-stat__value">{{ riderName }}</span>
          </div>
          <div v-if="pickupEta" class="buyer-ride-detail-stat">
            <span class="buyer-ride-detail-stat__label">{{ t('buyerXp.ride.etaPickup') }}</span>
            <span class="buyer-ride-detail-stat__value">{{ pickupEta }}</span>
          </div>
        </div>
        <a
          v-if="mapUrl"
          :href="mapUrl"
          target="_blank"
          rel="noopener"
          class="buyer-venue__chip buyer-venue__chip--primary buyer-ride-detail-tracking__map"
        >
          <Icon icon="solar:map-point-bold" aria-hidden="true" />
          {{ t('buyerXp.ride.openMap') }}
        </a>
      </section>

      <div class="buyer-ride-detail-actions">
        <button
          v-if="canCancel"
          type="button"
          class="buyer-venue__chip buyer-ride-detail-actions__cancel"
          :disabled="cancelling"
          @click="cancel"
        >
          {{ cancelling ? t('buyerXp.ride.requesting') : t('buyerXp.ride.cancelRide') }}
        </button>
        <RouterLink :to="{ name: 'buyer.rides' }" class="buyer-venue__chip">
          {{ t('buyerXp.ride.historyTitle') }}
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
import { ridesApi } from '@/api/rides'
import { formatApiError } from '@/utils/formatApiError'
import { formatRideStatus, rideStatusPillClass } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerRideRouteSummary from '@/components/buyer/experience/BuyerRideRouteSummary.vue'

const props = defineProps<{ id: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

type RideRow = Record<string, unknown>
type TrackingRow = Record<string, unknown>

const ride = ref<RideRow | null>(null)
const tracking = ref<TrackingRow | null>(null)
const loading = ref(false)
const error = ref('')
const cancelling = ref(false)
let pollTimer: ReturnType<typeof setInterval> | undefined

const rideStatus = computed(() => tracking.value?.status ?? ride.value?.status ?? '')

const displayStatus = computed(() => formatRideStatus(rideStatus.value))

const tripTypeLabel = computed(() => {
  const type = String(ride.value?.trip_type ?? 'passenger').toLowerCase()
  if (type === 'parcel') return t('buyerXp.ride.tripTypeParcel')
  return t('buyerXp.ride.tripTypeRide')
})

const vehicleLabel = computed(() => {
  const v = String(ride.value?.vehicle_type ?? '').toLowerCase()
  if (v === 'boda') return t('buyerXp.ride.boda')
  if (v === 'bajaj') return t('buyerXp.ride.bajaj')
  if (v === 'car') return t('buyerXp.ride.car')
  return String(ride.value?.vehicle_type ?? '').trim()
})

const riderName = computed(() => {
  const rider = tracking.value?.rider as Record<string, unknown> | undefined
  return String(rider?.full_name ?? tracking.value?.rider_name ?? '').trim()
})

const pickupEta = computed(() => {
  const sec = tracking.value?.estimated_pickup_eta_seconds
  if (typeof sec === 'number' && sec > 0) return `${Math.round(sec / 60)} min`
  return ''
})

const mapUrl = computed(() => {
  const link = tracking.value?.gps_track_link ?? tracking.value?.map_url
  if (link) return String(link)
  const loc = tracking.value?.rider_location as Record<string, unknown> | undefined
  const lat = Number(loc?.lat ?? loc?.latitude)
  const lng = Number(loc?.lng ?? loc?.longitude)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }
  return ''
})

const isActiveTrip = computed(() => {
  const s = String(rideStatus.value).toLowerCase()
  return !['delivered', 'completed', 'cancelled', 'canceled', 'failed'].includes(s)
})

const canCancel = computed(() => {
  const s = String(rideStatus.value).toLowerCase()
  return ['pending', 'searching', 'scheduled', 'assigned', 'accepted', 'requested'].includes(s)
})

function formatMoney(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n)
}

function formatWhen(value: unknown) {
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

async function loadTracking(rid: string | number) {
  try {
    const tr = await ridesApi.getRideTracking(rid)
    tracking.value = tr.data as TrackingRow
  } catch {
    tracking.value = null
  }
}

function configurePoll() {
  if (pollTimer) clearInterval(pollTimer)
  const s = String(rideStatus.value).toLowerCase()
  const closed = ['delivered', 'completed', 'cancelled', 'canceled', 'failed']
  if (closed.includes(s)) return
  pollTimer = setInterval(async () => {
    const rid = ride.value?.id ?? props.id
    if (!rid) return
    await loadTracking(rid as string | number)
    const st = String(tracking.value?.status ?? '').toLowerCase()
    if (closed.includes(st) && pollTimer) clearInterval(pollTimer)
  }, 12000)
}

async function load() {
  const rid = props.id || String(route.params.id ?? '')
  loading.value = true
  try {
    const { data } = await ridesApi.getRide(rid)
    ride.value = data as RideRow
    await loadTracking(rid)
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.ride.notFound'))
  } finally {
    loading.value = false
    configurePoll()
  }
}

async function cancel() {
  const rid = ride.value?.id ?? props.id
  if (!rid) return
  cancelling.value = true
  try {
    await ridesApi.cancelRide(rid as number | string, { cancel_reason: 'Cancelled by passenger' })
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.ride.couldNotCancel'))
  } finally {
    cancelling.value = false
  }
}

onMounted(load)
onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
