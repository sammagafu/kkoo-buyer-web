<template>
  <MarketingLayout>
    <section class="lp-section business-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="business-hero-grid">
          <div class="business-copy">
            <p class="business-eyebrow">{{ t('businessPage.hero.eyebrow') }}</p>
            <h1 class="business-title">
              {{ t('business.heroTitle') }}
              <span>{{ t('business.heroTitleAccent') }}</span>
            </h1>
            <p class="business-lead">{{ t('business.heroDesc') }}</p>
            <p class="business-social-proof">{{ t('businessPage.hero.socialProof') }}</p>

            <div class="business-actions">
              <b-button
                class="lp-btn-pill lp-btn-pill--accent lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
                :href="bizSellerRegisterUrl"
              >
                <span class="lp-btn-pill__label">{{ t('businessPage.hero.ctaRegister') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="link"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                :to="buyerRoutes.merchant"
              >
                <span class="lp-btn-pill__label">{{ t('landing.exploreMerchant') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:bag-5-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="link"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                :href="bizSellerDashboardUrl"
              >
                <span class="lp-btn-pill__label">{{ t('businessPage.hero.ctaExploreMerchantTools') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:widget-5-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="link"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                @click="navigateToService('market')"
              >
                <span class="lp-btn-pill__label">{{ t('businessPage.hero.ctaSeeMarketplaceDemand') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:shop-2-bold" class="lp-btn-pill__icon" />
                </span>
              </b-button>
            </div>

            <p class="business-sign-in">
              {{ t('businessPage.hero.alreadyRegistered') }}
              <a :href="bizSignInUrl">{{ t('businessPage.hero.signIn') }}</a>
              ·
              <a :href="bizSellerAccountUrl">{{ t('landing.footerSellerAccount') }}</a>
            </p>

            <div class="business-proof">
              <span v-for="point in proofPoints" :key="point" class="business-proof-chip">{{ point }}</span>
            </div>
          </div>

          <div class="business-visual">
            <article class="business-board">
              <div class="business-board-media">
                <img :src="shopImage" :alt="t('businessPage.hero.imageAlt')" class="business-board-image" />
                <div class="business-board-overlay">
                  <span class="business-board-kicker">{{ t('businessPage.hero.overlayKicker') }}</span>
                  <strong>{{ t('businessPage.hero.overlayTitle') }}</strong>
                </div>
              </div>

              <div class="business-board-stack">
                <article v-for="item in boardHighlights" :key="item.title" class="business-board-card">
                  <div class="business-board-icon">
                    <Icon :icon="item.icon" />
                  </div>
                  <div>
                    <h2>{{ item.title }}</h2>
                    <p>{{ item.copy }}</p>
                  </div>
                </article>
              </div>
            </article>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section business-type-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('businessPage.businessTypes.kicker') }}</p>
          <h2 class="section-title">{{ t('businessPage.businessTypes.title') }}</h2>
          <p class="section-copy">{{ t('businessPage.businessTypes.copy') }}</p>
        </div>

        <div class="business-type-grid">
          <article v-for="item in businessTypes" :key="item.title" class="business-type-card">
            <span class="business-type-icon">
              <Icon :icon="item.icon" />
            </span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section business-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('businessPage.sections.capabilities.kicker') }}</p>
          <h2 class="section-title">{{ t('businessPage.sections.capabilities.title') }}</h2>
          <p class="section-copy">{{ t('businessPage.sections.capabilities.copy') }}</p>
        </div>

        <div class="capability-grid">
          <article v-for="capability in capabilities" :key="capability.title" class="capability-card">
            <div class="capability-top">
              <span class="capability-icon">
                <Icon :icon="capability.icon" />
              </span>
              <span class="capability-tag">{{ capability.tag }}</span>
            </div>
            <h3>{{ capability.title }}</h3>
            <p>{{ capability.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('businessPage.sections.useCases.kicker') }}</p>
          <h2 class="section-title">{{ t('businessPage.sections.useCases.title') }}</h2>
          <p class="section-copy">{{ t('businessPage.sections.useCases.copy') }}</p>
        </div>

        <div class="use-case-grid">
          <article v-for="item in useCases" :key="item.title" class="use-case-card">
            <div class="use-case-media">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="use-case-body">
              <span class="use-case-label">{{ item.label }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.copy }}</p>
              <ul class="use-case-list">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section workflow-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="workflow-shell">
          <div>
            <p class="section-kicker">{{ t('businessPage.sections.operatingFlow.kicker') }}</p>
            <h2 class="section-title">{{ t('businessPage.sections.operatingFlow.title') }}</h2>
            <p class="section-copy">{{ t('businessPage.sections.operatingFlow.copy') }}</p>
          </div>

          <div class="workflow-grid">
            <article v-for="(step, index) in operatingFlow" :key="step.title" class="workflow-card">
              <span class="workflow-index">0{{ index + 1 }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.copy }}</p>
            </article>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section merchant-portal-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('businessPage.merchantPortal.kicker') }}</p>
          <h2 class="section-title">{{ t('businessPage.merchantPortal.title') }}</h2>
          <p class="section-copy">{{ t('businessPage.merchantPortal.copy') }}</p>
        </div>

        <div class="merchant-portal-grid">
          <article v-for="item in merchantPortalFeatures" :key="item.title" class="merchant-portal-card">
            <span class="merchant-portal-icon">
              <Icon :icon="item.icon" />
            </span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('businessPage.sections.growth.kicker') }}</p>
          <h2 class="section-title">{{ t('businessPage.sections.growth.title') }}</h2>
          <p class="section-copy">{{ t('businessPage.sections.growth.copy') }}</p>
        </div>

        <div class="gamification-grid">
          <article v-for="item in gamificationFeatures" :key="item.title" class="gamification-card">
            <div class="gamification-top">
              <span class="gamification-icon">
                <Icon :icon="item.icon" />
              </span>
              <span class="gamification-tag">{{ item.tag }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section feature-map-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('businessPage.sections.coverage.kicker') }}</p>
          <h2 class="section-title">{{ t('businessPage.sections.coverage.title') }}</h2>
        </div>

        <div class="feature-map-grid">
          <article v-for="item in productCoverage" :key="item.title" class="feature-map-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section business-testimonial-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <blockquote class="business-testimonial">
          <p>“{{ t('businessPage.testimonial.quote') }}”</p>
          <footer>
            <strong>{{ t('businessPage.testimonial.name') }}</strong>
            <span>{{ t('businessPage.testimonial.role') }}</span>
          </footer>
        </blockquote>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('businessPage.faqs.kicker') }}</p>
          <h2 class="section-title">{{ t('businessPage.faqs.title') }}</h2>
        </div>

        <div class="faq-list">
          <details v-for="faq in faqs" :key="faq.question" class="faq-item">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </b-container>
    </section>

    <section class="lp-section business-cta">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="cta-shell">
          <div>
            <p class="section-kicker">{{ t('businessPage.sections.cta.kicker') }}</p>
            <h2 class="section-title">{{ t('businessPage.sections.cta.title') }}</h2>
            <p class="section-copy">{{ t('businessPage.sections.cta.copy') }}</p>
          </div>

          <div class="cta-actions">
            <b-button
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
              :href="bizSellerRegisterUrl"
            >
              <span class="lp-btn-pill__label">{{ t('businessPage.sections.cta.goToMerchantSetup') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </b-button>
            <b-button
              variant="link"
              class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
              :to="{ name: 'pages.share-earn' }"
            >
              <span class="lp-btn-pill__label">{{ t('businessPage.sections.cta.seeRewards') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:gift-linear" class="lp-btn-pill__icon" />
              </span>
            </b-button>
          </div>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

import { useSubdomainNavigation } from '@/composables/useSubdomainNavigation'
import { bizSellerAccountUrl, bizSellerDashboardUrl, bizSellerRegisterUrl, bizSignInUrl, buyerRoutes } from '@/config/landing-links'
import foodImage from '@/assets/images/landing/services/food.jpg'
import groceriesImage from '@/assets/images/landing/services/groceries.jpg'
import shopImage from '@/assets/images/landing/services/shop.jpg'
import MarketingLayout from './MarketingLayout.vue'

const { t } = useI18n()
const { navigateToService } = useSubdomainNavigation()

const proofPoints = computed(() => [
  t('businessPage.proof.1'),
  t('businessPage.proof.2'),
  t('businessPage.proof.3'),
  t('businessPage.proof.4'),
])

const businessTypes = computed(() => [
  {
    icon: 'solar:chef-hat-heart-linear',
    title: t('businessPage.businessTypes.restaurant.title'),
    copy: t('businessPage.businessTypes.restaurant.copy'),
  },
  {
    icon: 'solar:cart-large-minimalistic-linear',
    title: t('businessPage.businessTypes.store.title'),
    copy: t('businessPage.businessTypes.store.copy'),
  },
  {
    icon: 'solar:bag-heart-linear',
    title: t('businessPage.businessTypes.retail.title'),
    copy: t('businessPage.businessTypes.retail.copy'),
  },
])

const boardHighlights = computed(() => [
  {
    icon: 'solar:cart-large-2-linear',
    title: t('businessPage.board.1.title'),
    copy: t('businessPage.board.1.copy'),
  },
  {
    icon: 'solar:delivery-linear',
    title: t('businessPage.board.2.title'),
    copy: t('businessPage.board.2.copy'),
  },
  {
    icon: 'solar:star-circle-linear',
    title: t('businessPage.board.3.title'),
    copy: t('businessPage.board.3.copy'),
  },
])

const capabilities = computed(() => [
  {
    icon: 'solar:shop-2-linear',
    tag: t('businessPage.capabilities.1.tag'),
    title: t('businessPage.capabilities.1.title'),
    copy: t('businessPage.capabilities.1.copy'),
  },
  {
    icon: 'solar:box-minimalistic-linear',
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
    icon: 'solar:gift-linear',
    tag: t('businessPage.capabilities.4.tag'),
    title: t('businessPage.capabilities.4.title'),
    copy: t('businessPage.capabilities.4.copy'),
  },
])

const useCases = computed(() => [
  {
    label: t('businessPage.useCases.1.label'),
    title: t('businessPage.useCases.1.title'),
    copy: t('businessPage.useCases.1.copy'),
    image: shopImage,
    points: [
      t('businessPage.useCases.1.points.1'),
      t('businessPage.useCases.1.points.2'),
      t('businessPage.useCases.1.points.3'),
    ],
  },
  {
    label: t('businessPage.useCases.2.label'),
    title: t('businessPage.useCases.2.title'),
    copy: t('businessPage.useCases.2.copy'),
    image: foodImage,
    points: [
      t('businessPage.useCases.2.points.1'),
      t('businessPage.useCases.2.points.2'),
      t('businessPage.useCases.2.points.3'),
    ],
  },
  {
    label: t('businessPage.useCases.3.label'),
    title: t('businessPage.useCases.3.title'),
    copy: t('businessPage.useCases.3.copy'),
    image: groceriesImage,
    points: [
      t('businessPage.useCases.3.points.1'),
      t('businessPage.useCases.3.points.2'),
      t('businessPage.useCases.3.points.3'),
    ],
  },
])

const operatingFlow = computed(() => [
  {
    title: t('businessPage.operatingFlow.1.title'),
    copy: t('businessPage.operatingFlow.1.copy'),
  },
  {
    title: t('businessPage.operatingFlow.2.title'),
    copy: t('businessPage.operatingFlow.2.copy'),
  },
  {
    title: t('businessPage.operatingFlow.3.title'),
    copy: t('businessPage.operatingFlow.3.copy'),
  },
  {
    title: t('businessPage.operatingFlow.4.title'),
    copy: t('businessPage.operatingFlow.4.copy'),
  },
])

const merchantPortalFeatures = computed(() => [
  {
    icon: 'solar:chart-square-linear',
    title: t('businessPage.merchantPortal.1.title'),
    copy: t('businessPage.merchantPortal.1.copy'),
  },
  {
    icon: 'solar:eye-linear',
    title: t('businessPage.merchantPortal.2.title'),
    copy: t('businessPage.merchantPortal.2.copy'),
  },
  {
    icon: 'solar:graph-up-linear',
    title: t('businessPage.merchantPortal.3.title'),
    copy: t('businessPage.merchantPortal.3.copy'),
  },
  {
    icon: 'solar:ticket-sale-linear',
    title: t('businessPage.merchantPortal.4.title'),
    copy: t('businessPage.merchantPortal.4.copy'),
  },
])

const faqs = computed(() => [
  { question: t('businessPage.faqs.1.q'), answer: t('businessPage.faqs.1.a') },
  { question: t('businessPage.faqs.2.q'), answer: t('businessPage.faqs.2.a') },
  { question: t('businessPage.faqs.3.q'), answer: t('businessPage.faqs.3.a') },
  { question: t('businessPage.faqs.4.q'), answer: t('businessPage.faqs.4.a') },
  { question: t('businessPage.faqs.5.q'), answer: t('businessPage.faqs.5.a') },
])

const gamificationFeatures = computed(() => [
  {
    icon: 'solar:star-circle-linear',
    tag: t('businessPage.growthCards.1.tag'),
    title: t('businessPage.growthCards.1.title'),
    copy: t('businessPage.growthCards.1.copy'),
  },
  {
    icon: 'solar:cup-star-linear',
    tag: t('businessPage.growthCards.2.tag'),
    title: t('businessPage.growthCards.2.title'),
    copy: t('businessPage.growthCards.2.copy'),
  },
  {
    icon: 'solar:gift-linear',
    tag: t('businessPage.growthCards.3.tag'),
    title: t('businessPage.growthCards.3.title'),
    copy: t('businessPage.growthCards.3.copy'),
  },
  {
    icon: 'solar:users-group-rounded-linear',
    tag: t('businessPage.growthCards.4.tag'),
    title: t('businessPage.growthCards.4.title'),
    copy: t('businessPage.growthCards.4.copy'),
  },
])

const productCoverage = computed(() => [
  {
    title: t('businessPage.coverageCards.1.title'),
    copy: t('businessPage.coverageCards.1.copy'),
  },
  {
    title: t('businessPage.coverageCards.2.title'),
    copy: t('businessPage.coverageCards.2.copy'),
  },
  {
    title: t('businessPage.coverageCards.3.title'),
    copy: t('businessPage.coverageCards.3.copy'),
  },
  {
    title: t('businessPage.coverageCards.4.title'),
    copy: t('businessPage.coverageCards.4.copy'),
  },
])
</script>

<style scoped>
.business-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at left top, rgba(var(--bs-secondary-rgb), 0.14), transparent 28%),
    radial-gradient(circle at 88% 18%, rgba(var(--bs-primary-rgb), 0.14), transparent 32%),
    linear-gradient(180deg, rgba(92, 48, 143, 0.02), rgba(92, 48, 143, 0));
}

.business-hero-grid,
.capability-grid,
.use-case-grid,
.workflow-grid,
.gamification-grid,
.feature-map-grid,
.business-type-grid,
.merchant-portal-grid {
  display: grid;
  gap: 1.4rem;
}

.business-hero-grid {
  align-items: center;
}

.business-eyebrow,
.section-kicker,
.capability-tag,
.use-case-label,
.business-board-kicker {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
}

.business-eyebrow,
.section-kicker,
.business-board-kicker {
  color: var(--bs-secondary);
}

.business-title,
.section-title {
  font-size: clamp(2rem, 3.5vw + 1rem, 4rem);
  line-height: calc(var(--lp-heading-lh) * 0.94);
  letter-spacing: -0.036em;
  font-weight: 800;
  color: var(--bs-headings-color);
  text-wrap: balance;
}

.business-title {
  max-width: 11ch;
  margin-bottom: 1rem;
}

.business-title span {
  display: block;
  color: var(--bs-secondary);
}

.business-lead,
.section-copy {
  font-size: clamp(1rem, 0.35vw + 0.96rem, 1.1rem);
  line-height: 1.68;
  color: var(--bs-secondary-color);
  max-width: 62ch;
  margin-bottom: 0;
  text-wrap: pretty;
}

.business-social-proof {
  margin: 1rem 0 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--bs-emphasis-color);
}

.business-sign-in {
  margin: 1rem 0 0;
  font-size: 0.95rem;
  color: var(--bs-secondary-color);
}

.business-sign-in a {
  color: var(--bs-primary);
  font-weight: 700;
  text-decoration: none;
}

.business-sign-in a:hover {
  text-decoration: underline;
}

.business-actions,
.business-proof,
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.business-actions,
.cta-actions {
  margin-top: 1.4rem;
}

.business-proof {
  margin-top: 1.3rem;
}

.business-proof-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
  background: rgba(255, 255, 255, 0.76);
  color: var(--bs-emphasis-color);
  font-size: 0.92rem;
  font-weight: 600;
  box-shadow: 0 14px 26px rgba(35, 20, 46, 0.05);
}

.business-board {
  display: grid;
  gap: 1rem;
}

.business-board-media,
.business-board-card,
.capability-card,
.use-case-card,
.workflow-card,
.gamification-card,
.feature-map-card,
.business-type-card,
.merchant-portal-card,
.cta-shell {
  border-radius: 1.7rem;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb), 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.82));
  box-shadow: 0 24px 56px rgba(35, 20, 46, 0.08);
}

.business-board-media {
  position: relative;
  overflow: hidden;
  min-height: 21rem;
}

.business-board-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.business-board-overlay {
  position: absolute;
  inset: auto 1rem 1rem 1rem;
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.1rem;
  border-radius: 1.2rem;
  background: rgba(15, 18, 28, 0.76);
  color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
}

.business-board-overlay strong {
  font-size: 1.25rem;
  line-height: 1.2;
  text-wrap: balance;
}

.business-board-stack {
  display: grid;
  gap: 1rem;
}

.business-board-card,
.capability-card,
.workflow-card,
.gamification-card,
.feature-map-card {
  padding: 1.35rem;
}

.business-board-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
}

.business-board-icon,
.capability-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
  font-size: 1.35rem;
  flex-shrink: 0;
}

.business-board-card h2,
.capability-card h3,
.use-case-card h3,
.workflow-card h3,
.gamification-card h3,
.feature-map-card h3,
.section-title {
  margin: 0;
  color: var(--bs-headings-color);
}

.business-board-card h2,
.capability-card h3,
.use-case-card h3,
.workflow-card h3,
.gamification-card h3,
.feature-map-card h3 {
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.22;
  letter-spacing: -0.02em;
}

.business-board-card p,
.capability-card p,
.use-case-card p,
.workflow-card p,
.gamification-card p,
.feature-map-card p {
  margin: 0.5rem 0 0;
  color: var(--bs-secondary-color);
  line-height: 1.68;
  text-wrap: pretty;
}

.business-surface,
.workflow-surface,
.feature-map-surface,
.business-type-surface,
.merchant-portal-surface,
.business-testimonial-surface {
  background:
    radial-gradient(circle at top left, rgba(var(--bs-primary-rgb), 0.06), transparent 24%),
    linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.03), rgba(var(--bs-primary-rgb), 0.01));
}

.business-type-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.business-type-card,
.merchant-portal-card {
  padding: 1.35rem;
  display: grid;
  gap: 0.85rem;
}

.business-type-icon,
.merchant-portal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: rgba(var(--bs-secondary-rgb), 0.14);
  color: var(--bs-secondary);
  font-size: 1.35rem;
}

.business-type-card h3,
.merchant-portal-card h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.22;
  letter-spacing: -0.02em;
  color: var(--bs-headings-color);
}

.business-type-card p,
.merchant-portal-card p {
  margin: 0;
  color: var(--bs-secondary-color);
  line-height: 1.68;
}

.merchant-portal-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.business-testimonial {
  margin: 0;
  padding: clamp(1.35rem, 2vw, 2rem);
  border-radius: 1.7rem;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb), 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.82));
  box-shadow: 0 24px 56px rgba(35, 20, 46, 0.08);
}

.business-testimonial p {
  margin: 0;
  font-size: clamp(1.1rem, 0.5vw + 1rem, 1.35rem);
  line-height: 1.6;
  color: var(--bs-headings-color);
  font-weight: 600;
  text-wrap: balance;
}

.business-testimonial footer {
  display: grid;
  gap: 0.2rem;
  margin-top: 1rem;
  color: var(--bs-secondary-color);
}

.business-testimonial footer strong {
  color: var(--bs-emphasis-color);
}

.faq-list {
  display: grid;
  gap: 0.85rem;
}

.faq-item {
  border-radius: 1.2rem;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
  background: rgba(255, 255, 255, 0.82);
  padding: 0.2rem 1rem;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 700;
  color: var(--bs-headings-color);
  padding: 0.85rem 0;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item p {
  margin: 0 0 1rem;
  color: var(--bs-secondary-color);
  line-height: 1.68;
}

.section-heading {
  margin-bottom: 1.75rem;
}

.section-title {
  font-size: clamp(1.75rem, 2.2vw + 1rem, 3rem);
  margin-bottom: 0.9rem;
  max-width: 18ch;
}

.capability-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.capability-card {
  display: grid;
  gap: 0.85rem;
}

.capability-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.capability-tag,
.use-case-label {
  color: var(--bs-primary);
}

.use-case-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.use-case-card {
  overflow: hidden;
}

.use-case-media {
  height: 13rem;
}

.use-case-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.use-case-body {
  display: grid;
  gap: 0.85rem;
  padding: 1.35rem;
}

.use-case-list {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--bs-secondary-color);
  line-height: 1.68;
}

.workflow-shell {
  display: grid;
  gap: 1.5rem;
}

.workflow-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gamification-grid,
.feature-map-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.workflow-card {
  position: relative;
  overflow: hidden;
}

.workflow-card::before {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 0 0 1.3rem 0;
  background: rgba(var(--bs-secondary-rgb), 0.14);
  opacity: 0.9;
}

.workflow-index {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--bs-primary);
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.gamification-card {
  display: grid;
  gap: 0.85rem;
}

.gamification-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.gamification-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: rgba(var(--bs-secondary-rgb), 0.14);
  color: var(--bs-secondary);
  font-size: 1.35rem;
}

.gamification-tag {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--bs-primary);
}

.feature-map-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.feature-map-card {
  min-height: 100%;
}

.business-cta {
  padding-bottom: clamp(3.5rem, 7vw, 6rem);
}

.cta-shell {
  display: grid;
  gap: 1.5rem;
  padding: clamp(1.35rem, 2vw, 1.7rem);
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb), 0.16), transparent 28%),
    linear-gradient(135deg, rgba(31, 21, 45, 0.98), rgba(70, 41, 104, 0.94));
}

.cta-shell .section-kicker,
.cta-shell .section-title,
.cta-shell .section-copy {
  color: rgba(255, 255, 255, 0.95);
}

.cta-shell .section-copy {
  color: rgba(255, 255, 255, 0.72);
}

@media (min-width: 992px) {
  .business-hero-grid {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
  }

  .workflow-shell,
  .cta-shell {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    align-items: start;
  }
}

@media (max-width: 991.98px) {
  .capability-grid,
  .use-case-grid,
  .workflow-grid,
  .gamification-grid,
  .feature-map-grid,
  .business-type-grid,
  .merchant-portal-grid {
    grid-template-columns: 1fr;
  }

  .business-title,
  .section-title {
    max-width: none;
  }
}

@media (max-width: 767.98px) {
  .business-board-card {
    grid-template-columns: 1fr;
  }
}
</style>
