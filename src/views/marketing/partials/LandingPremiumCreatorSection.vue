<template>
  <section id="creator" class="lp-audience lp-audience--creator lp-creator">
    <div class="ui-container">
      <div class="lp-creator__split">
        <div class="lp-creator__copy ui-reveal">
          <p class="lp-audience__eyebrow">{{ t('landing.premium.creatorEyebrow') }}</p>
          <h2 class="lp-audience__title">{{ t('landing.premium.creatorTitle') }}</h2>
          <p class="lp-audience__lead">{{ t('landing.premium.creatorLead') }}</p>

          <div v-if="hasLivePricing" class="lp-creator-commission">
            <span class="lp-creator-commission__rate">{{ creatorCommissionRate }}</span>
            <span class="lp-creator-commission__desc">{{ creatorCommissionDesc }}</span>
          </div>

          <ol class="lp-creator__timeline">
            <li v-for="(perk, i) in creatorPerks" :key="perk.key" class="lp-creator__timeline-step">
              <span class="lp-creator__timeline-dot" aria-hidden="true">
                <Icon :icon="perk.icon" />
              </span>
              <span v-if="i < creatorPerks.length - 1" class="lp-creator__timeline-line" aria-hidden="true" />
              <div class="lp-creator__timeline-copy">
                <h3>{{ t(perk.titleKey) }}</h3>
                <p>{{ t(perk.descKey) }}</p>
              </div>
            </li>
          </ol>

          <router-link :to="creatorSignupUrl" class="lp-bento-btn lp-bento-btn--primary lp-creator__cta">
            {{ t('landing.premium.creatorCta') }}
            <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
          </router-link>
        </div>

        <div class="lp-creator__stage ui-reveal" aria-hidden="true">
          <span class="lp-creator__chip lp-creator__chip--one">
            <Icon icon="solar:link-round-bold" />
          </span>
          <span class="lp-creator__chip lp-creator__chip--two">
            <Icon icon="solar:wallet-money-bold" />
          </span>

          <div class="lp-creator__phone">
            <span class="lp-creator__phone-notch" />
            <div class="lp-creator__chat">
              <div class="lp-creator__bubble lp-creator__bubble--sent">
                <span class="lp-creator__share-card">
                  <span class="lp-creator__share-icon">
                    <Icon icon="solar:bag-heart-bold" />
                  </span>
                  <span class="lp-creator__share-body">
                    <strong>{{ t('landing.premium.creatorDemoShared') }}</strong>
                    <span class="lp-creator__share-link">kkooapp.co.tz/p/ab12</span>
                  </span>
                </span>
              </div>

              <div class="lp-creator__bubble lp-creator__bubble--received">
                {{ t('landing.premium.creatorDemoReply') }}
              </div>

              <div class="lp-creator__toast">
                <Icon icon="solar:wallet-money-bold" class="lp-creator__toast-icon" />
                <span v-if="hasLivePricing && demoCommissionLabel">
                  {{ t('landing.premium.creatorDemoToastLive', { amount: demoCommissionLabel }) }}
                </span>
                <span v-else>{{ t('landing.premium.creatorDemoToast') }}</span>
              </div>
            </div>
          </div>

          <p class="lp-creator__caption">{{ t('landing.premium.creatorDemoCaption') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useKkooPricing } from '@/composables/useKkooPricing'
import { formatTzs } from '@/utils/kkooPricing'
import { creatorPerks, creatorSignupUrl } from '@/config/landing-audiences'

const { t } = useI18n()
const { config: pricingConfig, source: pricingSource, load: loadPricing } = useKkooPricing()

// Rates and amounts render only from published platform pricing — never from fallbacks.
const hasLivePricing = computed(() => pricingSource.value === 'live')

const creatorCommissionRate = computed(() =>
  t('landing.premium.creatorCommissionRateLive', {
    percent: pricingConfig.value.creator.shareCommissionPercent,
  }),
)

const creatorCommissionDesc = computed(() =>
  t('landing.premium.creatorCommissionDescLive', {
    amount: Math.round(pricingConfig.value.creator.avgOrderTzs).toLocaleString('en-TZ'),
    currency: pricingConfig.value.currency,
  }),
)

const demoCommissionLabel = computed(() => {
  const { avgOrderTzs, shareCommissionPercent } = pricingConfig.value.creator
  const amount = Math.round(avgOrderTzs * (shareCommissionPercent / 100))
  return amount > 0 ? formatTzs(amount, pricingConfig.value.currency) : null
})

onMounted(() => {
  void loadPricing()
})
</script>

<style scoped>
/* Mobile-first split: the phone demo stacks under the copy, sits beside it from lg up. */
.lp-creator__split {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 992px) {
  .lp-creator__split {
    grid-template-columns: 1.05fr 0.95fr;
  }
}

.lp-creator__cta {
  width: auto;
  min-width: 12rem;
}

/* How-it-works timeline */
.lp-creator__timeline {
  list-style: none;
  margin: 1.5rem 0 1.75rem;
  padding: 0;
  display: grid;
  gap: 1.15rem;
}

.lp-creator__timeline-step {
  position: relative;
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.lp-creator__timeline-dot {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  background: color-mix(in srgb, var(--lp-bento-primary) 12%, transparent);
  color: var(--lp-bento-primary);
  z-index: 1;
}

.lp-creator__timeline-line {
  position: absolute;
  left: 1.2rem;
  top: 2.4rem;
  bottom: -1.15rem;
  width: 2px;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--lp-bento-primary) 18%, transparent);
}

.lp-creator__timeline-copy h3 {
  margin: 0.15rem 0 0.2rem;
  font-size: 0.98rem;
  font-weight: 700;
}

.lp-creator__timeline-copy p {
  margin: 0;
  font-size: 0.87rem;
  line-height: 1.5;
  color: var(--lp-bento-muted);
}

/* Phone stage */
.lp-creator__stage {
  position: relative;
  display: grid;
  justify-items: center;
  padding: 1.5rem 0.5rem;
}

.lp-creator__phone {
  position: relative;
  width: min(19rem, 88%);
  padding: 2.1rem 0.9rem 1.1rem;
  border-radius: 2.1rem;
  background: var(--lp-bento-surface);
  border: 1px solid color-mix(in srgb, var(--lp-bento-ink) 10%, transparent);
  box-shadow:
    0 24px 60px color-mix(in srgb, var(--lp-bento-primary) 22%, transparent),
    0 4px 16px rgba(0, 0, 0, 0.08);
  transform: rotate(-2deg);
}

.lp-creator__phone-notch {
  position: absolute;
  top: 0.8rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6rem;
  height: 0.45rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--lp-bento-ink) 14%, transparent);
}

.lp-creator__chat {
  display: grid;
  gap: 0.7rem;
  padding: 0.85rem 0.55rem 0.55rem;
  border-radius: 1.4rem;
  background:
    radial-gradient(circle at 85% 8%, color-mix(in srgb, var(--lp-bento-primary) 8%, transparent), transparent 55%),
    color-mix(in srgb, var(--lp-bento-ink) 3%, transparent);
}

.lp-creator__bubble {
  max-width: 86%;
  padding: 0.6rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.82rem;
  line-height: 1.4;
}

.lp-creator__bubble--sent {
  justify-self: end;
  border-bottom-right-radius: 0.25rem;
  background: color-mix(in srgb, var(--lp-bento-primary) 14%, var(--lp-bento-surface));
}

.lp-creator__bubble--received {
  justify-self: start;
  border-bottom-left-radius: 0.25rem;
  background: var(--lp-bento-surface);
  border: 1px solid color-mix(in srgb, var(--lp-bento-ink) 8%, transparent);
}

.lp-creator__share-card {
  display: flex;
  gap: 0.55rem;
  align-items: center;
}

.lp-creator__share-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.6rem;
  font-size: 1rem;
  background: var(--lp-bento-primary);
  color: #fff;
}

.lp-creator__share-body {
  display: grid;
  gap: 0.1rem;
  min-width: 0;
}

.lp-creator__share-body strong {
  font-size: 0.8rem;
  line-height: 1.3;
}

.lp-creator__share-link {
  font-size: 0.72rem;
  color: var(--lp-bento-primary);
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lp-creator__toast {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.3rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.9rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #1abc9c, #0e8c73);
  box-shadow: 0 10px 24px rgba(26, 188, 156, 0.35);
  animation: lp-creator-toast-pop 2.8s ease-in-out infinite;
}

.lp-creator__toast-icon {
  flex-shrink: 0;
  font-size: 1.05rem;
}

@keyframes lp-creator-toast-pop {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

/* Floating accent chips */
.lp-creator__chip {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 0.9rem;
  font-size: 1.2rem;
  background: var(--lp-bento-surface);
  border: 1px solid color-mix(in srgb, var(--lp-bento-ink) 8%, transparent);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  color: var(--lp-bento-primary);
  z-index: 1;
}

.lp-creator__chip--one {
  top: 8%;
  left: 6%;
  animation: lp-creator-float 5s ease-in-out infinite;
}

.lp-creator__chip--two {
  bottom: 16%;
  right: 4%;
  color: #0e8c73;
  animation: lp-creator-float 5s ease-in-out 1.4s infinite;
}

@keyframes lp-creator-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-9px);
  }
}

.lp-creator__caption {
  margin: 1.25rem auto 0;
  max-width: 22rem;
  font-size: 0.82rem;
  line-height: 1.5;
  text-align: center;
  color: var(--lp-bento-muted);
}

@media (prefers-reduced-motion: reduce) {
  .lp-creator__toast,
  .lp-creator__chip--one,
  .lp-creator__chip--two {
    animation: none;
  }
}
</style>
