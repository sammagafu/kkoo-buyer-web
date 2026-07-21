<template>
  <MarketingLayout>
    <VerticalHero
      :eyebrow="t('personal.heroEyebrow', 'For you')"
      :title="t('personal.heroTitle')"
      :title-accent="t('personal.heroTitleAccent')"
      :lead="t('personal.heroDesc')"
      :image="personalHeroPlaceholder"
      :image-alt="t('personal.heroTitle')"
    >
      <template #actions>
        <LhButton variant="primary" size="lg" with-well @click="navigateToService('market')">
          Open Marketplace
        </LhButton>
        <LhButton variant="ghost" size="lg" @click="navigateToService('eats')">
          Order Food & Groceries
        </LhButton>
      </template>
    </VerticalHero>

    <MkSection
      kicker="How it works"
      title="One buyer flow across shopping, food, and delivery."
      lead="KKOO keeps discovery, checkout, protection, and delivery visibility in one place so everyday ordering feels simpler, faster, and more trustworthy."
      section-class="personal-summary-surface"
    >
      <MkProcessGrid :items="howItWorks" />
    </MkSection>

    <MkSection
      kicker="What happens after checkout"
      title="A clearer path from payment to doorstep."
      lead="The experience should not stop at payment. Users need to confirm details, follow the order, and understand where the money and delivery stand without guesswork."
      section-class="checkout-surface"
    >
      <MkProcessGrid :items="checkoutSteps" />
    </MkSection>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSubdomainNavigation } from '@/composables/useSubdomainNavigation'
import MarketingLayout from './MarketingLayout.vue'
import VerticalHero from './components/VerticalHero.vue'
import MkSection from './components/toolkit/MkSection.vue'
import MkProcessGrid from './components/toolkit/MkProcessGrid.vue'
import LhButton from './partials/house/LhButton.vue'
import personalHeroPlaceholder from '@/assets/images/landing/placeholders/personal-hero-placeholder.svg'

const { t } = useI18n()
const { navigateToService } = useSubdomainNavigation()

const howItWorks = [
  {
    key: 'browse',
    title: 'Browse what you need in one place',
    copy:
      'Shop products and order food from the same account, with discovery and search designed to keep the journey familiar.',
    icon: 'solar:magnifer-linear',
  },
  {
    key: 'checkout',
    title: 'Checkout with escrow protection',
    copy:
      'Pay with confidence knowing funds are held until your order is confirmed and on its way.',
    icon: 'solar:shield-check-linear',
  },
  {
    key: 'track',
    title: 'Track delivery in real time',
    copy:
      'Follow your order from the shop or restaurant to your door with live status updates.',
    icon: 'solar:map-point-wave-linear',
  },
]

const checkoutSteps = [
  {
    key: 'confirm',
    title: 'Confirm order details',
    copy: 'Review items, delivery address, and payment before the seller accepts.',
    icon: 'solar:clipboard-check-linear',
  },
  {
    key: 'follow',
    title: 'Follow live progress',
    copy: 'See when your order is packed, picked up, and en route.',
    icon: 'solar:delivery-linear',
  },
  {
    key: 'complete',
    title: 'Complete and review',
    copy: 'Confirm delivery, release escrow, and leave feedback for the seller or rider.',
    icon: 'solar:star-linear',
  },
]
</script>
