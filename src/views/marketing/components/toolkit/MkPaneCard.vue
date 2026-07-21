<template>
  <article class="lh-pane-card" :class="{ 'lh-pane-card--dark': dark }">
    <span v-if="icon" class="lh-pane-card__icon" aria-hidden="true">
      <Icon :icon="icon" width="22" height="22" />
    </span>
    <p v-if="tag" class="mk-feature-list__tag">{{ tag }}</p>
    <h3 class="lh-pane-card__title">{{ title }}</h3>
    <p v-if="copy" class="lh-pane-card__text">{{ copy }}</p>
    <component
      v-if="ctaTo"
      :is="ctaExternal ? 'a' : 'router-link'"
      :to="ctaExternal ? undefined : ctaTo"
      :href="ctaExternal ? String(ctaTo) : undefined"
      class="lh-pane-card__action"
      :aria-label="ctaLabel || title"
    >
      <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
    </component>
  </article>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  copy?: string
  tag?: string
  icon?: string
  dark?: boolean
  ctaTo?: RouteLocationRaw | string
  ctaLabel?: string
  ctaExternal?: boolean
}>()
</script>
