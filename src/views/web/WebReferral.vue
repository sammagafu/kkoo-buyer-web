<template>
  <div class="buyer-xp">
    <header class="buyer-home-hero">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.referral.overline') }}</p>
      <h1 class="buyer-home-hero__name">{{ code || t('buyerXp.referral.codeFallback') }}</h1>
      <p class="buyer-home-hero__tagline">{{ t('buyerXp.referral.tagline') }}</p>
      <div v-if="code" class="buyer-btn-row">
        <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="copyCode">
          {{ copied ? t('buyerXp.common.copied') : t('buyerXp.referral.copyCode') }}
        </button>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <div v-if="stats" class="buyer-stat-grid">
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ stats.total_referrals ?? 0 }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.referral.referrals') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ stats.completed_referrals ?? 0 }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.referral.completed') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ formatBuyerMoney(stats.total_earnings, 'TZS 0') }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.referral.earnings') }}</span>
      </div>
    </div>

    <section class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.referral.haveCode')" :subtitle="t('buyerXp.referral.haveCodeSub')" />
      <div class="buyer-ride-field">
        <input v-model="applyCode" type="text" :placeholder="t('buyerXp.referral.codePlaceholder')" />
      </div>
      <div class="buyer-btn-row buyer-form-actions">
        <button
          type="button"
          class="buyer-venue__chip buyer-venue__chip--primary"
          :disabled="applying || !applyCode.trim()"
          @click="apply"
        >
          {{ applying ? t('buyerXp.referral.applying') : t('buyerXp.referral.applyCode') }}
        </button>
      </div>
      <p v-if="applyMsg" class="buyer-xp-toast mt-2" :class="applyOk ? 'buyer-xp-toast--ok' : 'buyer-xp-toast--err'">{{ applyMsg }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { referralApi } from '@/api/referral'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerMoney } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'

const { t } = useI18n()
const code = ref('')
const stats = ref<Record<string, unknown> | null>(null)
const loading = ref(false)
const error = ref('')
const copied = ref(false)
const applyCode = ref('')
const applying = ref(false)
const applyMsg = ref('')
const applyOk = ref(true)

async function load() {
  loading.value = true
  try {
    const [codeRes, statsRes] = await Promise.all([referralApi.getCode(), referralApi.getStats()])
    code.value = codeRes.data?.code ?? ''
    stats.value = statsRes.data ?? null
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function copyCode() {
  if (!code.value) return
  try {
    await navigator.clipboard.writeText(code.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // ignore
  }
}

async function apply() {
  if (!applyCode.value.trim()) return
  applying.value = true
  applyMsg.value = ''
  try {
    const { data } = await referralApi.apply(applyCode.value.trim())
    applyMsg.value = data?.message || t('buyerXp.referral.codeApplied')
    applyOk.value = true
    applyCode.value = ''
    await load()
  } catch (e) {
    applyMsg.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
    applyOk.value = false
  } finally {
    applying.value = false
  }
}

onMounted(load)
</script>
