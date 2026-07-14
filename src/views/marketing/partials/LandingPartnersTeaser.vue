<template>
  <section id="partners" class="lp-partners-teaser">
    <div class="ui-container lp-partners-teaser__inner">
      <div class="lp-partners-teaser__copy">
        <h2 class="lp-partners-teaser__title">{{ t('landing.premium.partnersTitle') }}</h2>
        <p class="lp-partners-teaser__lead">{{ t('landing.premium.partnersLead') }}</p>
      </div>
      <div class="lp-partners-teaser__links">
        <a
          href="#sell-section"
          class="lp-partners-teaser__link"
          @click.prevent="scrollToSection('sell-section')"
        >
          {{ t('landing.premium.partnersSell') }}
          <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </a>
        <RouterLink :to="buyerRoutes.courier" class="lp-partners-teaser__link">
          {{ t('landing.premium.partnersRide') }}
          <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </RouterLink>
        <RouterLink :to="buyerRoutes.shareEarn" class="lp-partners-teaser__link">
          {{ t('landing.premium.partnersCreate') }}
          <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { buyerRoutes } from '@/config/landing-links'
import { useLandingScroll } from '@/composables/useLandingScroll'

const { t } = useI18n()
const { scrollToSection } = useLandingScroll()
</script>

<style scoped>
.lp-partners-teaser {
  padding: clamp(2.5rem, 6vw, 3.5rem) 0;
  border-top: 1px solid color-mix(in srgb, var(--lp-bento-ink, #3b1a5a) 8%, transparent);
  background: var(--lp-bento-surface, #fff);
}

.lp-partners-teaser__inner {
  display: grid;
  gap: 1.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .lp-partners-teaser__inner {
    grid-template-columns: 1.2fr 1fr;
    gap: 2rem;
  }
}

.lp-partners-teaser__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--lp-bento-ink, #3b1a5a);
}

.lp-partners-teaser__lead {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: color-mix(in srgb, var(--lp-bento-ink, #3b1a5a) 68%, transparent);
}

.lp-partners-teaser__links {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.lp-partners-teaser__link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0.7rem 1rem;
  border-radius: 13px;
  border: 1px solid color-mix(in srgb, #5c308f 16%, transparent);
  background: color-mix(in srgb, #5c308f 5%, transparent);
  color: #5c308f;
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.lp-partners-teaser__link:hover {
  background: color-mix(in srgb, #5c308f 10%, transparent);
  border-color: color-mix(in srgb, #5c308f 28%, transparent);
  color: #3b1a5a;
}
</style>
