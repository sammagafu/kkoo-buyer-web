<template>
  <section
    id="hero"
    ref="heroRef"
    class="lp-hero-compact"
    :aria-label="t('landing.heroShowcase.aria')"
  >
    <div class="lp-hero-compact__stage">
      <div class="lp-hero-compact__copy">
        <p class="lp-hero-compact__brand ui-reveal">KKOO</p>
        <h1 class="lp-hero-compact__title ui-reveal">
          {{ t('landing.premium.downloadHeroTitle') }}
          <span class="lp-hero-compact__accent">{{ t('landing.premium.downloadHeroAccent') }}</span>
        </h1>
        <p class="lp-hero-compact__lead ui-reveal">{{ t('landing.premium.downloadHeroLead') }}</p>

        <div class="lp-hero-compact__actions ui-reveal">
          <a
            href="#download"
            class="ui-btn ui-btn--primary"
            @click.prevent="scrollToSection('download')"
          >
            {{ t('landing.headerGetApp') }}
          </a>
          <RouterLink :to="buyerRoutes.marketplace" class="ui-btn ui-btn--ghost-ink">
            {{ t('landing.premium.browseWithoutSignup') }}
          </RouterLink>
        </div>
      </div>

      <div class="lp-hero-compact__media" aria-hidden="true">
        <img
          :src="premiumHeroImage"
          :alt="t('landing.premium.heroMockupAlt')"
          class="lp-hero-compact__image"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { buyerRoutes } from '@/config/landing-links'
import { premiumHeroImage } from '@/config/landing-premium'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { observeRevealChildren } from '@/composables/useLandingReveal'

const { t } = useI18n()
const { scrollToSection } = useLandingScroll()
const heroRef = ref<HTMLElement | null>(null)

onMounted(() => observeRevealChildren(heroRef.value))
</script>

<style scoped>
.lp-hero-compact {
  --lp-hero-ink: #1a1224;
  --lp-hero-ink-soft: rgba(26, 18, 36, 0.72);
  --lp-hero-surface: #fbfafc;
  --lp-hero-accent: #f7a829;
  --lp-hero-primary: #5c308f;
  position: relative;
  background: var(--lp-hero-surface);
  color: var(--lp-hero-ink);
  overflow: clip;
}

.lp-hero-compact__stage {
  display: grid;
  min-height: min(88vh, 42rem);
}

@media (min-width: 992px) {
  .lp-hero-compact__stage {
    grid-template-columns: minmax(20rem, 0.92fr) minmax(0, 1.08fr);
    min-height: min(92vh, 44rem);
  }
}

.lp-hero-compact__copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  padding: clamp(3rem, 8vw, 5.5rem) clamp(1.35rem, 5vw, 4rem);
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(92, 48, 143, 0.07), transparent 55%),
    var(--lp-hero-surface);
}

@media (min-width: 992px) {
  .lp-hero-compact__copy {
    padding-inline: clamp(2.5rem, 6vw, 5rem);
    max-width: none;
  }
}

.lp-hero-compact__brand {
  margin: 0 0 1.25rem;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.5rem, 3.2vw, 2rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 1;
  text-transform: uppercase;
  color: var(--lp-hero-primary);
}

.lp-hero-compact__title {
  margin: 0;
  max-width: 11ch;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2.35rem, 6.2vw, 4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: var(--lp-hero-ink);
  text-wrap: balance;
}

.lp-hero-compact__accent {
  display: block;
  margin-top: 0.15em;
  color: var(--lp-hero-accent);
}

.lp-hero-compact__lead {
  margin: 1.35rem 0 0;
  max-width: 28rem;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  line-height: 1.55;
  font-weight: 400;
  color: var(--lp-hero-ink-soft);
}

.lp-hero-compact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.lp-hero-compact__actions :deep(.ui-btn) {
  min-height: 3rem;
  padding: 0.85rem 1.5rem;
  border-radius: 13px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.lp-hero-compact__actions :deep(.ui-btn:hover) {
  transform: translateY(-1px);
}

.lp-hero-compact__actions :deep(.ui-btn--primary) {
  background: var(--lp-hero-primary);
  color: #fff;
  border: none;
  box-shadow: none;
}

.lp-hero-compact__actions :deep(.ui-btn--primary:hover) {
  background: #3b1a5a;
  color: #fff;
}

.lp-hero-compact__actions :deep(.ui-btn--ghost-ink) {
  background: transparent;
  color: var(--lp-hero-ink);
  border: 1.5px solid color-mix(in srgb, var(--lp-hero-ink) 22%, transparent);
}

.lp-hero-compact__actions :deep(.ui-btn--ghost-ink:hover) {
  background: color-mix(in srgb, var(--lp-hero-primary) 6%, transparent);
  border-color: color-mix(in srgb, var(--lp-hero-primary) 40%, transparent);
  color: var(--lp-hero-primary);
}

.lp-hero-compact__media {
  position: relative;
  min-height: 14rem;
  background: #1a1224;
  overflow: hidden;
}

@media (min-width: 992px) {
  .lp-hero-compact__media {
    min-height: 100%;
  }
}

.lp-hero-compact__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
  transform: scale(1.04);
  animation: lp-hero- ken 18s ease-in-out infinite alternate;
}

@keyframes lp-hero-ken {
  from {
    transform: scale(1.04) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.1) translate3d(-1.5%, -1%, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-hero-compact__image {
    animation: none;
    transform: none;
  }

  .lp-hero-compact__actions :deep(.ui-btn:hover) {
    transform: none;
  }
}

@media (max-width: 991.98px) {
  .lp-hero-compact__stage {
    grid-template-rows: auto minmax(16rem, 42vw);
  }

  .lp-hero-compact__copy {
    order: 1;
    padding-block: clamp(2.75rem, 9vw, 3.75rem) clamp(2.25rem, 7vw, 3rem);
  }

  .lp-hero-compact__media {
    order: 2;
  }

  .lp-hero-compact__title {
    max-width: 12ch;
  }

  .lp-hero-compact__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lp-hero-compact__actions :deep(.ui-btn) {
    justify-content: center;
  }
}
</style>
