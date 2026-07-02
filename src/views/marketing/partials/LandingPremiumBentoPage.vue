<template>
  <div ref="rootRef" class="lp-bento">
    <LandingPremiumHeroShowcase />

    <!-- Visual regions -->
    <section id="regions" class="lp-bento-section">
      <div class="ui-container">
        <header class="lp-bento-section__head lp-bento-section__head--split ui-reveal">
          <h2 class="lp-bento-section__title">
            {{ t('landing.sisyphus.regionsLine1') }}
            <span class="lp-bento-accent">{{ t('landing.sisyphus.regionsAccent') }}</span>
          </h2>
          <p class="lp-bento-section__desc">{{ t('landing.sisyphus.regionsDesc') }}</p>
        </header>

        <div class="lp-bento-regions">
          <component
            v-for="card in premiumRegionCards"
            :key="card.key"
            :is="regionCardTag(card)"
            :href="regionCardHref(card)"
            :to="regionCardTo(card)"
            class="lp-bento-regions__card ui-reveal"
            :aria-label="t(card.labelKey)"
            @click="onRegionCardClick(card, $event)"
          >
            <img :src="card.image" :alt="t(card.altKey)" loading="lazy" />
            <span class="lp-bento-regions__pill">
              <Icon :icon="card.icon" aria-hidden="true" />
              {{ t(card.labelKey) }}
            </span>
          </component>
        </div>
      </div>
    </section>

    <LandingPremiumSuperApp />
    <LandingPremiumSellerSection />
    <LandingPremiumRiderSection />
    <LandingPremiumCreatorSection />

    <!-- Project showcase -->
    <section id="showcase" class="lp-bento-section">
      <div class="ui-container">
        <header class="lp-bento-section__head lp-bento-section__head--row ui-reveal">
          <h2 class="lp-bento-section__title">
            {{ t('landing.sisyphus.showcaseLine1') }}
            <span class="lp-bento-accent">{{ t('landing.sisyphus.showcaseAccent') }}</span>
          </h2>
          <div class="lp-bento-section__actions">
            <a
              :href="landingAnchors.download.hash"
              class="lp-bento-btn lp-bento-btn--primary"
              @click.prevent="onAnchorClick('download', $event)"
            >
              {{ t('landing.premium.ctaDownloadProtected') }}
            </a>
          </div>
        </header>

        <div class="lp-bento-showcase" role="list">
          <router-link
            v-for="(item, index) in premiumShowcaseItems"
            :key="item.key"
            :to="item.to ?? buyerRoutes.marketplace"
            class="lp-bento-showcase__card ui-reveal"
            :class="{ 'lp-bento-showcase__card--wide': item.wide }"
            role="listitem"
            :aria-label="t(item.titleKey)"
          >
            <div class="lp-bento-showcase__frame">
              <img :src="item.image" :alt="t(item.altKey)" loading="lazy" />
              <div class="lp-bento-showcase__overlay" aria-hidden="true" />
              <span class="lp-bento-showcase__index">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="lp-bento-showcase__meta">
                <h3>{{ t(item.titleKey) }}</h3>
                <p>{{ t(item.descKey) }}</p>
              </div>
            </div>
          </router-link>
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
import {
  premiumRegionCards,
  premiumShowcaseItems,
  type PremiumRegionCard,
} from '@/config/landing-premium'
import { landingAnchors, buyerRoutes } from '@/config/landing-links'
import { observeRevealChildren } from '@/composables/useLandingReveal'
import { useLandingPillar } from '@/composables/useLandingPillar'
import { useLandingScroll } from '@/composables/useLandingScroll'

const { t } = useI18n()
const { onAnchorClick } = useLandingScroll()
const { navigateToPillar } = useLandingPillar()
const rootRef = ref<HTMLElement | null>(null)

function regionCardTag(card: PremiumRegionCard) {
  return card.link.kind === 'route' ? 'router-link' : 'a'
}

function regionCardHref(card: PremiumRegionCard) {
  if (card.link.kind === 'pillar') return `#services-${card.link.pillar}`
  if (card.link.kind === 'anchor') return `#${card.link.sectionId}`
  return undefined
}

function regionCardTo(card: PremiumRegionCard) {
  return card.link.kind === 'route' ? card.link.to : undefined
}

function onRegionCardClick(card: PremiumRegionCard, event: MouseEvent) {
  if (card.link.kind === 'route') return
  event.preventDefault()
  if (card.link.kind === 'pillar') {
    navigateToPillar(card.link.pillar)
    return
  }
  onAnchorClick(card.link.sectionId, event)
}

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
