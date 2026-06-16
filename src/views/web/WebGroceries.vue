<template>
  <MarketingLayout>
    <section class="lp-section web-groc-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-groc-grid">
          <div>
            <p class="web-groc-kicker">Groceries · Web</p>
            <h1 class="web-groc-title">Shop groceries on web, add to cart, and check out.</h1>
            <p class="web-groc-copy">Browse grocery stores, view products, and keep one web cart for checkout.</p>
          </div>
        </div>
      </b-container>
    </section>

    <WebMarket :embed="true" />
  </MarketingLayout>
</template>

<script setup lang="ts">
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import WebMarket from './WebMarket.vue'
</script>

<style scoped>
.web-groc-hero {
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.web-groc-grid {
  display: grid;
  gap: 1.5rem;
}
.web-groc-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.web-groc-title {
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.05;
  margin: 0.6rem 0 0.7rem;
}
.web-groc-copy {
  max-width: 60ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
</style>
