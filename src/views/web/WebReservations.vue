<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.reservations.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.reservations.meta') }}</p>
      <div class="buyer-btn-row buyer-page-head__actions">
        <RouterLink :to="{ name: 'buyer.booking' }" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.reservations.bookStay') }}</RouterLink>
        <button type="button" class="buyer-venue__chip" :disabled="loading" @click="load">
          {{ loading ? t('buyerXp.common.loading') : t('buyerXp.common.refresh') }}
        </button>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-if="hotelRows.length" class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.reservations.hotelStays')" />
      <article v-for="r in hotelRows" :key="'h-' + r.id" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <strong>{{ r.hotel_name || t('buyerXp.reservations.hotelFallback') }}</strong>
          <span :class="orderStatusPillClass(r.status)">{{ r.status }}</span>
        </div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.reservations.checkIn') }}</span><span>{{ formatBuyerDateTime(r.check_in) }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.reservations.checkOut') }}</span><span>{{ formatBuyerDateTime(r.check_out) }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.common.total') }}</span><strong>{{ formatBuyerMoney(r.total_amount) }}</strong></div>
      </article>
    </section>

    <section v-if="tableRows.length" class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.reservations.tableReservations')" />
      <article v-for="r in tableRows" :key="'t-' + r.id" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <strong>{{ t('buyerXp.reservations.tableFor', { count: r.party_size }) }}</strong>
          <span :class="orderStatusPillClass(r.status)">{{ r.status }}</span>
        </div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.reservations.when') }}</span><span>{{ formatBuyerDateTime(r.reserved_at) }}</span></div>
        <div v-if="r.notes" class="buyer-detail-row"><span>{{ t('buyerXp.reservations.notes') }}</span><span>{{ r.notes }}</span></div>
      </article>
    </section>

    <BuyerEmptyState
      v-if="!loading && !hotelRows.length && !tableRows.length && !error"
      icon="solar:calendar-bold"
      :title="t('buyerXp.reservations.emptyTitle')"
      :message="t('buyerXp.reservations.emptyMessage')"
    >
      <template #action>
        <RouterLink :to="{ name: 'buyer.booking' }" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.common.findStays') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.eats' }" class="buyer-venue__chip">{{ t('buyerXp.common.browseEats') }}</RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { superAppApi } from '@/api/superApp'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerDateTime, formatBuyerMoney, orderStatusPillClass } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type ResRow = Record<string, unknown> & { id?: number }

const { t } = useI18n()
const loading = ref(false)
const error = ref('')
const hotelRows = ref<ResRow[]>([])
const tableRows = ref<ResRow[]>([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [hotels, tables] = await Promise.all([
      superAppApi.listMyHotelReservations(),
      superAppApi.listMyTableReservations(),
    ])
    hotelRows.value = (hotels.data?.results ?? []) as ResRow[]
    tableRows.value = (tables.data?.results ?? []) as ResRow[]
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
