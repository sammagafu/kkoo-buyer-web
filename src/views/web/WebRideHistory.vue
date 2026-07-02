<template>
  <div class="buyer-xp buyer-xp--wide buyer-ride-trips-page">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div class="buyer-page-head__copy">
          <h1 class="buyer-page-head__title">{{ t('buyerXp.ride.historyTitle') }}</h1>
          <p class="buyer-page-head__meta">{{ t('buyerXp.ride.historyMeta') }}</p>
        </div>
        <div class="buyer-btn-row buyer-page-head__actions">
          <button type="button" class="buyer-venue__chip" :disabled="loading" @click="load">
            {{ loading ? t('buyerXp.common.refreshing') : t('buyerXp.common.refresh') }}
          </button>
          <RouterLink :to="{ name: 'buyer.ride' }" class="buyer-venue__chip buyer-venue__chip--primary d-none d-md-inline-flex">
            {{ t('buyerXp.common.bookRide') }}
          </RouterLink>
        </div>
      </div>
      <RouterLink :to="{ name: 'buyer.ride' }" class="buyer-venue__chip buyer-venue__chip--primary d-md-none">
        {{ t('buyerXp.common.bookRide') }}
      </RouterLink>
    </header>

    <div class="buyer-filter-row" role="tablist" :aria-label="t('buyerXp.ride.historyFilterLabel')">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="buyer-filter-chip"
        :class="{ 'buyer-filter-chip--active': activeFilter === tab.id }"
        :aria-selected="activeFilter === tab.id"
        @click="setFilter(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="rides.length" class="buyer-ride-trips-list">
      <article v-for="ride in rides" :key="String(ride.id)" class="buyer-ride-trip-card">
        <RouterLink :to="rideDetailLink(ride.id as number | string)" class="buyer-ride-trip-card__main">
          <div class="buyer-ride-trip-card__head">
            <div class="buyer-ride-trip-card__title-block">
              <div class="buyer-ride-trip-card__icon" aria-hidden="true">
                <Icon :icon="tripIcon(ride)" />
              </div>
              <div>
                <p class="buyer-ride-trip-card__id">{{ t('buyerXp.common.rideNumber', { number: ride.id }) }}</p>
                <p v-if="ride.created_at" class="buyer-ride-trip-card__when">{{ formatWhen(ride.created_at) }}</p>
              </div>
            </div>
            <div class="buyer-ride-trip-card__badges">
              <span class="buyer-ride-trip-card__type">{{ tripTypeLabel(ride) }}</span>
              <span :class="rideStatusPillClass(ride.status)">{{ formatRideStatus(ride.status) }}</span>
            </div>
          </div>

          <BuyerRideRouteSummary
            compact
            flat
            :pickup-title="t('buyerXp.ride.pickupLabel')"
            :dropoff-title="t('buyerXp.ride.dropoffLabel')"
            :pickup-address="String(ride.pickup_address ?? '')"
            :dropoff-address="String(ride.dropoff_address ?? '')"
            :aria-label="t('buyerXp.ride.routeSummary')"
          />

          <div class="buyer-ride-trip-card__foot">
            <div class="buyer-ride-trip-card__fare">
              <span class="buyer-ride-trip-card__fare-label">{{ t('buyerXp.ride.fare') }}</span>
              <strong>{{ formatMoney(ride.fare ?? ride.fare_amount ?? ride.estimated_fare) }}</strong>
            </div>
            <span class="buyer-ride-trip-card__cta">
              {{ t('buyerXp.ride.viewTrip') }}
              <Icon icon="solar:alt-arrow-right-linear" aria-hidden="true" />
            </span>
          </div>
        </RouterLink>

        <div v-if="canCancel(ride)" class="buyer-ride-trip-card__actions">
          <button type="button" class="buyer-ride-trip-card__cancel" @click="cancel(ride)">
            {{ t('buyerXp.ride.cancelRide') }}
          </button>
        </div>
      </article>
    </section>

    <BuyerEmptyState
      v-else
      icon="solar:scooter-bold"
      :title="t('buyerXp.ride.empty')"
      :message="t('buyerXp.ride.historyMeta')"
    >
      <template #action>
        <RouterLink :to="{ name: 'buyer.ride' }" class="buyer-venue__chip buyer-venue__chip--primary">
          {{ t('buyerXp.common.bookRide') }}
        </RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ridesApi } from '@/api/rides'
import { formatApiError } from '@/utils/formatApiError'
import { formatRideStatus, rideStatusPillClass } from '@/utils/buyerFormat'
import { rideDetailLink } from '@/utils/buyerDetailLinks'
import BuyerRideRouteSummary from '@/components/buyer/experience/BuyerRideRouteSummary.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type RideRow = Record<string, unknown>
type TripFilter = 'all' | 'passenger' | 'parcel'

const CANCELLABLE = new Set(['pending', 'searching', 'scheduled', 'assigned', 'accepted', 'requested'])

const router = useRouter()
const { t } = useI18n()

const rides = ref<RideRow[]>([])
const loading = ref(false)
const error = ref('')
const activeFilter = ref<TripFilter>('all')

const filterTabs = computed(() => [
  { id: 'all' as const, label: t('buyerXp.ride.historyTabAll') },
  { id: 'passenger' as const, label: t('buyerXp.ride.historyTabRides') },
  { id: 'parcel' as const, label: t('buyerXp.ride.historyTabParcels') },
])

function normalizeList(data: unknown): RideRow[] {
  if (Array.isArray(data)) return data
  return ((data as { results?: RideRow[] })?.results ?? []) as RideRow[]
}

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

function tripTypeLabel(ride: RideRow) {
  const type = String(ride.trip_type ?? 'passenger').toLowerCase()
  if (type === 'parcel') return t('buyerXp.ride.tripTypeParcel')
  return t('buyerXp.ride.tripTypeRide')
}

function tripIcon(ride: RideRow) {
  return String(ride.trip_type ?? 'passenger').toLowerCase() === 'parcel'
    ? 'solar:box-bold'
    : 'solar:scooter-bold'
}

function canCancel(ride: RideRow) {
  return CANCELLABLE.has(String(ride.status ?? '').toLowerCase())
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const params =
      activeFilter.value === 'all' ? undefined : { trip_type: activeFilter.value as 'passenger' | 'parcel' }
    const { data } = await ridesApi.listRides(params)
    rides.value = normalizeList(data)
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

function setFilter(id: TripFilter) {
  if (activeFilter.value === id) return
  activeFilter.value = id
  void load()
}

async function cancel(ride: RideRow) {
  if (!ride.id) return
  try {
    await ridesApi.cancelRide(ride.id as string | number)
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.ride.couldNotCancel'))
  }
}

onMounted(load)
</script>
