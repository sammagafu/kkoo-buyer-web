<template>
  <MarketingLayout>
    <VerticalHero
      :eyebrow="t('merchant.heroEyebrow')"
      :title="t('merchant.heroTitle')"
      :title-accent="t('merchant.heroTitleAccent')"
      :lead="t('merchant.heroDesc')"
      :image="shopImage"
      :image-alt="t('merchant.visual.primaryImageAlt')"
      :badge-label="t('merchant.visual.primaryBadgeLabel')"
      :badge-title="t('merchant.visual.primaryBadgeTitle')"
    >
      <template #actions>
        <a
          :href="bizSellerRegisterUrl"
          class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center text-white"
        >
          <span class="lp-btn-pill__label">{{ t('merchant.cta.becomeMerchant') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
          </span>
        </a>
        <RouterLink
          :to="buyerRoutes.business"
          class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
        >
          <span class="lp-btn-pill__label">{{ t('merchant.cta.needTools') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:widget-5-linear" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
      </template>
    </VerticalHero>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="mk-section-head">
          <p class="mk-eyebrow">{{ t('merchant.sections.why.kicker') }}</p>
          <h2 class="mk-title">{{ t('merchant.sections.why.title') }}</h2>
          <p class="mk-lead">{{ t('merchant.sections.why.copy') }}</p>
        </header>

        <ul class="mk-feature-list">
          <li v-for="benefit in benefits" :key="benefit.title">
            <Icon :icon="benefit.icon" class="mk-feature-list__icon" aria-hidden="true" />
            <div>
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.copy }}</p>
            </div>
          </li>
        </ul>
      </b-container>
    </section>

    <section class="lp-section mk-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="mk-section-head">
          <p class="mk-eyebrow">{{ t('merchant.sections.steps.kicker') }}</p>
          <h2 class="mk-title">{{ t('merchant.sections.steps.title') }}</h2>
        </header>

        <ol class="mk-steps">
          <li v-for="(step, index) in steps" :key="step.title">
            <span class="mk-steps__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.copy }}</p>
            </div>
          </li>
        </ol>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="mk-section-head">
          <p class="mk-eyebrow">{{ t('merchant.sections.faq.kicker') }}</p>
          <h2 class="mk-title">{{ t('merchant.sections.faq.title') }}</h2>
        </header>

        <div class="mk-faq">
          <details v-for="faq in faqs" :key="faq.question">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </b-container>
    </section>

    <section class="lp-section mk-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="mk-cta">
          <div>
            <p class="mk-eyebrow">{{ t('merchant.sections.cta.kicker') }}</p>
            <h2 class="mk-title">{{ t('merchant.sections.cta.title') }}</h2>
            <p class="mk-lead">{{ t('merchant.sections.cta.copy') }}</p>
          </div>
          <div class="mk-cta__actions">
            <a
              :href="bizSellerRegisterUrl"
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center text-white"
            >
              <span class="lp-btn-pill__label">{{ t('merchant.cta.startSetup') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </a>
            <a
              class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
              href="mailto:info@kkooapp.co.tz?subject=KKOO%20Merchant%20Partnership"
            >
              <span class="lp-btn-pill__label">{{ t('merchant.cta.partnerships') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:letter-linear" class="lp-btn-pill__icon" />
              </span>
            </a>
          </div>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import MarketingLayout from './MarketingLayout.vue'
import VerticalHero from './components/VerticalHero.vue'
import { buyerRoutes, bizSellerRegisterUrl } from '@/config/landing-links'
import shopImage from '@/assets/images/landing/services/shop.jpg'

const { t } = useI18n()

const benefits = computed(() => [
  {
    icon: 'solar:chart-square-linear',
    title: t('merchant.benefits.1.title'),
    copy: t('merchant.benefits.1.copy'),
  },
  {
    icon: 'solar:wallet-money-linear',
    title: t('merchant.benefits.2.title'),
    copy: t('merchant.benefits.2.copy'),
  },
  {
    icon: 'solar:box-linear',
    title: t('merchant.benefits.3.title'),
    copy: t('merchant.benefits.3.copy'),
  },
  {
    icon: 'solar:smartphone-2-linear',
    title: t('merchant.benefits.4.title'),
    copy: t('merchant.benefits.4.copy'),
  },
])

const steps = computed(() => [
  { title: t('merchant.steps.1.title'), copy: t('merchant.steps.1.copy') },
  { title: t('merchant.steps.2.title'), copy: t('merchant.steps.2.copy') },
  { title: t('merchant.steps.3.title'), copy: t('merchant.steps.3.copy') },
  { title: t('merchant.steps.4.title'), copy: t('merchant.steps.4.copy') },
])

const faqs = computed(() => [
  { question: t('merchant.faqs.1.q'), answer: t('merchant.faqs.1.a') },
  { question: t('merchant.faqs.2.q'), answer: t('merchant.faqs.2.a') },
  { question: t('merchant.faqs.3.q'), answer: t('merchant.faqs.3.a') },
  { question: t('merchant.faqs.4.q'), answer: t('merchant.faqs.4.a') },
])
</script>

<style scoped>
.mk-section-head {
  max-width: 38rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.mk-eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5c308f;
}

.mk-title {
  margin: 0 0 0.85rem;
  font-size: clamp(1.65rem, 3.5vw, 2.35rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--lp-heading-ink, #1a1224);
  text-wrap: balance;
}

.mk-lead {
  margin: 0;
  max-width: 36rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--lp-text-soft, #5c5663);
}

.mk-band {
  background: color-mix(in srgb, var(--lp-landing-paper, #f7f5f8) 88%, #5c308f 4%);
}

.mk-feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
  border-top: 1px solid color-mix(in srgb, var(--lp-heading-ink, #1a1224) 10%, transparent);
}

.mk-feature-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
  padding: 1.35rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--lp-heading-ink, #1a1224) 10%, transparent);
}

.mk-feature-list__icon {
  width: 1.35rem;
  height: 1.35rem;
  margin-top: 0.2rem;
  color: #5c308f;
}

.mk-feature-list h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--lp-heading-ink, #1a1224);
}

.mk-feature-list p {
  margin: 0;
  max-width: 42rem;
  line-height: 1.6;
  color: var(--lp-text-soft, #5c5663);
}

.mk-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: clamp(1.5rem, 3vw, 2rem);
}

@media (min-width: 992px) {
  .mk-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 3rem;
  }
}

.mk-steps li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem;
  align-items: start;
}

.mk-steps__index {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #f7a829;
  padding-top: 0.2rem;
}

.mk-steps h3 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--lp-heading-ink, #1a1224);
}

.mk-steps p {
  margin: 0;
  line-height: 1.6;
  color: var(--lp-text-soft, #5c5663);
}

.mk-faq {
  display: grid;
  gap: 0;
  border-top: 1px solid color-mix(in srgb, var(--lp-heading-ink, #1a1224) 10%, transparent);
  max-width: 44rem;
}

.mk-faq details {
  border-bottom: 1px solid color-mix(in srgb, var(--lp-heading-ink, #1a1224) 10%, transparent);
  padding: 1.1rem 0;
}

.mk-faq summary {
  cursor: pointer;
  font-weight: 700;
  color: var(--lp-heading-ink, #1a1224);
  list-style: none;
}

.mk-faq summary::-webkit-details-marker {
  display: none;
}

.mk-faq p {
  margin: 0.75rem 0 0;
  line-height: 1.65;
  color: var(--lp-text-soft, #5c5663);
}

.mk-cta {
  display: grid;
  gap: 1.75rem;
  align-items: end;
}

@media (min-width: 992px) {
  .mk-cta {
    grid-template-columns: 1.2fr auto;
    gap: 3rem;
  }
}

.mk-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
