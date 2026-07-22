<template>
  <TrustPageShell :kicker="t('trust.aboutKicker')" :title="t('trust.aboutTitle')" :lead="t('trust.aboutLead')">
    <div class="trust-page__grid">
      <article v-for="block in blocks" :key="block.title" class="trust-page__card">
        <h2>{{ block.title }}</h2>
        <p>{{ block.body }}</p>
      </article>
    </div>
    <p class="trust-page__note">
      {{ t('trust.aboutEntity', { entity: companyLegal.legalEntity, place: companyLegal.jurisdiction }) }}
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
  { title: t('trust.aboutMissionTitle'), body: t('trust.aboutMissionBody') },
  { title: t('trust.aboutWhatTitle'), body: t('trust.aboutWhatBody') },
  { title: t('trust.aboutWhyTitle'), body: t('trust.aboutWhyBody') },
])
</script>
