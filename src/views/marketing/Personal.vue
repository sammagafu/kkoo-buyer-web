<template>
  <MarketingLayout>
    <section class="lp-section lp-hero-section personal-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="lp-hero-grid">
          <div>
            <h1 class="lp-page-title">
              {{ t('personal.heroTitle') }}
              <span class="lp-accent">{{ t('personal.heroTitleAccent') }}</span>
            </h1>
            <p class="lp-page-desc">
              {{ t('personal.heroDesc') }}
            </p>
            <div class="lp-page-actions">
              <b-button
                variant="primary"
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
                @click="navigateToService('market')"
              >
                <span class="lp-btn-pill__label">Open Marketplace</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="link"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                @click="navigateToService('eats')"
              >
                <span class="lp-btn-pill__label">Order Food & Groceries</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:cup-hot-bold" class="lp-btn-pill__icon" />
                </span>
              </b-button>
            </div>
          </div>
          <div class="lp-hero-visual">
            <img :src="personalHeroPlaceholder" :alt="t('personal.heroTitle')" class="lp-hero-placeholder" />
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section personal-summary-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">How it works</p>
          <h2 class="section-title">One buyer flow across shopping, food, and delivery.</h2>
          <p class="section-copy">
            KKOO keeps discovery, checkout, protection, and delivery visibility in one place so everyday ordering feels
            simpler, faster, and more trustworthy.
          </p>
        </div>
        <div class="summary-grid">
          <article v-for="(step, index) in howItWorks" :key="step.title" class="summary-card">
            <span class="summary-index">0{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section checkout-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">What happens after checkout</p>
          <h2 class="section-title">A clearer path from payment to doorstep.</h2>
          <p class="section-copy">
            The experience should not stop at payment. Users need to confirm details, follow the order, and understand
            where the money and delivery stand without guesswork.
          </p>
        </div>
        <div class="checkout-grid">
          <article v-for="(step, index) in checkoutSteps" :key="step.title" class="checkout-card">
            <span class="summary-index">0{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useSubdomainNavigation } from '@/composables/useSubdomainNavigation'
import MarketingLayout from './MarketingLayout.vue'
import personalHeroPlaceholder from '@/assets/images/landing/placeholders/personal-hero-placeholder.svg'

const { t } = useI18n()
const { navigateToService } = useSubdomainNavigation()

const howItWorks = [
  {
    title: 'Browse what you need in one place',
    copy:
      'Shop products and order food from the same account, with discovery and search designed to keep the journey familiar.',
  },
  {
    title: 'Checkout with protection built in',
    copy:
      'Choose what you need, review delivery details, and pay through one buyer flow with clearer totals and less doubt.',
  },
  {
    title: 'Track progress without switching tools',
    copy:
      'Follow order progress, delivery movement, and account history without relying on scattered messages or manual updates.',
  },
]

const checkoutSteps = [
  {
    title: 'Review the cart properly',
    copy: 'Move from products or meals into a cart flow that keeps items, quantities, totals, and delivery context visible.',
  },
  {
    title: 'Confirm payment and destination',
    copy: 'Review the order, choose the right address, and pay through a checkout flow designed to feel trustworthy and easy to verify.',
  },
  {
    title: 'Track fulfilment live',
    copy: 'See the order move from confirmation to delivery without switching to chat or waiting on manual updates.',
  },
]
</script>

<style scoped>
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-secondary);
  margin-bottom: 0.85rem;
}

.section-title {
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.9rem;
  color: var(--bs-headings-color);
  text-wrap: balance;
}

.section-copy {
  font-size: 1rem;
  line-height: 1.72;
  color: var(--bs-secondary-color);
  max-width: 64ch;
  margin-bottom: 0;
}

.section-heading {
  margin-bottom: 2rem;
}

.lp-page-title {
  font-size: clamp(1.75rem, 3vw + 1rem, 2.5rem);
  font-weight: 700;
  line-height: calc(var(--lp-heading-lh) * 0.98);
  margin-bottom: calc(var(--lp-rhythm-phi) * 0.82);
  color: var(--bs-headings-color);
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.lp-accent {
  color: var(--bs-secondary);
  display: block;
}

@media (min-width: 992px) {
  .lp-accent {
    display: inline;
  }
}

.lp-page-desc {
  font-size: clamp(1rem, 0.55vw + 0.9rem, 1.125rem);
  line-height: var(--lp-prose-lh);
  color: var(--bs-secondary-color);
  max-width: var(--lp-prose-max);
  margin-bottom: 0;
}

.personal-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(247, 168, 41, 0.2), transparent 32%),
    radial-gradient(circle at 85% 20%, rgba(92, 48, 143, 0.18), transparent 30%);
}

.lp-hero-grid {
  display: grid;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 992px) {
  .lp-hero-grid {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
  }
}

.lp-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.35rem;
}

.lp-hero-visual {
  display: flex;
  justify-content: center;
}

.lp-hero-placeholder {
  width: min(100%, 480px);
  height: auto;
  display: block;
  border-radius: 2rem;
  box-shadow: 0 28px 72px rgba(92, 48, 143, 0.18);
  background:
    radial-gradient(circle at top right, rgba(247, 168, 41, 0.16), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82));
}

.personal-summary-surface {
  background:
    radial-gradient(circle at right top, rgba(92, 48, 143, 0.08), transparent 28%),
    linear-gradient(180deg, rgba(92, 48, 143, 0.03), rgba(92, 48, 143, 0.01));
}

.checkout-surface {
  background:
    radial-gradient(circle at left top, rgba(247, 168, 41, 0.08), transparent 28%),
    linear-gradient(180deg, rgba(92, 48, 143, 0.03), rgba(92, 48, 143, 0.01));
}

.checkout-grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .checkout-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.checkout-card {
  padding: 1.6rem;
  border-radius: 1.4rem;
}

.checkout-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.55rem;
}

.checkout-card p {
  margin: 0;
  color: var(--bs-secondary-color);
  line-height: 1.68;
  font-size: 0.94rem;
}

.summary-grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.summary-card {
  padding: 1.6rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: linear-gradient(180deg, rgba(92, 48, 143, 0.04), rgba(92, 48, 143, 0.02));
}

.summary-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.12);
  color: #5c308f;
  font-weight: 800;
  font-size: 0.82rem;
  margin-bottom: 1rem;
}

.summary-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.55rem;
}

.summary-card p {
  margin: 0;
  color: var(--bs-secondary-color);
  line-height: 1.68;
  font-size: 0.94rem;
}
</style>
