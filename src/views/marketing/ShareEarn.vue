<template>
  <MarketingLayout>
    <!-- Hero -->
    <section class="lp-section se-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="se-hero-grid">
          <div class="se-copy">
            <p class="se-eyebrow">{{ t('landing.navShareEarn') }}</p>
            <h1 class="se-title">
              {{ t('shareEarn.heroTitle') }}
              <span>{{ t('shareEarn.heroAccent') }}</span>
            </h1>
            <p class="se-lead">{{ t('shareEarn.heroDesc') }}</p>
            <div class="se-actions">
              <b-button
                class="lp-btn-pill lp-btn-pill--secondary lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
                :to="{ name: 'auth.sign-up' }"
              >
                <span class="lp-btn-pill__label">
                  <Icon icon="solar:users-group-rounded-bold" class="lp-btn-pill__lead-icon" aria-hidden="true" />
                  {{ t('shareEarn.heroCtaPrimary') }}
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
                <span class="lp-btn-pill__label">{{ t('shareEarn.heroCtaSecondary') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </b-button>
            </div>
          </div>

          <div class="se-visual">
            <div class="se-visual-stack">
              <img :src="shareEarnPlaceholder" :alt="t('shareEarn.heroTitle')" class="se-hero-image" />
              <div class="se-stats-card">
                <div class="se-stat-row">
                  <div class="se-stat">
                    <Icon icon="solar:users-group-rounded-bold" class="se-stat-icon" aria-hidden="true" />
                  <div>
                      <strong>TZS 126,000</strong>
                      <span>{{ t('shareEarn.stats.referralEarningsThisMonth') }}</span>
                    </div>
                  </div>
                  <div class="se-stat se-stat--accent">
                    <Icon icon="solar:star-bold" class="se-stat-icon" aria-hidden="true" />
                    <div>
                      <strong>3,480 pts</strong>
                      <span>{{ t('shareEarn.stats.pointsReadyToRedeem') }}</span>
                    </div>
                  </div>
                </div>
                <div class="se-progress-wrap">
                  <p class="se-progress-label">{{ t('shareEarn.stats.nextMilestone') }}</p>
                  <div class="se-progress-bar">
                    <div class="se-progress-fill" style="width: 62%;"></div>
                  </div>
                </div>
                <div class="se-chip-row">
                  <span class="se-chip">{{ t('shareEarn.stats.friendsJoined', { count: 12 }) }}</span>
                  <span class="se-chip se-chip--gold">{{ t('shareEarn.stats.ordersAttributed', { count: 18 }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-container>
    </section>

    <!-- Feature cards -->
    <section class="lp-section se-features-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('shareEarn.earningsLabel') }}</p>
          <h2 class="section-title">{{ t('shareEarn.earningsTitle') }}</h2>
          <p class="section-copy se-section-copy">
            {{ t('shareEarn.earningsCopy') }}
          </p>
        </div>
        <div class="se-feature-grid">
          <article v-for="(feat, i) in features" :key="i" class="se-feature-card" :class="feat.variant">
            <div class="se-feat-icon-wrap">
              <Icon :icon="feat.icon" class="se-feat-icon" aria-hidden="true" />
            </div>
            <h3>{{ t(feat.titleKey) }}</h3>
            <p>{{ t(feat.descKey) }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="lp-section se-how-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="se-how-grid">
        <div class="section-heading">
          <p class="section-kicker">{{ t('shareEarn.howLabel') }}</p>
          <h2 class="section-title">{{ t('shareEarn.howTitle') }}</h2>
          <p class="section-copy se-section-copy">
            {{ t('shareEarn.howCopy') }}
          </p>
        </div>
          <div class="se-steps">
            <div v-for="(step, i) in howSteps" :key="i" class="se-step">
              <div class="se-step-dot" :class="i % 2 === 0 ? 'se-step-dot--purple' : 'se-step-dot--gold'">
                <Icon :icon="step.icon" aria-hidden="true" />
              </div>
              <div class="se-step-body">
                <h4>{{ t(step.titleKey) }}</h4>
                <p>{{ t(step.descKey) }}</p>
              </div>
            </div>
          </div>
        </div>
      </b-container>
    </section>

    <!-- Earnings breakdown -->
    <section class="lp-section se-breakdown-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('shareEarn.earningsLabel') }}</p>
          <h2 class="section-title">{{ t('shareEarn.earningsTitle') }}</h2>
          <p class="section-copy se-section-copy">
            {{ t('shareEarn.breakdownCopy') }}
          </p>
        </div>
        <div class="se-breakdown-grid">
          <article v-for="(earn, i) in earnings" :key="i" class="se-earn-card">
            <Icon :icon="earn.icon" class="se-earn-icon" aria-hidden="true" />
            <h3>{{ t(earn.titleKey) }}</h3>
            <p>{{ t(earn.descKey) }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <!-- CTA -->
    <section class="lp-section se-cta-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="se-cta-shell">
          <div class="se-cta-text">
            <h2>{{ t('shareEarn.ctaTitle') }}</h2>
            <p>{{ t('shareEarn.ctaDesc') }}</p>
          </div>
          <div class="se-cta-actions">
            <b-button
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg border-0 p-0 text-white d-inline-flex align-items-center"
              :to="{ name: 'auth.sign-up' }"
            >
              <span class="lp-btn-pill__label">
                <Icon icon="solar:download-minimalistic-bold" class="lp-btn-pill__lead-icon" aria-hidden="true" />
                {{ t('landing.finalCtaDownloadShort') }}
              </span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </b-button>
            <b-button
              class="lp-btn-pill lp-btn-pill--secondary lp-btn-pill--lg border-0 p-0 d-inline-flex align-items-center"
              :to="{ name: 'auth.sign-up' }"
            >
              <span class="lp-btn-pill__label">
                <Icon icon="solar:users-group-rounded-bold" class="lp-btn-pill__lead-icon" aria-hidden="true" />
                {{ t('shareEarn.heroCtaPrimary') }}
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
import shareEarnPlaceholder from '@/assets/images/landing/placeholders/share-earn-placeholder.svg'

const { t } = useI18n()

const features = [
  { icon: 'solar:users-group-rounded-bold', titleKey: 'landing.shareEarnCard1Title', descKey: 'landing.shareEarnCard1Desc', variant: 'se-feat--purple' },
  { icon: 'solar:bag-2-bold',              titleKey: 'landing.shareEarnCard2Title', descKey: 'landing.shareEarnCard2Desc', variant: 'se-feat--gold'   },
  { icon: 'solar:wallet-money-bold',       titleKey: 'landing.shareEarnCard3Title', descKey: 'landing.shareEarnCard3Desc', variant: 'se-feat--mix'    },
]

const howSteps = [
  { icon: 'solar:download-minimalistic-bold', titleKey: 'shareEarn.how1Title', descKey: 'shareEarn.how1Desc' },
  { icon: 'solar:smartphone-2-bold',          titleKey: 'shareEarn.how2Title', descKey: 'shareEarn.how2Desc' },
  { icon: 'solar:users-group-rounded-bold',   titleKey: 'shareEarn.how3Title', descKey: 'shareEarn.how3Desc' },
  { icon: 'solar:wallet-money-bold',          titleKey: 'shareEarn.how4Title', descKey: 'shareEarn.how4Desc' },
]

const earnings = [
  { icon: 'solar:users-group-rounded-bold', titleKey: 'shareEarn.earn1Title', descKey: 'shareEarn.earn1Desc' },
  { icon: 'solar:bag-2-bold',              titleKey: 'shareEarn.earn2Title', descKey: 'shareEarn.earn2Desc' },
  { icon: 'solar:wallet-money-bold',       titleKey: 'shareEarn.earn3Title', descKey: 'shareEarn.earn3Desc' },
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
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  font-weight: 800;
  line-height: 1.12;
  color: var(--bs-heading-color, var(--bs-body-color));
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.section-copy {
  font-size: 1rem;
  line-height: 1.72;
  color: var(--bs-secondary-color);
  max-width: 62ch;
  margin: 0;
  text-wrap: pretty;
}

.se-section-copy {
  margin-top: 0.4rem;
}

.section-heading { margin-bottom: 2.5rem; }

.se-features-section .section-kicker {
  color: var(--bs-primary);
}

.se-features-section .section-title {
  color: var(--bs-primary);
}

.se-features-section .section-copy {
  color: color-mix(in srgb, var(--bs-primary) 38%, var(--bs-body-color) 62%);
}

/* ---- hero ---- */
.se-hero {
  padding-top: clamp(3rem, 8vw, 6rem);
  padding-bottom: clamp(3rem, 8vw, 5rem);
}

.se-hero-grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 992px) {
  .se-hero-grid { grid-template-columns: 1fr 1fr; }
}

.se-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-secondary);
  margin-bottom: 1rem;
}

.se-title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: 1.2rem;
  color: var(--bs-heading-color, var(--bs-body-color));
  text-wrap: balance;
}

.se-title span {
  display: block;
  background: linear-gradient(90deg, #F7A829, #C97C00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.se-lead {
  font-size: 1.05rem;
  line-height: 1.72;
  color: var(--bs-secondary-color);
  max-width: 52ch;
}

.se-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.6rem;
}

/* ---- hero visual stats card ---- */
.se-visual { display: flex; justify-content: center; }

.se-visual-stack {
  position: relative;
  width: min(100%, 420px);
  padding-top: 1.5rem;
}

.se-hero-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 2rem;
  box-shadow: 0 28px 72px rgba(92, 48, 143, 0.22);
}

.se-stats-card {
  width: 340px;
  max-width: calc(100% - 1.5rem);
  background: linear-gradient(145deg, #3B1A5A 0%, #5C308F 100%);
  border-radius: 1.5rem;
  padding: 1.75rem;
  box-shadow: 0 28px 72px rgba(92, 48, 143, 0.38);
  color: white;
  margin-top: -6rem;
  margin-left: auto;
  position: relative;
}

.se-stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.se-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1rem;
}

.se-stat--accent { background: rgba(247, 168, 41, 0.15); }

.se-stat-icon { font-size: 1.4rem; color: rgba(255, 255, 255, 0.75); }
.se-stat--accent .se-stat-icon { color: #F7A829; }

.se-stat strong {
  display: block;
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1;
}

.se-stat span {
  display: block;
  font-size: 0.72rem;
  opacity: 0.7;
  line-height: 1.35;
}

.se-progress-wrap { margin-bottom: 1.25rem; }

.se-progress-label {
  font-size: 0.76rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.se-progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  overflow: hidden;
}

.se-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #F7A829, #FFD166);
  border-radius: 999px;
}

.se-chip-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }

.se-chip {
  font-size: 0.75rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.se-chip--gold { background: rgba(247, 168, 41, 0.25); color: #F7A829; }

/* ---- features section ---- */
.se-features-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
  background: linear-gradient(180deg, rgba(92, 48, 143, 0.04) 0%, transparent 100%);
}

.se-feature-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) { .se-feature-grid { grid-template-columns: repeat(3, 1fr); } }

.se-feature-card {
  padding: 2rem 1.75rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.se-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(92, 48, 143, 0.14);
}

.se-feat--purple {
  background: linear-gradient(135deg, #5C308F 0%, #3B1A5A 100%);
  color: #F7A829;
}

.se-feat--gold {
  background: linear-gradient(135deg, #F7A829 0%, #C97C00 100%);
  color: #3B1A5A;
}

.se-feat--mix {
  background: linear-gradient(135deg, #3B1A5A 0%, #F7A829 100%);
  color: white;
}

.se-feat-icon-wrap {
  width: 3rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.18);
  margin-bottom: 1.25rem;
}

.se-feat-icon { font-size: 1.35rem; color: currentColor; }
.se-feat--purple .se-feat-icon-wrap {
  background: rgba(247, 168, 41, 0.16);
}
.se-feat--gold .se-feat-icon-wrap {
  background: rgba(59, 26, 90, 0.12);
}

.se-feature-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.6rem; }
.se-feature-card p { font-size: 0.9rem; line-height: 1.65; margin: 0; opacity: 0.85; }

/* ---- how it works ---- */
.se-how-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.se-how-grid {
  display: grid;
  gap: 3rem;
  align-items: start;
}

@media (min-width: 992px) {
  .se-how-grid { grid-template-columns: 1fr 1.6fr; }
  .se-how-grid .section-heading { position: sticky; top: 5rem; }
}

.se-steps {
  display: grid;
  gap: 1.5rem;
}

.se-step {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.se-step-dot {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.se-step-dot--purple { background: linear-gradient(135deg, #5C308F, #7B46B3); }
.se-step-dot--gold   { background: linear-gradient(135deg, #F7A829, #C97C00); color: #1a0d00; }

.se-step-body h4 { font-size: 1rem; font-weight: 700; margin-bottom: 0.4rem; }
.se-step-body p { font-size: 0.9rem; color: var(--bs-secondary-color); line-height: 1.65; margin: 0; }

/* ---- earnings breakdown ---- */
.se-breakdown-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
  background: linear-gradient(180deg, rgba(247, 168, 41, 0.04) 0%, transparent 100%);
}

.se-breakdown-grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) { .se-breakdown-grid { grid-template-columns: repeat(3, 1fr); } }

.se-earn-card {
  padding: 2rem 1.5rem;
  border-radius: 1.4rem;
  border: 1.5px solid rgba(247, 168, 41, 0.22);
  background: linear-gradient(180deg, rgba(247, 168, 41, 0.05), rgba(247, 168, 41, 0.02));
  transition: transform 0.25s ease;
}

.se-earn-card:hover { transform: translateY(-4px); }

.se-earn-icon {
  font-size: 2rem;
  color: #B8750A;
  margin-bottom: 1rem;
  display: block;
}

html[data-bs-theme='dark'] .se-earn-icon { color: #F7A829; }

.se-earn-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
.se-earn-card p  { font-size: 0.88rem; color: var(--bs-secondary-color); line-height: 1.65; margin: 0; }

/* ---- CTA ---- */
.se-cta-section {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.se-cta-shell {
  display: grid;
  gap: 2rem;
  align-items: center;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3.5rem);
  border-radius: 2rem;
  background: linear-gradient(135deg, #3B1A5A 0%, #5C308F 60%, rgba(247,168,41,0.6) 100%);
  color: #F7A829;
}

@media (min-width: 768px) {
  .se-cta-shell { grid-template-columns: 1fr auto; }
}

.se-cta-text h2 {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: #F7A829;
}

.se-cta-text p {
  font-size: 1rem;
  opacity: 0.85;
  line-height: 1.65;
  margin: 0;
  max-width: 48ch;
}

.se-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  align-items: center;
}
</style>
