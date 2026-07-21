<template>
  <div class="lh-footer__panel mk-cta-panel">
    <div>
      <p v-if="kicker" class="lh-kicker">{{ kicker }}</p>
      <h2 class="lh-section__title">{{ title }}</h2>
      <p v-if="lead" class="lh-section__lead">{{ lead }}</p>
    </div>
    <div class="mk-cta-panel__actions">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  kicker?: string
  title: string
  lead?: string
}>()
</script>

<style scoped>
.mk-cta-panel {
  margin-top: 0;
}

.mk-cta-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--lh-space-3, 0.75rem);
  align-items: center;
}

.mk-cta-panel .lh-section__title,
.mk-cta-panel .lh-section__lead {
  color: var(--lh-inverse-fg, #ffffff);
}

.mk-cta-panel .lh-kicker {
  color: var(--lh-eyebrow-on-dark, rgba(255, 255, 255, 0.78));
}
</style>
