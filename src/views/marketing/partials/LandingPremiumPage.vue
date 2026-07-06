<template>
  <div ref="rootRef" class="lp-wrapper mk-landing mk-landing--premium">
    <LandingHeader />
    <LandingPremiumBentoPage />
    <LandingPremiumCta />
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LandingFooter from '@/views/marketing/partials/LandingFooter.vue'
import LandingHeader from '@/views/marketing/partials/LandingHeader.vue'
import LandingPremiumBentoPage from '@/views/marketing/partials/LandingPremiumBentoPage.vue'
import LandingPremiumCta from '@/views/marketing/partials/LandingPremiumCta.vue'

const rootRef = ref<HTMLElement | null>(null)
</script>

<style scoped>
.lp-wrapper {
  overflow-x: clip;
}
</style>
