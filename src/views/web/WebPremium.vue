<template>
  <div class="buyer-xp">
    <header class="buyer-home-hero">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.premium.overline') }}</p>
      <h1 class="buyer-home-hero__name">{{ t('buyerXp.premium.title') }}</h1>
      <p class="buyer-home-hero__tagline">{{ t('buyerXp.premium.tagline') }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>
    <p v-if="upgradeMsg" class="buyer-xp-toast buyer-xp-toast--ok">{{ upgradeMsg }}</p>

    <section v-if="benefits.length" class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.premium.benefits')" />
      <div class="buyer-hub-list">
        <article v-for="(b, i) in benefits" :key="i" class="buyer-detail-card">
          <div class="buyer-detail-row">
            <Icon icon="solar:star-bold" class="text-warning" aria-hidden="true" />
            <span>{{ benefitLabel(b) }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="buyer-hub-list">
      <article v-for="tier in tiers" :key="String(tier.id ?? tier.name)" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <strong>{{ tier.name || tier.tier || t('buyerXp.common.tierFallback') }}</strong>
          <span>{{ formatBuyerMoney(tier.price, t('buyerXp.common.free')) }}</span>
        </div>
        <p v-if="tier.description" class="buyer-page-head__meta">{{ tier.description }}</p>
        <div class="buyer-btn-row mt-2">
          <button
            type="button"
            class="buyer-venue__chip buyer-venue__chip--primary"
            :disabled="upgrading"
            @click="upgrade(tier)"
          >
            {{ upgrading ? t('buyerXp.premium.processing') : t('buyerXp.premium.upgrade') }}
          </button>
        </div>
      </article>
      <BuyerEmptyState
        v-if="!loading && !tiers.length"
        icon="solar:crown-bold"
        :title="t('buyerXp.premium.emptyTitle')"
        :message="t('buyerXp.premium.emptyMessage')"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { premiumUserApi } from '@/api/premium'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerMoney } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type TierRow = Record<string, unknown>
type BenefitRow = Record<string, unknown>

const { t } = useI18n()
const tiers = ref<TierRow[]>([])
const benefits = ref<BenefitRow[]>([])
const loading = ref(false)
const error = ref('')
const upgrading = ref(false)
const upgradeMsg = ref('')

function normalizeList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  return ((data as { results?: unknown[] })?.results ?? []) as unknown[]
}

function benefitLabel(b: BenefitRow) {
  return String(b.title ?? b.name ?? b.description ?? t('buyerXp.common.benefitFallback'))
}

async function load() {
  loading.value = true
  try {
    const [tRes, b] = await Promise.all([premiumUserApi.listTiers(), premiumUserApi.listBenefits()])
    tiers.value = normalizeList(tRes.data) as TierRow[]
    benefits.value = normalizeList(b.data) as BenefitRow[]
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function upgrade(tier: TierRow) {
  upgrading.value = true
  upgradeMsg.value = ''
  try {
    await premiumUserApi.upgrade({
      tier_id: tier.id != null ? Number(tier.id) : undefined,
      program: 'buyer',
    })
    upgradeMsg.value = 'Upgrade requested. Check your notifications for payment.'
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    upgrading.value = false
  }
}

onMounted(load)
</script>
