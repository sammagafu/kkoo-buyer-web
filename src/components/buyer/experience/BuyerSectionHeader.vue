<template>
  <header class="buyer-section-head">
    <div>
      <p v-if="overline" class="buyer-section-head__overline">{{ overline }}</p>
      <h2 class="buyer-section-head__title">{{ title }}</h2>
      <p v-if="subtitle" class="buyer-section-head__sub">{{ subtitle }}</p>
    </div>
    <RouterLink v-if="actionTo" :to="actionTo" class="buyer-section-head__action">
      {{ actionLabel || 'See all' }}
      <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

defineProps<{
  title: string
  overline?: string
  subtitle?: string
  actionLabel?: string
  actionTo?: RouteLocationRaw
}>()
</script>
