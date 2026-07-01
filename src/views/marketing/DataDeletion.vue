<template>
  <MarketingLayout>
    <section class="lp-section lp-legal">
      <b-container class="px-lg-4">
        <h1 class="lp-legal-title">{{ t('legal.dataDeletionTitle') }}</h1>
        <p class="lp-legal-updated text-muted small mb-4">{{ t('legal.lastUpdated') }}: {{ lastUpdated }}</p>

        <div class="lp-legal-content">
          <p class="lp-legal-intro">{{ t('legal.dataDeletionIntro') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.dataDeletionHowTitle') }}</h2>
          <p>{{ t('legal.dataDeletionHowBody') }}</p>
          <ul class="lp-legal-list">
            <li>{{ t('legal.dataDeletionHowApp') }}</li>
            <li>
              {{ t('legal.dataDeletionHowEmail') }}
              <a :href="mailto">{{ t('legal.contactEmail') }}</a>
            </li>
          </ul>
          <p class="small text-muted">{{ t('legal.dataDeletionHowInclude') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.dataDeletionWhatTitle') }}</h2>
          <p>{{ t('legal.dataDeletionWhatBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.dataDeletionRetainTitle') }}</h2>
          <p>{{ t('legal.dataDeletionRetainBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.dataDeletionTimelineTitle') }}</h2>
          <p>{{ t('legal.dataDeletionTimelineBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.dataDeletionMetaTitle') }}</h2>
          <p>{{ t('legal.dataDeletionMetaBody') }}</p>

          <h2 class="lp-legal-h2">{{ t('legal.dataDeletionContact') }}</h2>
          <p>
            {{ t('legal.dataDeletionContactBody') }}
            <a :href="mailto">{{ t('legal.contactEmail') }}</a>.
          </p>
          <p class="mb-0">
            <router-link :to="{ name: 'pages.privacy' }">{{ t('legal.privacyCta') }}</router-link>
          </p>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MarketingLayout from './MarketingLayout.vue'

const { t } = useI18n()
const lastUpdated = '2026-07-01'

const mailto = computed(() => `mailto:${t('legal.contactEmail')}?subject=${encodeURIComponent('KKOO account data deletion request')}`)
</script>

<style scoped>
.lp-legal-list {
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}
.lp-legal-list li {
  margin-bottom: 0.35rem;
}
</style>
