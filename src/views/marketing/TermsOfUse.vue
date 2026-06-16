<template>
  <MarketingLayout>
    <section class="lp-section lp-legal">
      <b-container class="px-lg-4">
        <h1 class="lp-legal-title">{{ t('legal.termsTitle') }}</h1>
        <p class="lp-legal-updated text-muted small mb-4">{{ t('legal.lastUpdated') }}: {{ lastUpdated }}</p>

        <div class="lp-legal-content">
          <p class="lp-legal-intro">{{ t('legal.termsIntro') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.termsAcceptance') }}</h2>
          <p>{{ t('legal.termsAcceptanceBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.termsServices') }}</h2>
          <p>{{ t('legal.termsServicesBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.termsConduct') }}</h2>
          <p>{{ t('legal.termsConductBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.termsContact') }}</h2>
          <p>{{ t('legal.termsContactBody') }}</p>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MarketingLayout from './MarketingLayout.vue'

const { t } = useI18n()
const lastUpdated = '2025-01-01'
</script>
