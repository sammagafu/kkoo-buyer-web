<template>
  <MarketingLayout>
    <div class="context-nav">
      <div class="context-nav-left">
        <RouterLink to="/parcel" class="context-nav-link">{{ t('courier.context.sendParcel') }}</RouterLink>
        <RouterLink to="/send" class="context-nav-link">{{ t('courier.context.sendMe') }}</RouterLink>
        <RouterLink to="/ride" class="context-nav-link">{{ t('courier.context.requestRide') }}</RouterLink>
      </div>
    </div>

    <VerticalHero
      :eyebrow="t('courier.hero.eyebrow')"
      :title="t('courier.hero.title1')"
      :title-accent="t('courier.hero.title2')"
      :lead="t('courier.hero.lead')"
      :image="courierHeroImage"
      :image-alt="t('courier.hero.imageAlt')"
      :badge-label="t('courier.hero.overlay.runsLabel')"
      :badge-title="t('courier.hero.overlay.runsValue')"
    >
      <template #actions>
        <RouterLink to="/parcel" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center text-white">
          <span class="lp-btn-pill__label">{{ t('courier.hero.ctaParcel') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:box-linear" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
        <RouterLink to="/send" class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center">
          <span class="lp-btn-pill__label">{{ t('courier.hero.ctaSendMe') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:bag-heart-linear" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
      </template>
    </VerticalHero>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <h2 class="courier-section-title">{{ t('courier.sections.services.title') }}</h2>

        <div class="courier-quick-grid">
          <RouterLink to="/parcel" class="courier-quick-card">
            <img :src="groceriesImage" :alt="t('courier.sections.services.parcel.title')" class="courier-quick-card__img" loading="lazy" />
            <div class="courier-quick-card__body">
              <h3>{{ t('courier.sections.services.parcel.title') }}</h3>
              <p>{{ t('courier.sections.services.parcel.copy') }}</p>
            </div>
          </RouterLink>

          <RouterLink to="/send" class="courier-quick-card">
            <img :src="foodImage" :alt="t('courier.sections.services.sendMe.title')" class="courier-quick-card__img" loading="lazy" />
            <div class="courier-quick-card__body">
              <h3>{{ t('courier.sections.services.sendMe.title') }}</h3>
              <p>{{ t('courier.sections.services.sendMe.copy') }}</p>
            </div>
          </RouterLink>
        </div>
      </b-container>
    </section>

    <section class="lp-section courier-driver-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="courier-driver-band__inner">
          <div>
            <h2 class="courier-section-title">{{ t('courier.sections.cta.title') }}</h2>
            <p class="courier-driver-band__copy">{{ t('courier.sections.cta.copy') }}</p>
          </div>
          <RouterLink :to="{ name: 'auth.sign-in' }" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm text-decoration-none d-inline-flex align-items-center text-white">
            <span class="lp-btn-pill__label">{{ t('courier.sections.cta.join') }}</span>
            <span class="lp-btn-pill__well" aria-hidden="true">
              <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
            </span>
          </RouterLink>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'

import MarketingLayout from './MarketingLayout.vue'
import VerticalHero from './components/VerticalHero.vue'
import courierHeroImage from '@/assets/images/landing/services/ride.jpg'
import foodImage from '@/assets/images/landing/services/food.jpg'
import groceriesImage from '@/assets/images/landing/services/groceries.jpg'

const { t } = useI18n()
</script>

<style scoped>
.courier-section-title {
  margin: 0 0 1rem;
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 800;
  line-height: 1.15;
  color: var(--bs-heading-color, var(--bs-body-color));
}

.courier-quick-grid {
  display: grid;
  gap: 1rem;
}

.courier-quick-card {
  display: flex;
  flex-direction: column;
  border-radius: 1.15rem;
  overflow: hidden;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.14);
  background: var(--bs-body-bg, #fff);
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.courier-quick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(12, 15, 30, 0.08);
  color: inherit;
}

.courier-quick-card__img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.courier-quick-card__body {
  padding: 1rem 1.1rem 1.15rem;
}

.courier-quick-card__body h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.courier-quick-card__body p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--bs-secondary-color);
}

.courier-driver-band {
  background: color-mix(in srgb, var(--bs-primary) 6%, var(--bs-body-bg));
}

.courier-driver-band__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.courier-driver-band__copy {
  margin: 0.35rem 0 0;
  max-width: 36ch;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--bs-secondary-color);
}

@media (min-width: 768px) {
  .courier-quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
