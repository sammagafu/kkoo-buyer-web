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
            <div class="se-actions lh-hero__cta">
              <LhButton as="router-link" :to="{ name: 'auth.sign-up' }" variant="primary" size="lg" with-well>
                {{ t('shareEarn.heroCtaPrimary') }}
              </LhButton>
              <LhButton as="a" href="#how-it-works" variant="ghost" size="lg">
                {{ t('shareEarn.heroCtaSecondary') }}
              </LhButton>
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
            <p class="se-eyebrow">{{ t('landing.navShareEarn') }}</p>
            <h2>{{ t('shareEarn.ctaTitle') }}</h2>
            <p>{{ t('shareEarn.ctaDesc') }}</p>
          </div>
          <div class="se-cta-actions">
            <LhButton as="router-link" :to="{ name: 'auth.sign-up' }" variant="on-dark" size="lg" with-well>
              {{ t('shareEarn.heroCtaPrimary') }}
            </LhButton>
            <LhButton as="a" href="#how-it-works" variant="ghost" size="lg" class="lh-cta__ghost se-cta-ghost">
              {{ t('shareEarn.heroCtaSecondary') }}
            </LhButton>
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
import LhButton from './partials/house/LhButton.vue'
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
/* Title sizes/layout: _lh-marketing-bridge.scss (house landing scale) */

.se-hero {
  padding-block: clamp(2.5rem, 6vw, 4.5rem) !important;
}

.se-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  min-width: 0;
}

.se-eyebrow {
  margin: 0 0 0.85rem;
}

.se-lead {
  margin: 1.1rem 0 0;
}

.se-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.75rem;
}

.se-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

.se-visual-stack {
  position: relative;
  width: min(100%, 420px);
  padding-top: 0.5rem;
}

.se-hero-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 1.5rem;
  box-shadow: 0 28px 72px rgba(92, 48, 143, 0.22);
}

.se-stats-card {
  width: min(340px, calc(100% - 1.25rem));
  margin-top: -5rem;
  margin-left: auto;
  position: relative;
  padding: 1.35rem 1.4rem;
}

.se-stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-bottom: 1.15rem;
}

.se-stat {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 0.9rem;
}

.se-stat--accent { background: rgba(247, 168, 41, 0.15); }

.se-stat-icon { font-size: 1.25rem; color: rgba(255, 255, 255, 0.75); }
.se-stat--accent .se-stat-icon { color: #F7A829; }

.se-stat strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.1;
}

.se-stat span {
  display: block;
  font-size: 0.72rem;
  opacity: 0.75;
  line-height: 1.35;
}

.se-progress-wrap { margin-bottom: 1rem; }

.se-progress-label {
  font-size: 0.76rem;
  opacity: 0.75;
  margin-bottom: 0.45rem;
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

.se-chip-row { display: flex; gap: 0.55rem; flex-wrap: wrap; }

.se-chip {
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.se-chip--gold { background: rgba(247, 168, 41, 0.25); color: #F7A829; }

/* ---- features section ---- */
.se-features-section {
  padding: clamp(2.75rem, 6vw, 4.5rem) 0 !important;
  background: linear-gradient(180deg, rgba(92, 48, 143, 0.04) 0%, transparent 100%);
}

.se-section-copy {
  margin-top: 0.75rem;
}

.se-feature-grid {
  display: grid;
  gap: 1.25rem;
  margin-top: 0.25rem;
}

@media (min-width: 768px) { .se-feature-grid { grid-template-columns: repeat(3, 1fr); gap: 1.35rem; } }

.se-feature-card {
  padding: 1.75rem 1.5rem;
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
  padding: clamp(2.75rem, 6vw, 4.5rem) 0 !important;
}

.se-how-grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
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
  padding: clamp(2.75rem, 6vw, 4.5rem) 0 !important;
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
  padding: clamp(2.5rem, 5vw, 4rem) 0 !important;
}

.se-cta-shell {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 840px) {
  .se-cta-shell {
    grid-template-columns: 1.3fr 0.7fr;
    align-items: end;
    gap: 2rem;
  }
}

.se-cta-text .se-eyebrow {
  margin: 0 0 0.65rem;
}

.se-cta-text h2 {
  margin: 0;
  font-family: var(--lh-font-display, 'Poppins', sans-serif);
  font-size: clamp(1.45rem, 2.8vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  max-width: 16ch;
}

.se-cta-text p {
  margin: 0.75rem 0 0;
  font-size: 1rem;
  line-height: 1.55;
  max-width: 42ch;
  opacity: 0.9;
}

.se-cta-actions {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 0.85rem;
  align-items: flex-start;
}

@media (min-width: 840px) {
  .se-cta-actions {
    align-items: flex-end;
  }
}

.se-cta-ghost.lh-btn--ghost {
  color: #fffaf6 !important;
  border-color: rgba(255, 250, 246, 0.35) !important;
  background: transparent !important;
}

.se-cta-ghost.lh-btn--ghost:hover {
  background: rgba(255, 250, 246, 0.1) !important;
  border-color: rgba(255, 250, 246, 0.55) !important;
  color: #fffaf6 !important;
}
</style>
