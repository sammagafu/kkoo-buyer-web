<template>
  <div class="buyer-xp buyer-wallet">
    <header class="buyer-wallet__hero">
      <div class="buyer-wallet__hero-top">
        <p class="buyer-wallet__overline">{{ t('buyerXp.wallet.overline') }}</p>
        <Icon icon="solar:wallet-bold" class="buyer-wallet__hero-icon" aria-hidden="true" />
      </div>
      <p class="buyer-wallet__balance-label">{{ t('buyerXp.wallet.balance') }}</p>
      <h1 class="buyer-wallet__balance">{{ formatBuyerMoney(wallet?.balance, 'TZS 0') }}</h1>
      <p class="buyer-wallet__tagline">{{ t('buyerXp.wallet.tagline') }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="loadError" class="buyer-xp-toast buyer-xp-toast--err">{{ loadError }}</p>

    <div v-if="wallet && !loading" class="buyer-wallet__stats">
      <div class="buyer-wallet__stat buyer-wallet__stat--in">
        <span class="buyer-wallet__stat-label">{{ t('buyerXp.wallet.totalDeposited') }}</span>
        <span class="buyer-wallet__stat-value">{{ formatBuyerMoney(summary?.total_deposited, 'TZS 0') }}</span>
      </div>
      <div class="buyer-wallet__stat buyer-wallet__stat--out">
        <span class="buyer-wallet__stat-label">{{ t('buyerXp.wallet.totalSpent') }}</span>
        <span class="buyer-wallet__stat-value">{{ formatBuyerMoney(summary?.total_spent, 'TZS 0') }}</span>
      </div>
    </div>

    <section class="buyer-wallet__panel">
      <BuyerSectionHeader :title="t('buyerXp.wallet.topUp')" :subtitle="t('buyerXp.wallet.topUpSub')" />
      <div class="buyer-wallet__topup">
        <label class="buyer-wallet__field-label" for="wallet-topup-amount">{{ t('buyerXp.wallet.amount') }}</label>
        <input
          id="wallet-topup-amount"
          v-model.number="depositAmount"
          class="buyer-wallet__field-input"
          type="number"
          min="1000"
          step="500"
        />
        <button
          type="button"
          class="buyer-wallet__cta"
          :disabled="depositing"
          @click="deposit"
        >
          {{ depositing ? t('buyerXp.wallet.processing') : t('buyerXp.wallet.addMoney') }}
        </button>
      </div>
      <p
        v-if="depositMsg"
        class="buyer-xp-toast buyer-wallet__toast"
        :class="depositOk ? 'buyer-xp-toast--ok' : 'buyer-xp-toast--err'"
      >
        {{ depositMsg }}
      </p>
      <p class="buyer-wallet__policy">{{ t('buyerXp.wallet.policyTagline') }}</p>
    </section>

    <section class="buyer-wallet__panel">
      <BuyerSectionHeader :title="t('buyerXp.wallet.transactions')" />
      <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
      <BuyerEmptyState
        v-else-if="!transactions.length"
        icon="solar:wallet-bold"
        :title="t('buyerXp.wallet.emptyTitle')"
        :message="t('buyerXp.wallet.emptyMessage')"
      />
      <ul v-else class="buyer-wallet__tx-list">
        <li v-for="tx in transactions" :key="String(tx.id)" class="buyer-wallet__tx">
          <span class="buyer-wallet__tx-mark" :data-tone="txTone(tx)" aria-hidden="true">
            <Icon :icon="txIcon(tx)" width="18" height="18" />
          </span>
          <div class="buyer-wallet__tx-copy">
            <span class="buyer-wallet__tx-title">{{ tx.description || tx.type || t('buyerXp.common.transactionFallback') }}</span>
            <span class="buyer-wallet__tx-meta">{{ formatTxDate(tx.created_at) }} · {{ tx.status }}</span>
          </div>
          <strong class="buyer-wallet__tx-amount" :data-tone="txTone(tx)">
            {{ formatBuyerMoney(tx.amount) }}
          </strong>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { getWalletBalance, depositToWallet, getWalletTransactions, type WalletBalanceResponse } from '@/api/wallet'
import type { KkooWallet, WalletTransaction } from '@/types/wallet'
import { formatApiError } from '@/utils/formatApiError'
import { formatBuyerMoney } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

const { t } = useI18n()
const wallet = ref<KkooWallet | null>(null)
const summary = ref<Omit<WalletBalanceResponse, 'wallet'> | null>(null)
const transactions = ref<WalletTransaction[]>([])
const loading = ref(false)
const loadError = ref('')
const depositAmount = ref(10000)
const depositing = ref(false)
const depositMsg = ref('')
const depositOk = ref(true)

function txTone(tx: WalletTransaction): 'in' | 'out' | 'neutral' {
  const amount = Number(tx.amount)
  if (amount < 0 || tx.type === 'payment' || tx.type === 'withdrawal') return 'out'
  if (tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'cashback' || tx.type === 'bonus') return 'in'
  return amount >= 0 ? 'in' : 'out'
}

function txIcon(tx: WalletTransaction): string {
  const tone = txTone(tx)
  if (tone === 'in') return 'solar:arrow-down-bold'
  if (tone === 'out') return 'solar:arrow-up-bold'
  return 'solar:transfer-horizontal-bold'
}

function formatTxDate(iso?: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await getWalletBalance()
    wallet.value = data.wallet
    summary.value = {
      transaction_count: data.transaction_count,
      total_deposited: data.total_deposited,
      total_spent: data.total_spent,
      total_withdrawn: data.total_withdrawn,
    }
    const tx = await getWalletTransactions({ page_size: 20 })
    transactions.value = tx.results ?? []
  } catch (e) {
    loadError.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function deposit() {
  depositing.value = true
  depositMsg.value = ''
  try {
    const res = await depositToWallet(depositAmount.value)
    depositMsg.value = res.message || t('buyerXp.wallet.depositInitiated')
    depositOk.value = true
    if (res.deposit_url) window.open(res.deposit_url, '_blank')
    await load()
  } catch (e) {
    depositMsg.value = formatApiError(e, t('buyerXp.wallet.depositFailed'))
    depositOk.value = false
  } finally {
    depositing.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.buyer-wallet {
  gap: 1.15rem;
}

.buyer-wallet__hero {
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

.buyer-wallet__hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
}

.buyer-wallet__overline {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.buyer-wallet__hero-icon {
  width: 1.45rem;
  height: 1.45rem;
  color: var(--kkoo-accent, #f7a829);
}

.buyer-wallet__balance-label {
  margin: 0 0 0.25rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.buyer-wallet__balance {
  margin: 0;
  font-family: var(--kkoo-font-display, 'Poppins', sans-serif);
  font-size: clamp(1.85rem, 5vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.buyer-wallet__tagline {
  margin: 0.65rem 0 0;
  max-width: 28ch;
  font-size: 0.84rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.78);
}

.buyer-wallet__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.buyer-wallet__stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1rem 1.05rem;
  border-radius: 1.1rem;
  border: 1px solid transparent;
}

.buyer-wallet__stat--in {
  background: color-mix(in srgb, #10b981 10%, var(--buyer-canvas, #f7f4f0));
  border-color: color-mix(in srgb, #10b981 18%, transparent);
}

.buyer-wallet__stat--out {
  background: color-mix(in srgb, #f7a829 12%, var(--buyer-canvas, #f7f4f0));
  border-color: color-mix(in srgb, #f7a829 22%, transparent);
}

.buyer-wallet__stat-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--buyer-muted, #6b5f78);
}

.buyer-wallet__stat-value {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--buyer-ink, #1f1b24);
  font-variant-numeric: tabular-nums;
}

.buyer-wallet__panel {
  padding: 1.2rem 1.15rem 1.25rem;
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 4%, #fff);
  border: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 10%, transparent);
  box-shadow: none;
}

.buyer-wallet__panel :deep(.buyer-section-head) {
  margin-bottom: 0.95rem;
}

.buyer-wallet__topup {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.buyer-wallet__field-label {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--buyer-muted, #6b5f78);
}

.buyer-wallet__field-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem 1rem;
  border-radius: 0.95rem;
  border: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 16%, transparent);
  background: #fff;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--buyer-ink, #1f1b24);
  font-variant-numeric: tabular-nums;
}

.buyer-wallet__field-input:focus {
  outline: 2px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 35%, transparent);
  outline-offset: 1px;
  border-color: var(--kkoo-primary, #5c308f);
}

.buyer-wallet__cta {
  margin-top: 0.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.75rem 1.15rem;
  border: none;
  border-radius: 0.95rem;
  background: var(--kkoo-accent, #f7a829);
  color: #1a1200;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.buyer-wallet__cta:hover:not(:disabled) {
  filter: brightness(1.04);
  transform: translateY(-1px);
}

.buyer-wallet__cta:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.buyer-wallet__toast {
  margin: 0.85rem 0 0;
}

.buyer-wallet__policy {
  margin: 1rem 0 0;
  padding-top: 0.95rem;
  border-top: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 10%, transparent);
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--buyer-muted, #6b5f78);
}

.buyer-wallet__tx-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.buyer-wallet__tx {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.15rem;
  border-bottom: 1px solid color-mix(in srgb, var(--kkoo-primary, #5c308f) 8%, transparent);
}

.buyer-wallet__tx:last-child {
  border-bottom: none;
  padding-bottom: 0.15rem;
}

.buyer-wallet__tx:first-child {
  padding-top: 0.15rem;
}

.buyer-wallet__tx-mark {
  display: grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.8rem;
  flex-shrink: 0;
}

.buyer-wallet__tx-mark[data-tone='in'] {
  color: #047857;
  background: rgba(16, 185, 129, 0.14);
}

.buyer-wallet__tx-mark[data-tone='out'] {
  color: #9a3412;
  background: rgba(247, 168, 41, 0.2);
}

.buyer-wallet__tx-mark[data-tone='neutral'] {
  color: var(--kkoo-primary, #5c308f);
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 12%, transparent);
}

.buyer-wallet__tx-copy {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.buyer-wallet__tx-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--buyer-ink, #1f1b24);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.buyer-wallet__tx-meta {
  font-size: 0.72rem;
  color: var(--buyer-muted, #6b5f78);
  text-transform: capitalize;
}

.buyer-wallet__tx-amount {
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.buyer-wallet__tx-amount[data-tone='in'] {
  color: #047857;
}

.buyer-wallet__tx-amount[data-tone='out'] {
  color: #9a3412;
}

@media (min-width: 768px) {
  .buyer-wallet {
    gap: 1.35rem;
  }

  .buyer-wallet__hero {
    padding: 1.55rem 1.45rem 1.6rem;
  }

  .buyer-wallet__panel {
    padding: 1.35rem 1.35rem 1.4rem;
  }
}

html[data-bs-theme='dark'] .buyer-wallet__panel,
html.theme-dark .buyer-wallet__panel {
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 14%, var(--buyer-surface, #1a1520));
  border-color: color-mix(in srgb, #fff 10%, transparent);
}

html[data-bs-theme='dark'] .buyer-wallet__field-input,
html.theme-dark .buyer-wallet__field-input {
  background: var(--buyer-input-bg, #121016);
  color: var(--buyer-ink, #f5f2f8);
}

html[data-bs-theme='dark'] .buyer-wallet__stat--in,
html.theme-dark .buyer-wallet__stat--in {
  background: rgba(16, 185, 129, 0.12);
}

html[data-bs-theme='dark'] .buyer-wallet__stat--out,
html.theme-dark .buyer-wallet__stat--out {
  background: rgba(247, 168, 41, 0.12);
}
</style>
