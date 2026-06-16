<template>
  <MarketingLayout>
    <section class="lp-section lp-legal">
      <b-container class="px-lg-4">
        <h1 class="lp-legal-title">{{ t('appHomepage.pageTitle') }}</h1>
        <p class="lp-legal-intro">{{ t('appHomepage.lead') }}</p>

        <h2 class="lp-legal-h2">{{ t('appHomepage.functionTitle') }}</h2>
        <p class="text-muted small mb-3">{{ t('appHomepage.functionIntro') }}</p>
        <ul class="lp-legal-list">
          <li>{{ t('appHomepage.functionMarketplace') }}</li>
          <li>{{ t('appHomepage.functionEats') }}</li>
          <li>{{ t('appHomepage.functionRides') }}</li>
          <li>{{ t('appHomepage.functionBusiness') }}</li>
          <li>{{ t('appHomepage.functionAccount') }}</li>
        </ul>

        <h2 class="lp-legal-h2">{{ t('appHomepage.dataTitle') }}</h2>
        <p>{{ t('appHomepage.dataIntro') }}</p>
        <ul class="lp-legal-list">
          <li>{{ t('appHomepage.dataAccount') }}</li>
          <li>{{ t('appHomepage.dataOrders') }}</li>
          <li>{{ t('appHomepage.dataLocation') }}</li>
          <li>{{ t('appHomepage.dataUsage') }}</li>
        </ul>
        <p>{{ t('appHomepage.dataNoSell') }}</p>

        <div class="mt-4">
          <router-link :to="{ name: 'pages.privacy' }" class="btn btn-primary">
            {{ t('appHomepage.privacyCta') }}
          </router-link>
        </div>

        <h2 class="lp-legal-h2 mt-5">{{ t('appHomepage.contactLabel') }}</h2>
        <p class="mb-0">
          <a href="mailto:info@kkooapp.co.tz">info@kkooapp.co.tz</a>
        </p>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MarketingLayout from './MarketingLayout.vue'

const { t } = useI18n()
</script>
<style scoped>
.lp-legal-list {
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}

.lp-legal-list li {
  margin-bottom: 0.5rem;
}
</style>

