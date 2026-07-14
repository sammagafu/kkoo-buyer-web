<template>
  <div ref="rootRef" class="lp-bento">
    <LandingPremiumHeroCompact />

    <LandingPremiumSuperApp />
    <LandingPremiumSellerSection />

    <LandingPartnersTeaser />

    <!-- Testimonials: three static quotes -->
    <section id="stories" class="lp-bento-section lp-bento-section--muted">
      <div class="ui-container">
        <header class="lp-bento-section__head ui-reveal">
          <h2 class="lp-bento-section__title">
            {{ t('landing.sisyphus.testimonialsLine1') }}
            <span class="lp-bento-accent">{{ t('landing.sisyphus.testimonialsAccent') }}</span>
          </h2>
        </header>

        <div class="lp-bento-testimonials lp-bento-testimonials--static" role="list">
          <article
            v-for="item in featuredTestimonials"
            :key="item.name"
            class="lp-bento-testimonials__card"
            role="listitem"
          >
            <div class="lp-bento-testimonials__profile">
              <span class="lp-bento-testimonials__avatar" aria-hidden="true">{{ item.initials }}</span>
              <div>
                <p class="lp-bento-testimonials__name">{{ item.name }}</p>
                <p class="lp-bento-testimonials__role">{{ item.role }}</p>
              </div>
            </div>
            <p class="lp-bento-testimonials__quote">“{{ item.text }}”</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LandingPremiumHeroCompact from '@/views/marketing/partials/LandingPremiumHeroCompact.vue'
import LandingPremiumSuperApp from '@/views/marketing/partials/LandingPremiumSuperApp.vue'
import LandingPremiumSellerSection from '@/views/marketing/partials/LandingPremiumSellerSection.vue'
import LandingPartnersTeaser from '@/views/marketing/partials/LandingPartnersTeaser.vue'
import { observeRevealChildren } from '@/composables/useLandingReveal'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)

const featuredTestimonials = computed(() => [
  {
    name: t('landing.testimonial1Name'),
    role: t('landing.testimonial1Role'),
    text: t('landing.testimonial1Text'),
    initials: 'AM',
  },
  {
    name: t('landing.testimonial2Name'),
    role: t('landing.testimonial2Role'),
    text: t('landing.testimonial2Text'),
    initials: 'DK',
  },
  {
    name: t('landing.testimonial3Name'),
    role: t('landing.testimonial3Role'),
    text: t('landing.testimonial3Text'),
    initials: 'FM',
  },
])

onMounted(() => observeRevealChildren(rootRef.value))
</script>

<style scoped>
.lp-bento-testimonials--static {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
}

@media (min-width: 768px) {
  .lp-bento-testimonials--static {
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(2rem, 4vw, 3rem);
  }
}
</style>
