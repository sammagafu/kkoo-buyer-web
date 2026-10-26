<template>
  <div ref="rootRef" class="lh-root" data-theme="light">
    <LhHeader />
    <main>
      <LhHero />
      <LhServices />
      <LhFeatures />
      <LhTrust />
      <LhRoles />
      <LhDownload />
      <LhCta />
    </main>
    <LhFooter />
    <LhCookieConsent />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import LhHeader from '@/views/marketing/partials/house/LhHeader.vue'
import LhHero from '@/views/marketing/partials/house/LhHero.vue'
import LhFooter from '@/views/marketing/partials/house/LhFooter.vue'
import LhCookieConsent from '@/views/marketing/partials/house/LhCookieConsent.vue'
import '@/assets/scss/pages/_landing-house-below.scss'

const LhServices = defineAsyncComponent(() => import('@/views/marketing/partials/house/LhServices.vue'))
const LhFeatures = defineAsyncComponent(() => import('@/views/marketing/partials/house/LhFeatures.vue'))
const LhTrust = defineAsyncComponent(() => import('@/views/marketing/partials/house/LhTrust.vue'))
const LhRoles = defineAsyncComponent(() => import('@/views/marketing/partials/house/LhRoles.vue'))
const LhDownload = defineAsyncComponent(() => import('@/views/marketing/partials/house/LhDownload.vue'))
const LhCta = defineAsyncComponent(() => import('@/views/marketing/partials/house/LhCta.vue'))

const rootRef = ref<HTMLElement | null>(null)
</script>
