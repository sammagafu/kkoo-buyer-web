<template>
  <div class="buyer-xp buyer-rewards">
    <header class="buyer-rewards__hero">
      <div class="buyer-rewards__hero-top">
        <p class="buyer-rewards__overline">{{ t('buyerXp.rewards.overline') }}</p>
        <Icon icon="solar:cup-star-bold" class="buyer-rewards__hero-icon" aria-hidden="true" />
      </div>
      <p class="buyer-rewards__balance-label">{{ t('buyerXp.rewards.availablePoints') }}</p>
      <h1 class="buyer-rewards__balance">{{ availablePoints }} <span>pts</span></h1>
      <p class="buyer-rewards__tagline">{{ t('buyerXp.rewards.tagline') }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <div v-if="!loading && balance" class="buyer-rewards__stats">
      <div class="buyer-rewards__stat buyer-rewards__stat--total">
        <span class="buyer-rewards__stat-label">{{ t('buyerXp.rewards.totalPoints') }}</span>
        <span class="buyer-rewards__stat-value">{{ totalPoints }}</span>
      </div>
      <div class="buyer-rewards__stat buyer-rewards__stat--min">
        <span class="buyer-rewards__stat-label">{{ t('buyerXp.rewards.minRedeem') }}</span>
        <span class="buyer-rewards__stat-value">{{ redemption?.min_redemption_points ?? '—' }}</span>
      </div>
      <div class="buyer-rewards__stat buyer-rewards__stat--vouchers">
        <span class="buyer-rewards__stat-label">{{ t('buyerXp.rewards.vouchers') }}</span>
        <span class="buyer-rewards__stat-value">{{ vouchers.length }}</span>
      </div>
    </div>

    <section class="buyer-rewards__panel">
      <BuyerSectionHeader :title="t('buyerXp.rewards.giftVouchers')" />
      <BuyerEmptyState
        v-if="!loading && !vouchers.length"
        icon="solar:ticket-bold"
        :title="t('buyerXp.rewards.noVouchers')"
        :message="t('buyerXp.rewards.noVouchersMessage')"
      />
      <ul v-else class="buyer-rewards__list">
        <li v-for="v in vouchers" :key="String(v.id)" class="buyer-rewards__row">
          <span class="buyer-rewards__row-mark" data-tone="voucher" aria-hidden="true">
            <Icon icon="solar:ticket-bold" width="18" height="18" />
          </span>
          <div class="buyer-rewards__row-copy">
            <span class="buyer-rewards__row-title">{{ v.code }}</span>
            <span class="buyer-rewards__row-meta">{{ t('buyerXp.rewards.vouchers') }}</span>
          </div>
          <strong class="buyer-rewards__row-amount">{{ formatBuyerMoney(v.amount) }}</strong>
        </li>
      </ul>
    </section>

    <section class="buyer-rewards__panel">
      <BuyerSectionHeader :title="t('buyerXp.rewards.recentActivity')" />
      <BuyerEmptyState
        v-if="!loading && !transactions.length"
        icon="solar:history-bold"
        :title="t('buyerXp.rewards.noActivity')"
        :message="t('buyerXp.rewards.noActivityMessage')"
      />
      <ul v-else class="buyer-rewards__list">
        <li v-for="(tx, i) in transactions" :key="i" class="buyer-rewards__row">
          <span class="buyer-rewards__row-mark" :data-tone="activityTone(tx)" aria-hidden="true">
            <Icon :icon="activityIcon(tx)" width="18" height="18" />
          </span>
          <div class="buyer-rewards__row-copy">
            <span class="buyer-rewards__row-title">
              {{ String(tx.description || tx.type || t('buyerXp.common.transactionFallback')) }}
            </span>
            <span v-if="tx.created_at" class="buyer-rewards__row-meta">{{ formatTxDate(String(tx.created_at)) }}</span>
          </div>
          <strong class="buyer-rewards__row-amount" :data-tone="activityTone(tx)">
            {{ formatActivityPoints(tx) }}
          </strong>
        </li>
      </ul>
      <p class="buyer-rewards__policy">{{ t('buyerXp.rewards.policyTagline') }}</p>
    </section>

    <div class="buyer-rewards__links">
      <BuyerHubCard
        :title="t('buyerXp.shareEarn.overline')"
        :subtitle="t('buyerXp.shareEarn.dashboardSub')"
        icon="solar:share-bold"
        :to="{ name: 'buyer.share-earn' }"
      />
      <BuyerHubCard
        :title="t('buyerXp.rewards.referFriends')"
        :subtitle="t('buyerXp.rewards.referFriendsSub')"
        icon="solar:users-group-rounded-bold"
        :to="{ name: 'buyer.referral' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { rewardsUserApi, type GiftVoucherRow } from '@/api/rewards'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerMoney } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

const { t } = useI18n()
const loading = ref(false)
const error = ref('')
const balance = ref<{ total_balance?: number; available_balance?: number } | null>(null)
const redemption = ref<{ min_redemption_points?: number; points_to_cash_rate?: number } | null>(null)
const vouchers = ref<GiftVoucherRow[]>([])
const transactions = ref<Record<string, unknown>[]>([])

const totalPoints = computed(() => Math.round(balance.value?.total_balance ?? 0))
const availablePoints = computed(() =>
  Math.round(balance.value?.available_balance ?? balance.value?.total_balance ?? 0),
)

function activityPoints(tx: Record<string, unknown>): number {
  const raw = tx.points ?? tx.amount ?? 0
  return Number(raw) || 0
}

function activityTone(tx: Record<string, unknown>): 'in' | 'out' | 'neutral' {
  const pts = activityPoints(tx)
  const type = String(tx.type || '').toLowerCase()
  if (pts < 0 || type.includes('redeem') || type.includes('spend')) return 'out'
  if (pts > 0 || type.includes('earn') || type.includes('bonus') || type.includes('cashback')) return 'in'
  return 'neutral'
}

function activityIcon(tx: Record<string, unknown>): string {
  const tone = activityTone(tx)
  if (tone === 'in') return 'solar:arrow-down-bold'
  if (tone === 'out') return 'solar:arrow-up-bold'
  return 'solar:history-bold'
}

function formatActivityPoints(tx: Record<string, unknown>): string {
  const pts = activityPoints(tx)
  const sign = pts > 0 ? '+' : ''
  return `${sign}${pts} pts`
}

function formatTxDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [bal, red, vouch, tx] = await Promise.allSettled([
      rewardsUserApi.getBalance(),
      rewardsUserApi.getRedemptionOptions(),
      rewardsUserApi.getGiftVouchers({ type: 'all' }),
      rewardsUserApi.getTransactions({ page_size: 10 }),
    ])

    if (bal.status === 'fulfilled') {
      balance.value = bal.value.data ?? null
    } else {
      throw bal.reason
    }

    if (red.status === 'fulfilled') {
      redemption.value = red.value.data ?? null
    }

    if (vouch.status === 'fulfilled') {
      vouchers.value = vouch.value.data?.results ?? []
    }

    if (tx.status === 'fulfilled') {
      const txData = tx.value.data as { results?: Record<string, unknown>[] }
      transactions.value = txData?.results ?? []
    }
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.buyer-rewards {
  gap: 1.15rem;
}

.buyer-rewards__hero {
  position: relative;
  overflow: hidden;
  padding: 1.35rem 1.25rem 1.4rem;
  border-radius: 1.35rem;
  color: #fff;
  background:
    radial-gradient(ellipse at 88% 0%, rgba(247, 168, 41, 0.38), transparent 42%),
    radial-gradient(ellipse at 0% 100%, rgba(255, 255, 255, 0.1), transparent 45%),
    linear-gradient(145deg, #6b3aa3 0%, #5c308f 48%, #3d1f5c 100%);
}

.buyer-rewards__hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
}

.buyer-rewards__overline {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.buyer-rewards__hero-icon {
  width: 1.45rem;
  height: 1.45rem;
  color: var(--kkoo-accent, #f7a829);
}

.buyer-rewards__balance-label {
  margin: 0 0 0.25rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.buyer-rewards__balance {
  margin: 0;
  font-family: var(--kkoo-font-display, 'Poppins', sans-serif);
  font-size: clamp(1.85rem, 5vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.buyer-rewards__balance span {
  font-size: 0.55em;
  font-weight: 700;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.72);
}

.buyer-rewards__tagline {
  margin: 0.65rem 0 0;
  max-width: 34ch;
  font-size: 0.84rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.78);
}

.buyer-rewards__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.buyer-rewards__stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 0.85rem 1.05rem;
  border-radius: 1.1rem;
  border: 1px solid transparent;
}

.buyer-rewards__stat--total {
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 10%, var(--buyer-canvas, #f7f4f0));
  border-color: color-mix(in srgb, var(--kkoo-primary, #5c308f) 16%, transparent);
}

.buyer-rewards__stat--min {
  background: color-mix(in srgb, #f7a829 12%, var(--buyer-canvas, #f7f4f0));
  border-color: color-mix(in srgb, #f7a829 22%, transparent);
}

.buyer-rewards__stat--vouchers {
  background: color-mix(in srgb, #10b981 10%, var(--buyer-canvas, #f7f4f0));
  border-color: color-mix(in srgb, #10b981 18%, transparent);
}

.buyer-rewards__stat-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--buyer-muted, #6b5f78);
}

.buyer-rewards__stat-value {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--buyer-ink, #1f1b24);
  font-variant-numeric: tabular-nums;
}

.buyer-rewards__panel {
  padding: 1.2rem 1.15rem 1.25rem;
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 4%, #fff);
  border: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 10%, transparent);
  box-shadow: none;
}

.buyer-rewards__panel :deep(.buyer-section-head) {
  margin-bottom: 0.95rem;
}

.buyer-rewards__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.buyer-rewards__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.15rem;
  border-bottom: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 8%, transparent);
}

.buyer-rewards__row:last-child {
  border-bottom: none;
  padding-bottom: 0.15rem;
}

.buyer-rewards__row:first-child {
  padding-top: 0.15rem;
}

.buyer-rewards__row-mark {
  display: grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.8rem;
  flex-shrink: 0;
}

.buyer-rewards__row-mark[data-tone='in'],
.buyer-rewards__row-mark[data-tone='voucher'] {
  color: #047857;
  background: rgba(16, 185, 129, 0.14);
}

.buyer-rewards__row-mark[data-tone='out'] {
  color: #9a3412;
  background: rgba(247, 168, 41, 0.2);
}

.buyer-rewards__row-mark[data-tone='neutral'] {
  color: var(--kkoo-primary, #5c308f);
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 12%, transparent);
}

.buyer-rewards__row-copy {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.buyer-rewards__row-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--buyer-ink, #1f1b24);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.buyer-rewards__row-meta {
  font-size: 0.72rem;
  color: var(--buyer-muted, #6b5f78);
}

.buyer-rewards__row-amount {
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--buyer-ink, #1f1b24);
}

.buyer-rewards__row-amount[data-tone='in'] {
  color: #047857;
}

.buyer-rewards__row-amount[data-tone='out'] {
  color: #9a3412;
}

.buyer-rewards__policy {
  margin: 1rem 0 0;
  padding-top: 0.95rem;
  border-top: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 10%, transparent);
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--buyer-muted, #6b5f78);
}

.buyer-rewards__links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.buyer-rewards__links :deep(.buyer-hub-card) {
  margin: 0;
  border-radius: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 10%, transparent);
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 4%, #fff);
  box-shadow: none;
}

@media (max-width: 420px) {
  .buyer-rewards__stats {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .buyer-rewards {
    gap: 1.35rem;
  }

  .buyer-rewards__hero {
    padding: 1.55rem 1.45rem 1.6rem;
  }

  .buyer-rewards__panel {
    padding: 1.35rem 1.35rem 1.4rem;
  }
}

html[data-bs-theme='dark'] .buyer-rewards__panel,
html.theme-dark .buyer-rewards__panel,
html[data-bs-theme='dark'] .buyer-rewards__links :deep(.buyer-hub-card),
html.theme-dark .buyer-rewards__links :deep(.buyer-hub-card) {
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 14%, var(--buyer-surface, #1a1520));
  border-color: color-mix(in srgb, #fff 10%, transparent);
}

html[data-bs-theme='dark'] .buyer-rewards__stat--total,
html.theme-dark .buyer-rewards__stat--total {
  background: rgba(92, 48, 143, 0.2);
}

html[data-bs-theme='dark'] .buyer-rewards__stat--min,
html.theme-dark .buyer-rewards__stat--min {
  background: rgba(247, 168, 41, 0.12);
}

html[data-bs-theme='dark'] .buyer-rewards__stat--vouchers,
html.theme-dark .buyer-rewards__stat--vouchers {
  background: rgba(16, 185, 129, 0.12);
}
</style>
