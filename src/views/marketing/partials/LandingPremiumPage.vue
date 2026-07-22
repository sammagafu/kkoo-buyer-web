<template>
  <div ref="rootRef" class="lp-wrapper mk-landing mk-landing--premium lh-chrome">
    <LhHeader />
    <LandingPremiumBentoPage />
    <LandingPremiumCta />
    <LhFooter />
    <LhCookieConsent />
    <LandingMobileCtaBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LhFooter from '@/views/marketing/partials/house/LhFooter.vue'
import LhHeader from '@/views/marketing/partials/house/LhHeader.vue'
import LhCookieConsent from '@/views/marketing/partials/house/LhCookieConsent.vue'
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
