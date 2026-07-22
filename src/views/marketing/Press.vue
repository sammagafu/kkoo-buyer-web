<template>
  <TrustPageShell :kicker="t('trust.pressKicker')" :title="t('trust.pressTitle')" :lead="t('trust.pressLead')">
    <div class="trust-page__grid">
      <article class="trust-page__card">
        <h2>{{ t('trust.pressBrandTitle') }}</h2>
        <p>{{ t('trust.pressBrandBody') }}</p>
      </article>
      <article class="trust-page__card">
        <h2>{{ t('trust.pressMediaTitle') }}</h2>
        <p>
          {{ t('trust.pressMediaBody') }}
          <a :href="`mailto:${companyLegal.pressEmail}`">{{ companyLegal.pressEmail }}</a>
        </p>
      </article>
    </div>
  </TrustPageShell>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { companyLegal } from '@/config/company-trust'
import TrustPageShell from '@/views/marketing/components/TrustPageShell.vue'

const { t } = useI18n()
</script>
