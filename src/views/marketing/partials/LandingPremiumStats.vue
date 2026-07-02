<template>
  <!-- Social proof stats — numbers only, no cards -->
  <section id="stats" class="ui-section ui-section--muted">
    <div class="ui-container">
      <header class="ui-section-head ui-reveal" ref="headRef">
        <p class="ui-eyebrow">{{ t('landing.statsByTheNumbers') }}</p>
        <h2 class="ui-heading">{{ t('landing.premium.statsTitle') }}</h2>
      </header>

      <dl class="ui-stats ui-reveal">
        <div v-for="stat in premiumStats" :key="stat.key" class="ui-stats__item">
          <dt class="ui-stats__value">{{ stat.value }}</dt>
          <dd class="ui-stats__label">{{ t(stat.labelKey) }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { premiumStats } from '@/config/landing-premium'
import { useLandingReveal } from '@/composables/useLandingReveal'

const { t } = useI18n()
const headRef = ref<HTMLElement | null>(null)
useLandingReveal(headRef)
</script>

<style scoped>
.ui-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem 1.5rem;
  margin: 0;
  max-width: 48rem;
  margin-inline: auto;
  text-align: center;
}

@media (min-width: 768px) {
  .ui-stats {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

.ui-stats__item {
  margin: 0;
}

.ui-stats__value {
  margin: 0 0 0.35rem;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ui-text);
}

.ui-stats__label {
  margin: 0;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}
</style>
