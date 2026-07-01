<template>
  <RouterLink
    v-if="hasActiveOrder && activeOrder"
    :to="{ name: 'buyer.order', params: { id: String(activeOrder.id) } }"
    class="buyer-track-bar"
  >
    <Icon icon="solar:map-point-wave-bold" class="buyer-track-bar__icon" aria-hidden="true" />
    <span class="buyer-track-bar__label">{{ t('buyerXp.home.trackOrder') }}</span>
    <span class="buyer-track-bar__meta">#{{ activeOrder.order_number || activeOrder.id }}</span>
    <Icon icon="solar:arrow-right-linear" class="buyer-track-bar__arrow" aria-hidden="true" />
  </RouterLink>
  <RouterLink
    v-else
    :to="{ name: 'buyer.orders' }"
    class="buyer-track-bar buyer-track-bar--idle"
  >
    <Icon icon="solar:map-point-wave-bold" class="buyer-track-bar__icon" aria-hidden="true" />
    <span class="buyer-track-bar__label">{{ t('buyerXp.home.trackOrder') }}</span>
    <Icon icon="solar:arrow-right-linear" class="buyer-track-bar__arrow" aria-hidden="true" />
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useBuyerActiveOrder } from '@/composables/useBuyerActiveOrder'

const { t } = useI18n()
const { activeOrder, hasActiveOrder } = useBuyerActiveOrder()
</script>
