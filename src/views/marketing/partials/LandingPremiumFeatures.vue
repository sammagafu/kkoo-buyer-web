<template>
  <!-- Structured feature list — no card grid -->
  <section id="features" class="ui-section ui-section--muted">
    <div class="ui-container">
      <header class="ui-section-head ui-reveal" ref="headRef">
        <p class="ui-eyebrow">{{ t('landing.premium.featuresEyebrow') }}</p>
        <h2 class="ui-heading">{{ t('landing.premium.featuresTitle') }}</h2>
        <p class="ui-lead ui-lead--center">{{ t('landing.premium.featuresLead') }}</p>
      </header>

      <ul class="ui-features" role="list">
        <li
          v-for="(feature, i) in premiumFeatures"
          :key="feature.key"
          class="ui-features__item ui-reveal"
          :style="{ '--i': i }"
        >
          <span class="ui-features__icon" aria-hidden="true">
            <Icon :icon="feature.icon" />
          </span>
          <div class="ui-features__body">
            <h3 class="ui-features__title">{{ t(feature.titleKey) }}</h3>
            <p class="ui-features__desc">{{ t(feature.descKey) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { premiumFeatures } from '@/config/landing-premium'
import { observeRevealChildren, useLandingReveal } from '@/composables/useLandingReveal'

const { t } = useI18n()
const headRef = ref<HTMLElement | null>(null)
useLandingReveal(headRef)
onMounted(() => observeRevealChildren(headRef.value?.closest('section') ?? null))
</script>

<style scoped>
.ui-features {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  max-width: 40rem;
  margin-inline: auto;
}

@media (min-width: 768px) {
  .ui-features {
    max-width: none;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 3rem;
  }
}

.ui-features__item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--ui-border);
}

@media (min-width: 768px) {
  .ui-features__item {
    border-bottom: none;
    padding: 0;
  }
}

.ui-features__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--ui-radius);
  font-size: 1.2rem;
  color: var(--ui-primary);
  background: var(--ui-primary-soft);
}

.ui-features__title {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ui-text);
}

.ui-features__desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--ui-text-muted);
}
</style>
