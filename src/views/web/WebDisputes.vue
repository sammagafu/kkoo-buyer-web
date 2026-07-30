<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.disputes.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.disputes.meta') }}</p>
    </header>

    <section class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.disputes.openTitle')" :subtitle="t('buyerXp.disputes.openSubtitle')" />

      <p v-if="prefillNote" class="buyer-xp-toast buyer-xp-toast--ok mb-2">{{ prefillNote }}</p>

      <div class="buyer-ride-field">
        <label>{{ t('buyerXp.disputes.orderId') }}</label>
        <input
          v-model.number="form.order_id"
          type="number"
          min="1"
          :placeholder="t('buyerXp.disputes.orderId')"
        />
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
          :disabled="creating || !canSubmit"
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
        <div class="buyer-detail-row">
          <span>{{ t('buyerXp.disputes.subject') }}</span>
          <span>{{ d.subject_type }} #{{ d.order_id || d.subject_id || d.assignment_id }}</span>
        </div>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { disputesUserApi } from '@/api/disputes'
import { formatApiError } from '@/utils/formatApiError'
import { orderStatusPillClass } from '@/utils/buyerFormat'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

type DisputeRow = Record<string, unknown>

const { t } = useI18n()
const route = useRoute()
const disputes = ref<DisputeRow[]>([])
const loading = ref(false)
const error = ref('')
const creating = ref(false)
const createMsg = ref('')
const createOk = ref(true)
const ridePrefillId = ref('')

const form = reactive({
  order_id: 0,
  reason: '',
  description: '',
})

const canSubmit = computed(
  () => form.order_id > 0 && form.reason.trim().length > 0 && form.description.trim().length > 0,
)

const prefillNote = computed(() => {
  if (form.order_id > 0 && ridePrefillId.value) {
    return t('buyerXp.disputes.prefillOrderAndRide', { order: form.order_id, ride: ridePrefillId.value })
  }
  if (form.order_id > 0) {
    return t('buyerXp.disputes.prefillOrder', { order: form.order_id })
  }
  if (ridePrefillId.value) {
    return t('buyerXp.disputes.prefillRide', { ride: ridePrefillId.value })
  }
  return ''
})

function applyQueryPrefill() {
  const orderRaw = String(route.query.order_id ?? '').trim()
  const rideRaw = String(route.query.ride_id ?? '').trim()
  const orderId = Number(orderRaw)
  if (Number.isFinite(orderId) && orderId > 0) {
    form.order_id = orderId
  }
  if (rideRaw) {
    ridePrefillId.value = rideRaw
    const rideNote = t('buyerXp.disputes.rideContext', { ride: rideRaw })
    if (!form.description.includes(rideNote)) {
      form.description = form.description.trim()
        ? `${form.description.trim()}\n\n${rideNote}`
        : rideNote
    }
  }
}

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
  if (!canSubmit.value) return
  creating.value = true
  createMsg.value = ''
  try {
    await disputesUserApi.create({
      order_id: form.order_id,
      reason: form.reason.trim(),
      description: form.description.trim(),
    })
    createMsg.value = t('buyerXp.disputes.submitted')
    createOk.value = true
    form.order_id = 0
    form.reason = ''
    form.description = ''
    ridePrefillId.value = ''
    await load()
  } catch (e) {
    createMsg.value = formatApiError(e, t('buyerXp.common.couldNotLoad'))
    createOk.value = false
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  applyQueryPrefill()
  void load()
})
</script>
