<template>
  <ul class="mk-process-grid" role="list">
    <li
      v-for="(item, index) in items"
      :key="item.key ?? item.title"
      class="lh-process-card"
    >
      <span class="lh-process-card__num" aria-hidden="true">{{ formatIndex(index) }}</span>
      <span v-if="item.icon" class="lh-process-card__icon" aria-hidden="true">
        <Icon :icon="item.icon" width="20" height="20" />
      </span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.copy }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

export type MkProcessItem = {
  key?: string
  title: string
  copy: string
  icon?: string
}

defineProps<{
  items: MkProcessItem[]
}>()

function formatIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<style scoped>
.mk-process-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--lh-space-4, 1rem);
}

@media (min-width: 768px) {
  .mk-process-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
</style>
