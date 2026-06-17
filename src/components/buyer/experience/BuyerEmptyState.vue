<template>
  <div class="buyer-empty">
    <span class="buyer-empty__icon" aria-hidden="true">
      <Icon :icon="icon" />
    </span>
    <h2 class="buyer-empty__title">{{ title }}</h2>
    <p v-if="message" class="buyer-empty__message">{{ message }}</p>
    <div v-if="$slots.action" class="buyer-btn-row buyer-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    title: string
    message?: string
    icon?: string
  }>(),
  {
    icon: 'solar:box-minimalistic-bold',
  },
)
</script>
