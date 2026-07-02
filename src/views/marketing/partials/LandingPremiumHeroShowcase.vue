<template>
  <section id="hero" ref="heroRef" class="lp-hero-showcase lp-hero-showcase--download" :aria-label="t('landing.heroShowcase.aria')">
    <div class="lp-hero-showcase__stage">
      <div
        v-for="(slide, i) in premiumHeroSlides"
        :key="slide.key"
        class="lp-hero-showcase__slide"
        :class="{ 'lp-hero-showcase__slide--active': activeIndex === i }"
        :aria-hidden="activeIndex !== i"
        :style="{ '--slide-tint': slide.tint }"
      >
        <div class="lp-hero-showcase__backdrop" aria-hidden="true">
          <img
            :src="slide.image"
            :alt="t(slide.altKey)"
            class="lp-hero-showcase__image"
            :loading="i === 0 ? 'eager' : 'lazy'"
            decoding="async"
          />
          <div class="lp-hero-showcase__scrim" />
        </div>

        <div class="ui-container lp-hero-showcase__foreground lp-download-hero__grid">
          <div class="lp-download-hero__copy">
            <template v-if="slide.layout === 'download'">
              <p class="lp-download-hero__eyebrow">{{ t('landing.premium.downloadHeroEyebrow') }}</p>
              <h1 class="lp-download-hero__title">
                {{ t('landing.premium.downloadHeroTitle') }}
                <span class="lp-bento-accent">{{ t('landing.premium.downloadHeroAccent') }}</span>
              </h1>
              <p class="lp-download-hero__lead">{{ t('landing.premium.downloadHeroLead') }}</p>
            </template>
            <template v-else>
              <p class="lp-download-hero__eyebrow">{{ t(slide.brandKey) }}</p>
              <h1 class="lp-download-hero__title">
                {{ t(slide.wordLeftKey) }}
                <span class="lp-bento-accent">{{ t(slide.wordRightKey) }}</span>
              </h1>
              <p class="lp-download-hero__lead">{{ t(slide.descKey) }}</p>
              <component
                :is="slideCta(slide).is"
                :href="slideCta(slide).href"
                :to="slideCta(slide).to"
                class="lp-hero-showcase__slide-cta"
                :target="slide.href ? '_blank' : undefined"
                :rel="slide.href ? 'noopener noreferrer' : undefined"
              >
                {{ t(slide.ctaKey) }}
                <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
              </component>
            </template>

            <LandingStoreBadges layout="row" />

            <p class="lp-download-hero__proof">
              <Icon icon="solar:users-group-rounded-bold" aria-hidden="true" />
              {{ t('landing.premium.downloadHeroProof') }}
            </p>

            <div class="lp-download-hero__secondary">
              <RouterLink :to="buyerRoutes.marketplace" class="lp-download-hero__browse">
                {{ t('landing.premium.browseWithoutSignup') }}
                <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
              </RouterLink>
            </div>

            <div class="lp-download-hero__audience" role="tablist" :aria-label="t('landing.premium.audienceSwitcherAria')">
              <button
                v-for="item in audienceSwitcherItems"
                :key="item.key"
                type="button"
                role="tab"
                class="lp-download-hero__audience-btn"
                @click="scrollToSection(item.sectionId)"
              >
                {{ t(item.labelKey) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="lp-hero-showcase__arr lp-hero-showcase__arr--prev"
        :aria-label="t('landing.premium.prev')"
        @click="prev"
      >
        <Icon icon="solar:alt-arrow-left-linear" />
      </button>
      <button
        type="button"
        class="lp-hero-showcase__arr lp-hero-showcase__arr--next"
        :aria-label="t('landing.premium.next')"
        @click="next"
      >
        <Icon icon="solar:alt-arrow-right-linear" />
      </button>
    </div>

    <div class="ui-container lp-hero-showcase__inner">
      <div class="lp-hero-showcase__dots" role="tablist" :aria-label="t('landing.heroShowcase.tabsAria')">
        <button
          v-for="(slide, i) in premiumHeroSlides"
          :key="`dot-${slide.key}`"
          type="button"
          role="tab"
          class="lp-hero-showcase__dot"
          :class="{ 'lp-hero-showcase__dot--active': activeIndex === i }"
          :aria-selected="activeIndex === i"
          :aria-label="t(slide.tabLabelKey)"
          @click="goTo(i)"
        />
      </div>

      <div class="lp-hero-showcase__stats" role="list">
        <article
          v-for="(stat, i) in premiumStats"
          :key="stat.key"
          class="lp-hero-showcase__stat ui-reveal"
          :class="{ 'lp-hero-showcase__stat--featured': i === 0 }"
          :style="{ '--reveal-delay': `${i * 100}ms` }"
          role="listitem"
        >
          <Icon v-if="stat.icon && i === 0" :icon="stat.icon" class="lp-hero-showcase__stat-icon" aria-hidden="true" />
          <h3 class="lp-hero-showcase__stat-value">{{ stat.value }}</h3>
          <p class="lp-hero-showcase__stat-label">{{ t(stat.labelKey) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import LandingStoreBadges from '@/views/marketing/components/LandingStoreBadges.vue'
import { audienceSwitcherItems } from '@/config/landing-audiences'
import { buyerRoutes } from '@/config/landing-links'
import { HERO_SHOWCASE_AUTO_MS, premiumHeroSlides, type HeroShowcaseSlide } from '@/config/landing-hero-showcase'
import { premiumStats } from '@/config/landing-premium'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { observeRevealChildren } from '@/composables/useLandingReveal'

const heroRef = ref<HTMLElement | null>(null)

const { t } = useI18n()
const { scrollToSection } = useLandingScroll()

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function slideCta(slide: HeroShowcaseSlide) {
  if (slide.href) return { is: 'a' as const, href: slide.href, to: undefined }
  return { is: RouterLink, href: undefined, to: slide.to }
}

function goTo(index: number) {
  const len = premiumHeroSlides.length
  activeIndex.value = ((index % len) + len) % len
}

function next() {
  goTo(activeIndex.value + 1)
}

function prev() {
  goTo(activeIndex.value - 1)
}

onMounted(() => {
  timer = setInterval(() => next(), HERO_SHOWCASE_AUTO_MS)
  observeRevealChildren(heroRef.value)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
