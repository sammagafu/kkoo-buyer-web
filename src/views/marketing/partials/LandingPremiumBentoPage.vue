<template>
  <div ref="rootRef" class="lp-bento">
    <LandingPremiumHeroShowcase />

    <LandingPremiumSuperApp />
    <LandingPremiumSellerSection />
    <LandingPremiumRiderSection />
    <LandingPremiumCreatorSection />

    <!-- Project showcase -->
    <section id="showcase" class="lp-bento-section">
      <div class="ui-container">
        <header class="lp-bento-section__head lp-bento-section__head--split ui-reveal">
          <h2 class="lp-bento-section__title">
            {{ t('landing.sisyphus.showcaseLine1') }}
            <span class="lp-bento-accent">{{ t('landing.sisyphus.showcaseAccent') }}</span>
          </h2>
          <div class="lp-bento-section__aside">
            <p class="lp-bento-section__desc">{{ t('landing.premium.showcaseDesc') }}</p>
          </div>
        </header>

        <div
          class="lp-bento-showcase"
          role="list"
          :aria-label="t('landing.premium.showcaseScrollAria')"
        >
          <div class="lp-bento-showcase__track">
            <router-link
              v-for="item in premiumShowcaseItems"
              :key="item.key"
              :to="item.to ?? buyerRoutes.marketplace"
              class="lp-bento-showcase__card ui-reveal"
              role="listitem"
              :aria-label="t(item.titleKey)"
            >
              <div class="lp-bento-showcase__cover">
                <img :src="item.image" :alt="t(item.altKey)" loading="lazy" />
                <div class="lp-bento-showcase__overlay" aria-hidden="true" />
                <span class="lp-bento-showcase__badge" aria-hidden="true">
                  <Icon :icon="item.icon" />
                </span>
                <div class="lp-bento-showcase__body">
                  <h3>{{ t(item.titleKey) }}</h3>
                  <p>{{ t(item.descKey) }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="stories" class="lp-bento-section lp-bento-section--muted">
      <div class="ui-container">
        <header class="lp-bento-section__head lp-bento-section__head--row ui-reveal">
          <h2 class="lp-bento-section__title">
            {{ t('landing.sisyphus.testimonialsLine1') }}
            <span class="lp-bento-accent">{{ t('landing.sisyphus.testimonialsAccent') }}</span>
          </h2>
          <div class="lp-bento-carousel-nav">
            <button type="button" class="lp-bento-carousel-nav__btn" :aria-label="t('landing.premium.prev')" @click="prevTestimonial">
              <Icon icon="solar:alt-arrow-left-linear" />
            </button>
            <button type="button" class="lp-bento-carousel-nav__btn" :aria-label="t('landing.premium.next')" @click="nextTestimonial">
              <Icon icon="solar:alt-arrow-right-linear" />
            </button>
          </div>
        </header>

        <div class="lp-testimonial-roles" role="tablist" :aria-label="t('landing.premium.testimonialsFilterAria')">
          <button
            v-for="tab in testimonialRoleTabs"
            :key="tab.key"
            type="button"
            role="tab"
            class="lp-testimonial-roles__btn"
            :class="{ 'lp-testimonial-roles__btn--on': activeRole === tab.key }"
            :aria-selected="activeRole === tab.key"
            @click="setRole(tab.key)"
          >
            {{ t(tab.labelKey) }}
          </button>
        </div>

        <TransitionGroup name="lp-testimonial" tag="div" class="lp-bento-testimonials" role="list">
          <article
            v-for="(item, i) in visibleTestimonials"
            :key="`${activeRole}-${item.name}-${testimonialOffset}`"
            class="lp-bento-testimonials__card"
            :class="{ 'lp-bento-testimonials__card--featured': i === 1 }"
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
        </TransitionGroup>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import LandingPremiumHeroShowcase from '@/views/marketing/partials/LandingPremiumHeroShowcase.vue'
import LandingPremiumSuperApp from '@/views/marketing/partials/LandingPremiumSuperApp.vue'
import LandingPremiumSellerSection from '@/views/marketing/partials/LandingPremiumSellerSection.vue'
import LandingPremiumRiderSection from '@/views/marketing/partials/LandingPremiumRiderSection.vue'
import LandingPremiumCreatorSection from '@/views/marketing/partials/LandingPremiumCreatorSection.vue'
import {
  testimonialRoleMap,
  testimonialRoleTabs,
  type TestimonialRole,
} from '@/config/landing-audiences'
import { premiumShowcaseItems } from '@/config/landing-premium'
import { buyerRoutes } from '@/config/landing-links'
import { observeRevealChildren } from '@/composables/useLandingReveal'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)

type Testimonial = { name: string; role: string; text: string; initials: string }

const testimonialCatalog = computed<Record<number, Testimonial>>(() => ({
  1: { name: t('landing.testimonial1Name'), role: t('landing.testimonial1Role'), text: t('landing.testimonial1Text'), initials: 'AM' },
  2: { name: t('landing.testimonial2Name'), role: t('landing.testimonial2Role'), text: t('landing.testimonial2Text'), initials: 'DK' },
  3: { name: t('landing.testimonial3Name'), role: t('landing.testimonial3Role'), text: t('landing.testimonial3Text'), initials: 'FM' },
  4: { name: t('landing.testimonial4Name'), role: t('landing.testimonial4Role'), text: t('landing.testimonial4Text'), initials: 'HK' },
  5: { name: t('landing.testimonial5Name'), role: t('landing.testimonial5Role'), text: t('landing.testimonial5Text'), initials: 'GN' },
  6: { name: t('landing.testimonial6Name'), role: t('landing.testimonial6Role'), text: t('landing.testimonial6Text'), initials: 'MZ' },
  7: { name: t('landing.testimonial7Name'), role: t('landing.testimonial7Role'), text: t('landing.testimonial7Text'), initials: 'JO' },
  8: { name: t('landing.testimonial8Name'), role: t('landing.testimonial8Role'), text: t('landing.testimonial8Text'), initials: 'PS' },
}))

const activeRole = ref<TestimonialRole>('buyer')
const testimonialOffset = ref(0)

const roleTestimonials = computed(() =>
  testimonialRoleMap[activeRole.value].map((id) => testimonialCatalog.value[id]),
)

const visibleTestimonials = computed(() => {
  const items = roleTestimonials.value
  const len = items.length
  if (len <= 3) return items
  const start = testimonialOffset.value % len
  return [0, 1, 2].map((i) => items[(start + i) % len])
})

function setRole(role: TestimonialRole) {
  activeRole.value = role
  testimonialOffset.value = 0
}

function nextTestimonial() {
  testimonialOffset.value = (testimonialOffset.value + 1) % roleTestimonials.value.length
}

function prevTestimonial() {
  const len = roleTestimonials.value.length
  testimonialOffset.value = (testimonialOffset.value - 1 + len) % len
}

watch(activeRole, () => {
  testimonialOffset.value = 0
})

onMounted(() => observeRevealChildren(rootRef.value))
</script>
