<template>
  <div class="buyer-xp">
    <header class="buyer-home-hero">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.weeklyPass.overline') }}</p>
      <h1 class="buyer-home-hero__name">{{ pass?.title || t('buyerXp.weeklyPass.challengesFallback') }}</h1>
      <p class="buyer-home-hero__tagline">{{ pass?.description || t('buyerXp.weeklyPass.taglineFallback') }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>
    <p v-else-if="claimMsg" class="buyer-xp-toast buyer-xp-toast--ok">{{ claimMsg }}</p>

    <section v-if="tasks.length" class="buyer-hub-list">
      <article v-for="task in tasks" :key="String(task.id)" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <strong>{{ task.title }}</strong>
          <span class="buyer-status-pill">{{ taskProgress(task) }}</span>
        </div>
        <p v-if="task.description" class="buyer-page-head__meta">{{ task.description }}</p>
      </article>
    </section>

    <div v-if="pass?.id && canClaim" class="buyer-btn-row">
      <button
        type="button"
        class="buyer-venue__chip buyer-venue__chip--primary"
        :disabled="claiming"
        @click="claim"
      >
        {{ claiming ? t('buyerXp.weeklyPass.claiming') : t('buyerXp.weeklyPass.claimReward') }}
      </button>
    </div>

    <BuyerEmptyState
      v-if="!loading && !pass"
      icon="solar:calendar-mark-bold"
      :title="t('buyerXp.weeklyPass.emptyTitle')"
      :message="t('buyerXp.weeklyPass.emptyMessage')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { weeklyPassApi } from '@/api/weeklyPass'
import { formatApiError } from '@/utils/formatApiError'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type PassData = {
  id?: number
  title?: string
  description?: string
  tasks?: Array<Record<string, unknown>>
  progress?: { completed?: boolean; tasks_completed?: number }
}

const { t } = useI18n()
const pass = ref<PassData | null>(null)
const loading = ref(false)
const error = ref('')
const claiming = ref(false)
const claimMsg = ref('')

const tasks = computed(() => pass.value?.tasks ?? [])
const canClaim = computed(() => pass.value?.progress?.completed === true)

function taskProgress(task: Record<string, unknown>) {
  const cur = Number(task.current_count ?? 0)
  const target = Number(task.target_count ?? 1)
  return `${cur}/${target}`
}

async function load() {
  loading.value = true
  try {
    const { data } = await weeklyPassApi.getActive()
    pass.value = (data as PassData) ?? null
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function claim() {
  if (!pass.value?.id) return
  claiming.value = true
  claimMsg.value = ''
  try {
    await weeklyPassApi.claim(pass.value.id)
    claimMsg.value = t('buyerXp.weeklyPass.rewardClaimed')
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    claiming.value = false
  }
}

onMounted(load)
</script>
