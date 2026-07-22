<template>
  <TrustPageShell :kicker="t('trust.supportKicker')" :title="t('trust.supportTitle')" :lead="t('trust.supportLead')">
    <div class="trust-page__grid trust-page__grid--support">
      <RouterLink
        v-for="card in cards"
        :key="card.name"
        :to="{ name: card.name }"
        class="trust-page__card trust-page__card--link"
      >
        <h2>{{ t(card.titleKey) }}</h2>
        <p>{{ t(card.bodyKey) }}</p>
        <span>{{ t('trust.supportOpen') }}</span>
      </RouterLink>
    </div>
    <p class="trust-page__note">
      {{ t('trust.supportEmailNote') }}
      <a :href="`mailto:${companyLegal.supportEmail}`">{{ companyLegal.supportEmail }}</a>
    </p>
  </TrustPageShell>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { companyLegal } from '@/config/company-trust'
import TrustPageShell from '@/views/marketing/components/TrustPageShell.vue'

const { t } = useI18n()

const cards = [
  {
    name: 'pages.support-buyers',
    titleKey: 'trust.navSupportBuyers',
    bodyKey: 'trust.supportBuyersTeaser',
  },
  {
    name: 'pages.support-sellers',
    titleKey: 'trust.navSupportSellers',
    bodyKey: 'trust.supportSellersTeaser',
  },
  {
    name: 'pages.support-riders',
    titleKey: 'trust.navSupportRiders',
    bodyKey: 'trust.supportRidersTeaser',
  },
  {
    name: 'pages.support-restaurants',
    titleKey: 'trust.navSupportRestaurants',
    bodyKey: 'trust.supportRestaurantsTeaser',
  },
] as const
</script>
