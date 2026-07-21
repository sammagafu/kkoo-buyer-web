<template>
  <ul class="mk-feature-stack" role="list">
    <li v-for="item in items" :key="item.title" class="lh-dark-card is-in">
      <span v-if="item.icon" class="lh-dark-card__icon" aria-hidden="true">
        <Icon :icon="item.icon" width="22" height="22" />
      </span>
      <div class="lh-dark-card__body">
        <p v-if="item.tag" class="mk-feature-list__tag">{{ item.tag }}</p>
        <h3>{{ item.title }}</h3>
        <p>{{ item.copy }}</p>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

export type MkFeatureItem = {
  title: string
  copy: string
  tag?: string
  icon?: string
}

defineProps<{
  items: MkFeatureItem[]
}>()
</script>

<style scoped>
.mk-feature-stack {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--lh-space-4, 1rem);
}
</style>
