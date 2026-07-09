<template>
  <div ref="rootRef" class="lp-wrapper mk-landing mk-landing--premium">
    <LandingHeader />
    <LandingPremiumBentoPage />
    <LandingPremiumCta />
    <LandingFooter />
    <LandingMobileCtaBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LandingFooter from '@/views/marketing/partials/LandingFooter.vue'
import LandingHeader from '@/views/marketing/partials/LandingHeader.vue'
import LandingMobileCtaBar from '@/views/marketing/partials/LandingMobileCtaBar.vue'
import LandingPremiumBentoPage from '@/views/marketing/partials/LandingPremiumBentoPage.vue'
import LandingPremiumCta from '@/views/marketing/partials/LandingPremiumCta.vue'

const rootRef = ref<HTMLElement | null>(null)
</script>

<style scoped>
.lp-wrapper {
  overflow-x: clip;
}

/* Keep the fixed mobile CTA bar from covering the footer's last rows on phones. */
@media (max-width: 991.98px) {
  .lp-wrapper {
    padding-bottom: 4.5rem;
  }
}
</style>
