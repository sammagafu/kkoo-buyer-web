<template>
  <TrustPageShell :kicker="t('trust.safetyKicker')" :title="t('trust.safetyTitle')" :lead="t('trust.safetyLead')">
    <div class="trust-page__grid">
      <article v-for="block in blocks" :key="block.title" class="trust-page__card">
        <h2>{{ block.title }}</h2>
        <p>{{ block.body }}</p>
      </article>
    </div>
    <p class="trust-page__note">
      {{ t('trust.safetyContact') }}
      <a :href="`mailto:${companyLegal.safetyEmail}`">{{ companyLegal.safetyEmail }}</a>
    </p>
  </TrustPageShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { companyLegal } from '@/config/company-trust'
import TrustPageShell from '@/views/marketing/components/TrustPageShell.vue'

const { t } = useI18n()
const blocks = computed(() => [
  { title: t('trust.safetyBuyersTitle'), body: t('trust.safetyBuyersBody') },
  { title: t('trust.safetyRidersTitle'), body: t('trust.safetyRidersBody') },
  { title: t('trust.safetySellersTitle'), body: t('trust.safetySellersBody') },
  { title: t('trust.safetyPaymentsTitle'), body: t('trust.safetyPaymentsBody') },
])
</script>
