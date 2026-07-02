<template>
  <div class="buyer-xp">
    <header class="buyer-home-hero buyer-detail-card">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.rewards.overline') }}</p>
      <h1 class="buyer-home-hero__name">{{ totalPoints }} pts</h1>
      <p class="buyer-home-hero__tagline">{{ t('buyerXp.rewards.tagline') }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <div v-if="!loading && balance" class="buyer-stat-grid">
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ totalPoints }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.rewards.totalPoints') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ availablePoints }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.rewards.availablePoints') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ redemption?.min_redemption_points ?? '—' }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.rewards.minRedeem') }}</span>
      </div>
      <div class="buyer-stat-card">
        <span class="buyer-stat-card__value">{{ vouchers.length }}</span>
        <span class="buyer-stat-card__label">{{ t('buyerXp.rewards.vouchers') }}</span>
      </div>
    </div>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.rewards.giftVouchers')" />
      <BuyerEmptyState
        v-if="!loading && !vouchers.length"
        icon="solar:ticket-bold"
        :title="t('buyerXp.rewards.noVouchers')"
        :message="t('buyerXp.rewards.noVouchersMessage')"
      />
      <div v-else class="buyer-hub-list">
        <article v-for="v in vouchers" :key="String(v.id)" class="buyer-detail-card">
          <div class="buyer-detail-row">
            <strong>{{ v.code }}</strong>
            <span>{{ formatBuyerMoney(v.amount) }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.rewards.recentActivity')" />
      <BuyerEmptyState
        v-if="!loading && !transactions.length"
        icon="solar:history-bold"
        :title="t('buyerXp.rewards.noActivity')"
        :message="t('buyerXp.rewards.noActivityMessage')"
      />
      <div v-else class="buyer-hub-list">
        <article v-for="(tx, i) in transactions" :key="i" class="buyer-detail-card">
          <div class="buyer-detail-row">
            <span>{{ tx.description || tx.type || t('buyerXp.common.transactionFallback') }}</span>
            <strong>{{ tx.points ?? tx.amount }}</strong>
          </div>
        </article>
      </div>
    </section>

    <BuyerHubCard :title="t('buyerXp.shareEarn.overline')" :subtitle="t('buyerXp.shareEarn.dashboardSub')" icon="solar:share-bold" :to="{ name: 'buyer.share-earn' }" />
    <BuyerHubCard :title="t('buyerXp.rewards.referFriends')" :subtitle="t('buyerXp.rewards.referFriendsSub')" icon="solar:users-group-rounded-bold" :to="{ name: 'buyer.referral' }" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
const availablePoints = computed(() => Math.round(balance.value?.available_balance ?? balance.value?.total_balance ?? 0))

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
