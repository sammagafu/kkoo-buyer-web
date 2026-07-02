<template>
  <div class="buyer-xp">
    <header class="buyer-home-hero buyer-detail-card">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.wallet.overline') }}</p>
      <h1 class="buyer-home-hero__name">{{ formatBuyerMoney(wallet?.balance, 'TZS 0') }}</h1>
      <p class="buyer-home-hero__tagline">{{ t('buyerXp.wallet.tagline') }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="loadError" class="buyer-xp-toast buyer-xp-toast--err">{{ loadError }}</p>

    <div v-if="wallet && !loading" class="buyer-stat-grid">
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ formatBuyerMoney(wallet.balance, 'TZS 0') }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.wallet.balance') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ formatBuyerMoney(summary?.total_deposited, 'TZS 0') }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.wallet.totalDeposited') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ formatBuyerMoney(summary?.total_spent, 'TZS 0') }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.wallet.totalSpent') }}</span>
      </div>
    </div>

    <section class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.wallet.topUp')" :subtitle="t('buyerXp.wallet.topUpSub')" />
      <div class="buyer-ride-field">
        <label>{{ t('buyerXp.wallet.amount') }}</label>
        <input v-model.number="depositAmount" type="number" min="1000" step="500" />
      </div>
      <div class="buyer-btn-row buyer-form-actions">
        <button
          type="button"
          class="buyer-venue__chip buyer-venue__chip--primary"
          :disabled="depositing"
          @click="deposit"
        >
          {{ depositing ? t('buyerXp.wallet.processing') : t('buyerXp.wallet.addMoney') }}
        </button>
      </div>
      <p v-if="depositMsg" class="buyer-xp-toast mt-2" :class="depositOk ? 'buyer-xp-toast--ok' : 'buyer-xp-toast--err'">{{ depositMsg }}</p>
    </section>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.wallet.transactions')" />
      <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
      <BuyerEmptyState
        v-else-if="!transactions.length"
        icon="solar:wallet-bold"
        :title="t('buyerXp.wallet.emptyTitle')"
        :message="t('buyerXp.wallet.emptyMessage')"
      />
      <div v-else class="buyer-hub-list">
        <article v-for="tx in transactions" :key="String(tx.id)" class="buyer-detail-card">
          <div class="buyer-detail-row">
            <span>{{ tx.description || tx.type || t('buyerXp.common.transactionFallback') }}</span>
            <strong :class="Number(tx.amount) < 0 ? 'text-danger' : ''">{{ formatBuyerMoney(tx.amount) }}</strong>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
