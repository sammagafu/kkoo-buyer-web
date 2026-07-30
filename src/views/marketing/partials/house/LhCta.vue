<template>
  <section id="get-started" ref="rootRef" class="lh-section lh-cta lh-page lh-reveal">
    <div class="lh-cta__panel">
      <div class="lh-cta__copy">
        <p class="lh-cta__kicker">{{ t('landingHouse.kickers.cta') }}</p>
        <h2 class="lh-cta__title">{{ t('landingHouse.footer.title') }}</h2>
        <p class="lh-cta__lead">{{ t('landingHouse.footer.lead') }}</p>
      </div>

      <div class="lh-cta__actions">
        <LhButton
          as="router-link"
          :to="buyerRoutes.marketplace"
          variant="on-dark"
          size="lg"
          with-arrow
        >
          {{ t('landingHouse.ctaPrimary') }}
        </LhButton>
        <LhButton
          as="router-link"
          :to="buyerRoutes.merchant"
          variant="ghost"
          size="lg"
          class="lh-cta__ghost"
        >
          {{ t('landingHouse.ctaSell') }}
        </LhButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { buyerRoutes } from '@/config/landing-links'
import { useHouseReveal } from '@/composables/useHouseReveal'
import LhButton from './LhButton.vue'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)
</script>
