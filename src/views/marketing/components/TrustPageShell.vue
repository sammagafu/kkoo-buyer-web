<template>
  <MarketingLayout>
    <section class="lp-section trust-page">
      <div class="container px-3 px-sm-4 px-lg-4">
        <p v-if="kicker" class="trust-page__kicker">{{ kicker }}</p>
        <h1 class="trust-page__title">{{ title }}</h1>
        <p v-if="lead" class="trust-page__lead">{{ lead }}</p>
        <slot />
      </div>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'

defineProps<{
  title: string
  lead?: string
  kicker?: string
}>()
</script>
