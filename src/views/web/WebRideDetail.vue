<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div>
          <h1 class="buyer-page-head__title">{{ t('buyerXp.common.rideNumber', { number: ride?.id || id }) }}</h1>
          <p v-if="ride?.status" class="buyer-page-head__meta">
            <span class="buyer-venue__chip">{{ ride.status }}</span>
          </p>
        </div>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <template v-else-if="ride">
      <section class="buyer-detail-card">
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.pickupLabel') }}</span><span>{{ ride.pickup_address || '—' }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.dropoffLabel') }}</span><span>{{ ride.dropoff_address || '—' }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.fare') }}</span><strong>{{ formatMoney(ride.fare_amount ?? ride.estimated_fare) }}</strong></div>
        <div v-if="ride.vehicle_type" class="buyer-detail-row"><span>{{ t('buyerXp.ride.vehicleLabel') }}</span><span>{{ ride.vehicle_type }}</span></div>
      </section>

      <section v-if="tracking" class="buyer-detail-card">
        <BuyerSectionHeader :title="t('buyerXp.ride.liveTracking')" />
        <div class="buyer-detail-row"><span>{{ t('buyerXp.common.status') }}</span><span>{{ tracking.status || '—' }}</span></div>
        <div v-if="tracking.rider_name" class="buyer-detail-row"><span>{{ t('buyerXp.ride.rider') }}</span><span>{{ tracking.rider_name }}</span></div>
        <a
          v-if="tracking.map_url || tracking.gps_track_link"
          :href="String(tracking.map_url || tracking.gps_track_link)"
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
import { computed, onMounted, ref } from 'vue'
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

const canCancel = computed(() => {
  const s = String(ride.value?.status ?? '').toLowerCase()
  return s === 'pending' || s === 'requested' || s === 'accepted'
})

function formatMoney(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n)
}

async function load() {
  const rid = props.id || String(route.params.id ?? '')
  loading.value = true
  try {
    const { data } = await ridesApi.getRide(rid)
    ride.value = data as RideRow
    try {
      const tr = await ridesApi.getRideTracking(rid)
      tracking.value = tr.data as TrackingRow
    } catch {
      tracking.value = null
    }
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.ride.notFound'))
  } finally {
    loading.value = false
  }
}

async function cancel() {
  const rid = ride.value?.id ?? props.id
  if (!rid) return
  try {
    await ridesApi.cancelRide(rid as number | string)
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.ride.couldNotCancel'))
  }
}

onMounted(load)
</script>
