<template>
  <footer class="hp-footer">
    <div class="mk-shell hp-footer__inner">
      <div class="hp-footer__grid">
        <div class="hp-footer__brand">
          <router-link to="/" class="hp-footer__logo">
            <img :src="logoSrc" alt="KKOO" />
          </router-link>
          <p class="hp-footer__tagline">{{ t('landing.footerTaglineShort') }}</p>
          <div class="hp-footer__stores">
            <a
              :href="appLinks.marketplace.appStore"
              target="_blank"
              rel="noopener noreferrer"
              class="hp-footer__store"
            >
              {{ t('landing.footerAppStore') }}
            </a>
            <a
              :href="appLinks.marketplace.googlePlay"
              target="_blank"
              rel="noopener noreferrer"
              class="hp-footer__store"
            >
              {{ t('landing.footerGooglePlay') }}
            </a>
          </div>
        </div>

        <div class="hp-footer__col">
          <h6 class="hp-footer__heading">{{ t('landing.footerExplore') }}</h6>
          <router-link v-for="item in primaryNavItems" :key="item.key" :to="item.route">
            {{ t(item.labelKey) }}
          </router-link>
          <router-link v-for="item in secondaryNavItems" :key="item.key" :to="item.route">
            {{ t(item.labelKey) }}
          </router-link>
        </div>

        <div class="hp-footer__col">
          <h6 class="hp-footer__heading">{{ t('landing.footerShop') }}</h6>
          <router-link :to="buyerRoutes.marketplace">{{ t('landing.navMarketplace') }}</router-link>
          <router-link :to="buyerRoutes.eats">{{ t('landing.navEats') }}</router-link>
          <router-link :to="{ name: 'pages.hotels' }">{{ t('landing.navHotels') }}</router-link>
          <router-link :to="buyerRoutes.vouchers">{{ t('landing.navVouchers') }}</router-link>
        </div>

        <div class="hp-footer__col">
          <h6 class="hp-footer__heading">{{ t('landing.footerNavForSellers') }}</h6>
          <router-link :to="sellerNavItems.business.route">{{ t(sellerNavItems.business.labelKey) }}</router-link>
          <router-link :to="sellerNavItems.merchant.route">{{ t(sellerNavItems.merchant.labelKey) }}</router-link>
          <a :href="sellerNavItems.register.href">{{ t(sellerNavItems.register.labelKey) }}</a>
          <a :href="sellerNavItems.account.href">{{ t(sellerNavItems.account.labelKey) }}</a>
          <a :href="sellerNavItems.portal.href">{{ t(sellerNavItems.portal.labelKey) }}</a>
        </div>

        <div class="hp-footer__col">
          <h6 class="hp-footer__heading">{{ t('landing.footerCompany') }}</h6>
          <router-link :to="{ name: 'pages.app-homepage' }">{{ t('appHomepage.footerLink') }}</router-link>
          <router-link :to="buyerRoutes.careers">{{ t('landing.footerCareers') }}</router-link>
          <router-link v-if="!isAuthenticated" :to="buyerRoutes.partnerRegister">
            {{ t('landing.footerPartnerApi') }}
          </router-link>
          <template v-if="isAuthenticated">
            <router-link :to="dashboardRoute">{{ t('landing.footerDashboard') }}</router-link>
          </template>
          <template v-else>
            <router-link :to="{ name: 'auth.sign-in' }">{{ t('landing.footerSignIn') }}</router-link>
          </template>
        </div>

        <div class="hp-footer__col">
          <h6 class="hp-footer__heading">{{ t('landing.footerHelp') }}</h6>
          <router-link :to="buyerRoutes.community">{{ t('landing.navCommunity') }}</router-link>
          <router-link :to="{ name: 'pages.terms' }">{{ t('landing.footerTermsOfUse') }}</router-link>
          <router-link :to="{ name: 'pages.privacy' }">{{ t('landing.footerPrivacyPolicy') }}</router-link>
          <router-link :to="{ name: 'pages.refunds' }">{{ t('landing.footerRefundPolicy') }}</router-link>
        </div>
      </div>

      <div class="hp-footer__bottom">
        <div class="hp-footer__legal">
          <router-link :to="{ name: 'pages.privacy' }">{{ t('landing.footerPrivacyPolicy') }}</router-link>
          <span aria-hidden="true">·</span>
          <router-link :to="{ name: 'pages.terms' }">{{ t('landing.footerTermsOfUse') }}</router-link>
          <span aria-hidden="true">·</span>
          <router-link :to="{ name: 'pages.cookies' }">{{ t('landing.footerCookiePolicy') }}</router-link>
        </div>
        <small class="hp-footer__copy">
          {{ t('landing.footerCopyright', { year: new Date().getFullYear() }) }}
        </small>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { appLinks } from '@/config/app-links'
import { buyerRoutes, primaryNavItems, secondaryNavItems, sellerNavItems } from '@/config/landing-links'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { useLayoutStore } from '@/stores/layout'
import logoLight from '@/assets/images/logo-light.svg'
import logoDark from '@/assets/images/logo-dark.svg'

const { t } = useI18n()
const { layout } = storeToRefs(useLayoutStore())
const { isAuthenticated, dashboardRoute } = useAuthDisplay()

const logoSrc = computed(() => (layout.value.theme === 'dark' ? logoDark : logoLight))
</script>
