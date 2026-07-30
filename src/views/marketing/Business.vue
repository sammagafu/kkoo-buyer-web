<template>
  <MarketingLayout>
    <VerticalHero
      :eyebrow="t('businessPage.hero.eyebrow')"
      :title="t('business.heroTitle')"
      :title-accent="t('business.heroTitleAccent')"
      :lead="t('business.heroDesc')"
      :image="shopImage"
      :image-alt="t('businessPage.hero.imageAlt')"
      :badge-label="t('businessPage.hero.overlayKicker')"
      :badge-title="t('businessPage.hero.overlayTitle')"
    >
      <template #actions>
        <LhButton as="a" :href="bizSellerDashboardUrl" variant="primary" size="lg" with-well>
          {{ t('businessPage.hero.ctaRegister') }}
        </LhButton>
        <LhButton as="router-link" :to="buyerRoutes.merchant" variant="ghost" size="lg">
          {{ t('businessPage.hero.ctaExploreMerchantTools') }}
        </LhButton>
      </template>
    </VerticalHero>

    <p class="ex-signin">
      {{ t('businessPage.hero.alreadyRegistered') }}
      <a :href="bizSignInUrl">{{ t('businessPage.hero.signIn') }}</a>
      <span aria-hidden="true"> · </span>
      <span>{{ t('businessPage.hero.otpWhatsApp') }}</span>
    </p>

    <MkSection
      :kicker="t('businessPage.sections.capabilities.kicker')"
      :title="t('businessPage.sections.capabilities.title')"
      :lead="t('businessPage.sections.capabilities.copy')"
    >
      <MkFeatureList :items="capabilities" />
    </MkSection>

    <MkSection
      :kicker="t('businessPage.sections.operatingFlow.kicker')"
      :title="t('businessPage.sections.operatingFlow.title')"
      :lead="t('businessPage.sections.operatingFlow.copy')"
      section-class="mk-band"
    >
      <MkProcessGrid :items="operatingFlowItems" />
    </MkSection>

    <MkSection
      :kicker="t('businessPage.businessTypes.kicker')"
      :title="t('businessPage.businessTypes.title')"
      :lead="t('businessPage.businessTypes.copy')"
    >
      <MkProcessGrid :items="businessTypeItems" />
    </MkSection>

    <MkSection
      :kicker="t('businessPage.faqs.kicker')"
      :title="t('businessPage.faqs.title')"
      section-class="mk-band"
    >
      <div class="mk-faq">
        <details v-for="faq in faqs" :key="faq.question">
          <summary>{{ faq.question }}</summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </MkSection>

    <MkSection>
      <MkCtaPanel
        :kicker="t('businessPage.sections.cta.kicker')"
        :title="t('businessPage.sections.cta.title')"
        :lead="t('businessPage.sections.cta.copy')"
      >
        <LhButton as="a" :href="bizSellerDashboardUrl" variant="on-dark" size="lg" with-well>
          {{ t('businessPage.hero.ctaRegister') }}
        </LhButton>
        <LhButton as="router-link" :to="buyerRoutes.merchant" variant="ghost" size="lg" class="lh-cta__ghost">
          {{ t('landing.navSell') }}
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
import { bizSellerDashboardUrl, bizSignInUrl, buyerRoutes } from '@/config/landing-links'
import shopImage from '@/assets/images/landing/services/shop.jpg'

const { t } = useI18n()

const capabilities = computed(() => [
  {
    icon: 'solar:shop-2-linear',
    tag: t('businessPage.capabilities.1.tag'),
    title: t('businessPage.capabilities.1.title'),
    copy: t('businessPage.capabilities.1.copy'),
  },
  {
    icon: 'solar:delivery-linear',
    tag: t('businessPage.capabilities.2.tag'),
    title: t('businessPage.capabilities.2.title'),
    copy: t('businessPage.capabilities.2.copy'),
  },
  {
    icon: 'solar:wallet-money-linear',
    tag: t('businessPage.capabilities.3.tag'),
    title: t('businessPage.capabilities.3.title'),
    copy: t('businessPage.capabilities.3.copy'),
  },
  {
    icon: 'solar:chart-square-linear',
    tag: t('businessPage.capabilities.4.tag'),
    title: t('businessPage.capabilities.4.title'),
    copy: t('businessPage.capabilities.4.copy'),
  },
])

const operatingFlowItems = computed(() =>
  [1, 2, 3, 4].map((n) => ({
    key: `flow-${n}`,
    title: t(`businessPage.operatingFlow.${n}.title`),
    copy: t(`businessPage.operatingFlow.${n}.copy`),
    icon: 'solar:arrow-right-linear',
  })),
)

const businessTypeItems = computed(() =>
  ['restaurant', 'store', 'retail'].map((key) => ({
    key,
    title: t(`businessPage.businessTypes.${key}.title`),
    copy: t(`businessPage.businessTypes.${key}.copy`),
    icon: 'solar:shop-linear',
  })),
)

const faqs = computed(() =>
  [1, 2, 3, 4, 5].map((n) => ({
    question: t(`businessPage.faqs.${n}.q`),
    answer: t(`businessPage.faqs.${n}.a`),
  })),
)
</script>

<style scoped>
.ex-signin {
  margin: 0 auto;
  padding: 0.25rem clamp(1rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem);
  max-width: var(--lh-content-max, 72rem);
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.ex-signin a {
  color: var(--lh-primary, #5c308f);
  font-weight: 600;
  text-decoration: none;
}

.ex-signin a:hover {
  text-decoration: underline;
}

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
