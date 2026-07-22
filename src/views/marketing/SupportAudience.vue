<template>
  <TrustPageShell :kicker="t('trust.supportKicker')" :title="pageTitle" :lead="pageLead">
    <ol class="trust-faq">
      <li v-for="(item, index) in faqs" :key="index">
        <h2>{{ item.q }}</h2>
        <p>{{ item.a }}</p>
      </li>
    </ol>
    <div class="trust-page__cta-row">
      <RouterLink :to="{ name: 'pages.support' }" class="trust-page__cta">{{ t('trust.supportBack') }}</RouterLink>
      <RouterLink :to="ctaRoute" class="trust-page__cta trust-page__cta--primary">{{ ctaLabel }}</RouterLink>
      <RouterLink :to="{ name: 'pages.community' }" class="trust-page__cta">{{ t('landing.navCommunity') }}</RouterLink>
    </div>
  </TrustPageShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { buyerRoutes } from '@/config/landing-links'
import TrustPageShell from '@/views/marketing/components/TrustPageShell.vue'

const { t } = useI18n()
const route = useRoute()

const audience = computed(() => {
  const name = String(route.name || '')
  if (name.includes('sellers')) return 'sellers'
  if (name.includes('riders')) return 'riders'
  if (name.includes('restaurants')) return 'restaurants'
  return 'buyers'
})

const pageTitle = computed(() => t(`trust.supportAudience.${audience.value}.title`))
const pageLead = computed(() => t(`trust.supportAudience.${audience.value}.lead`))
const faqs = computed(() => {
  const key = audience.value
  return [1, 2, 3, 4].map((n) => ({
    q: t(`trust.supportAudience.${key}.q${n}`),
    a: t(`trust.supportAudience.${key}.a${n}`),
  }))
})

const ctaRoute = computed(() => {
  switch (audience.value) {
    case 'sellers':
      return buyerRoutes.merchant
    case 'riders':
      return buyerRoutes.courier
    case 'restaurants':
      return buyerRoutes.restaurants
    default:
      return buyerRoutes.getStarted
  }
})

const ctaLabel = computed(() => t(`trust.supportAudience.${audience.value}.cta`))
</script>
