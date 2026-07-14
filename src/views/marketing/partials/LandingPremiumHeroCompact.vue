<template>
  <section
    id="hero"
    ref="heroRef"
    class="lp-hero-compact"
    :aria-label="t('landing.heroShowcase.aria')"
  >
    <div class="lp-hero-compact__media" aria-hidden="true">
      <img
        :src="premiumHeroImage"
        :alt="t('landing.premium.heroMockupAlt')"
        class="lp-hero-compact__image"
        loading="eager"
        decoding="async"
      />
      <div class="lp-hero-compact__scrim" />
    </div>

    <div class="ui-container lp-hero-compact__content">
      <p class="lp-hero-compact__brand">KKOO</p>
      <h1 class="lp-hero-compact__title">
        {{ t('landing.premium.downloadHeroTitle') }}
        <span class="lp-hero-compact__accent">{{ t('landing.premium.downloadHeroAccent') }}</span>
      </h1>
      <p class="lp-hero-compact__lead">{{ t('landing.premium.downloadHeroLead') }}</p>

      <div class="lp-hero-compact__actions">
        <a
          href="#download"
          class="ui-btn ui-btn--primary"
          @click.prevent="scrollToSection('download')"
        >
          {{ t('landing.headerGetApp') }}
        </a>
        <RouterLink :to="buyerRoutes.marketplace" class="ui-btn ui-btn--ghost-on-dark">
          {{ t('landing.premium.browseWithoutSignup') }}
        </RouterLink>
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
  --lp-hero-fg: #fff;
  --lp-hero-fg-muted: rgba(255, 255, 255, 0.88);
  --lp-hero-accent: #f7a829;
  position: relative;
  min-height: min(92vh, 40rem);
  display: flex;
  align-items: flex-end;
  color: var(--lp-hero-fg);
  background: #1a1224;
  overflow: clip;
}

.lp-hero-compact__media {
  position: absolute;
  inset: 0;
}

.lp-hero-compact__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.lp-hero-compact__scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(105deg, rgba(26, 18, 36, 0.92) 0%, rgba(59, 26, 90, 0.55) 48%, rgba(26, 18, 36, 0.35) 100%),
    linear-gradient(to top, rgba(26, 18, 36, 0.88) 0%, transparent 55%);
}

.lp-hero-compact__content {
  position: relative;
  z-index: 1;
  max-width: 38rem;
  padding-block: clamp(4.5rem, 12vw, 7rem) clamp(3rem, 8vw, 4.5rem);
}

.lp-hero-compact__brand {
  margin: 0 0 0.75rem;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--lp-hero-fg);
}

.lp-hero-compact__title {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5.5vw, 3.15rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.lp-hero-compact__accent {
  color: var(--lp-hero-accent);
}

.lp-hero-compact__lead {
  margin: 0;
  max-width: 32rem;
  font-size: clamp(1rem, 2.2vw, 1.125rem);
  line-height: 1.55;
  font-weight: 500;
  color: var(--lp-hero-fg-muted);
}

.lp-hero-compact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.lp-hero-compact__actions :deep(.ui-btn) {
  min-height: 2.75rem;
  padding: 0.75rem 1.35rem;
  border-radius: 13px;
  font-weight: 600;
  text-decoration: none;
}

.lp-hero-compact__actions :deep(.ui-btn--primary) {
  background: #5c308f;
  color: #fff;
  border: none;
  box-shadow: 0 2px 10px rgba(92, 48, 143, 0.35);
}

.lp-hero-compact__actions :deep(.ui-btn--primary:hover) {
  background: #3b1a5a;
  color: #fff;
}

.lp-hero-compact__actions :deep(.ui-btn--ghost-on-dark) {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
}

.lp-hero-compact__actions :deep(.ui-btn--ghost-on-dark:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

@media (max-width: 575.98px) {
  .lp-hero-compact {
    min-height: min(88vh, 34rem);
    align-items: flex-end;
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
