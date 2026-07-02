<template>
  <!-- Split showcase: copy left, image right -->
  <section id="showcase" class="ui-section">
    <div class="ui-container ui-showcase">
      <div class="ui-showcase__copy ui-reveal" ref="copyRef">
        <p class="ui-eyebrow">{{ t('landing.premium.previewEyebrow') }}</p>
        <h2 class="ui-heading">{{ t(showcase.titleKey) }}</h2>
        <p class="ui-lead">{{ t(showcase.descKey) }}</p>
        <router-link :to="buyerRoutes.marketplace" class="ui-btn ui-btn--primary ui-showcase__cta">
          {{ t(showcase.ctaKey) }}
        </router-link>
      </div>
      <div class="ui-showcase__media ui-reveal" ref="mediaRef">
        <img
          :src="showcase.image"
          :alt="t(showcase.titleKey)"
          class="ui-showcase__img"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { premiumShowcase } from '@/config/landing-premium'
import { buyerRoutes } from '@/config/landing-links'
import { useLandingReveal } from '@/composables/useLandingReveal'

const { t } = useI18n()
const showcase = premiumShowcase
const copyRef = ref<HTMLElement | null>(null)
const mediaRef = ref<HTMLElement | null>(null)
useLandingReveal(copyRef)
useLandingReveal(mediaRef)
</script>

<style scoped>
.ui-showcase {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 992px) {
  .ui-showcase {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.ui-showcase__cta {
  margin-top: 1.5rem;
}

.ui-showcase__img {
  width: 100%;
  border-radius: var(--ui-radius-lg);
  box-shadow: var(--ui-shadow-md);
  object-fit: cover;
  aspect-ratio: 3 / 2;
  background: var(--ui-surface-muted);
}
</style>
