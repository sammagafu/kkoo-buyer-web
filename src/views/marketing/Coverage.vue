<template>
  <TrustPageShell
    :kicker="t('trust.coverageKicker')"
    :title="t('trust.coverageTitle')"
    :lead="t('trust.coverageLead')"
  >
    <div v-for="group in coverageCities" :key="group.countryKey" class="trust-coverage">
      <h2 class="trust-coverage__country">{{ t(`trust.coverageCountries.${group.countryKey}`) }}</h2>
      <ul class="trust-coverage__list" role="list">
        <li v-for="city in group.cities" :key="city.name" class="trust-coverage__city">
          <div>
            <strong>{{ city.name }}</strong>
            <span class="trust-coverage__status" :data-status="city.status">
              {{ t(`trust.coverageStatus.${city.status}`) }}
            </span>
          </div>
          <p>{{ city.services.join(' · ') }}</p>
        </li>
      </ul>
    </div>
  </TrustPageShell>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { coverageCities } from '@/config/company-trust'
import TrustPageShell from '@/views/marketing/components/TrustPageShell.vue'

const { t } = useI18n()
</script>
