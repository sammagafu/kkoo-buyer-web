<template>
  <section id="top" ref="rootRef" class="lh-hero lh-page lh-reveal is-visible">
    <div class="lh-hero__shell">
      <div class="lh-hero__grid">
        <div class="lh-hero__copy">
          <p class="lh-hero__brand">{{ t('landingHouse.hero.brand') }}</p>
          <h1>{{ t('landingHouse.hero.title') }}</h1>
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
