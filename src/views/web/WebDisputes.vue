<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.disputes.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.disputes.meta') }}</p>
    </header>

    <section class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.disputes.openTitle')" :subtitle="t('buyerXp.disputes.openSubtitle')" />
      <div class="buyer-ride-field">
        <label>{{ t('buyerXp.disputes.orderId') }}</label>
        <input v-model.number="form.subject_id" type="number" min="1" :placeholder="t('buyerXp.disputes.orderId')" />
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.disputes.reason') }}</label>
        <input v-model="form.reason" type="text" :placeholder="t('buyerXp.disputes.reasonPlaceholder')" />
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.disputes.details') }}</label>
        <textarea v-model="form.description" rows="3" :placeholder="t('buyerXp.disputes.detailsPlaceholder')" />
      </div>
      <div class="buyer-btn-row buyer-form-actions">
        <button
          type="button"
          class="buyer-venue__chip buyer-venue__chip--primary"
          :disabled="creating || !form.subject_id || !form.reason.trim()"
          @click="create"
        >
          {{ creating ? t('buyerXp.disputes.submitting') : t('buyerXp.disputes.submit') }}
        </button>
      </div>
      <p v-if="createMsg" class="buyer-xp-toast mt-2" :class="createOk ? 'buyer-xp-toast--ok' : 'buyer-xp-toast--err'">{{ createMsg }}</p>
    </section>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="disputes.length" class="buyer-hub-list">
      <article v-for="d in disputes" :key="String(d.id)" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <strong>#{{ d.id }}</strong>
          <span :class="orderStatusPillClass(d.status)">{{ d.status }}</span>
        </div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.disputes.subject') }}</span><span>{{ d.subject_type }} #{{ d.subject_id }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.disputes.reason') }}</span><span>{{ d.reason }}</span></div>
      </article>
    </section>

    <BuyerEmptyState
      v-else-if="!loading"
      icon="solar:shield-warning-bold"
      :title="t('buyerXp.disputes.emptyTitle')"
      :message="t('buyerXp.disputes.emptyMessage')"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { disputesUserApi } from '@/api/disputes'
import { formatApiError } from '@/utils/formatApiError'
import { orderStatusPillClass } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type DisputeRow = Record<string, unknown>

const { t } = useI18n()
const disputes = ref<DisputeRow[]>([])
const loading = ref(false)
const error = ref('')
const creating = ref(false)
const createMsg = ref('')
const createOk = ref(true)
const form = reactive({
  subject_id: 0,
  reason: '',
  description: '',
})

async function load() {
  loading.value = true
  try {
    const { data } = await disputesUserApi.list()
    disputes.value = ((data as { results?: DisputeRow[] })?.results ?? []) as DisputeRow[]
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function create() {
  if (!form.subject_id || !form.reason.trim()) return
  creating.value = true
  createMsg.value = ''
  try {
    await disputesUserApi.create({
      subject_type: 'order',
      subject_id: form.subject_id,
      reason: form.reason.trim(),
      description: form.description || undefined,
    })
    createMsg.value = t('buyerXp.disputes.submitted')
    createOk.value = true
    form.subject_id = 0
    form.reason = ''
    form.description = ''
    await load()
  } catch (e) {
    createMsg.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
    createOk.value = false
  } finally {
    creating.value = false
  }
}

onMounted(load)
</script>
