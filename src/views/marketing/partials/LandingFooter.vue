<template>
  <footer
    ref="footerEl"
    class="mk-footer mk-footer--surprise"
    :class="{ 'mk-footer--egg': easterEggActive }"
    :style="spotlightStyle"
    @mousemove="onFooterMove"
    @mouseleave="onFooterLeave"
  >
    <div class="mk-footer__aurora" aria-hidden="true">
      <span class="mk-footer__orb mk-footer__orb--1" />
      <span class="mk-footer__orb mk-footer__orb--2" />
      <span class="mk-footer__orb mk-footer__orb--3" />
    </div>
    <div class="mk-footer__watermark" aria-hidden="true">KKOO</div>
    <div class="mk-footer__grid-glow" aria-hidden="true" />

    <div class="mk-shell mk-footer__inner">
      <div class="mk-footer__pulse" role="status" aria-live="polite">
        <Transition name="mk-footer-whisper" mode="out-in">
          <span :key="whisperIndex" class="mk-footer__whisper-line">{{ whispers[whisperIndex] }}</span>
        </Transition>
      </div>

      <div class="mk-footer__top">
        <div class="mk-footer__brand">
          <router-link
            to="/"
            class="mk-link d-inline-flex align-items-center gap-2 mk-footer__logo-hit"
            @click="onLogoClick"
          >
            <img :src="logoLight" alt="KKOO" class="mk-footer__logo-img" />
          </router-link>
          <p class="mt-3 mb-3 mk-footer__tagline">
            <span
              v-for="(ch, i) in taglineChars"
              :key="i"
              class="mk-footer__tagline-char"
              :style="{ '--char-i': i }"
            >{{ ch === ' ' ? '\u00a0' : ch }}</span>
          </p>

          <div class="d-flex flex-column gap-2">
            <strong class="small text-uppercase mk-footer__apps-label">{{ t('landing.footerGetApp') }}</strong>
            <div class="lp-download-actions lp-download-actions--footer">
              <a
                :href="appLinks.marketplace.appStore"
                target="_blank"
                rel="noopener noreferrer"
                class="lp-store-badge lp-store-badge--apple"
              >
                <span class="lp-store-badge__icon" aria-hidden="true">
                  <Icon icon="logos:apple-app-store" />
                </span>
                <span class="lp-store-badge__text">
                  <span class="lp-store-badge__kicker">{{ t('landing.footerStoreKickerApple') }}</span>
                  <span class="lp-store-badge__brand">{{ t('landing.footerAppStore') }}</span>
                </span>
              </a>
              <a
                :href="appLinks.marketplace.googlePlay"
                target="_blank"
                rel="noopener noreferrer"
                class="lp-store-badge lp-store-badge--google"
              >
                <span class="lp-store-badge__icon" aria-hidden="true">
                  <Icon icon="logos:google-play-icon" />
                </span>
                <span class="lp-store-badge__text">
                  <span class="lp-store-badge__kicker">{{ t('landing.footerStoreKickerGoogle') }}</span>
                  <span class="lp-store-badge__brand">{{ t('landing.footerGooglePlay') }}</span>
                </span>
              </a>
            </div>

            <small class="text-muted mk-footer__apps-note">
              {{ t('landing.footerAppNote') }}
            </small>
          </div>
        </div>

        <div class="mk-footer__links">
          <div class="mk-footer__col">
            <h5>{{ t('landing.footerExplore') }}</h5>
            <router-link
              v-for="item in primaryNavItems"
              :key="item.key"
              :to="item.route"
            >
              {{ t(item.labelKey) }}
            </router-link>
            <router-link :to="landingAnchors.download">{{ t('landing.headerGetApp') }}</router-link>
          </div>
          <div class="mk-footer__col">
            <h5>{{ t('landing.footerProduct') }}</h5>
            <template v-if="isAuthenticated">
              <span class="mk-footer__signed-in-name">{{ displayName }}</span>
              <router-link :to="dashboardRoute">{{ t('landing.footerDashboard') }}</router-link>
            </template>
            <template v-else>
              <router-link :to="{ name: 'auth.sign-in' }">{{ t('landing.footerSignIn') }}</router-link>
              <router-link :to="{ name: 'auth.sign-up' }">{{ t('landing.footerSignUp') }}</router-link>
            </template>
          </div>
          <div v-if="!isAuthenticated" class="mk-footer__col">
            <h5>{{ t('landing.footerPartners') }}</h5>
            <router-link :to="buyerRoutes.partnerRegister">{{ t('landing.footerPartnerApi') }}</router-link>
            <router-link :to="buyerRoutes.careers">{{ t('landing.footerCareers') }}</router-link>
          </div>
          <div class="mk-footer__col">
            <h5>{{ t('landing.footerCompany') }}</h5>
            <router-link :to="{ name: 'pages.app-homepage' }">{{ t('appHomepage.footerLink') }}</router-link>
            <router-link :to="buyerRoutes.careers">{{ t('landing.footerCareers') }}</router-link>
            <router-link :to="{ name: 'pages.terms' }">{{ t('landing.footerTermsOfUse') }}</router-link>
            <router-link :to="{ name: 'pages.privacy' }">{{ t('landing.footerPrivacyPolicy') }}</router-link>
            <router-link :to="{ name: 'pages.cookies' }">{{ t('landing.footerCookiePolicy') }}</router-link>
            <router-link :to="{ name: 'pages.refunds' }">{{ t('landing.footerRefundPolicy') }}</router-link>
            <router-link :to="{ name: 'pages.acceptable-use' }">{{ t('landing.footerAcceptableUse') }}</router-link>
          </div>
        </div>
      </div>

      <div class="mk-footer__bottom">
        <div class="mk-footer__bottom-row">
          <small>{{ t('landing.footerCopyright', { year: new Date().getFullYear() }) }}</small>
          <small>{{ t('landing.footerDriversNote') }}</small>
          <small class="text-muted">
            {{ t('landing.footerDevelopedBy') }}
            <a href="https://neotelabs.com" target="_blank" rel="noopener noreferrer" class="mk-link text-decoration-none mk-footer__agency-link">
              {{ t('landing.footerAgencyName') }}
            </a>
          </small>
        </div>
      </div>
    </div>

    <Transition name="mk-footer-pop">
      <div v-if="easterEggActive" class="mk-footer__egg" role="status">
        <span class="mk-footer__egg-emoji" aria-hidden="true">🛒✨🚀</span>
        <p class="mb-0">{{ t('landing.footerEasterEgg') }}</p>
      </div>
    </Transition>

    <div v-if="easterEggActive" class="mk-footer__confetti" aria-hidden="true">
      <span v-for="n in 18" :key="n" class="mk-footer__confetti-bit" :style="{ '--i': n }" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { appLinks } from '@/config/app-links'
import { buyerRoutes, landingAnchors, primaryNavItems } from '@/config/landing-links'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import logoLight from '@/assets/images/logo-light.svg'

const { t } = useI18n()
const { isAuthenticated, displayName, dashboardRoute } = useAuthDisplay()
const footerEl = ref<HTMLElement | null>(null)
const spotlightStyle = ref<Record<string, string>>({})
const whisperIndex = ref(0)
const easterEggActive = ref(false)
const logoClicks = ref(0)
let whisperTimer: ReturnType<typeof setInterval> | null = null
let eggTimeout: ReturnType<typeof setTimeout> | null = null

const whispers = computed(() => [
  t('landing.footerWhisper1'),
  t('landing.footerWhisper2'),
  t('landing.footerWhisper3'),
  t('landing.footerWhisper4'),
  t('landing.footerWhisper5'),
])

const taglineChars = computed(() => [...t('landing.footerTagline')])

function onFooterMove(e: MouseEvent) {
  const el = footerEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const x = ((e.clientX - r.left) / r.width) * 100
  const y = ((e.clientY - r.top) / r.height) * 100
  spotlightStyle.value = {
    '--spot-x': `${x}%`,
    '--spot-y': `${y}%`,
  }
}

function onFooterLeave() {
  spotlightStyle.value = {
    '--spot-x': '50%',
    '--spot-y': '20%',
  }
}

function onLogoClick(e: MouseEvent) {
  logoClicks.value += 1
  if (logoClicks.value >= 5) {
    e.preventDefault()
    logoClicks.value = 0
    triggerEasterEgg()
  }
}

function triggerEasterEgg() {
  easterEggActive.value = true
  if (eggTimeout) clearTimeout(eggTimeout)
  eggTimeout = setTimeout(() => {
    easterEggActive.value = false
  }, 5200)
}

onMounted(() => {
  onFooterLeave()
  whisperTimer = setInterval(() => {
    whisperIndex.value = (whisperIndex.value + 1) % whispers.value.length
  }, 4200)
})

onUnmounted(() => {
  if (whisperTimer) clearInterval(whisperTimer)
  if (eggTimeout) clearTimeout(eggTimeout)
})
</script>

<style scoped>
.mk-footer__signed-in-name {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: rgba(20, 19, 22, 0.88);
}

html[data-bs-theme='dark'] .mk-footer__signed-in-name {
  color: rgba(255, 255, 255, 0.9);
}
</style>
