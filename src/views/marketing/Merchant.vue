<template>
  <MarketingLayout>
    <section class="lp-section program-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="program-hero-grid">
          <div class="program-copy">
            <p class="program-eyebrow">{{ t('merchant.heroEyebrow') }}</p>
            <h1 class="program-title">
              {{ t('merchant.heroTitle') }}
              <span>{{ t('merchant.heroTitleAccent') }}</span>
            </h1>
            <p class="program-lead">{{ t('merchant.heroDesc') }}</p>
            <div class="program-actions">
              <b-button
                class="lp-btn-pill lp-btn-pill--accent lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
                :to="{ name: 'auth.seller-register' }"
              >
                <span class="lp-btn-pill__label">{{ t('merchant.cta.becomeMerchant') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="link"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                :to="{ name: 'pages.community' }"
              >
                <span class="lp-btn-pill__label">{{ t('merchant.cta.seeRequests') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:chat-round-dots-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="outline-primary"
                class="lp-btn-pill lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                :to="buyerRoutes.marketplace"
              >
                <span class="lp-btn-pill__label">{{ t('merchant.cta.previewWebStore') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:shop-2-bold" class="lp-btn-pill__icon" />
                </span>
              </b-button>
            </div>
            <div class="program-proof">
              <span v-for="proof in proofPoints" :key="proof" class="program-proof-chip">{{ proof }}</span>
            </div>
          </div>

          <div class="program-visual">
            <article class="visual-stack">
              <div class="visual-card visual-card--primary">
                <img :src="merchantPlaceholder" :alt="t('merchant.visual.primaryImageAlt')" class="visual-image" />
                <div class="visual-badge">
                  <span class="visual-badge-label">{{ t('merchant.visual.primaryBadgeLabel') }}</span>
                  <strong>{{ t('merchant.visual.primaryBadgeTitle') }}</strong>
                </div>
              </div>

              <div class="visual-card visual-card--secondary">
                <img :src="shopImage" :alt="t('merchant.visual.retailImageAlt')" class="visual-image" />
                <div class="visual-mini">
                  <span>{{ t('merchant.visual.retailLabel') }}</span>
                  <strong>{{ t('merchant.visual.retailTitle') }}</strong>
                </div>
              </div>

              <div class="visual-card visual-card--secondary">
                <img :src="groceriesImage" :alt="t('merchant.visual.groceriesImageAlt')" class="visual-image" />
                <div class="visual-mini">
                  <span>{{ t('merchant.visual.groceriesLabel') }}</span>
                  <strong>{{ t('merchant.visual.groceriesTitle') }}</strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('merchant.sections.why.kicker') }}</p>
          <h2 class="section-title">{{ t('merchant.sections.why.title') }}</h2>
          <p class="section-copy">{{ t('merchant.sections.why.copy') }}</p>
        </div>

        <div class="benefit-grid">
          <article v-for="benefit in benefits" :key="benefit.title" class="benefit-card">
            <div class="benefit-icon">
              <Icon :icon="benefit.icon" />
            </div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section program-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="insight-grid">
          <article class="quote-card">
            <p class="quote-mark">“</p>
            <p class="quote-body">{{ t('merchant.quote.body') }}</p>
            <p class="quote-meta">{{ t('merchant.quote.meta') }}</p>
          </article>

          <article class="insight-card">
            <p class="section-kicker">{{ t('merchant.sections.insight.kicker') }}</p>
            <h3>{{ t('merchant.sections.insight.title') }}</h3>
            <ul class="check-list">
              <li>{{ t('merchant.sections.insight.points.1') }}</li>
              <li>{{ t('merchant.sections.insight.points.2') }}</li>
              <li>{{ t('merchant.sections.insight.points.3') }}</li>
              <li>{{ t('merchant.sections.insight.points.4') }}</li>
            </ul>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('merchant.sections.verticals.kicker') }}</p>
          <h2 class="section-title">{{ t('merchant.sections.verticals.title') }}</h2>
        </div>

        <div class="vertical-grid">
          <article v-for="vertical in verticals" :key="vertical.title" class="vertical-card">
            <h3>{{ vertical.title }}</h3>
            <p>{{ vertical.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('merchant.sections.steps.kicker') }}</p>
          <h2 class="section-title">{{ t('merchant.sections.steps.title') }}</h2>
        </div>

        <div class="steps-grid">
          <article v-for="(step, index) in steps" :key="step.title" class="step-card">
            <span class="step-index">0{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('merchant.sections.faq.kicker') }}</p>
          <h2 class="section-title">{{ t('merchant.sections.faq.title') }}</h2>
        </div>

        <div class="faq-list">
          <details v-for="faq in faqs" :key="faq.question" class="faq-item">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </b-container>
    </section>

    <section class="lp-section program-cta">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="cta-shell">
          <div>
            <p class="section-kicker">{{ t('merchant.sections.cta.kicker') }}</p>
            <h2 class="section-title">{{ t('merchant.sections.cta.title') }}</h2>
            <p class="section-copy">{{ t('merchant.sections.cta.copy') }}</p>
          </div>
          <div class="cta-action-panel">
            <div class="program-actions program-actions--cta">
              <b-button
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm border-0 p-0 text-white d-inline-flex align-items-center"
                :to="{ name: 'auth.seller-register' }"
                :aria-label="t('merchant.cta.ariaStartSetup')"
              >
                <span class="lp-btn-pill__label">{{ t('merchant.cta.startSetup') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <a
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--sm text-decoration-none d-inline-flex align-items-center"
                href="mailto:info@kkooapp.co.tz?subject=K%27KOO%20Merchant%20Partnership"
                :aria-label="t('merchant.cta.ariaPartnerships')"
              >
                <span class="lp-btn-pill__label">{{ t('merchant.cta.partnerships') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:letter-linear" class="lp-btn-pill__icon" />
                </span>
              </a>
            </div>
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

import MarketingLayout from './MarketingLayout.vue'
import { buyerRoutes } from '@/config/landing-links'
import foodImage from '@/assets/images/landing/services/food.jpg'
import groceriesImage from '@/assets/images/landing/services/groceries.jpg'
import shopImage from '@/assets/images/landing/services/shop.jpg'
import merchantPlaceholder from '@/assets/images/landing/placeholders/merchant-hero-placeholder.svg'

const { t } = useI18n()

const proofPoints = computed(() => [
  t('merchant.proof.1'),
  t('merchant.proof.2'),
  t('merchant.proof.3'),
])

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

const verticals = computed(() => [
  {
    title: t('merchant.verticals.1.title'),
    copy: t('merchant.verticals.1.copy'),
  },
  {
    title: t('merchant.verticals.2.title'),
    copy: t('merchant.verticals.2.copy'),
  },
  {
    title: t('merchant.verticals.3.title'),
    copy: t('merchant.verticals.3.copy'),
  },
])

const steps = computed(() => [
  {
    title: t('merchant.steps.1.title'),
    copy: t('merchant.steps.1.copy'),
  },
  {
    title: t('merchant.steps.2.title'),
    copy: t('merchant.steps.2.copy'),
  },
  {
    title: t('merchant.steps.3.title'),
    copy: t('merchant.steps.3.copy'),
  },
  {
    title: t('merchant.steps.4.title'),
    copy: t('merchant.steps.4.copy'),
  },
])

const faqs = computed(() => [
  {
    question: t('merchant.faqs.1.q'),
    answer: t('merchant.faqs.1.a'),
  },
  {
    question: t('merchant.faqs.2.q'),
    answer: t('merchant.faqs.2.a'),
  },
  {
    question: t('merchant.faqs.3.q'),
    answer: t('merchant.faqs.3.a'),
  },
  {
    question: t('merchant.faqs.4.q'),
    answer: t('merchant.faqs.4.a'),
  },
])
</script>

<style scoped>
.program-hero-grid,
.insight-grid,
.cta-shell {
  display: grid;
  gap: 1.5rem;
}

.program-hero {
  background:
    radial-gradient(circle at top right, rgba(247, 168, 41, 0.12), transparent 32%),
    radial-gradient(circle at left center, rgba(92, 48, 143, 0.12), transparent 42%);
}

.program-hero-grid {
  align-items: center;
}

.program-copy,
.program-visual,
.quote-card,
.insight-card,
.cta-shell {
  position: relative;
}

.program-eyebrow,
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-primary);
  margin-bottom: 0.85rem;
}

.program-title,
.section-title {
  font-size: clamp(2rem, 4vw, 4.25rem);
  line-height: calc(var(--lp-heading-lh) * 0.96);
  font-weight: 800;
  color: var(--bs-heading-color, var(--bs-body-color));
  margin-bottom: calc(var(--lp-rhythm-phi) * 0.88);
  max-width: 12ch;
  letter-spacing: -0.028em;
  text-wrap: balance;
}

.program-title span {
  color: var(--bs-secondary);
  display: block;
}

.program-lead,
.section-copy {
  font-size: 1.04rem;
  line-height: 1.72;
  color: var(--bs-secondary-color);
  max-width: 62ch;
  margin-bottom: 0;
}

.program-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.9rem;
  margin-top: 1.6rem;
}

.program-proof {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1.2rem;
}

.program-proof-chip {
  padding: 0.72rem 0.95rem;
  border-radius: 999px;
  background: rgba(var(--bs-primary-rgb), 0.08);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.18);
  font-size: 0.92rem;
  color: var(--bs-body-color);
}

.visual-stack {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1rem;
}

.visual-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.65rem;
  min-height: 220px;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.16);
  box-shadow: 0 24px 60px rgba(12, 15, 30, 0.12);
}

.visual-card--primary {
  grid-row: span 2;
  min-height: 460px;
}

.visual-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visual-badge,
.visual-mini {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  border-radius: 1.2rem;
  padding: 0.95rem 1rem;
  background: rgba(13, 18, 30, 0.78);
  backdrop-filter: blur(18px);
  color: #fff;
}

.visual-badge-label,
.visual-mini span {
  display: block;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.75;
  margin-bottom: 0.35rem;
}

.visual-badge strong,
.visual-mini strong {
  display: block;
  font-size: 1rem;
  line-height: 1.35;
}

.section-heading {
  margin-bottom: 1.4rem;
}

.benefit-grid,
.vertical-grid,
.steps-grid {
  display: grid;
  gap: 1rem;
}

.benefit-card,
.vertical-card,
.step-card,
.quote-card,
.insight-card,
.cta-shell {
  border-radius: 1.55rem;
  padding: 1.4rem;
  background: linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.05), rgba(var(--bs-primary-rgb), 0.11));
  border: 1px solid rgba(var(--bs-primary-rgb), 0.14);
}

.benefit-icon {
  width: 3rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--bs-primary);
  font-size: 1.35rem;
  margin-bottom: 1rem;
}

.benefit-card h3,
.vertical-card h3,
.step-card h3,
.insight-card h3 {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.benefit-card p,
.vertical-card p,
.step-card p,
.quote-meta,
.check-list li {
  color: var(--bs-secondary-color);
  line-height: 1.65;
  margin-bottom: 0;
}

.program-surface {
  background:
    radial-gradient(circle at top left, rgba(var(--bs-secondary-rgb), 0.08), transparent 28%),
    linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.03), rgba(var(--bs-primary-rgb), 0.08));
}

.quote-mark {
  font-size: 4rem;
  line-height: 1;
  margin-bottom: 0.35rem;
  color: rgba(var(--bs-primary-rgb), 0.35);
}

.quote-body {
  font-size: 1.16rem;
  line-height: 1.75;
  margin-bottom: 1rem;
}

.check-list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.75rem;
}

.step-index {
  display: inline-flex;
  padding: 0.28rem 0.58rem;
  border-radius: 999px;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--bs-primary);
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.faq-list {
  display: grid;
  gap: 0.85rem;
}

.faq-item {
  border-radius: 1.2rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.14);
  background: rgba(var(--bs-body-bg-rgb, 255, 255, 255), 0.7);
}

.faq-item summary {
  cursor: pointer;
  list-style: none;
  font-weight: 700;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item p {
  color: var(--bs-secondary-color);
  margin: 0.8rem 0 0;
  line-height: 1.7;
}

.program-cta .cta-shell {
  gap: 1rem;
  padding: clamp(1.35rem, 3vw, 2.25rem);
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb), 0.12), transparent 44%),
    linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.08), rgba(var(--bs-primary-rgb), 0.16));
  box-shadow: 0 24px 60px rgba(12, 15, 30, 0.1);
}

.cta-action-panel {
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding-top: clamp(1rem, 2.2vw, 1.3rem);
  padding-right: clamp(1rem, 2.2vw, 1.3rem);
  padding-left: clamp(1rem, 2.2vw, 1.3rem);
  padding-bottom: 1.8rem;
  border-radius: 1.4rem;
  background:
    linear-gradient(
      180deg,
      rgba(var(--lp-cream-rgb, 250, 246, 240), 0.94),
      rgba(var(--lp-beige-rgb, 240, 232, 223), 0.88)
    ),
    rgba(var(--bs-body-bg-rgb, 240, 232, 223), 0.86);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.14);
  box-shadow:
    inset 0 1px 0 rgba(var(--lp-cream-rgb, 250, 246, 240), 0.72),
    0 16px 34px rgba(var(--lp-ink-rgb, 42, 24, 54), 0.08);
  backdrop-filter: blur(18px);
}

.program-actions--cta {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 0;
}

.program-actions--cta .lp-btn-pill {
  width: 100%;
  justify-content: space-between;
  min-width: 0;
}

.program-actions--cta .lp-btn-pill__label {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  padding-left: 0.65rem;
  padding-right: 0.65rem;
  line-height: 1.08;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .benefit-grid,
  .vertical-grid,
  .steps-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .insight-grid,
  .cta-shell {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
}

@media (min-width: 992px) {
  .program-hero-grid {
    grid-template-columns: minmax(0, 1.12fr) minmax(340px, 0.88fr);
  }

  .benefit-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .steps-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .program-title,
  .section-title {
    max-width: none;
  }

  .cta-action-panel {
    min-height: auto;
  }

  .program-actions--cta {
    gap: 0.75rem;
  }

  .program-actions--cta .lp-btn-pill__label {
    font-size: 0.84rem;
    padding-left: 0.55rem;
    padding-right: 0.55rem;
  }

  .visual-stack {
    grid-template-columns: 1fr;
  }

  .visual-card--primary {
    min-height: 280px;
  }
}
</style>
