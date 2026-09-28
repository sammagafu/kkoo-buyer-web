<template>
  <section id="top" ref="rootRef" class="lh-hero lh-hero--billboard lh-page lh-reveal is-visible">
    <div class="lh-hero__shell">
      <div class="lh-hero__grid">
        <div class="lh-hero__copy">
          <div class="lh-hero__billboard">
            <p class="lh-hero__brand">{{ t('landingHouse.hero.brand') }}</p>
            <h1>{{ t('landingHouse.hero.title') }}</h1>
          </div>
          <div class="lh-hero__close">
            <p class="lh-hero__lead">{{ t('landingHouse.hero.lead') }}</p>
            <div class="lh-hero__cta">
              <LhButton
                as="router-link"
                :to="buyerRoutes.marketplace"
                variant="primary"
                size="lg"
                with-arrow
              >
                {{ t('landingHouse.ctaPrimary') }}
              </LhButton>
              <LhButton
                as="router-link"
                :to="buyerRoutes.signUp"
                variant="secondary"
                size="lg"
              >
                {{ t('landingHouse.ctaSecondary') }}
              </LhButton>
            </div>
            <p class="lh-hero__assurance">{{ t('landingHouse.hero.assurance') }}</p>
          </div>
        </div>

        <div class="lh-hero__visual">
          <img
            :src="heroImage"
            :alt="t('landingHouse.hero.imageAlt')"
            width="960"
            height="1200"
            fetchpriority="high"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { houseHeroImage as heroImage } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'
import LhButton from './LhButton.vue'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
</script>

<style scoped>
.lh-hero {
  padding-block: clamp(3rem, 8vw, 6.5rem);
}

.lh-hero.lh-page {
  width: min(100% - clamp(1.75rem, 5.5vw, 4rem), var(--lh-content-max, 72rem));
}

.lh-hero__copy {
  container-type: inline-size;
  gap: calc(1rem * var(--lh-phi, 1.618));
  padding: clamp(2.5rem, 5vw, 4rem) clamp(1.6rem, 3vw, 2.5rem);
}

.lh-hero__billboard {
  --lh-phi: 1.6180339887;
  --lh-hero-module: clamp(2.6rem, 6.2vw, 4.75rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(var(--lh-hero-module) / var(--lh-phi) / var(--lh-phi));
  font-size: var(--lh-hero-module);
}

.lh-hero__brand {
  margin: 0;
  font-size: calc(1em / var(--lh-phi));
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1;
  color: var(--lh-accent, #f7a829);
}

.lh-hero h1 {
  display: block;
  margin: 0;
  max-width: 18ch;
  font-size: 1em;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.12;
  text-wrap: balance;
}

.lh-hero__close {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
}

.lh-hero__lead {
  margin: 0;
  max-width: 36ch;
  font-size: clamp(0.95rem, 1.4vw, 1.06rem);
  line-height: 1.42;
}

.lh-hero__cta {
  gap: 0.5rem;
  margin-top: 0;
}

.lh-hero__assurance {
  margin: 0;
}

@media (min-width: 900px) {
  .lh-hero__copy {
    padding: clamp(2.75rem, 5vw, 4.25rem) clamp(1.85rem, 3.2vw, 2.75rem);
  }

  .lh-hero__grid {
    min-height: 40rem;
  }
}
</style>

