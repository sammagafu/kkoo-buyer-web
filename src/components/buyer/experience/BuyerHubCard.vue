<template>
  <component
    :is="to ? RouterLink : 'button'"
    :to="to"
    type="button"
    class="buyer-hub-card"
    @click="!to ? $emit('click') : undefined"
  >
    <span class="buyer-hub-card__icon" :class="tone ? `buyer-hub-card__icon--${tone}` : ''" aria-hidden="true">
      <Icon :icon="icon" />
    </span>
    <span class="buyer-hub-card__copy">
      <strong class="buyer-hub-card__title">{{ title }}</strong>
      <span v-if="subtitle" class="buyer-hub-card__sub">{{ subtitle }}</span>
    </span>
    <Icon icon="solar:alt-arrow-right-linear" class="buyer-hub-card__chev" aria-hidden="true" />
  </component>
</template>

<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

defineProps<{
  title: string
  subtitle?: string
  icon: string
  to?: RouteLocationRaw
  tone?: 'primary' | 'orange' | 'teal' | 'pink' | 'purple' | 'gold'
}>()

defineEmits<{ click: [] }>()
</script>
