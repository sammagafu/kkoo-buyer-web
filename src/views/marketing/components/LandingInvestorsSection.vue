<template>
  <section id="investors" class="lp-investors lp-section lp-section-page" v-wow>
    <b-container class="lp-page-container">
      <div class="lp-investors-inner">
        <header class="lp-investors-bento-header">
          <div class="lp-investors-bento-eyebrow d-flex align-items-center gap-2">
            <span class="lp-investors-bento-dot" aria-hidden="true" />
            <span class="lp-investors-bento-eyebrow-text text-uppercase">{{ t('landing.investorsBentoEyebrow') }}</span>
          </div>
          <h2 class="lp-investors-bento-title mb-2">{{ t('landing.investorsBentoHeadline') }}</h2>
          <p class="lp-investors-bento-sub mb-0">{{ t('landing.investorsBentoSub') }}</p>
          <div class="lp-investors-bento-rule mt-4" role="presentation" />
        </header>

        <div ref="bentoGridRef" class="lp-investors-bento-grid">
          <!-- Left column -->
          <div class="lp-bento-col lp-bento-col--left d-flex flex-column lp-bento-col-stack">
            <article class="lp-bento-card lp-bento-card--cream px-3 px-sm-4 py-4 py-md-5 p-lg-4 h-100">
              <p class="lp-bento-card-body mb-4">{{ t('landing.investorsBentoCard1Body') }}</p>
              <p class="lp-bento-stat-mega mb-1" aria-live="polite">
                <span class="lp-bento-stat-mega-num">{{ fmtBento1 }}</span>
              </p>
              <p class="lp-bento-stat-mega-label mb-0">{{ t('landing.investorsBentoStat1Label') }}</p>
            </article>
            <div class="lp-bento-media lp-bento-surface flex-grow-1">
              <img :src="imgLeft" :alt="t('landing.investorsBentoImgLeftAlt')" class="lp-bento-media-img" loading="lazy" width="800" height="600" />
            </div>
          </div>

          <!-- Center tall -->
          <article class="lp-bento-card lp-bento-card--tall position-relative overflow-hidden">
            <img :src="imgMid" :alt="t('landing.investorsBentoImgMidAlt')" class="lp-bento-tall-bg" loading="lazy" width="900" height="1200" />
            <div class="lp-bento-tall-overlay">
              <div class="lp-bento-tall-overlay__top">
                <p class="lp-bento-tall-stat mb-2" aria-live="polite">{{ fmtBento2 }}</p>
                <p class="lp-bento-tall-stat-title mb-0">{{ t('landing.investorsBentoStat2Title') }}</p>
              </div>
              <p class="lp-bento-tall-desc mb-0">{{ t('landing.investorsBentoStat2Body') }}</p>
            </div>
          </article>

          <!-- Right column -->
          <div class="lp-bento-col lp-bento-col--right d-flex flex-column lp-bento-col-stack">
            <div class="lp-bento-media lp-bento-surface">
              <img :src="imgRight" :alt="t('landing.investorsBentoImgRightAlt')" class="lp-bento-media-img" loading="lazy" width="800" height="600" />
            </div>
            <article class="lp-bento-card lp-bento-card--lavender px-3 px-sm-4 py-4 py-md-5 p-lg-4 h-100">
              <p class="lp-bento-stat-mega mb-2" aria-live="polite">
                <span class="lp-bento-stat-mega-num">{{ fmtBento3 }}</span>
              </p>
              <p class="lp-bento-stat-block-title mb-3">{{ t('landing.investorsBentoStat3Title') }}</p>
              <p class="lp-bento-card-body mb-0">{{ t('landing.investorsBentoStat3Body') }}</p>
            </article>
          </div>
        </div>

        <footer class="lp-investors-footer text-center text-md-start border-top lp-investors-footer-border">
          <a
            :href="investorMailto"
            class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm text-decoration-none d-inline-flex align-items-center"
          >
            <span class="lp-btn-pill__label">{{ t('landing.investorsCta') }}</span>
            <span class="lp-btn-pill__well" aria-hidden="true">
              <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
            </span>
          </a>
          <p class="lp-investors-microcopy small text-muted mb-1 mt-3">{{ t('landing.investorsMicrocopy') }}</p>
          <p class="small text-muted mb-0">
            <a :href="investorMailto" class="lp-investors-email-link">{{ tx('legal.contactEmail', 'info@kkooapp.co.tz') }}</a>
          </p>
        </footer>
      </div>
    </b-container>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import imgLeft from '@/assets/images/landing/services/shop.jpg'
import imgMid from '@/assets/images/landing/hero.jpg'
import imgRight from '@/assets/images/landing/services/groceries.jpg'

const { t, locale } = useI18n()

function tx(i18nKey: string, fallback: string): string {
  const v = t(i18nKey)
  if (typeof v !== 'string') return fallback
  const s = v.trim()
  if (s === '' || s === i18nKey) return fallback
  return v
}

const T1 = 99.8
const T2 = 98
const T3 = 300

const bento1 = ref(0)
const bento2 = ref(0)
const bento3 = ref(0)
const bentoGridRef = ref<HTMLElement | null>(null)
let bentoAnimated = false
let bentoRaf = 0

// Locale-aware number formatting for display
const fmtBento1 = computed(() => {
  const tag = locale.value === 'sw' ? 'sw-TZ' : locale.value === 'fr' ? 'fr' : 'en-GB'
  const n = bento1.value
  return `${n.toLocaleString(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
})

const fmtBento2 = computed(() => {
  const tag = locale.value === 'sw' ? 'sw-TZ' : locale.value === 'fr' ? 'fr' : 'en-GB'
  return `${Math.round(bento2.value).toLocaleString(tag)}%`
})

const fmtBento3 = computed(() => {
  const tag = locale.value === 'sw' ? 'sw-TZ' : locale.value === 'fr' ? 'fr' : 'en-GB'
  return `${Math.round(bento3.value).toLocaleString(tag)}+`
})

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function runBentoCountUp(durationMs: number) {
  if (bentoRaf) cancelAnimationFrame(bentoRaf)
  const start = performance.now()
  const tick = (now: number) => {
    const elapsed = now - start
    const u = Math.min(1, elapsed / durationMs)
    const e = easeOutCubic(u)
    bento1.value = T1 * e
    bento2.value = T2 * e
    bento3.value = T3 * e
    if (u < 1) bentoRaf = requestAnimationFrame(tick)
    else bentoRaf = 0
  }
  bentoRaf = requestAnimationFrame(tick)
}

function applyBentoInstant() {
  if (bentoRaf) {
    cancelAnimationFrame(bentoRaf)
    bentoRaf = 0
  }
  bento1.value = T1
  bento2.value = T2
  bento3.value = T3
}

function maybeAnimateBento() {
  const el = bentoGridRef.value
  if (!el || bentoAnimated) return
  bentoAnimated = true
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    applyBentoInstant()
    return
  }
  runBentoCountUp(1600)
}

onMounted(() => {
  const el = bentoGridRef.value
  if (!el) return
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      maybeAnimateBento()
      io.disconnect()
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  io.observe(el)
  requestAnimationFrame(() => {
    if (bentoAnimated) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) maybeAnimateBento()
  })
})

onUnmounted(() => {
  if (bentoRaf) cancelAnimationFrame(bentoRaf)
})

const investorMailto = computed(() => {
  const email = tx('legal.contactEmail', 'info@kkooapp.co.tz')
  const subject = encodeURIComponent(tx('landing.investorsMailtoSubject', 'KKOO – investor / partner intro'))
  return `mailto:${email}?subject=${subject}`
})
</script>

<style scoped>
.lp-investors {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: clip;
  /* Match other landing bands; do not stretch to full viewport */
  min-height: unset;
  scroll-margin-top: calc(var(--lp-rhythm-phi) * 3);
  background: var(--bs-body-bg);
}

@supports not (overflow: clip) {
  .lp-investors {
    overflow-x: hidden;
  }
}

/* Layout wrapper only; horizontal inset via MarketingLayout `.lp-page-container` */
.lp-investors-inner {
  box-sizing: border-box;
  min-width: 0;
}

header.lp-investors-bento-header {
  margin-bottom: var(--lp-rhythm-phi2);
}

@media (min-width: 992px) {
  header.lp-investors-bento-header {
    margin-bottom: var(--lp-rhythm-phi3);
  }
}

.lp-investors-bento-eyebrow {
  margin-bottom: var(--lp-content-gap);
}

.lp-bento-col-stack {
  gap: var(--lp-row-gutter-md, var(--lp-content-gap));
}

.lp-investors-footer {
  margin-top: var(--lp-rhythm-phi2);
  padding-top: var(--lp-rhythm-phi);
}

/* Header */
.lp-investors-bento-title {
  font-size: clamp(1.5rem, 2.4vw + 0.65rem, 2.25rem);
  font-weight: 800;
  color: var(--bs-headings-color);
  letter-spacing: -0.02em;
  line-height: var(--lp-heading-lh);
  max-width: 28rem;
}

.lp-investors-bento-sub {
  font-size: clamp(0.95rem, 0.8vw + 0.82rem, 1.05rem);
  color: var(--bs-secondary-color);
  line-height: var(--lp-prose-lh);
  max-width: min(40rem, var(--lp-prose-max));
}

.lp-investors-bento-eyebrow {
  align-items: center;
}

.lp-investors-bento-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--bs-primary);
  flex-shrink: 0;
}

.lp-investors-bento-eyebrow-text {
  font-size: clamp(0.75rem, 0.2vw + 0.68rem, 0.8125rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--bs-primary);
}

.lp-investors-bento-rule {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(var(--bs-primary-rgb, 92, 48, 143), 0.22) 15%,
    rgba(var(--bs-primary-rgb, 92, 48, 143), 0.22) 85%,
    transparent
  );
}

/* Bento grid — 3 columns, center spans full height */
.lp-investors-bento-grid {
  display: flex;
  flex-direction: column;
  gap: var(--lp-row-gutter-md, var(--lp-content-gap));
  min-width: 0;
}

@media (max-width: 991.98px) {
  .lp-bento-card--tall {
    order: 1;
  }
  .lp-bento-col--left {
    order: 2;
  }
  .lp-bento-col--right {
    order: 3;
  }
}

@media (min-width: 992px) {
  .lp-investors-bento-grid {
    display: grid;
    flex-direction: unset;
  }

  .lp-bento-card--tall,
  .lp-bento-col--left,
  .lp-bento-col--right {
    order: unset;
  }

  .lp-investors-bento-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1fr);
    grid-template-rows: auto auto;
    gap: var(--lp-row-gutter-lg, var(--lp-section-inner-gap));
    align-items: stretch;
    min-height: min(520px, 70vh);
  }

  .lp-bento-col--left {
    grid-column: 1;
    grid-row: 1 / 3;
  }

  .lp-bento-card--tall {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  .lp-bento-col--right {
    grid-column: 3;
    grid-row: 1 / 3;
  }
}

/* Cards + media: same radius as landing (MarketingLayout passes --lp-radius-card) */
.lp-bento-surface {
  border-radius: var(--lp-radius-card, 16px);
  overflow: hidden;
}

/* Cards */
.lp-bento-card {
  border-radius: var(--lp-radius-card, 16px);
  border: 1px solid var(--lp-kkoo-border, rgba(var(--bs-primary-rgb, 92, 48, 143), 0.18));
  box-shadow: var(--lp-kkoo-shadow, 0 10px 36px rgba(var(--bs-primary-rgb, 92, 48, 143), 0.08));
}

.lp-bento-card--cream {
  background: color-mix(in srgb, var(--bs-secondary) 18%, var(--bs-body-bg));
}

.lp-bento-card--lavender {
  background: color-mix(in srgb, var(--bs-primary) 20%, var(--bs-body-bg));
}

.lp-bento-card-body {
  font-size: 0.95rem;
  line-height: var(--lp-prose-lh);
  color: var(--bs-secondary-color);
  margin-bottom: 0;
}

.lp-bento-stat-mega {
  font-size: clamp(1.85rem, 3vw + 0.85rem, 2.65rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--bs-headings-color);
  font-variant-numeric: tabular-nums;
}

.lp-bento-stat-mega-num {
  color: var(--bs-primary);
}

.lp-bento-stat-mega-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--bs-headings-color);
  line-height: 1.3;
}

.lp-bento-stat-block-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--bs-headings-color);
  line-height: 1.3;
}

/* Media tiles */
.lp-bento-media {
  min-height: 11rem;
  min-width: 0;
  background: var(--bs-tertiary-bg, rgba(0, 0, 0, 0.04));
}

@media (min-width: 992px) {
  .lp-bento-col--left .lp-bento-media {
    flex: 1 1 40%;
    min-height: 0;
  }
}

.lp-bento-media-img {
  width: 100%;
  height: 100%;
  min-height: 11rem;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}

@media (min-width: 992px) {
  .lp-bento-col--left .lp-bento-media-img {
    min-height: 100%;
  }
}

/* Tall center card — same radius as other bento tiles; image + overlay clip to curve */
.lp-bento-card--tall {
  min-height: 20rem;
  border: 1px solid color-mix(in srgb, var(--bs-primary) 22%, var(--bs-border-color) 78%);
  border-radius: var(--lp-radius-card, 16px);
  box-shadow: var(--lp-kkoo-shadow, 0 10px 36px rgba(var(--bs-primary-rgb, 92, 48, 143), 0.12)),
    0 18px 48px rgba(var(--bs-primary-rgb, 92, 48, 143), 0.18);
}

@media (min-width: 992px) {
  .lp-bento-card--tall {
    min-height: 100%;
  }
}

.lp-bento-tall-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.lp-bento-tall-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(1rem, 2.5vw, 1.75rem);
  box-sizing: border-box;
  padding: clamp(1.25rem, 3.5vw, 1.75rem);
  border-radius: inherit;
  overflow: hidden;
  background: linear-gradient(
    165deg,
    rgba(var(--lp-ink-rgb), 0.42) 0%,
    rgba(var(--bs-primary-rgb, 92, 48, 143), 0.38) 42%,
    rgba(var(--lp-ink-rgb), 0.78) 100%
  );
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}

@media (min-width: 992px) {
  .lp-bento-tall-overlay {
    padding: clamp(1.65rem, 2.2vw, 2.65rem);
    gap: clamp(1.25rem, 2vw, 2rem);
  }
}

.lp-bento-tall-overlay__top {
  min-width: 0;
}

.lp-bento-tall-stat {
  font-size: clamp(2rem, 3.5vw + 1rem, 3.15rem);
  font-weight: 800;
  line-height: 1;
  color: var(--lp-cream, #faf6f0);
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.35);
}

.lp-bento-tall-stat-title {
  font-size: clamp(1rem, 1.2vw + 0.75rem, 1.25rem);
  font-weight: 700;
  color: rgba(var(--lp-cream-rgb), 0.98);
  text-shadow: 0 1px 14px rgba(0, 0, 0, 0.35);
}

.lp-bento-tall-desc {
  font-size: clamp(0.9rem, 0.35vw + 0.82rem, 1rem);
  line-height: 1.6;
  color: rgba(var(--lp-cream-rgb), 0.94);
  max-width: min(22rem, 100%);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
}

/* Footer */
.lp-investors-footer-border {
  border-color: var(--bs-border-color) !important;
}

.lp-investors-email-link {
  color: var(--bs-primary);
  word-break: break-all;
}

.lp-investors-email-link:hover {
  color: var(--bs-secondary);
}

html[data-bs-theme='dark'] .lp-bento-card--cream {
  background: color-mix(in srgb, var(--bs-secondary) 16%, var(--bs-body-bg));
}

html[data-bs-theme='dark'] .lp-bento-card--lavender {
  background: color-mix(in srgb, var(--bs-primary) 28%, var(--bs-body-bg));
}

html[data-bs-theme='dark'] .lp-bento-card {
  border-color: rgba(var(--bs-primary-rgb, 92, 48, 143), 0.4);
}

html[data-bs-theme='dark'] .lp-bento-tall-overlay {
  background: linear-gradient(
    180deg,
    rgba(var(--bs-primary-rgb, 92, 48, 143), 0.2) 0%,
    rgba(15, 8, 28, 0.72) 50%,
    rgba(10, 6, 18, 0.92) 100%
  );
}
</style>
