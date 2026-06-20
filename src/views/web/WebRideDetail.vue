<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div>
          <h1 class="buyer-page-head__title">{{ t('buyerXp.common.rideNumber', { number: ride?.id || id }) }}</h1>
          <p v-if="displayStatus" class="buyer-page-head__meta">
            <span class="buyer-venue__chip">{{ displayStatus }}</span>
          </p>
        </div>
      </div>
    </header>

    <p v-if="loading && !ride" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <template v-else-if="ride">
      <section class="buyer-detail-card">
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.pickupLabel') }}</span><span>{{ ride.pickup_address || '—' }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.dropoffLabel') }}</span><span>{{ ride.dropoff_address || '—' }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.fare') }}</span><strong>{{ formatMoney(ride.fare ?? ride.fare_amount ?? ride.estimated_fare) }}</strong></div>
        <div v-if="ride.vehicle_type" class="buyer-detail-row"><span>{{ t('buyerXp.ride.vehicleLabel') }}</span><span>{{ ride.vehicle_type }}</span></div>
      </section>

      <section v-if="tracking" class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.ride.liveTracking')" />
        <div class="buyer-detail-row"><span>{{ t('buyerXp.common.status') }}</span><span>{{ displayStatus }}</span></div>
        <div v-if="riderName" class="buyer-detail-row"><span>{{ t('buyerXp.ride.rider') }}</span><span>{{ riderName }}</span></div>
        <div v-if="pickupEta" class="buyer-detail-row"><span>ETA</span><span>{{ pickupEta }}</span></div>
        <a
          v-if="mapUrl"
          :href="mapUrl"
          target="_blank"
          rel="noopener"
          class="buyer-venue__chip buyer-venue__chip--primary mt-2"
        >
          {{ t('buyerXp.ride.openMap') }}
        </a>
      </section>

      <button
        v-if="canCancel"
        type="button"
        class="buyer-venue__chip mt-3"
        @click="cancel"
      >
        {{ t('buyerXp.ride.cancelRide') }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ridesApi } from '@/api/rides'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'

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
let pollTimer: ReturnType<typeof setInterval> | undefined

const displayStatus = computed(() =>
  String(tracking.value?.status ?? ride.value?.status ?? '').replace(/_/g, ' '),
)

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

const canCancel = computed(() => {
  const s = String(tracking.value?.status ?? ride.value?.status ?? '').toLowerCase()
  return ['pending', 'searching', 'scheduled', 'assigned', 'accepted'].includes(s)
})

function formatMoney(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n)
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
  const s = String(tracking.value?.status ?? ride.value?.status ?? '').toLowerCase()
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
  try {
    await ridesApi.cancelRide(rid as number | string, { cancel_reason: 'Cancelled by passenger' })
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.ride.couldNotCancel'))
  }
}

onMounted(load)
onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
