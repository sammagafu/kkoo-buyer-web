<template>
  <section id="ride-partners" class="lp-rider">
    <div class="ui-container">
      <div class="lp-rider__shell ui-reveal">
        <header class="lp-rider__intro">
          <p class="lp-rider__eyebrow">{{ t('landing.premium.riderEyebrow') }}</p>
          <h2 class="lp-rider__title">{{ t('landing.premium.riderTitle') }}</h2>
          <p class="lp-rider__lead">{{ t('landing.premium.riderLead') }}</p>
        </header>

        <div
          class="lp-rider__earnings-hero"
          :aria-label="t('landing.premium.riderEarnings')"
        >
          <span class="lp-rider__earnings-unit">{{ t('landing.premium.riderEarningsUnit') }}</span>
          <span class="lp-rider__earnings-amount">{{ t('landing.premium.riderEarningsAmount') }}</span>
          <span class="lp-rider__earnings-note">{{ t('landing.premium.riderEarningsNote') }}</span>
        </div>

        <div class="lp-rider__highlights" role="list">
          <div
            v-for="item in riderHighlights"
            :key="item.key"
            class="lp-rider__highlight"
            :class="{ 'lp-rider__highlight--featured': item.key === 'pay' }"
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
            <div class="lp-rider__earnings-chip">
              <Icon icon="solar:wallet-money-bold" aria-hidden="true" />
              <div class="lp-rider__earnings-chip-copy">
                <span class="lp-rider__earnings-chip-amount">{{ t('landing.premium.riderEarningsAmount') }}</span>
                <span class="lp-rider__earnings-chip-label">{{ t('landing.premium.riderEarningsChipLabel') }}</span>
              </div>
            </div>
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import rideImage from '@/assets/landing/services/ride.jpg'
import { buyerRoutes } from '@/config/landing-links'
import {
  riderEligibilityItems,
  riderHighlights,
  riderOnboardingSteps,
  riderWhatsAppApplyUrl,
} from '@/config/landing-audiences'

const { t } = useI18n()
</script>
