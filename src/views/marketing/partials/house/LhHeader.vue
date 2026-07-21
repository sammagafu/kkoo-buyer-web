<template>
  <header ref="headerRef" class="lh-header">
    <div class="lh-page lh-header__inner">
      <component
        :is="isLandingPage ? 'a' : 'router-link'"
        class="lh-brand"
        :href="isLandingPage ? '#top' : undefined"
        :to="isLandingPage ? undefined : { path: '/' }"
        :aria-label="`${copy.brand} — top`"
        @click="onBrandClick"
      >
        <img :src="brandLogoSrc" class="lh-brand__logo" :alt="copy.brand" width="200" height="200" />
      </component>

      <div class="lh-header__actions">
        <LhThemeToggle class="d-none d-sm-inline-flex" />
        <RouterLink :to="buyerRoutes.community" class="lh-header__support d-none d-md-inline">
          {{ t('landing.navCommunity') }}
        </RouterLink>
        <LhButton
          as="router-link"
          :to="headerAuthCta.to"
          variant="ghost"
        >
          {{ headerAuthCta.label }}
        </LhButton>
        <LhButton as="router-link" :to="buyerRoutes.getStarted" variant="primary" with-well>
          {{ copy.cta }}
        </LhButton>
        <button
          type="button"
          class="lh-mobile-menu-btn"
          aria-label="Open menu"
          :aria-expanded="megaOpen"
          @click="toggleMega()"
        >
          <Icon :icon="megaOpen ? 'solar:close-square-bold' : 'solar:hamburger-menu-broken'" width="22" height="22" />
        </button>
      </div>
    </div>

    <LhMegaMenu
      v-if="megaOpen"
      :key="megaFocus"
      :initial-section="megaFocus"
      @close="closeMega"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { buyerRoutes, houseMegaSections } from '@/config/landing-links'
import { houseCopy as copy, houseLogoDark, houseLogoLight } from '@/config/landing-house'
import { useLayoutStore } from '@/stores/layout'
import LhButton from './LhButton.vue'
import LhMegaMenu from './LhMegaMenu.vue'
import LhThemeToggle from './LhThemeToggle.vue'

const { t } = useI18n()
const { layout } = storeToRefs(useLayoutStore())
const { isAuthenticated, dashboardRoute } = useAuthDisplay()

const brandLogoSrc = computed(() => (layout.value.theme === 'dark' ? houseLogoDark : houseLogoLight))

const headerAuthCta = computed(() =>
  isAuthenticated.value
    ? { to: dashboardRoute.value, label: t('auth.continueToKkoo') }
    : { to: buyerRoutes.signIn, label: t('auth.signIn') },
)

const headerRef = ref<HTMLElement | null>(null)
const megaOpen = ref(false)
const megaFocus = ref(houseMegaSections[0]?.key ?? 'products')

const { isLandingPage } = useLandingScroll()

let prevBodyOverflow = ''

function openMega(sectionKey: string) {
  megaFocus.value = sectionKey
  megaOpen.value = true
}

function toggleMega() {
  if (megaOpen.value) {
    closeMega()
    return
  }
  openMega(megaFocus.value)
}

function closeMega() {
  megaOpen.value = false
}

function onBrandClick(event: MouseEvent) {
  if (!isLandingPage.value) return
  event.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  history.replaceState(null, '', window.location.pathname)
}

watch(megaOpen, (open) => {
  if (open) {
    prevBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }
  document.body.style.overflow = prevBodyOverflow
})

const onScroll = () => {
  const header = headerRef.value
  if (!header) return
  header.dataset.scrolled = window.scrollY > 12 ? 'true' : 'false'

  const root = document.querySelector('.lh-root') as HTMLElement | null
  if (root) {
    root.dataset.scrolled = window.scrollY > 12 ? 'true' : 'false'
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && megaOpen.value) closeMega()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = prevBodyOverflow
})
</script>
