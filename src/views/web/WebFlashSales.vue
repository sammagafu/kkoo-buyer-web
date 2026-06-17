<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-home-hero">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.flashSales.overline') }}</p>
      <h1 class="buyer-home-hero__name">{{ t('buyerXp.flashSales.title') }}</h1>
      <p class="buyer-home-hero__tagline">{{ t('buyerXp.flashSales.tagline') }}</p>
      <div class="buyer-btn-row">
        <button type="button" class="buyer-venue__chip" :disabled="loading" @click="load">
          {{ loading ? t('buyerXp.common.refreshing') : t('buyerXp.common.refresh') }}
        </button>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="sales.length" class="buyer-flash-grid">
      <article v-for="sale in sales" :key="sale.id" class="buyer-flash-card">
        <div class="buyer-flash-card__head">
          <h2 class="buyer-flash-card__title">{{ sale.name }}</h2>
          <span class="buyer-flash-card__countdown">
            <Icon icon="solar:fire-bold" aria-hidden="true" />
            {{ countdownFor(sale.end_at) }}
          </span>
        </div>
        <p v-if="sale.description" class="buyer-flash-card__desc">{{ sale.description }}</p>
        <div class="buyer-flash-card__meta">
          <span class="buyer-venue__chip">{{ verticalLabel(sale.vertical) }}</span>
          <span>{{ t('buyerXp.flashSales.deals', { count: sale.items?.length ?? 0 }) }}</span>
        </div>
        <div class="buyer-btn-row">
          <RouterLink :to="flashSaleDetailLink(sale.slug)" class="buyer-venue__chip buyer-venue__chip--primary">
            {{ t('buyerXp.flashSales.viewDeals') }}
          </RouterLink>
        </div>
      </article>
    </section>

    <BuyerEmptyState
      v-else
      icon="solar:fire-bold"
      :title="t('buyerXp.flashSales.emptyTitle')"
      :message="t('buyerXp.flashSales.emptyMessage')"
    >
      <template #action>
        <RouterLink :to="BUYER_DASHBOARD_ROUTE" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.common.browseMarketplace') }}</RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { listActiveFlashSales } from '@/api/flashSales'
import type { FlashSale } from '@/types/flashSales'
import { formatApiError } from '@/utils/formatApiError'
import { flashSaleCountdown, verticalLabel } from '@/utils/buyerFormat'
import { flashSaleDetailLink } from '@/utils/buyerDetailLinks'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'

const { t } = useI18n()

const sales = ref<FlashSale[]>([])
const loading = ref(false)
const error = ref('')
const tick = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

function countdownFor(endAt: string) {
  return flashSaleCountdown(endAt, tick.value)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await listActiveFlashSales()
    sales.value = data.results ?? []
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.flashSales.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
  timer = setInterval(() => { tick.value = Date.now() }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
