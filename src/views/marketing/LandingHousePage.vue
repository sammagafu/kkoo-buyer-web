<template>
  <div ref="rootRef" class="lh-root" data-theme="light">
    <LhHeader />
    <main>
      <LhHero />
      <LhServices />
      <LhRoles />
      <LhFeatures />
      <LhTrust />
      <LhDownload />
    </main>
    <LhFooter />
    <LhCookieConsent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LhHeader from '@/views/marketing/partials/house/LhHeader.vue'
import LhHero from '@/views/marketing/partials/house/LhHero.vue'
import LhServices from '@/views/marketing/partials/house/LhServices.vue'
import LhRoles from '@/views/marketing/partials/house/LhRoles.vue'
import LhFeatures from '@/views/marketing/partials/house/LhFeatures.vue'
import LhTrust from '@/views/marketing/partials/house/LhTrust.vue'
import LhDownload from '@/views/marketing/partials/house/LhDownload.vue'
import LhFooter from '@/views/marketing/partials/house/LhFooter.vue'
import LhCookieConsent from '@/views/marketing/partials/house/LhCookieConsent.vue'

const rootRef = ref<HTMLElement | null>(null)
</script>
