<template>
  <TrustPageShell
    :kicker="t('trust.investorsKicker')"
    :title="t('trust.investorsTitle')"
    :lead="t('trust.investorsLead')"
  >
    <div class="trust-page__grid">
      <article class="trust-page__card">
        <h2>{{ t('trust.investorsThesisTitle') }}</h2>
        <p>{{ t('trust.investorsThesisBody') }}</p>
      </article>
      <article class="trust-page__card">
        <h2>{{ t('trust.investorsContactTitle') }}</h2>
        <p>
          {{ t('trust.investorsContactBody') }}
          <a :href="`mailto:${companyLegal.investorsEmail}`">{{ companyLegal.investorsEmail }}</a>
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
