<template>
  <section class="buyer-post-success" :aria-label="t('buyerXp.postSuccess.ariaLabel')">
    <div class="buyer-post-success__rate">
      <div class="buyer-post-success__rate-mark" aria-hidden="true">
        <Icon icon="solar:shield-check-bold" width="22" height="22" />
      </div>
      <div class="buyer-post-success__rate-copy">
        <p class="buyer-post-success__rate-value">{{ rateLabel }}</p>
        <p class="buyer-post-success__rate-hint">{{ rateHint }}</p>
      </div>
    </div>

    <p class="buyer-post-success__escrow">{{ t('buyerXp.postSuccess.escrow') }}</p>

    <RouterLink
      class="buyer-post-success__dispute"
      :to="disputeTo"
    >
      <span class="buyer-post-success__dispute-icon" aria-hidden="true">
        <Icon icon="solar:shield-warning-bold" width="18" height="18" />
      </span>
      <span class="buyer-post-success__dispute-copy">
        <strong>{{ t('buyerXp.postSuccess.disputeTitle') }}</strong>
        <span>{{ disputeSubtitle }}</span>
      </span>
      <Icon icon="solar:alt-arrow-right-linear" class="buyer-post-success__dispute-chev" aria-hidden="true" />
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const props = withDefaults(
  defineProps<{
    /** buy = marketplace checkout, send = Send me, move = ride/parcel */
    channel: 'buy' | 'send' | 'move'
    /** Optional subject id for dispute deep-link (order or ride id). */
    subjectId?: string | number | null
    /** Override displayed completion rate, e.g. "98%". */
    rate?: string
  }>(),
  { subjectId: null, rate: '' },
)

const { t } = useI18n()

const rateLabel = computed(() =>
  props.rate?.trim()
    ? t('buyerXp.postSuccess.rateValue', { rate: props.rate.trim() })
    : t('buyerXp.postSuccess.rateValueDefault'),
)

const rateHint = computed(() => t(`buyerXp.postSuccess.rateHint.${props.channel}`))

const disputeSubtitle = computed(() => t(`buyerXp.postSuccess.disputeSub.${props.channel}`))

const disputeTo = computed<RouteLocationRaw>(() => {
  if (props.channel === 'buy' && props.subjectId != null && String(props.subjectId).trim()) {
    return { name: 'buyer.disputes', query: { order_id: String(props.subjectId) } }
  }
  if (props.channel === 'move' && props.subjectId != null && String(props.subjectId).trim()) {
    return { name: 'buyer.disputes', query: { ride_id: String(props.subjectId) } }
  }
  return { name: 'buyer.disputes' }
})
</script>
