<template>
  <footer id="contacts" ref="rootRef" class="lh-footer lh-page lh-reveal">
    <div class="lh-footer__panel">
      <div>
        <img
          :src="houseLogoLight"
          class="lh-footer__logo"
          :alt="houseCopy.brand"
          width="128"
          height="128"
        />
        <h2>{{ t('landingHouse.footer.title') }}</h2>
        <p class="lh-footer__lead">{{ t('landingHouse.footer.lead') }}</p>
        <div class="lh-footer__stores">
          <a
            :href="appLinks.marketplace.appStore"
            class="lh-footer__store"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('landing.footerAppStore') }}
          </a>
          <a
            :href="appLinks.marketplace.googlePlay"
            class="lh-footer__store"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('landing.footerGooglePlay') }}
          </a>
        </div>
        <div class="lh-footer__social" role="list">
          <a
            v-for="s in companySocialLinks"
            :key="s.key"
            :href="s.href"
            class="lh-footer__social-link"
            role="listitem"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="s.label"
          >
            <Icon :icon="s.icon" width="20" height="20" />
          </a>
        </div>
      </div>
      <div class="lh-footer__actions">
        <LhButton
          as="router-link"
          :to="buyerRoutes.marketplace"
          variant="on-dark"
          size="lg"
          with-well
        >
          {{ t('landingHouse.ctaPrimary') }}
        </LhButton>
        <LhButton
          as="router-link"
          :to="buyerRoutes.merchant"
          variant="ghost"
          size="lg"
          class="lh-footer__ghost"
        >
          {{ t('landingHouse.ctaSell') }}
        </LhButton>
        <LhButton
          as="router-link"
          :to="buyerRoutes.getStarted"
          variant="ghost"
          size="lg"
          class="lh-footer__ghost"
        >
          {{ t('landingHouse.ctaSecondary') }}
        </LhButton>
      </div>
    </div>

    <div class="lh-footer__columns">
      <nav class="lh-footer__col" :aria-label="t('landing.footerProduct')">
        <h6 class="lh-footer__heading">{{ t('landing.footerProduct') }}</h6>
        <a
          v-for="item in productNav"
          :key="item.id"
          :href="sectionHref(item.id)"
          @click="onFooterNavClick(item.id, $event)"
        >
          {{ t(`landingHouse.nav.${item.id}`) }}
        </a>
      </nav>

      <nav class="lh-footer__col" :aria-label="t('landing.footerCompany')">
        <h6 class="lh-footer__heading">{{ t('landing.footerCompany') }}</h6>
        <RouterLink v-for="item in companyLinks" :key="item.name" :to="{ name: item.name }">
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>

      <nav class="lh-footer__col" :aria-label="t('trust.supportHeading')">
        <h6 class="lh-footer__heading">{{ t('trust.supportHeading') }}</h6>
        <RouterLink v-for="item in supportLinks" :key="item.name" :to="{ name: item.name }">
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>

      <nav class="lh-footer__col" :aria-label="t('trust.legalHeading')">
        <h6 class="lh-footer__heading">{{ t('trust.legalHeading') }}</h6>
        <RouterLink v-for="item in legalLinks" :key="item.name" :to="{ name: item.name }">
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>
    </div>

    <div class="lh-footer__meta">
      <div class="lh-footer__meta-main">
        <span>{{ t('trust.copyrightLine', { year, entity: companyLegal.legalEntity }) }}</span>
        <span class="lh-footer__entity">{{ companyLegal.jurisdiction }}</span>
        <span>{{ t('landingHouse.footer.meta') }}</span>
      </div>
      <div class="lh-footer__meta-tools">
        <small class="lh-footer__credit">
          {{ t('landing.footerDevelopedBy') }}
          <a href="https://neotelabs.com" target="_blank" rel="noopener noreferrer">{{
            t('landing.footerAgencyName')
          }}</a>
        </small>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { houseCopy, houseLogoLight } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'
import { appLinks } from '@/config/app-links'
import { companyLegal, companySocialLinks } from '@/config/company-trust'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useHouseReveal } from '@/composables/useHouseReveal'
import LhButton from './LhButton.vue'

const { t } = useI18n()
const { sectionHref, onAnchorClick } = useLandingScroll()

const productNav = computed(() =>
  (['buy', 'sell', 'pos', 'business', 'ride', 'earn'] as const).map((id) => ({ id })),
)

const companyLinks = [
  { name: 'pages.about', labelKey: 'trust.navAbout' },
  { name: 'pages.safety', labelKey: 'trust.navSafety' },
  { name: 'pages.coverage', labelKey: 'trust.navCoverage' },
  { name: 'pages.careers', labelKey: 'landing.footerCareers' },
  { name: 'pages.news', labelKey: 'trust.navNews' },
  { name: 'pages.press', labelKey: 'trust.navPress' },
  { name: 'pages.investors', labelKey: 'trust.navInvestors' },
  { name: 'pages.partner-register', labelKey: 'landing.footerPartnerApi' },
] as const

const supportLinks = [
  { name: 'pages.support', labelKey: 'trust.navSupportHub' },
  { name: 'pages.support-buyers', labelKey: 'trust.navSupportBuyers' },
  { name: 'pages.support-sellers', labelKey: 'trust.navSupportSellers' },
  { name: 'pages.support-riders', labelKey: 'trust.navSupportRiders' },
  { name: 'pages.support-restaurants', labelKey: 'trust.navSupportRestaurants' },
  { name: 'pages.community', labelKey: 'landing.navCommunity' },
] as const

const legalLinks = [
  { name: 'pages.terms', labelKey: 'landing.footerTermsOfUse' },
  { name: 'pages.privacy', labelKey: 'landing.footerPrivacyPolicy' },
  { name: 'pages.cookies', labelKey: 'landing.footerCookiePolicy' },
  { name: 'pages.refunds', labelKey: 'landing.footerRefundPolicy' },
  { name: 'pages.acceptable-use', labelKey: 'landing.footerAcceptableUse' },
  { name: 'pages.data-deletion', labelKey: 'landing.footerDataDeletion' },
] as const

function onFooterNavClick(id: string, event: MouseEvent) {
  onAnchorClick(id, event)
}

const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const year = new Date().getFullYear()
</script>
