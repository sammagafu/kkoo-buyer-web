<template>
  <MarketingLayout>
    <div class="context-nav">
      <div class="context-nav-left">
        <RouterLink :to="{ name: 'buyer.ride' }" class="context-nav-link">{{ t('courier.context.requestRide') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.checkout' }" class="context-nav-link">{{ t('courier.context.checkout') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.marketplace' }" class="context-nav-link">{{ t('courier.context.marketplace') }}</RouterLink>
      </div>
      <div class="context-nav-right">
        <RouterLink :to="{ name: 'pages.courier' }" class="context-nav-pill">{{ t('courier.context.driverApp') }}</RouterLink>
      </div>
    </div>
    <section class="lp-section courier-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="courier-hero-grid">
          <div class="courier-copy">
            <p class="courier-eyebrow">{{ t('courier.hero.eyebrow') }}</p>
            <h1 class="courier-title">
              {{ t('courier.hero.title1') }}
              <span>{{ t('courier.hero.title2') }}</span>
            </h1>
            <p class="courier-lead">
              {{ t('courier.hero.lead') }}
            </p>
            <div class="courier-actions">
              <b-button
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
                :to="{ name: 'buyer.ride' }"
              >
                <span class="lp-btn-pill__label">{{ t('courier.hero.ctaWeb') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <b-button
                variant="link"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                :to="{ name: 'auth.sign-in' }"
              >
                <span class="lp-btn-pill__label">{{ t('courier.hero.ctaRegister') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:chat-round-dots-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
            </div>
            <div class="courier-proof">
              <span v-for="proof in proofPoints" :key="proof" class="courier-proof-chip">{{ proof }}</span>
            </div>
          </div>

          <div class="courier-visual">
            <article class="hero-visual-card">
              <img :src="courierPlaceholder" :alt="t('courier.hero.imageAlt')" class="hero-visual-image" />
              <div class="hero-visual-overlay">
                <div class="overlay-strip">
                  <span>{{ t('courier.hero.overlay.shiftRhythmLabel') }}</span>
                  <strong>{{ t('courier.hero.overlay.shiftRhythmValue') }}</strong>
                </div>
                <div class="overlay-mini-grid">
                  <div class="overlay-mini-card">
                    <span>{{ t('courier.hero.overlay.runsLabel') }}</span>
                    <strong>{{ t('courier.hero.overlay.runsValue') }}</strong>
                  </div>
                  <div class="overlay-mini-card">
                    <span>{{ t('courier.hero.overlay.controlLabel') }}</span>
                    <strong>{{ t('courier.hero.overlay.controlValue') }}</strong>
                  </div>
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
          <p class="section-kicker">{{ t('courier.sections.whyJoin.kicker') }}</p>
          <h2 class="section-title">{{ t('courier.sections.whyJoin.title') }}</h2>
          <p class="section-copy">{{ t('courier.sections.whyJoin.copy') }}</p>
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

    <section class="lp-section earnings-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('courier.sections.earningsBoosters.kicker') }}</p>
          <h2 class="section-title">{{ t('courier.sections.earningsBoosters.title') }}</h2>
        </div>

        <div class="booster-grid">
          <article v-for="booster in boosters" :key="booster.title" class="booster-card">
            <h3>{{ booster.title }}</h3>
            <p>{{ booster.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="requirements-grid">
          <article class="requirements-card">
            <p class="section-kicker">{{ t('courier.sections.requirements.kicker') }}</p>
            <h2 class="section-title">{{ t('courier.sections.requirements.title') }}</h2>
            <ul class="check-list">
              <li>{{ t('courier.sections.requirements.list.1') }}</li>
              <li>{{ t('courier.sections.requirements.list.2') }}</li>
              <li>{{ t('courier.sections.requirements.list.3') }}</li>
              <li>{{ t('courier.sections.requirements.list.4') }}</li>
            </ul>
          </article>

          <article class="requirements-card requirements-card--accent">
            <p class="section-kicker">{{ t('courier.sections.howItWorks.kicker') }}</p>
            <div class="steps-stack">
              <div v-for="(step, index) in steps" :key="step.title" class="step-row">
                <span class="step-index">0{{ index + 1 }}</span>
                <div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.copy }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('courier.sections.faq.kicker') }}</p>
          <h2 class="section-title">{{ t('courier.sections.faq.title') }}</h2>
        </div>

        <div class="faq-list">
          <details v-for="faq in faqs" :key="faq.question" class="faq-item">
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </b-container>
    </section>

    <section class="lp-section courier-cta">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="cta-shell">
          <div>
            <p class="section-kicker">{{ t('courier.sections.cta.kicker') }}</p>
            <h2 class="section-title">{{ t('courier.sections.cta.title') }}</h2>
            <p class="section-copy">{{ t('courier.sections.cta.copy') }}</p>
          </div>
          <div class="cta-action-panel">
            <div class="courier-actions courier-actions--cta">
              <b-button
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm border-0 p-0 text-white d-inline-flex align-items-center"
                :to="{ name: 'auth.sign-in' }"
                :aria-label="t('courier.sections.cta.joinAria')"
              >
                <span class="lp-btn-pill__label">{{ t('courier.sections.cta.join') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
              <a
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--sm text-decoration-none d-inline-flex align-items-center"
                href="mailto:info@kkooapp.co.tz?subject=K%27KOO%20Courier%20Program"
                :aria-label="t('courier.sections.cta.talkAria')"
              >
                <span class="lp-btn-pill__label">{{ t('courier.sections.cta.talk') }}</span>
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
import { RouterLink } from 'vue-router'

import MarketingLayout from './MarketingLayout.vue'
import courierPlaceholder from '@/assets/images/landing/placeholders/courier-hero-placeholder.svg'

const { t } = useI18n()

const proofPoints = computed(() => [
  t('courier.proof.1'),
  t('courier.proof.2'),
  t('courier.proof.3'),
])

const benefits = computed(() => [
  {
    icon: 'solar:calendar-linear',
    title: t('courier.benefits.1.title'),
    copy: t('courier.benefits.1.copy'),
  },
  {
    icon: 'solar:wallet-linear',
    title: t('courier.benefits.2.title'),
    copy: t('courier.benefits.2.copy'),
  },
  {
    icon: 'solar:map-arrow-square-linear',
    title: t('courier.benefits.3.title'),
    copy: t('courier.benefits.3.copy'),
  },
  {
    icon: 'solar:shield-user-linear',
    title: t('courier.benefits.4.title'),
    copy: t('courier.benefits.4.copy'),
  },
])

const boosters = computed(() => [
  {
    title: t('courier.boosters.1.title'),
    copy: t('courier.boosters.1.copy'),
  },
  {
    title: t('courier.boosters.2.title'),
    copy: t('courier.boosters.2.copy'),
  },
  {
    title: t('courier.boosters.3.title'),
    copy: t('courier.boosters.3.copy'),
  },
])

const steps = computed(() => [
  { title: t('courier.steps.1.title'), copy: t('courier.steps.1.copy') },
  { title: t('courier.steps.2.title'), copy: t('courier.steps.2.copy') },
  { title: t('courier.steps.3.title'), copy: t('courier.steps.3.copy') },
  { title: t('courier.steps.4.title'), copy: t('courier.steps.4.copy') },
])

const faqs = computed(() => [
  { question: t('courier.faq.1.q'), answer: t('courier.faq.1.a') },
  { question: t('courier.faq.2.q'), answer: t('courier.faq.2.a') },
  { question: t('courier.faq.3.q'), answer: t('courier.faq.3.a') },
  { question: t('courier.faq.4.q'), answer: t('courier.faq.4.a') },
])
</script>

<style scoped>
.courier-hero-grid,
.requirements-grid,
.cta-shell {
  display: grid;
  gap: 1.5rem;
}

.courier-hero {
  background:
    radial-gradient(circle at top left, rgba(247, 168, 41, 0.12), transparent 30%),
    radial-gradient(circle at right center, rgba(92, 48, 143, 0.14), transparent 40%);
}

.courier-hero-grid {
  align-items: center;
}

.courier-eyebrow,
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-primary);
  margin-bottom: 0.85rem;
}

.courier-title,
.section-title {
  font-size: clamp(2rem, 4vw, 4.1rem);
  line-height: calc(var(--lp-heading-lh) * 0.96);
  font-weight: 800;
  color: var(--bs-heading-color, var(--bs-body-color));
  margin-bottom: calc(var(--lp-rhythm-phi) * 0.88);
  max-width: 12ch;
  letter-spacing: -0.028em;
  text-wrap: balance;
}

.courier-title span {
  display: block;
  color: var(--bs-secondary);
}

.courier-lead,
.section-copy {
  font-size: 1.04rem;
  line-height: 1.72;
  color: var(--bs-secondary-color);
  max-width: 62ch;
  margin-bottom: 0;
}

.courier-actions,
.courier-proof {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.9rem;
}

.courier-actions {
  margin-top: 1.4rem;
}

.courier-proof {
  margin-top: 1.2rem;
}

.courier-proof-chip {
  padding: 0.72rem 0.95rem;
  border-radius: 999px;
  background: rgba(var(--bs-primary-rgb), 0.08);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.18);
  font-size: 0.92rem;
  color: var(--bs-body-color);
}

.hero-visual-card,
.benefit-card,
.booster-card,
.requirements-card,
.cta-shell {
  border-radius: 1.55rem;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.14);
  overflow: hidden;
  background: linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.05), rgba(var(--bs-primary-rgb), 0.11));
}

.hero-visual-card {
  position: relative;
  min-height: 480px;
  box-shadow: 0 24px 60px rgba(12, 15, 30, 0.12);
}

.hero-visual-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-visual-overlay {
  position: absolute;
  inset: auto 1rem 1rem 1rem;
  display: grid;
  gap: 0.85rem;
}

.overlay-strip,
.overlay-mini-card {
  border-radius: 1.15rem;
  background: rgba(13, 18, 30, 0.8);
  color: #fff;
  backdrop-filter: blur(18px);
}

.overlay-strip {
  padding: 1rem 1.1rem;
}

.overlay-strip span,
.overlay-mini-card span {
  display: block;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  opacity: 0.75;
  margin-bottom: 0.3rem;
}

.overlay-strip strong,
.overlay-mini-card strong {
  display: block;
  line-height: 1.4;
}

.overlay-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.overlay-mini-card {
  padding: 0.9rem;
}

.section-heading {
  margin-bottom: 1.4rem;
}

.benefit-grid,
.booster-grid {
  display: grid;
  gap: 1rem;
}

.benefit-card,
.booster-card,
.requirements-card,
.cta-shell {
  padding: 1.4rem;
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
.booster-card h3,
.requirements-card h3,
.step-row h3 {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.benefit-card p,
.booster-card p,
.check-list li,
.step-row p,
.faq-item p {
  color: var(--bs-secondary-color);
  line-height: 1.65;
  margin-bottom: 0;
}

.earnings-surface {
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb), 0.08), transparent 26%),
    linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.03), rgba(var(--bs-primary-rgb), 0.08));
}

.check-list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.75rem;
}

.requirements-card--accent {
  background: linear-gradient(180deg, rgba(var(--bs-secondary-rgb), 0.08), rgba(var(--bs-primary-rgb), 0.12));
}

.steps-stack {
  display: grid;
  gap: 1rem;
}

.step-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem;
  align-items: start;
}

.step-index {
  display: inline-flex;
  padding: 0.28rem 0.58rem;
  border-radius: 999px;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--bs-primary);
  font-size: 0.82rem;
  font-weight: 700;
  margin-top: 0.15rem;
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
  margin-top: 0.8rem;
  line-height: 1.7;
}

.courier-cta .cta-shell {
  padding: clamp(1.35rem, 3vw, 2.25rem);
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb), 0.12), transparent 44%),
    linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.08), rgba(var(--bs-primary-rgb), 0.16));
  box-shadow: 0 24px 60px rgba(12, 15, 30, 0.1);
}

.cta-action-panel {
  align-self: flex-end;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 100%;
  padding-top: clamp(0.35rem, 1vw, 0.75rem);
  padding-right: clamp(1rem, 2.2vw, 1.3rem);
  padding-left: clamp(1rem, 2.2vw, 1.3rem);
  padding-bottom: 2.4rem;
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

.courier-actions--cta {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 0.5rem;
}

.courier-actions--cta .lp-btn-pill {
  width: 100%;
  justify-content: space-between;
  min-width: 0;
}

.courier-actions--cta .lp-btn-pill__label {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  padding-left: 0.65rem;
  padding-right: 0.65rem;
  line-height: 1.08;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .booster-grid,
  .requirements-grid,
  .cta-shell {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .benefit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 992px) {
  .courier-hero-grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
  }

  .benefit-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .booster-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .courier-title,
  .section-title {
    max-width: none;
  }

  .hero-visual-card {
    min-height: 320px;
  }

  .cta-action-panel {
    min-height: auto;
    align-items: flex-end;
  }

  .courier-actions--cta {
    gap: 0.75rem;
    align-items: flex-end;
  }

  .courier-actions--cta .lp-btn-pill__label {
    font-size: 0.84rem;
    padding-left: 0.55rem;
    padding-right: 0.55rem;
  }

  .overlay-mini-grid {
    grid-template-columns: 1fr;
  }
}
</style>
