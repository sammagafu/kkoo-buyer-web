<template>
  <section
    class="lp-trust-section"
    v-wow
    style="
      padding: 80px 0;
      background: linear-gradient(135deg, #3b1a5a 0%, #5c308f 60%, #7b46b3 100%);
    "
  >
    <b-container class="lp-page-container">
      <div class="text-center mb-5">
        <p
          style="
            color: #f7a829;
            font-weight: 700;
            letter-spacing: 1.5px;
            font-size: 0.75rem;
            text-transform: uppercase;
            margin-bottom: 12px;
            margin-top: 0;
          "
        >
          {{ t('landing.trustedByLabel') }}
        </p>
        <h2
          style="
            color: white;
            font-size: clamp(1.4rem, 4vw, 2rem);
            font-weight: 700;
            margin: 0;
            text-wrap: balance;
          "
        >
          {{ t('landing.trustedByHeadline') }}
        </h2>
      </div>

      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 28px;
          align-items: start;
          justify-items: center;
          margin-top: 48px;
        "
      >
        <div
          v-for="(trust, i) in trustPillars"
          :key="i"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            text-align: center;
          "
        >
          <div
            style="
              width: 54px;
              height: 54px;
              background: rgba(247, 168, 41, 0.15);
              border: 1.5px solid rgba(247, 168, 41, 0.35);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            "
          >
            <Icon :icon="trust.icon" style="font-size: 24px; color: #f7a829" />
          </div>
          <span
            style="
              color: rgba(255, 255, 255, 0.9);
              font-size: 0.78rem;
              font-weight: 600;
              line-height: 1.35;
              max-width: 95px;
            "
          >
            {{ trust.label }}
          </span>
        </div>
      </div>
    </b-container>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';

const { t } = useI18n();

const trustPillars = [
  {
    icon: 'solar:shield-check-bold',
    label: t('landing.trustVerifiedLabel'),
  },
  {
    icon: 'solar:document-text-bold',
    label: t('landing.trustTransparentLabel'),
  },
  {
    icon: 'solar:people-nearby-bold',
    label: t('landing.trustAccountableLabel'),
  },
  {
    icon: 'solar:card-2-bold',
    label: t('landing.trustSecureLabel'),
  },
  {
    icon: 'solar:box-bold',
    label: t('landing.trustDeliveryLabel'),
  },
  {
    icon: 'solar:headphones-round-bold',
    label: t('landing.trustSupportLabel'),
  },
];
</script>

<style scoped>
/* Section styling */
section {
  position: relative;
}
</style>
