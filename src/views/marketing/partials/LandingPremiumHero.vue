<template>
  <!-- Minimal hero: headline, short copy, dual CTA, single mockup -->
  <section id="top" class="ui-hero ui-section">
    <div class="ui-container ui-hero__grid">
      <div class="ui-hero__copy ui-reveal" ref="copyRef">
        <p class="ui-eyebrow">{{ t('landing.heroEyebrow') }}</p>
        <h1 class="ui-hero__title">{{ t('landing.premium.heroTitle') }}</h1>
        <p class="ui-lead">{{ t('landing.premium.heroSubtitle') }}</p>
        <div class="ui-hero__actions">
          <router-link
            :to="landingAnchors.download"
            class="ui-btn ui-btn--primary"
            @click="onAnchorClick('download', $event)"
          >
            {{ t('landing.premium.ctaPrimary') }}
          </router-link>
          <a
            href="#showcase"
            class="ui-btn ui-btn--ghost"
            @click.prevent="onAnchorClick('showcase', $event)"
          >
            {{ t('landing.premium.ctaSecondary') }}
          </a>
        </div>
      </div>
      <div class="ui-hero__media ui-reveal" ref="visualRef">
        <img
          :src="premiumHeroImage"
          :alt="t('landing.premium.heroMockupAlt')"
          class="ui-hero__img"
          loading="eager"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { premiumHeroImage } from '@/config/landing-premium'
import { landingAnchors } from '@/config/landing-links'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useLandingReveal } from '@/composables/useLandingReveal'

const { t } = useI18n()
const { onAnchorClick } = useLandingScroll()
const copyRef = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)
useLandingReveal(copyRef)
useLandingReveal(visualRef)
</script>

<style scoped>
.ui-hero {
  padding-top: clamp(3rem, 8vw, 5rem);
}

.ui-hero__grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 992px) {
  .ui-hero__grid {
    grid-template-columns: 1fr 1fr;
    gap: 3.5rem;
  }
}

.ui-hero__title {
  margin: 0 0 1rem;
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--ui-text);
}

.ui-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.ui-hero__media {
  display: flex;
  justify-content: center;
}

.ui-hero__img {
  width: 100%;
  max-width: 28rem;
  border-radius: var(--ui-radius-lg);
  box-shadow: var(--ui-shadow-md);
  object-fit: cover;
  aspect-ratio: 4 / 3;
}
</style>
