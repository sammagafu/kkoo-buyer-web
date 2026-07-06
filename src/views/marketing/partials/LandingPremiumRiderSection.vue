<template>
  <section id="ride-partners" class="lp-rider">
    <div class="ui-container ui-reveal">
        <header class="lp-rider__intro">
          <p class="lp-rider__eyebrow">{{ t('landing.premium.riderEyebrow') }}</p>
          <h2 class="lp-rider__title">{{ t('landing.premium.riderTitle') }}</h2>
          <div
            class="lp-rider__earnings-hero"
            :aria-label="t('landing.premium.riderEarnings')"
          >
            <span class="lp-rider__earnings-amount">{{ weeklyRangeLabel }}</span>
            <span class="lp-rider__earnings-unit">{{ t('landing.premium.riderEarningsUnit') }}</span>
            <div class="lp-rider-calc">
              <label class="lp-rider-calc__field">
                <span>{{ t('landing.premium.riderCalcTrips') }}</span>
                <input v-model.number="tripsPerDay" type="range" :min="pricingConfig.rider.tripsPerDayMin" :max="pricingConfig.rider.tripsPerDayMax" step="1" />
                <output>{{ tripsPerDay }} {{ t('landing.premium.riderCalcTripsUnit') }}</output>
              </label>
              <p class="lp-rider-calc__result">
                {{ t('landing.premium.riderCalcResult', { amount: weeklyEstimateLabel }) }}
              </p>
            </div>
            <span class="lp-rider__earnings-note">{{ t('landing.premium.riderEarningsNote') }}</span>
          </div>
          <p class="lp-rider__lead">{{ t('landing.premium.riderLead') }}</p>
        </header>

        <div class="lp-rider__highlights" role="list">
          <div
            v-for="item in riderHighlights"
            :key="item.key"
            class="lp-rider__highlight"
            role="listitem"
          >
            <Icon :icon="item.icon" class="lp-rider__highlight-icon" aria-hidden="true" />
            <div>
              <strong>{{ t(item.valueKey) }}</strong>
              <span>{{ t(item.labelKey) }}</span>
            </div>
          </div>
        </div>

        <div class="lp-rider__bento">
          <div class="lp-rider__visual">
            <img :src="rideImage" :alt="t('landing.premium.riderSpotlightAlt')" loading="lazy" />
          </div>

          <div class="lp-rider__join">
            <h3 class="lp-rider__join-title">{{ t('landing.premium.riderRequirementsTitle') }}</h3>

            <ul class="lp-rider__reqs" role="list">
              <li v-for="item in riderEligibilityItems" :key="item.key" role="listitem">
                <Icon :icon="item.icon" aria-hidden="true" />
                <span>{{ t(item.labelKey) }}</span>
              </li>
            </ul>

            <div class="lp-rider__actions">
              <router-link :to="buyerRoutes.courier" class="lp-bento-btn lp-bento-btn--amber">
                {{ t('landing.premium.riderCta') }}
                <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
              </router-link>
              <a
                :href="riderWhatsAppApplyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="lp-bento-btn lp-bento-btn--outline lp-bento-btn--whatsapp"
              >
                <Icon icon="bxl:whatsapp" aria-hidden="true" />
                {{ t('landing.premium.riderWhatsappCta') }}
              </a>
            </div>
          </div>
        </div>

        <div class="lp-rider__process">
          <div class="lp-rider__process-head">
            <h3 class="lp-rider__process-title">{{ t('landing.premium.riderHowTitle') }}</h3>
            <p class="lp-rider__process-lead">{{ t('landing.premium.riderFlowLead') }}</p>
          </div>

          <ol class="lp-rider__track" :aria-label="t('landing.premium.riderStepsAria')">
            <li v-for="(step, index) in riderOnboardingSteps" :key="step.key" class="lp-rider__track-step">
              <div class="lp-rider__track-marker" aria-hidden="true">
                <span class="lp-rider__track-num">{{ index + 1 }}</span>
                <span v-if="index < riderOnboardingSteps.length - 1" class="lp-rider__track-line" />
              </div>
              <div class="lp-rider__track-body">
                <h4>{{ t(step.titleKey) }}</h4>
                <p>{{ t(step.descKey) }}</p>
              </div>
            </li>
          </ol>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import rideImage from '@/assets/landing/services/ride.jpg'
import { buyerRoutes } from '@/config/landing-links'
import { useKkooPricing } from '@/composables/useKkooPricing'
import {
  estimateRiderWeeklyEarnings,
  formatCompactTzsRange,
  formatTzs,
} from '@/utils/kkooPricing'
import {
  riderEligibilityItems,
  riderHighlights,
  riderOnboardingSteps,
  riderWhatsAppApplyUrl,
} from '@/config/landing-audiences'

const { t } = useI18n()
const { config: pricingConfig, load: loadPricing } = useKkooPricing()
const tripsPerDay = ref(8)

const weeklyRangeLabel = computed(() =>
  formatCompactTzsRange(
    pricingConfig.value.rider.weeklyEarningsMinTzs,
    pricingConfig.value.rider.weeklyEarningsMaxTzs,
    pricingConfig.value.currency,
  ),
)

const weeklyEstimateLabel = computed(() =>
  formatTzs(estimateRiderWeeklyEarnings(tripsPerDay.value, pricingConfig.value), pricingConfig.value.currency),
)

watch(
  () => pricingConfig.value.rider.tripsPerDayMin,
  (min) => {
    const max = pricingConfig.value.rider.tripsPerDayMax
    const mid = Math.round((min + max) / 2)
    tripsPerDay.value = Math.min(max, Math.max(min, mid))
  },
  { immediate: true },
)

onMounted(() => {
  void loadPricing()
})
</script>
