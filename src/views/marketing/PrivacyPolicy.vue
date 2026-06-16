<template>
  <MarketingLayout>
    <section class="lp-section lp-legal">
      <b-container class="px-lg-4">
        <h1 class="lp-legal-title">{{ t('legal.privacyTitle') }}</h1>
        <p class="lp-legal-updated text-muted small mb-4">{{ t('legal.lastUpdated') }}: {{ lastUpdated }}</p>

        <div class="lp-legal-content">
          <p class="lp-legal-intro">{{ t('legal.privacyIntro') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.privacyCollect') }}</h2>
          <p>{{ t('legal.privacyCollectBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.privacyUse') }}</h2>
          <p>{{ t('legal.privacyUseBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.privacyShare') }}</h2>
          <p>{{ t('legal.privacyShareBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.googleUserDataTitle') }}</h2>
          <h3 class="lp-legal-h3">{{ t('legal.googleUserDataAccessed') }}</h3>
          <p>{{ t('legal.googleUserDataAccessedBody') }}</p>
          <h3 class="lp-legal-h3">{{ t('legal.googleUserDataUsage') }}</h3>
          <p>{{ t('legal.googleUserDataUsageBody') }}</p>
          <h3 class="lp-legal-h3">{{ t('legal.googleUserDataStorage') }}</h3>
          <p>{{ t('legal.googleUserDataStorageBody') }}</p>
          <h3 class="lp-legal-h3">{{ t('legal.googleUserDataSharing') }}</h3>
          <p>{{ t('legal.googleUserDataSharingBody') }}</p>
          <h3 class="lp-legal-h3">{{ t('legal.googleLimitedUse') }}</h3>
          <p>{{ t('legal.googleLimitedUseBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.privacyContact') }}</h2>
          <p>{{ t('legal.privacyContactBody') }}</p>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MarketingLayout from './MarketingLayout.vue'

const { t } = useI18n()
const lastUpdated = '2026-05-08'
</script>
