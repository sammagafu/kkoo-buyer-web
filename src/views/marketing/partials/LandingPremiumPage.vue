<template>
  <div ref="rootRef" class="ui-page">
    <LandingPremiumBentoPage />
    <LandingPremiumCta />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LandingPremiumBentoPage from '@/views/marketing/partials/LandingPremiumBentoPage.vue'
import LandingPremiumCta from '@/views/marketing/partials/LandingPremiumCta.vue'

const rootRef = ref<HTMLElement | null>(null)
</script>

<style scoped>
.ui-page {
  overflow-x: clip;
}
</style>
