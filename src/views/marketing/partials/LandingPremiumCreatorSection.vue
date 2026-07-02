<template>
  <section id="creator" class="lp-audience lp-audience--creator">
    <div class="ui-container">
      <div class="lp-audience__split lp-audience__split--creator">
        <div class="lp-audience__copy-block ui-reveal">
          <p class="lp-audience__eyebrow">{{ t('landing.premium.creatorEyebrow') }}</p>
          <h2 class="lp-audience__title">{{ t('landing.premium.creatorTitle') }}</h2>
          <p class="lp-audience__lead">{{ t('landing.premium.creatorLead') }}</p>

          <div class="lp-creator-commission">
            <span class="lp-creator-commission__rate">{{ t('landing.premium.creatorCommissionRate') }}</span>
            <span class="lp-creator-commission__desc">{{ t('landing.premium.creatorCommissionDesc') }}</span>
          </div>

          <p class="lp-audience__proof">
            <Icon icon="solar:star-bold" aria-hidden="true" />
            {{ t('landing.premium.creatorSocialProof') }}
          </p>

          <router-link :to="creatorSignupUrl" class="lp-bento-btn lp-bento-btn--primary">
            {{ t('landing.premium.creatorCta') }}
            <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
          </router-link>
        </div>

        <div class="lp-creator-grid">
          <article v-for="perk in creatorPerks" :key="perk.key" class="lp-creator-card ui-reveal">
            <Icon :icon="perk.icon" class="lp-creator-card__icon" aria-hidden="true" />
            <h3>{{ t(perk.titleKey) }}</h3>
            <p>{{ t(perk.descKey) }}</p>
          </article>

          <div class="lp-creator-preview" aria-hidden="true">
            <div class="lp-creator-preview__bar" />
            <div class="lp-creator-preview__stat">
              <span>{{ t('landing.premium.creatorPreviewClicks') }}</span>
              <strong>1,284</strong>
            </div>
            <div class="lp-creator-preview__stat">
              <span>{{ t('landing.premium.creatorPreviewOrders') }}</span>
              <strong>96</strong>
            </div>
            <div class="lp-creator-preview__stat lp-creator-preview__stat--highlight">
              <span>{{ t('landing.premium.creatorPreviewEarned') }}</span>
              <strong>TZS 428K</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { creatorPerks, creatorSignupUrl } from '@/config/landing-audiences'

const { t } = useI18n()
</script>
