<template>
  <section id="partners" class="lp-partners-teaser">
    <div class="ui-container lp-partners-teaser__inner">
      <div class="lp-partners-teaser__copy">
        <h2 class="lp-partners-teaser__title">{{ t('landing.premium.partnersTitle') }}</h2>
        <p class="lp-partners-teaser__lead">{{ t('landing.premium.partnersLead') }}</p>
      </div>
      <div class="lp-partners-teaser__links">
        <RouterLink :to="buyerRoutes.merchant" class="lp-partners-teaser__link">
          {{ t('landing.premium.partnersSell') }}
          <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </RouterLink>
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

const { t } = useI18n()
</script>

<style scoped>
.lp-partners-teaser {
  padding: clamp(4rem, 9vw, 6rem) 0;
  background: var(--lp-bento-bg, #f7f5f8);
}

.lp-partners-teaser__inner {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
  align-items: end;
}

@media (min-width: 768px) {
  .lp-partners-teaser__inner {
    grid-template-columns: 1.15fr 0.85fr;
    gap: 3rem;
  }
}

.lp-partners-teaser__title {
  margin: 0 0 0.85rem;
  font-size: clamp(1.5rem, 3.2vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--lp-bento-ink, #1a1224);
  text-wrap: balance;
}

.lp-partners-teaser__lead {
  margin: 0;
  max-width: 32rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--lp-bento-muted, #5c5663);
}

.lp-partners-teaser__links {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  border-top: 1px solid color-mix(in srgb, var(--lp-bento-ink, #1a1224) 12%, transparent);
}

.lp-partners-teaser__link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 3.25rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--lp-bento-ink, #1a1224) 12%, transparent);
  color: var(--lp-bento-ink, #1a1224);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.15s ease, padding-inline-start 0.15s ease;
}

.lp-partners-teaser__link:hover {
  color: var(--lp-bento-primary, #5c308f);
  padding-inline-start: 0.35rem;
}
</style>
