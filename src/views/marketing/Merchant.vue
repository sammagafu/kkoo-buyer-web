<template>
  <MarketingLayout>
    <VerticalHero
      :eyebrow="t('merchant.heroEyebrow')"
      :title="t('merchant.heroTitle')"
      :title-accent="t('merchant.heroTitleAccent')"
      :lead="t('merchant.heroDesc')"
      :image="shopImage"
      :image-alt="t('merchant.visual.primaryImageAlt')"
      :badge-label="t('merchant.visual.primaryBadgeLabel')"
      :badge-title="t('merchant.visual.primaryBadgeTitle')"
    >
      <template #actions>
        <LhButton as="a" :href="bizSellerRegisterUrl" variant="primary" size="lg" with-well>
          {{ t('merchant.cta.becomeMerchant') }}
        </LhButton>
        <LhButton as="router-link" :to="buyerRoutes.business" variant="ghost" size="lg">
          {{ t('merchant.cta.needTools') }}
        </LhButton>
      </template>
    </VerticalHero>

    <MkSection
      :kicker="t('merchant.sections.why.kicker')"
      :title="t('merchant.sections.why.title')"
      :lead="t('merchant.sections.why.copy')"
    >
      <MkFeatureList :items="benefits" />
    </MkSection>

    <MkSection
      :kicker="t('merchant.sections.steps.kicker')"
      :title="t('merchant.sections.steps.title')"
      section-class="mk-band"
    >
      <MkProcessGrid :items="stepItems" />
    </MkSection>

    <MkSection :kicker="t('merchant.sections.faq.kicker')" :title="t('merchant.sections.faq.title')">
      <div class="mk-faq">
        <details v-for="faq in faqs" :key="faq.question">
          <summary>{{ faq.question }}</summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </MkSection>

    <MkSection section-class="mk-band">
      <MkCtaPanel
        :kicker="t('merchant.sections.cta.kicker')"
        :title="t('merchant.sections.cta.title')"
        :lead="t('merchant.sections.cta.copy')"
      >
        <LhButton as="a" :href="bizSellerRegisterUrl" variant="on-dark" size="lg" with-well>
          {{ t('merchant.cta.startSetup') }}
        </LhButton>
        <LhButton
          as="a"
          href="mailto:info@kkooapp.co.tz?subject=KKOO%20Merchant%20Partnership"
          variant="ghost"
          size="lg"
          class="lh-footer__ghost"
        >
          {{ t('merchant.cta.partnerships') }}
        </LhButton>
      </MkCtaPanel>
    </MkSection>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MarketingLayout from './MarketingLayout.vue'
import VerticalHero from './components/VerticalHero.vue'
import MkSection from './components/toolkit/MkSection.vue'
import MkFeatureList from './components/toolkit/MkFeatureList.vue'
import MkProcessGrid from './components/toolkit/MkProcessGrid.vue'
import MkCtaPanel from './components/toolkit/MkCtaPanel.vue'
import LhButton from './partials/house/LhButton.vue'
import { buyerRoutes, bizSellerRegisterUrl } from '@/config/landing-links'
import shopImage from '@/assets/images/landing/services/shop.jpg'

const { t } = useI18n()

const benefits = computed(() =>
  [1, 2, 3, 4].map((n) => ({
    icon: ['solar:chart-square-linear', 'solar:wallet-money-linear', 'solar:box-linear', 'solar:smartphone-2-linear'][n - 1],
    title: t(`merchant.benefits.${n}.title`),
    copy: t(`merchant.benefits.${n}.copy`),
  })),
)

const stepItems = computed(() =>
  [1, 2, 3, 4].map((n) => ({
    key: `step-${n}`,
    title: t(`merchant.steps.${n}.title`),
    copy: t(`merchant.steps.${n}.copy`),
    icon: 'solar:arrow-right-linear',
  })),
)

const faqs = computed(() =>
  [1, 2, 3, 4].map((n) => ({
    question: t(`merchant.faqs.${n}.q`),
    answer: t(`merchant.faqs.${n}.a`),
  })),
)
</script>

<style scoped>
.mk-faq {
  display: grid;
  max-width: 44rem;
  border-top: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
}

.mk-faq details {
  border-bottom: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
  padding: 1.1rem 0;
}

.mk-faq summary {
  cursor: pointer;
  font-family: var(--lh-font-display, var(--kkoo-font-display));
  font-weight: 700;
  color: var(--lh-text, #1a1a1a);
  list-style: none;
}

.mk-faq summary::-webkit-details-marker {
  display: none;
}

.mk-faq p {
  margin: 0.75rem 0 0;
  line-height: 1.65;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}
</style>
