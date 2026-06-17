<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.returns.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.returns.meta') }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="returns.length" class="buyer-hub-list">
      <article v-for="r in returns" :key="String(r.id)" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <strong>#{{ r.id }}</strong>
          <span :class="orderStatusPillClass(r.status)">{{ r.status || 'pending' }}</span>
        </div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.returns.order') }}</span><span>#{{ r.order_id }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.returns.reason') }}</span><span>{{ r.reason }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.returns.refund') }}</span><strong>{{ formatBuyerMoney(r.refund_amount) }}</strong></div>
        <div v-if="canCancel(r)" class="buyer-btn-row mt-2">
          <button type="button" class="buyer-venue__chip" @click="cancel(r)">{{ t('buyerXp.returns.cancelRequest') }}</button>
        </div>
      </article>
    </section>

    <BuyerEmptyState
      v-else-if="!loading"
      icon="solar:restart-bold"
      :title="t('buyerXp.returns.emptyTitle')"
      :message="t('buyerXp.returns.emptyMessage')"
    >
      <template #action>
        <RouterLink :to="{ name: 'buyer.orders' }" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.common.viewOrders') }}</RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { returnsApi } from '@/api/returns'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerMoney, orderStatusPillClass } from '@/utils/buyerFormat'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type ReturnRow = Record<string, unknown>

const { t } = useI18n()
const returns = ref<ReturnRow[]>([])
const loading = ref(false)
const error = ref('')

function canCancel(r: ReturnRow) {
  const s = String(r.status ?? '').toLowerCase()
  return s === 'pending' || s === 'submitted'
}

async function load() {
  loading.value = true
  try {
    const { data } = await returnsApi.list()
    returns.value = ((data as { results?: ReturnRow[] })?.results ?? []) as ReturnRow[]
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function cancel(r: ReturnRow) {
  const id = r.id
  if (id == null) return
  try {
    await returnsApi.cancel(id as string | number)
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  }
}

onMounted(load)
</script>
