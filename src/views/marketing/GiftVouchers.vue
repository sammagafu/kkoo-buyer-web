<template>
  <MarketingLayout>
    <!-- Hero -->
    <section class="lp-section vch-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="vch-hero-grid">
          <div class="vch-copy">
            <p class="vch-eyebrow">{{ t('landing.vouchersSectionLabel') }}</p>
            <h1 class="vch-title">
              {{ t('vouchers.heroTitle') }}
              <span>{{ t('vouchers.heroAccent') }}</span>
            </h1>
            <p class="vch-lead">{{ t('vouchers.heroDesc') }}</p>
            <div class="vch-actions">
              <b-button
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
                :to="{ name: 'auth.sign-up' }"
              >
                <span class="lp-btn-pill__label">
                  <Icon icon="solar:gift-bold" class="lp-btn-pill__lead-icon" aria-hidden="true" />
                  {{ t('vouchers.heroCtaPrimary') }}
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="link"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                href="#how-it-works"
              >
                <span class="lp-btn-pill__label">{{ t('vouchers.heroCtaSecondary') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
            </div>
          </div>

          <div class="vch-visual">
            <div class="vch-visual-stack">
              <img :src="voucherPlaceholder" :alt="t('vouchers.heroTitle')" class="vch-hero-image" />
              <div class="voucher-card-mockup">
                <div class="vcm-top">
                  <div class="vcm-brand">
                    <Icon icon="solar:gift-bold" style="font-size:1.5rem; color:#F7A829;" />
                    <span>{{ t('vouchers.mockup.brand') }}</span>
                  </div>
                  <div class="vcm-amount">25,000 <small>TZS</small></div>
                </div>
                <div class="vcm-divider">
                  <span class="vcm-circle vcm-circle--left"></span>
                  <div class="vcm-dashes"></div>
                  <span class="vcm-circle vcm-circle--right"></span>
                </div>
                <div class="vcm-bottom">
                  <p class="vcm-label">{{ t('vouchers.mockup.codeLabel') }}</p>
                  <p class="vcm-code">KKOO·GIFT·2026</p>
                  <div class="vcm-meta">
                    <span>{{ t('vouchers.mockup.redeemEverywhere') }}</span>
                    <span>{{ t('vouchers.mockup.pointsAndPromos') }}</span>
                  </div>
                </div>
                <Icon icon="solar:star-bold" class="vcm-star vcm-star--1" aria-hidden="true" />
                <Icon icon="solar:star-bold" class="vcm-star vcm-star--2" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </b-container>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="lp-section vch-steps-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('vouchers.howLabel') }}</p>
          <h2 class="section-title">{{ t('vouchers.howTitle') }}</h2>
        </div>
        <div class="vch-steps-grid">
          <article v-for="(step, i) in steps" :key="i" class="vch-step-card">
            <div class="vch-step-icon-wrap">
              <Icon :icon="step.icon" class="vch-step-icon" aria-hidden="true" />
            </div>
            <div class="vch-step-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3>{{ t(step.titleKey) }}</h3>
            <p>{{ t(step.descKey) }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <!-- Use cases -->
    <section class="lp-section vch-usecases-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('vouchers.useCasesLabel') }}</p>
          <h2 class="section-title">{{ t('vouchers.useCasesTitle') }}</h2>
        </div>
        <div class="vch-use-grid">
          <article v-for="(uc, i) in useCases" :key="i" class="vch-use-card">
            <div class="vch-use-icon">
              <Icon :icon="uc.icon" aria-hidden="true" />
            </div>
            <h3>{{ t(uc.titleKey) }}</h3>
            <p>{{ t(uc.descKey) }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <!-- FAQ -->
    <section class="lp-section vch-faq-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('vouchers.faqLabel') }}</p>
          <h2 class="section-title">{{ t('vouchers.faqTitle') }}</h2>
        </div>
        <div class="faq-list">
          <details v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <summary>{{ t(faq.qKey) }}</summary>
            <p>{{ t(faq.aKey) }}</p>
          </details>
        </div>
      </b-container>
    </section>

    <!-- CTA -->
    <section class="lp-section vch-cta-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="vch-cta-card">
          <div class="vch-cta-bg"></div>
          <div class="vch-cta-content">
            <Icon icon="solar:gift-bold" style="font-size:3rem; color:#F7A829; margin-bottom:1rem;" aria-hidden="true" />
            <h2>{{ t('vouchers.ctaTitle') }}</h2>
            <p>{{ t('vouchers.ctaDesc') }}</p>
            <b-button
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
              :to="{ name: 'auth.sign-up' }"
            >
              <span class="lp-btn-pill__label">
                <Icon icon="solar:gift-bold" class="lp-btn-pill__lead-icon" aria-hidden="true" />
                {{ t('landing.vouchersCta') }}
              </span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </b-button>
          </div>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import MarketingLayout from './MarketingLayout.vue'
import voucherPlaceholder from '@/assets/images/landing/placeholders/gift-voucher-placeholder.svg'

const { t } = useI18n()

const steps = [
  { icon: 'solar:gift-bold', titleKey: 'landing.voucherCard1Title', descKey: 'landing.voucherCard1Desc' },
  { icon: 'solar:users-group-rounded-bold', titleKey: 'landing.voucherCard2Title', descKey: 'landing.voucherCard2Desc' },
  { icon: 'solar:cart-large-2-bold', titleKey: 'landing.voucherCard3Title', descKey: 'landing.voucherCard3Desc' },
]

const useCases = [
  { icon: 'solar:star-bold',           titleKey: 'vouchers.useCase1Title', descKey: 'vouchers.useCase1Desc' },
  { icon: 'solar:case-bold',           titleKey: 'vouchers.useCase2Title', descKey: 'vouchers.useCase2Desc' },
  { icon: 'solar:people-nearby-bold',  titleKey: 'vouchers.useCase3Title', descKey: 'vouchers.useCase3Desc' },
  { icon: 'solar:shield-check-bold',   titleKey: 'vouchers.useCase4Title', descKey: 'vouchers.useCase4Desc' },
]

const faqs = [
  { qKey: 'vouchers.faq1Q', aKey: 'vouchers.faq1A' },
  { qKey: 'vouchers.faq2Q', aKey: 'vouchers.faq2A' },
  { qKey: 'vouchers.faq3Q', aKey: 'vouchers.faq3A' },
  { qKey: 'vouchers.faq4Q', aKey: 'vouchers.faq4A' },
]
</script>

<style scoped>
/* ---- shared section typography ---- */
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-primary);
  margin-bottom: 0.85rem;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  font-weight: 800;
  line-height: 1.12;
  color: var(--bs-heading-color, var(--bs-body-color));
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.section-heading {
  margin-bottom: 2.5rem;
}

/* ---- hero ---- */
.vch-hero {
  padding-top: clamp(3rem, 8vw, 6rem);
  padding-bottom: clamp(3rem, 8vw, 5rem);
}

.vch-hero-grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 992px) {
  .vch-hero-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.vch-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-secondary);
  margin-bottom: 1rem;
}

.vch-title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: 1.2rem;
  color: var(--bs-heading-color, var(--bs-body-color));
  text-wrap: balance;
}

.vch-title span {
  display: block;
  background: linear-gradient(90deg, #5C308F, #F7A829);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.vch-lead {
  font-size: 1.05rem;
  line-height: 1.72;
  color: var(--bs-secondary-color);
  max-width: 52ch;
  margin-bottom: 0;
}

.vch-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.6rem;
}

/* ---- voucher card mockup ---- */
.vch-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.vch-visual-stack {
  position: relative;
  width: min(100%, 430px);
  padding-top: 1.25rem;
}

.vch-hero-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 2rem;
  box-shadow: 0 28px 72px rgba(92, 48, 143, 0.2);
}

.voucher-card-mockup {
  position: relative;
  width: 340px;
  max-width: 100%;
  background: linear-gradient(135deg, #3B1A5A 0%, #5C308F 60%, #7B46B3 100%);
  border-radius: 1.5rem;
  box-shadow: 0 32px 80px rgba(92, 48, 143, 0.4);
  overflow: hidden;
  padding: 0;
  margin-top: -6rem;
  margin-left: auto;
}

.vcm-top {
  padding: 1.75rem 1.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.vcm-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 1rem;
}

.vcm-amount {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.vcm-amount small {
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0.75;
}

.vcm-divider {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0;
  height: 2px;
}

.vcm-dashes {
  flex: 1;
  border-top: 2px dashed rgba(255, 255, 255, 0.25);
  margin: 0 1rem;
}

.vcm-circle {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bs-body-bg, #fff);
  flex-shrink: 0;
}

.vcm-circle--left { margin-left: -12px; }
.vcm-circle--right { margin-right: -12px; }

.vcm-bottom {
  padding: 1.25rem 1.75rem 1.75rem;
}

.vcm-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.4rem;
}

.vcm-code {
  font-size: 1.4rem;
  font-weight: 800;
  color: #F7A829;
  letter-spacing: 0.12em;
  margin-bottom: 1rem;
  font-family: monospace;
}

.vcm-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.vcm-meta span {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
}

.vcm-star {
  position: absolute;
  color: rgba(247, 168, 41, 0.35);
  pointer-events: none;
}

.vcm-star--1 { top: 1rem; right: 5rem; font-size: 2.5rem; }
.vcm-star--2 { bottom: 2rem; right: 1.5rem; font-size: 1.5rem; }

/* ---- steps section ---- */
.vch-steps-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
  background: linear-gradient(180deg, rgba(92, 48, 143, 0.04) 0%, transparent 100%);
}

.vch-steps-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .vch-steps-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.vch-step-card {
  position: relative;
  padding: 2rem 1.5rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background: linear-gradient(180deg, rgba(92, 48, 143, 0.04), rgba(92, 48, 143, 0.08));
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vch-step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(92, 48, 143, 0.13);
}

.vch-step-icon-wrap {
  width: 3rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: linear-gradient(135deg, #5C308F, #7B46B3);
  color: white;
  font-size: 1.35rem;
  margin-bottom: 1rem;
}

.vch-step-num {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgba(92, 48, 143, 0.3);
  letter-spacing: 0.04em;
}

.vch-step-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.vch-step-card p {
  color: var(--bs-secondary-color);
  font-size: 0.92rem;
  line-height: 1.65;
  margin: 0;
}

/* ---- use cases ---- */
.vch-usecases-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.vch-use-grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 576px) { .vch-use-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 992px) { .vch-use-grid { grid-template-columns: repeat(4, 1fr); } }

.vch-use-card {
  padding: 1.75rem 1.5rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background: var(--bs-body-bg);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vch-use-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(92, 48, 143, 0.12);
}

.vch-use-icon {
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  background: rgba(247, 168, 41, 0.14);
  color: #B8750A;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

html[data-bs-theme='dark'] .vch-use-icon {
  background: rgba(247, 168, 41, 0.18);
  color: #F7A829;
}

.vch-use-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.vch-use-card p {
  color: var(--bs-secondary-color);
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
}

/* ---- FAQ ---- */
.vch-faq-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
  background: linear-gradient(180deg, rgba(92, 48, 143, 0.03) 0%, transparent 100%);
}

.faq-list {
  display: grid;
  gap: 0.85rem;
  max-width: 760px;
}

.faq-item {
  border-radius: 1.2rem;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
}

html[data-bs-theme='dark'] .faq-item {
  background: rgba(30, 24, 48, 0.7);
}

.faq-item summary {
  cursor: pointer;
  list-style: none;
  font-weight: 700;
  font-size: 0.98rem;
}

.faq-item summary::-webkit-details-marker { display: none; }

.faq-item p {
  margin-top: 0.75rem;
  color: var(--bs-secondary-color);
  line-height: 1.7;
  margin-bottom: 0;
}

/* ---- CTA ---- */
.vch-cta-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.vch-cta-card {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  text-align: center;
  padding: clamp(3rem, 8vw, 5rem) clamp(1.5rem, 6vw, 4rem);
}

.vch-cta-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3B1A5A 0%, #5C308F 55%, #F7A829 100%);
}

.vch-cta-content {
  position: relative;
  z-index: 1;
  color: white;
}

.vch-cta-content h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: white;
}

.vch-cta-content p {
  font-size: 1.05rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 48ch;
  margin-inline: auto;
  line-height: 1.65;
}
</style>
