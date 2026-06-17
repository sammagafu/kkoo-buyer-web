<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.ride.historyTitle') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.ride.historyMeta') }}</p>
      <RouterLink :to="{ name: 'buyer.ride' }" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.common.bookRide') }}</RouterLink>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else class="buyer-hub-list">
      <article v-for="ride in rides" :key="String(ride.id)" class="buyer-detail-card buyer-detail-card--clickable" @click="openRide(ride)">
        <div class="buyer-detail-row">
          <strong>#{{ ride.id }}</strong>
          <span class="buyer-venue__chip">{{ ride.status || 'pending' }}</span>
        </div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.from') }}</span><span>{{ ride.pickup_address || '—' }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.to') }}</span><span>{{ ride.dropoff_address || '—' }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.ride.fare') }}</span><span>{{ formatMoney(ride.fare_amount ?? ride.estimated_fare) }}</span></div>
        <button
          v-if="canCancel(ride)"
          type="button"
          class="buyer-venue__chip mt-2"
          @click.stop="cancel(ride)"
        >
          {{ t('buyerXp.ride.cancelRide') }}
        </button>
      </article>
      <p v-if="!rides.length" class="shop-products__status">{{ t('buyerXp.ride.empty') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ridesApi } from '@/api/rides'
import { formatApiError } from '@/utils/formatApiError'
import { rideDetailLink } from '@/utils/buyerDetailLinks'

type RideRow = Record<string, unknown>

const router = useRouter()
const { t } = useI18n()

const rides = ref<RideRow[]>([])
const loading = ref(false)
const error = ref('')

function normalizeList(data: unknown): RideRow[] {
  if (Array.isArray(data)) return data
  return ((data as { results?: RideRow[] })?.results ?? []) as RideRow[]
}

function formatMoney(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n)
}

function canCancel(ride: RideRow) {
  const s = String(ride.status ?? '').toLowerCase()
  return s === 'pending' || s === 'requested' || s === 'accepted'
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await ridesApi.listRides()
    rides.value = normalizeList(data)
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
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

function openRide(ride: RideRow) {
  if (!ride.id) return
  void router.push(rideDetailLink(ride.id as number | string))
}

onMounted(load)
</script>

<style scoped>
.buyer-detail-card--clickable {
  cursor: pointer;
}
</style>
