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

            <p v-if="usersProofValue" class="lp-download-hero__proof">
              <Icon icon="solar:users-group-rounded-bold" aria-hidden="true" />
              {{ t('landing.premium.downloadHeroProof', { count: usersProofValue }) }}
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

      <!-- Live platform metrics from /public/landing/stats/ — hidden until real numbers arrive. -->
      <div v-if="liveStats.length" class="lp-hero-showcase__stats" role="list">
        <article
          v-for="(stat, i) in liveStats"
          :key="stat.key"
          class="lp-hero-showcase__stat"
          :class="{ 'lp-hero-showcase__stat--featured': i === 0 }"
          role="listitem"
        >
          <Icon
            v-if="i === 0 && iconifyName(stat.icon)"
            :icon="iconifyName(stat.icon)!"
            class="lp-hero-showcase__stat-icon"
            aria-hidden="true"
          />
          <h3 class="lp-hero-showcase__stat-value">{{ stat.value }}</h3>
          <p class="lp-hero-showcase__stat-label">{{ stat.label }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import LandingStoreBadges from '@/views/marketing/partials/LandingStoreBadges.vue'
import { audienceSwitcherItems } from '@/config/landing-audiences'
import { buyerRoutes } from '@/config/landing-links'
import { HERO_SHOWCASE_AUTO_MS, premiumHeroSlides, type HeroShowcaseSlide } from '@/config/landing-hero-showcase'
import { fetchLandingStats, type LandingStatItem } from '@/api/landing'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { observeRevealChildren } from '@/composables/useLandingReveal'

const heroRef = ref<HTMLElement | null>(null)

const { t } = useI18n()
const { scrollToSection } = useLandingScroll()

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

/** Live metric tiles from the platform; empty means the strip stays hidden (no invented numbers). */
const liveStats = ref<LandingStatItem[]>([])

/** Backend sends bootstrap-icon classes ("bi bi-people-fill"); Iconify wants "bi:people-fill". */
function iconifyName(icon?: string): string | null {
  const cls = (icon ?? '').trim()
  if (!cls) return null
  if (cls.includes(':')) return cls
  const m = cls.match(/bi-([a-z0-9-]+)/)
  return m ? `bi:${m[1]}` : null
}

/** Parses "1.2K+" / "3M+" / "250+" tile values back to a number for thresholds. */
function parseStatCount(value: string): number {
  const m = value.trim().match(/^([\d,.]+)\s*([KM]?)/i)
  if (!m) return 0
  const n = Number.parseFloat(m[1].replace(/,/g, ''))
  if (!Number.isFinite(n)) return 0
  const unit = m[2].toUpperCase()
  return Math.round(n * (unit === 'M' ? 1_000_000 : unit === 'K' ? 1_000 : 1))
}

/** Social proof only once there is proof: real user count, shown from 100 users up. */
const usersProofValue = computed(() => {
  const tile = liveStats.value.find((s) => s.key === 'wallets' || s.key === 'users')
  if (!tile) return null
  return parseStatCount(tile.value) >= 100 ? tile.value : null
})

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

onMounted(async () => {
  timer = setInterval(() => next(), HERO_SHOWCASE_AUTO_MS)
  observeRevealChildren(heroRef.value)
  const payload = await fetchLandingStats()
  if (payload?.stats?.length) {
    liveStats.value = payload.stats.slice(0, 4)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
