<template>
  <div class="buyer-xp">
    <header class="buyer-home-hero">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.shareEarn.overline') }}</p>
      <h1 class="buyer-home-hero__name">{{ formatBuyerMoney(summary.totalCommissionTzs, 'TZS 0') }}</h1>
      <p class="buyer-home-hero__tagline">{{ t('buyerXp.shareEarn.tagline') }}</p>
      <div class="buyer-btn-row">
        <button type="button" class="buyer-venue__chip" :disabled="refreshing" @click="load">
          {{ refreshing ? t('buyerXp.common.refreshing') : t('buyerXp.common.refresh') }}
        </button>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <div v-if="!loading && !error" class="buyer-stat-grid">
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ summary.referralPoints }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.referralPoints') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ formatBuyerMoney(summary.shareCommissionPaid) }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.sharePaid') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ formatBuyerMoney(summary.shareCommissionPending) }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.sharePending') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ summary.recommendationPoints }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.recommendationPoints') }}</span>
      </div>
    </div>

    <section v-if="!loading" class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.shareEarn.analyticsTitle')" :subtitle="t('buyerXp.shareEarn.analyticsSub')" />
      <div class="buyer-stat-grid buyer-stat-grid--compact">
        <div class="buyer-stat-card">
          <span class="buyer-stat-card__value">{{ summary.referralCount }}</span>
          <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.invites') }}</span>
        </div>
        <div class="buyer-stat-card">
          <span class="buyer-stat-card__value">{{ summary.completedReferrals }}</span>
          <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.converted') }}</span>
        </div>
        <div class="buyer-stat-card">
          <span class="buyer-stat-card__value">
            {{ summary.referralConversionPct == null ? '—' : `${summary.referralConversionPct}%` }}
          </span>
          <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.conversionRate') }}</span>
        </div>
        <div class="buyer-stat-card">
          <span class="buyer-stat-card__value">{{ summary.shareUnitsSold }}</span>
          <span class="buyer-stat-card__label">{{ t('buyerXp.shareEarn.unitsSold') }}</span>
        </div>
      </div>

      <div v-if="monthly.length" class="share-earn-bars" aria-hidden="true">
        <div v-for="bucket in monthly" :key="bucket.month" class="share-earn-bars__col">
          <div
            class="share-earn-bars__bar"
            :style="{ height: `${barHeight(bucket)}%` }"
            :title="monthLabel(bucket.month)"
          />
          <span class="share-earn-bars__label">{{ monthShort(bucket.month) }}</span>
        </div>
      </div>
    </section>

    <section v-if="!loading" class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.shareEarn.referralTitle')" :subtitle="t('buyerXp.shareEarn.referralSub')" />
      <p class="share-earn-code">{{ referralCode || t('buyerXp.referral.codeFallback') }}</p>
      <div class="buyer-btn-row">
        <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="copyReferral">
          {{ copiedReferral ? t('buyerXp.common.copied') : t('buyerXp.shareEarn.copyReferral') }}
        </button>
        <button v-if="referralShareUrl" type="button" class="buyer-venue__chip" @click="copyReferralLink">
          {{ copiedLink ? t('buyerXp.common.copied') : t('buyerXp.shareEarn.copyLink') }}
        </button>
        <a
          v-if="whatsappReferralUrl"
          class="buyer-venue__chip"
          :href="whatsappReferralUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
      <p v-if="offers?.earn?.referral?.referrer_bonus" class="share-earn-hint">
        {{ t('buyerXp.shareEarn.referralBonusHint', { pts: offers.earn.referral.referrer_bonus }) }}
      </p>
    </section>

    <section v-if="!loading" class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.shareEarn.linkSharingTitle')" :subtitle="t('buyerXp.shareEarn.linkSharingSub')" />
      <p v-if="offers?.earn?.share?.share_commission_percent" class="share-earn-hint">
        {{
          t('buyerXp.shareEarn.shareRateHint', {
            pct: offers.earn.share.share_commission_percent,
            bonus: offers.earn.share.share_purchase_bonus ?? 0,
          })
        }}
      </p>
    </section>

    <section v-if="!loading" class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.shareEarn.activityTitle')" :subtitle="t('buyerXp.shareEarn.activitySub')" />
      <BuyerEmptyState
        v-if="!activity.length"
        icon="solar:chart-2-bold"
        :title="t('buyerXp.shareEarn.emptyTitle')"
        :message="t('buyerXp.shareEarn.emptyMessage')"
      />
      <div v-else class="buyer-hub-list">
        <article v-for="row in activity" :key="row.id" class="buyer-detail-card">
          <div class="buyer-detail-row">
            <div>
              <strong>{{ channelLabel(row.channel) }}</strong>
              <p class="share-earn-meta">{{ row.label }}</p>
              <p class="share-earn-meta">{{ formatBuyerDateTime(row.at) }}</p>
            </div>
            <div class="share-earn-amount">
              <strong>{{ row.unit === 'tzs' ? formatBuyerMoney(row.amount) : `${row.amount} pts` }}</strong>
              <span v-if="row.status" :class="orderStatusPillClass(row.status)">{{ row.status }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <BuyerHubCard
      :title="t('buyerXp.referral.overline')"
      :subtitle="t('buyerXp.shareEarn.manageReferralSub')"
      icon="solar:users-group-rounded-bold"
      :to="{ name: 'buyer.referral' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { referralApi } from '@/api/referral'
import { sharesApi } from '@/api/shares'
import { rewardsUserApi } from '@/api/rewards'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerDateTime, formatBuyerMoney, orderStatusPillClass } from '@/utils/buyerFormat'
import {
  computeShareEarnSummary,
  groupShareEarnByMonth,
  shareEarnActivityRows,
  type RewardTransactionRow,
  type ShareEarnOffers,
  type ShareEarnStats,
  type ShareEarningsPayload,
  type ShareSaleRow,
} from '@/utils/shareEarnAnalytics'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

const { t } = useI18n()
const loading = ref(false)
const refreshing = ref(false)
const error = ref('')
const stats = ref<ShareEarnStats | null>(null)
const earnings = ref<ShareEarningsPayload | null>(null)
const transactions = ref<RewardTransactionRow[]>([])
const offers = ref<ShareEarnOffers | null>(null)
const referralCode = ref('')
const referralShareUrl = ref('')
const referralShareText = ref('')
const copiedReferral = ref(false)
const copiedLink = ref(false)

const summary = computed(() =>
  computeShareEarnSummary(stats.value, earnings.value, transactions.value),
)

const sales = computed(() => (earnings.value?.sales ?? []) as ShareSaleRow[])

const monthly = computed(() => groupShareEarnByMonth(sales.value, transactions.value))

const activity = computed(() => shareEarnActivityRows(sales.value, transactions.value))

const whatsappReferralUrl = computed(() => {
  const text = referralShareText.value || referralShareUrl.value
  if (!text) return ''
  return `https://wa.me/?text=${encodeURIComponent(text)}`
})

const maxMonthlyTotal = computed(() => {
  let max = 0
  for (const b of monthly.value) {
    const total = b.referralPoints + b.shareCommission + b.recommendationPoints
    if (total > max) max = total
  }
  return max || 1
})

function barHeight(bucket: { referralPoints: number; shareCommission: number; recommendationPoints: number }) {
  const total = bucket.referralPoints + bucket.shareCommission + bucket.recommendationPoints
  return Math.max(8, Math.round((total / maxMonthlyTotal.value) * 100))
}

function monthShort(key: string) {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString(undefined, { month: 'short' })
}

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString(undefined, { month: 'long', year: 'numeric' })
}

function channelLabel(channel: 'referral' | 'share' | 'recommendation') {
  if (channel === 'referral') return t('buyerXp.shareEarn.channelReferral')
  if (channel === 'share') return t('buyerXp.shareEarn.channelShare')
  return t('buyerXp.shareEarn.channelRecommendation')
}

async function copyText(value: string, flag: typeof copiedReferral) {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
    flag.value = true
    setTimeout(() => { flag.value = false }, 2000)
  } catch {
    // ignore
  }
}

function copyReferral() {
  copyText(referralCode.value, copiedReferral)
}

function copyReferralLink() {
  copyText(referralShareUrl.value || referralShareText.value, copiedLink)
}

async function loadEarnings() {
  const { data } = await sharesApi.getEarnings()
  earnings.value = (data ?? null) as ShareEarningsPayload | null
}

async function load() {
  const isRefresh = !loading.value
  if (isRefresh) refreshing.value = true
  else loading.value = true
  error.value = ''
  try {
    const [statsRes, earningsRes, txRes, offersRes, codeRes] = await Promise.all([
      referralApi.getStats(),
      sharesApi.getEarnings(),
      rewardsUserApi.getTransactions(),
      rewardsUserApi.getOffers(),
      referralApi.getCode(),
    ])
    stats.value = statsRes.data ?? null
    earnings.value = (earningsRes.data ?? null) as ShareEarningsPayload | null
    const txPayload = txRes.data
    transactions.value = Array.isArray(txPayload)
      ? txPayload
      : ((txPayload as { results?: RewardTransactionRow[] })?.results ?? [])
    offers.value = (offersRes.data ?? null) as ShareEarnOffers
    const codePayload = codeRes.data as { code?: string; share_url?: string; share_text?: string } | undefined
    referralCode.value = codePayload?.code ?? ''
    referralShareUrl.value = codePayload?.share_url ?? ''
    referralShareText.value = codePayload?.share_text ?? ''
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.share-earn-code {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 0.75rem;
}

.share-earn-hint {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  opacity: 0.85;
}

.share-earn-meta {
  margin: 0.15rem 0 0;
  font-size: 0.8125rem;
  opacity: 0.75;
}

.share-earn-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.share-earn-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  min-height: 7rem;
  padding: 0.5rem 0;
}

.share-earn-bars__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.share-earn-bars__bar {
  width: 100%;
  max-width: 2.5rem;
  min-height: 0.5rem;
  border-radius: 0.35rem 0.35rem 0 0;
  background: linear-gradient(180deg, var(--buyer-accent, #0d9488), color-mix(in srgb, var(--buyer-accent, #0d9488) 55%, transparent));
}

.share-earn-bars__label {
  font-size: 0.6875rem;
  opacity: 0.7;
}

.buyer-stat-grid--compact .buyer-stat-card__value {
  font-size: 1.125rem;
}
</style>
