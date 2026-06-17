<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.wholesale.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.wholesale.meta') }}</p>
    </header>

    <div v-if="wholesaleApproved" class="buyer-wholesale-banner">
      <Icon icon="solar:verified-check-bold" aria-hidden="true" />
      {{ t('buyerXp.wholesale.approvedBanner') }}
    </div>

    <section v-else class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.wholesale.applyTitle')" :subtitle="t('buyerXp.wholesale.applySubtitle')" />
      <div class="buyer-ride-field">
        <label>{{ t('buyerXp.wholesale.businessName') }}</label>
        <input v-model="form.business_name" type="text" placeholder="Your registered business" />
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.wholesale.tin') }}</label>
        <input v-model="form.tin_number" type="text" placeholder="Tax identification number" />
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.wholesale.address') }}</label>
        <input v-model="form.business_address" type="text" placeholder="Business location" />
      </div>
      <div class="buyer-btn-row buyer-form-actions">
        <button
          type="button"
          class="buyer-venue__chip buyer-venue__chip--primary"
          :disabled="applying || !form.business_name.trim()"
          @click="apply"
        >
          {{ applying ? t('buyerXp.wholesale.submitting') : t('buyerXp.wholesale.submit') }}
        </button>
      </div>
      <p v-if="applyMsg" class="buyer-xp-toast" :class="applyOk ? 'buyer-xp-toast--ok' : 'buyer-xp-toast--err'">{{ applyMsg }}</p>
      <p v-if="pendingReview" class="buyer-page-head__meta mt-2">{{ t('buyerXp.wholesale.pending') }}</p>
    </section>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <BuyerProductGridSection
      v-else-if="products.length"
      :products="products"
      :show-store-label="true"
      @add="onAdd"
    />

    <BuyerEmptyState
      v-else-if="!loading && !error"
      icon="solar:box-bold"
      :title="t('buyerXp.wholesale.emptyTitle')"
      :message="t('buyerXp.wholesale.emptyMessage')"
    >
      <template #action>
        <RouterLink :to="BUYER_DASHBOARD_ROUTE" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.features.service.market.subtitle') }}</RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { wholesalePublicApi, wholesaleUserApi } from '@/api/wholesale'
import { cartApi } from '@/api/cart'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'

const { t } = useI18n()
const auth = useAuthStore()
const refreshBuyerCart = inject<() => Promise<void>>('refreshBuyerCart', async () => {})
const openBuyerCart = inject<() => void>('openBuyerCart', () => {})

const me = ref<Record<string, unknown> | null>(null)
const products = ref<GridProduct[]>([])
const loading = ref(false)
const error = ref('')
const applying = ref(false)
const applyMsg = ref('')
const applyOk = ref(true)
const form = ref({ business_name: '', tin_number: '', business_address: '' })

const wholesaleApproved = computed(() => {
  const status = String(me.value?.status ?? '').toLowerCase()
  return status === 'approved' || status === 'active'
})

const pendingReview = computed(() => {
  const status = String(me.value?.status ?? '').toLowerCase()
  return status === 'pending' || status === 'submitted'
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (auth.isAuthenticated) {
      try {
        const { data } = await wholesaleUserApi.getMe()
        me.value = (data as Record<string, unknown>) ?? null
      } catch {
        me.value = null
      }
    }
    const { data } = await wholesalePublicApi.listProducts()
    const list = (data as { results?: GridProduct[] })?.results ?? (data as GridProduct[])
    products.value = Array.isArray(list) ? list : []
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.wholesale.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function apply() {
  if (!form.value.business_name.trim()) return
  applying.value = true
  applyMsg.value = ''
  try {
    await wholesaleUserApi.apply(form.value)
    applyMsg.value = t('buyerXp.wholesale.applicationSent')
    applyOk.value = true
    await load()
  } catch (e) {
    applyMsg.value = formatApiError(e, 'Application failed')
    applyOk.value = false
  } finally {
    applying.value = false
  }
}

async function onAdd(prod: GridProduct) {
  if (!auth.isAuthenticated) {
    error.value = t('buyerXp.common.signInToAdd')
    return
  }
  const skuId = prod.skus?.[0]?.id
  if (!skuId) return
  try {
    await cartApi.add(Number(skuId), 1)
    await refreshBuyerCart()
    openBuyerCart()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotAdd'))
  }
}

onMounted(load)
</script>
