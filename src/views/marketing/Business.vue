<template>
  <MarketingLayout>
    <VerticalHero
      :eyebrow="t('businessPage.hero.eyebrow')"
      :title="t('business.heroTitle')"
      :title-accent="t('business.heroTitleAccent')"
      :lead="t('business.heroDesc')"
      :image="shopImage"
      :image-alt="t('businessPage.hero.imageAlt')"
      :badge-label="t('businessPage.hero.overlayKicker')"
      :badge-title="t('businessPage.hero.overlayTitle')"
    >
      <template #actions>
        <a
          :href="bizSellerDashboardUrl"
          class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center text-white"
        >
          <span class="lp-btn-pill__label">{{ t('businessPage.hero.ctaRegister') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:widget-5-linear" class="lp-btn-pill__icon" />
          </span>
        </a>
        <RouterLink
          :to="buyerRoutes.merchant"
          class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
        >
          <span class="lp-btn-pill__label">{{ t('businessPage.hero.ctaExploreMerchantTools') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:shop-2-linear" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
      </template>
    </VerticalHero>

    <p class="ex-signin">
      {{ t('businessPage.hero.alreadyRegistered') }}
      <a :href="bizSignInUrl">{{ t('businessPage.hero.signIn') }}</a>
      <span aria-hidden="true"> · </span>
      <span>{{ t('businessPage.hero.otpWhatsApp') }}</span>
    </p>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="mk-section-head">
          <p class="mk-eyebrow">{{ t('businessPage.sections.capabilities.kicker') }}</p>
          <h2 class="mk-title">{{ t('businessPage.sections.capabilities.title') }}</h2>
          <p class="mk-lead">{{ t('businessPage.sections.capabilities.copy') }}</p>
        </header>

        <ul class="mk-feature-list">
          <li v-for="item in capabilities" :key="item.title">
            <Icon :icon="item.icon" class="mk-feature-list__icon" aria-hidden="true" />
            <div>
              <p class="mk-feature-list__tag">{{ item.tag }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.copy }}</p>
            </div>
          </li>
        </ul>
      </b-container>
    </section>

    <section class="lp-section mk-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="mk-section-head">
          <p class="mk-eyebrow">{{ t('businessPage.sections.operatingFlow.kicker') }}</p>
          <h2 class="mk-title">{{ t('businessPage.sections.operatingFlow.title') }}</h2>
          <p class="mk-lead">{{ t('businessPage.sections.operatingFlow.copy') }}</p>
        </header>

        <ol class="mk-steps">
          <li v-for="(step, index) in operatingFlow" :key="step.title">
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
          <p class="mk-eyebrow">{{ t('businessPage.businessTypes.kicker') }}</p>
          <h2 class="mk-title">{{ t('businessPage.businessTypes.title') }}</h2>
          <p class="mk-lead">{{ t('businessPage.businessTypes.copy') }}</p>
        </header>

        <ul class="mk-type-list">
          <li v-for="item in businessTypes" :key="item.title">
            <h3>{{ item.title }}</h3>
            <p>{{ item.copy }}</p>
          </li>
        </ul>
      </b-container>
    </section>

    <section class="lp-section mk-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="mk-section-head">
          <p class="mk-eyebrow">{{ t('businessPage.faqs.kicker') }}</p>
          <h2 class="mk-title">{{ t('businessPage.faqs.title') }}</h2>
        </header>

        <div class="mk-faq">
          <details v-for="faq in faqs" :key="faq.question">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="mk-cta">
          <div>
            <p class="mk-eyebrow">{{ t('businessPage.sections.cta.kicker') }}</p>
            <h2 class="mk-title">{{ t('businessPage.sections.cta.title') }}</h2>
            <p class="mk-lead">{{ t('businessPage.sections.cta.copy') }}</p>
          </div>
          <div class="mk-cta__actions">
            <a
              :href="bizSellerDashboardUrl"
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center text-white"
            >
              <span class="lp-btn-pill__label">{{ t('businessPage.hero.ctaRegister') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:widget-5-linear" class="lp-btn-pill__icon" />
              </span>
            </a>
            <RouterLink
              :to="buyerRoutes.merchant"
              class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
            >
              <span class="lp-btn-pill__label">{{ t('landing.navSell') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:shop-2-linear" class="lp-btn-pill__icon" />
              </span>
            </RouterLink>
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
import { bizSellerDashboardUrl, bizSignInUrl, buyerRoutes } from '@/config/landing-links'
import shopImage from '@/assets/images/landing/services/shop.jpg'

const { t } = useI18n()

const capabilities = computed(() => [
  {
    icon: 'solar:shop-2-linear',
    tag: t('businessPage.capabilities.1.tag'),
    title: t('businessPage.capabilities.1.title'),
    copy: t('businessPage.capabilities.1.copy'),
  },
  {
    icon: 'solar:delivery-linear',
    tag: t('businessPage.capabilities.2.tag'),
    title: t('businessPage.capabilities.2.title'),
    copy: t('businessPage.capabilities.2.copy'),
  },
  {
    icon: 'solar:wallet-money-linear',
    tag: t('businessPage.capabilities.3.tag'),
    title: t('businessPage.capabilities.3.title'),
    copy: t('businessPage.capabilities.3.copy'),
  },
  {
    icon: 'solar:chart-square-linear',
    tag: t('businessPage.capabilities.4.tag'),
    title: t('businessPage.capabilities.4.title'),
    copy: t('businessPage.capabilities.4.copy'),
  },
])

const operatingFlow = computed(() => [
  { title: t('businessPage.operatingFlow.1.title'), copy: t('businessPage.operatingFlow.1.copy') },
  { title: t('businessPage.operatingFlow.2.title'), copy: t('businessPage.operatingFlow.2.copy') },
  { title: t('businessPage.operatingFlow.3.title'), copy: t('businessPage.operatingFlow.3.copy') },
  { title: t('businessPage.operatingFlow.4.title'), copy: t('businessPage.operatingFlow.4.copy') },
])

const businessTypes = computed(() => [
  {
    title: t('businessPage.businessTypes.restaurant.title'),
    copy: t('businessPage.businessTypes.restaurant.copy'),
  },
  {
    title: t('businessPage.businessTypes.store.title'),
    copy: t('businessPage.businessTypes.store.copy'),
  },
  {
    title: t('businessPage.businessTypes.retail.title'),
    copy: t('businessPage.businessTypes.retail.copy'),
  },
])

const faqs = computed(() => [
  { question: t('businessPage.faqs.1.q'), answer: t('businessPage.faqs.1.a') },
  { question: t('businessPage.faqs.2.q'), answer: t('businessPage.faqs.2.a') },
  { question: t('businessPage.faqs.3.q'), answer: t('businessPage.faqs.3.a') },
  { question: t('businessPage.faqs.4.q'), answer: t('businessPage.faqs.4.a') },
  { question: t('businessPage.faqs.5.q'), answer: t('businessPage.faqs.5.a') },
])
</script>

<style scoped>
.ex-signin {
  margin: 0 auto;
  padding: 0.25rem clamp(1rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem);
  max-width: 72rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--lp-text-soft, #5c5663);
}

.ex-signin a {
  color: #5c308f;
  font-weight: 600;
  text-decoration: none;
}

.ex-signin a:hover {
  text-decoration: underline;
}

.mk-section-head {
  max-width: 40rem;
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
  max-width: 38rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--lp-text-soft, #5c5663);
}

.mk-band {
  background: color-mix(in srgb, var(--lp-landing-paper, #f7f5f8) 88%, #5c308f 4%);
}

.mk-feature-list,
.mk-type-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, var(--lp-heading-ink, #1a1224) 10%, transparent);
}

.mk-feature-list li,
.mk-type-list li {
  padding: 1.35rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--lp-heading-ink, #1a1224) 10%, transparent);
}

.mk-feature-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
}

.mk-feature-list__icon {
  width: 1.35rem;
  height: 1.35rem;
  margin-top: 0.35rem;
  color: #5c308f;
}

.mk-feature-list__tag {
  margin: 0 0 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f7a829;
}

.mk-feature-list h3,
.mk-type-list h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--lp-heading-ink, #1a1224);
}

.mk-feature-list p,
.mk-type-list p {
  margin: 0;
  max-width: 44rem;
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
  max-width: 44rem;
  border-top: 1px solid color-mix(in srgb, var(--lp-heading-ink, #1a1224) 10%, transparent);
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
