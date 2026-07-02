<template>
  <section id="preview" class="lp-premium-section">
    <div class="container-lg">
      <header class="lp-premium-section__head lp-premium-reveal">
        <p class="lp-premium-section__eyebrow">{{ t('landing.premium.previewEyebrow') }}</p>
        <h2 class="lp-premium-section__title">{{ t('landing.premium.previewTitle') }}</h2>
        <p class="lp-premium-section__lead">{{ t('landing.premium.previewLead') }}</p>
      </header>

      <div class="lp-premium-preview" role="list">
        <article
          v-for="(slide, i) in premiumPreviewSlides"
          :key="slide.key"
          class="lp-premium-preview__item lp-premium-reveal lp-vivid-tile"
          :class="`lp-vivid-tile--${previewTones[i % previewTones.length]}`"
          role="listitem"
        >
          <LandingPhoneMockup :image-src="slide.image" :alt="t(slide.titleKey)" />
          <div class="lp-premium-preview__meta">
            <h3>{{ t(slide.titleKey) }}</h3>
            <p>{{ t(slide.descKey) }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LandingPhoneMockup from '@/views/marketing/partials/LandingPhoneMockup.vue'
import { premiumPreviewSlides } from '@/config/landing-premium'

const { t } = useI18n()
const previewTones = ['ride', 'food', 'shop', 'orange'] as const
</script>

<style scoped>
.lp-premium-preview {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.25rem 0 0.75rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.lp-premium-preview__item {
  flex: 0 0 min(100%, 15rem);
  scroll-snap-align: start;
  text-align: center;
  padding: 1.25rem 1rem 1rem;
  border-radius: var(--lp-premium-radius-lg);
  border: 1px solid transparent;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.lp-premium-preview__item:hover {
  transform: translateY(-4px);
  box-shadow: var(--lp-premium-shadow-vivid);
}

@media (min-width: 768px) {
  .lp-premium-preview__item {
    flex-basis: 17rem;
  }
}

.lp-premium-preview__meta {
  margin-top: 1rem;
}

.lp-premium-preview__meta h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 800;
}

.lp-premium-preview__meta p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--lp-premium-muted);
  line-height: 1.45;
}
</style>
