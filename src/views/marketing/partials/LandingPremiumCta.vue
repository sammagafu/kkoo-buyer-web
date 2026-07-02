<template>
  <section id="download" class="lp-bento-cta">
    <div class="ui-container lp-bento-cta__grid ui-reveal" ref="ctaRef">
      <div class="lp-bento-cta__copy">
        <p class="lp-bento-cta__eyebrow">{{ t('landing.premium.ctaEyebrow') }}</p>
        <h2 class="lp-bento-cta__title">{{ t('landing.premium.ctaTitle') }}</h2>
        <p class="lp-bento-cta__lead">{{ t('landing.premium.ctaLead') }}</p>

        <div class="lp-bento-cta__rating" aria-label="4.7 out of 5 stars, 2.4K ratings">
          <span class="lp-bento-cta__stars" aria-hidden="true">★★★★★</span>
          <span>{{ t('landing.premium.ctaRating') }}</span>
        </div>

        <LandingStoreBadges />

        <router-link :to="buyerRoutes.marketplace" class="lp-bento-cta__web">
          {{ t('landing.ctaShopOnWeb') }}
        </router-link>
      </div>

      <div class="lp-bento-cta__aside">
        <LandingPhoneMockup large hero>
          <img :src="heroImage" :alt="t('landing.premium.heroMockupAlt')" class="lp-phone-mockup__image" />
        </LandingPhoneMockup>

        <figure class="lp-bento-cta__qr">
          <img :src="qrCodeUrl" :alt="t('landing.premium.ctaQrAlt')" width="140" height="140" loading="lazy" />
          <figcaption>{{ t('landing.premium.ctaQrCaption') }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LandingStoreBadges from '@/views/marketing/components/LandingStoreBadges.vue'
import LandingPhoneMockup from '@/views/marketing/partials/LandingPhoneMockup.vue'
import { appLinks } from '@/config/app-links'
import { buyerRoutes } from '@/config/landing-links'
import { premiumHeroImage as heroImage } from '@/config/landing-premium'
import { useLandingReveal } from '@/composables/useLandingReveal'

const { t } = useI18n()
const ctaRef = ref<HTMLElement | null>(null)
useLandingReveal(ctaRef)

const qrCodeUrl = computed(() => {
  const target = appLinks.marketplace.googlePlay
  return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(target)}`
})
</script>

<style scoped>
.lp-bento-cta {
  padding: clamp(3.5rem, 8vw, 5rem) 0;
  background: var(--lp-bento-surface);
  border-top: 1px solid color-mix(in srgb, var(--lp-bento-ink) 8%, transparent);
}

.lp-bento-cta__grid {
  display: grid;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 992px) {
  .lp-bento-cta__grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 2.5rem;
  }
}

.lp-bento-cta__copy {
  max-width: 28rem;
}

.lp-bento-cta__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--lp-bento-primary);
}

.lp-bento-cta__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.025em;
}

.lp-bento-cta__lead {
  margin: 0 0 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--lp-bento-muted);
}

.lp-bento-cta__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  color: var(--lp-bento-muted);
}

.lp-bento-cta__stars {
  color: var(--lp-bento-accent);
  letter-spacing: 0.05em;
}

.lp-bento-cta__web {
  display: inline-block;
  margin-top: 1rem;
  font-weight: 600;
  color: var(--lp-bento-primary);
  text-decoration: none;
}

.lp-bento-cta__web:hover {
  text-decoration: underline;
}

.lp-bento-cta__aside {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.lp-bento-cta__qr {
  margin: 0;
  text-align: center;
}

.lp-bento-cta__qr img {
  border-radius: 1rem;
  background: #fff;
  padding: 0.5rem;
  box-shadow: var(--lp-bento-shadow);
}

.lp-bento-cta__qr figcaption {
  margin-top: 0.5rem;
  font-size: 0.82rem;
  color: var(--lp-bento-muted);
}
</style>
