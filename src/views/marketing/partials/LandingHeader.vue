<template>
  <header class="mk-header">
    <div class="mk-shell">
      <!-- Mobile & tablet: menu | logo | compact actions -->
      <div class="mk-header__row d-lg-none">
        <button
          type="button"
          class="mk-nav-toggle"
          :aria-expanded="mobileNavOpen ? 'true' : 'false'"
          :aria-controls="mobileNavPanelId"
          :aria-label="mobileNavOpen ? t('landing.a11yCloseMenu') : t('landing.a11yMenuOpen')"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          <Icon :icon="mobileNavOpen ? 'solar:close-circle-bold' : 'solar:hamburger-menu-bold'" />
        </button>

        <router-link to="/" class="mk-header__brand mk-link" @click="closeMobileNav">
          <img :src="headerLogo" alt="KKOO" class="mk-header__logo" />
        </router-link>

        <div class="mk-header__actions mk-header__actions--compact">
          <button
            type="button"
            class="mk-icon-btn"
            :aria-label="isDark ? t('landing.themeSwitchToLight') : t('landing.themeSwitchToDark')"
            @click="toggleTheme"
          >
            <Icon :icon="isDark ? 'solar:sun-2-bold' : 'solar:moon-bold'" />
          </button>
          <b-dropdown variant="link" no-caret menu-class="dropdown-menu-end">
            <template #button-content>
              <span class="mk-lang-btn" :aria-label="currentLocaleName">{{ localeShortLabel }}</span>
            </template>
            <b-dropdown-item
              v-for="option in supportedLocales"
              :key="option.code"
              :active="locale === option.code"
              @click="setLocale(option.code)"
            >
              {{ option.name }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>

      <!-- Desktop -->
      <div class="mk-header__row d-none d-lg-flex">
        <router-link to="/" class="mk-header__brand mk-link">
          <img :src="headerLogo" alt="KKOO" class="mk-header__logo mk-header__logo--lg" />
        </router-link>

        <nav class="mk-nav" aria-label="Primary">
          <router-link
            v-for="item in desktopNavItems"
            :key="item.label"
            :to="item.to"
            class="mk-link mk-nav__link"
          >
            {{ t(item.label) }}
          </router-link>
          <b-dropdown variant="link" no-caret toggle-class="mk-nav__link mk-nav__link--dropdown p-0 border-0 shadow-none text-decoration-none">
            <template #button-content>
              {{ t('landing.navShop') }}
              <Icon icon="solar:alt-arrow-down-linear" class="ms-1" />
            </template>
            <b-dropdown-item
              v-for="vertical in shopVerticals"
              :key="vertical.key"
              :to="vertical.route"
            >
              <Icon :icon="vertical.icon" class="me-2" />
              {{ t(vertical.labelKey) }}
            </b-dropdown-item>
          </b-dropdown>
        </nav>

        <div class="mk-header__actions">
          <button
            type="button"
            class="mk-icon-btn"
            :aria-label="isDark ? t('landing.themeSwitchToLight') : t('landing.themeSwitchToDark')"
            @click="toggleTheme"
          >
            <Icon :icon="isDark ? 'solar:sun-2-bold' : 'solar:moon-bold'" />
          </button>

          <b-dropdown variant="link" no-caret menu-class="dropdown-menu-end">
            <template #button-content>
              <span class="lp-btn-pill lp-btn-pill--ghost lp-btn-pill--sm border-0 p-0 d-inline-flex align-items-center text-decoration-none shadow-none">
                <span class="lp-btn-pill__label d-inline-flex align-items-center gap-1">
                  <Icon icon="solar:global-bold" />
                  <span>{{ currentLocaleName }}</span>
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:alt-arrow-down-linear" class="lp-btn-pill__icon" />
                </span>
              </span>
            </template>
            <b-dropdown-item
              v-for="option in supportedLocales"
              :key="option.code"
              :active="locale === option.code"
              @click="setLocale(option.code)"
            >
              {{ option.name }}
            </b-dropdown-item>
          </b-dropdown>

          <div v-if="isAuthenticated" class="mk-header__signed-in">
            <span class="mk-header__user-name" :title="displayName">
              <Icon icon="solar:user-circle-bold" class="mk-header__user-icon" aria-hidden="true" />
              <span class="mk-header__user-text">{{ displayName }}</span>
            </span>
            <router-link
              :to="dashboardRoute"
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm text-decoration-none text-white d-inline-flex align-items-center"
            >
              <span class="lp-btn-pill__label">{{ t('landing.headerGoToDashboard') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </router-link>
          </div>
          <template v-else>
            <KkooAccountButton variant="accent" size="sm" />

            <router-link
              :to="{ name: 'auth.sign-up' }"
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm text-decoration-none text-white d-inline-flex align-items-center"
            >
              <span class="lp-btn-pill__label">{{ t('landing.heroCtaSignIn') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </router-link>
          </template>
        </div>
      </div>
    </div>

    <b-offcanvas
      :id="mobileNavPanelId"
      v-model="mobileNavOpen"
      placement="end"
      class="mk-mobile-offcanvas"
      @hidden="mobileNavOpen = false"
    >
      <template #header>
        <div class="mk-mobile-offcanvas__head">
          <img :src="headerLogo" alt="KKOO" class="mk-mobile-offcanvas__logo" />
          <b-button
            variant="link"
            class="mk-icon-btn mk-icon-btn--ghost p-0"
            :aria-label="t('landing.a11yCloseMenu')"
            @click="closeMobileNav"
          >
            <Icon icon="solar:close-circle-bold" />
          </b-button>
        </div>
      </template>

      <nav class="mk-mobile-drawer" :aria-label="t('landing.navToggle')">
        <template v-for="item in mobileNavItems" :key="item.label + item.kind">
          <a
            v-if="item.href"
            :href="item.href"
            class="mk-mobile-drawer__link"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMobileNav"
          >
            <Icon v-if="item.icon" :icon="item.icon" class="mk-mobile-drawer__icon" aria-hidden="true" />
            <span>{{ t(item.label) }}</span>
            <Icon icon="solar:square-arrow-right-up-linear" class="mk-mobile-drawer__external" aria-hidden="true" />
          </a>
          <router-link
            v-else-if="item.to"
            :to="item.to"
            class="mk-mobile-drawer__link"
            @click="closeMobileNav"
          >
            <Icon v-if="item.icon" :icon="item.icon" class="mk-mobile-drawer__icon" aria-hidden="true" />
            <span>{{ t(item.label) }}</span>
          </router-link>
        </template>
      </nav>

      <div class="mk-mobile-drawer__footer">
        <div v-if="isAuthenticated" class="mk-mobile-drawer__signed-in">
          <p class="mk-mobile-drawer__signed-in-label mb-1">{{ t('landing.headerSignedInAs') }}</p>
          <p class="mk-mobile-drawer__signed-in-name mb-3">{{ displayName }}</p>
          <router-link
            :to="dashboardRoute"
            class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm w-100 border-0 p-0 d-flex text-decoration-none shadow-none text-white"
            @click="closeMobileNav"
          >
            <span class="lp-btn-pill__label">{{ t('landing.headerGoToDashboard') }}</span>
            <span class="lp-btn-pill__well" aria-hidden="true">
              <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
            </span>
          </router-link>
        </div>
        <template v-else>
          <KkooAccountButton variant="accent" size="sm" block @click="closeMobileNav" />

          <router-link
            :to="{ name: 'auth.sign-up' }"
            class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm w-100 border-0 p-0 d-flex text-decoration-none shadow-none text-white"
            @click="closeMobileNav"
          >
            <span class="lp-btn-pill__label">{{ t('landing.heroCtaSignIn') }}</span>
            <span class="lp-btn-pill__well" aria-hidden="true">
              <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
            </span>
          </router-link>
        </template>
      </div>
    </b-offcanvas>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales, setLocale } from '@/i18n'
import { useLayoutStore } from '@/stores/layout'
import { useKkooAccountAuth } from '@/composables/useKkooAccountAuth'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { buyerRoutes, landingAnchors, shopVerticals, marketingPrograms, bizWebUrl } from '@/config/landing-links'
import logoLight from '@/assets/images/logo-light.svg'

const { t, locale } = useI18n()
const layoutStore = useLayoutStore()
const { layout } = storeToRefs(layoutStore)
const { isAuthenticated, displayName, dashboardRoute } = useKkooAccountAuth()

const mobileNavPanelId = 'mk-landing-mobile-nav'
const mobileNavOpen = ref(false)

const isDark = computed(() => layout.value.theme === 'dark')
const headerLogo = computed(() => logoLight)

function toggleTheme() {
  layoutStore.setTheme(isDark.value ? 'light' : 'dark')
}

function closeMobileNav() {
  mobileNavOpen.value = false
}

watch(isDark, () => {
  mobileNavOpen.value = false
})

const currentLocaleName = computed(() => supportedLocales.find((l) => l.code === locale.value)?.name ?? 'English')

const localeShortLabel = computed(() => {
  const c = locale.value
  if (c === 'en') return 'EN'
  if (c === 'fr') return 'FR'
  if (c === 'sw') return 'SW'
  return String(c).toUpperCase().slice(0, 2)
})

const desktopNavItems = [
  { label: 'landing.navPersonal', to: buyerRoutes.personal },
  { label: 'landing.navBusiness', to: buyerRoutes.business },
  { label: 'landing.navSolutions', to: landingAnchors.solutions },
  { label: 'landing.navOnboarding', to: landingAnchors.work },
  { label: 'landing.navApps', to: landingAnchors.download },
  { label: 'landing.navCommunity', to: buyerRoutes.community },
] as const

type MobileNavItem = {
  label: string
  to?: { name: string; hash?: string }
  href?: string
  icon?: string
  external?: boolean
  kind: string
}

const mobileNavItems = computed((): MobileNavItem[] => [
  { label: 'landing.navHome', to: buyerRoutes.landing, icon: 'solar:home-2-bold', kind: 'route' },
  ...shopVerticals.map((v) => ({
    label: v.labelKey,
    to: v.route,
    icon: v.icon,
    kind: 'route' as const,
  })),
  { label: 'landing.navSolutions', to: landingAnchors.solutions, icon: 'solar:widget-5-bold', kind: 'route' },
  { label: 'landing.navOnboarding', to: landingAnchors.work, icon: 'solar:clipboard-list-bold', kind: 'route' },
  { label: 'landing.navApps', to: landingAnchors.download, icon: 'solar:smartphone-2-bold', kind: 'route' },
  { label: 'landing.navPersonal', to: buyerRoutes.personal, icon: 'solar:user-heart-bold', kind: 'route' },
  { label: 'landing.navSell', to: buyerRoutes.business, icon: 'solar:shop-2-bold', kind: 'route' },
  ...marketingPrograms
    .filter((p) => !['personal', 'business', 'community'].includes(p.key))
    .map((p) => ({
      label: p.labelKey,
      to: p.route,
      icon: p.icon,
      kind: 'route' as const,
    })),
  { label: 'landing.navCommunity', to: buyerRoutes.community, icon: 'solar:users-group-rounded-bold', kind: 'route' },
  { label: 'landing.navBusiness', href: bizWebUrl, icon: 'solar:buildings-3-bold', external: true, kind: 'href' },
])
</script>

<style scoped>
.mk-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.65rem 0;
  min-height: 3.5rem;
}

.mk-header__row.d-lg-flex {
  flex-wrap: nowrap;
  gap: clamp(0.65rem, 1.2vw, 1.25rem);
}

.mk-header__brand {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  text-decoration: none;
}

.mk-header__row.d-lg-flex .mk-header__brand {
  flex: 0 0 auto;
  justify-content: flex-start;
}

.mk-header__logo {
  height: 36px;
  width: auto;
  max-width: min(140px, 42vw);
  object-fit: contain;
}

.mk-header__logo--lg {
  height: 44px;
  max-width: 180px;
}

.mk-header__actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.mk-header__row.d-lg-flex .mk-header__actions {
  gap: 0.45rem;
}

.mk-header__row.d-lg-flex .mk-nav__link {
  font-size: clamp(0.8rem, 0.82vw, 0.88rem);
}

.mk-header__actions--compact {
  gap: 0.25rem;
}

.mk-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid var(--mk-border-strong, rgba(31, 27, 36, 0.12));
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
  color: var(--mk-ink, #1f1b24);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.mk-icon-btn:hover {
  border-color: color-mix(in srgb, var(--mk-primary, #5c308f) 35%, transparent);
  color: var(--mk-primary, #5c308f);
}

.mk-icon-btn--ghost {
  border-color: transparent;
  background: transparent;
}

.mk-lang-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--mk-border-strong, rgba(31, 27, 36, 0.12));
  background: rgba(255, 255, 255, 0.65);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--mk-ink, #1f1b24);
  text-decoration: none;
}

.mk-nav {
  display: flex;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.65rem, 1.5vw, 1.15rem);
  min-width: 0;
}

.mk-header__row.d-lg-flex .mk-nav {
  flex-wrap: nowrap;
  gap: clamp(0.45rem, 0.9vw, 1rem);
}

.mk-nav__link {
  font-weight: 600;
  font-size: 0.9rem;
  color: rgba(20, 19, 22, 0.78);
  text-decoration: none;
  white-space: nowrap;
}

.mk-nav__link--dropdown {
  font-weight: 600;
  font-size: 0.9rem;
  color: rgba(20, 19, 22, 0.78);
}

.mk-nav__link:hover {
  color: var(--mk-primary, #5c308f);
}

html[data-bs-theme='dark'] .mk-nav__link--dropdown {
  color: rgba(255, 255, 255, 0.78);
}


.mk-nav-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  padding: 0;
  border-radius: 999px;
  border: 1px solid var(--mk-border-strong, rgba(31, 27, 36, 0.12));
  background: rgba(255, 255, 255, 0.65);
  color: var(--mk-ink, #1f1b24);
  cursor: pointer;
}

.mk-nav-toggle :deep(svg) {
  width: 1.35rem;
  height: 1.35rem;
}

.mk-mobile-offcanvas :deep(.offcanvas-header) {
  padding: 1rem 1.15rem 0.5rem;
  border-bottom: none;
}

.mk-mobile-offcanvas :deep(.offcanvas-body) {
  padding: 0.75rem 1.15rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.mk-mobile-offcanvas__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.75rem;
}

.mk-mobile-offcanvas__logo {
  height: 38px;
  width: auto;
  max-width: 130px;
  object-fit: contain;
}

.mk-mobile-drawer {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.mk-mobile-drawer__link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.95rem 1rem;
  border-radius: 0.85rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: rgba(20, 19, 22, 0.88);
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease;
}

.mk-mobile-drawer__link:hover,
.mk-mobile-drawer__link.router-link-active {
  background: rgba(92, 48, 143, 0.08);
  color: var(--mk-primary, #5c308f);
}

.mk-mobile-drawer__icon {
  width: 1.35rem;
  height: 1.35rem;
  flex-shrink: 0;
  opacity: 0.85;
}

.mk-mobile-drawer__external {
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  opacity: 0.55;
}

.mk-mobile-drawer__footer {
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(31, 27, 36, 0.08);
}

.mk-header__signed-in {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.mk-header__user-name {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  max-width: 11rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(20, 19, 22, 0.82);
}

.mk-header__user-icon {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  color: var(--mk-primary, #5c308f);
}

.mk-header__user-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mk-mobile-drawer__signed-in-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(20, 19, 22, 0.55);
}

.mk-mobile-drawer__signed-in-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: rgba(20, 19, 22, 0.9);
}

html[data-bs-theme='dark'] .mk-icon-btn,
html[data-bs-theme='dark'] .mk-lang-btn,
html[data-bs-theme='dark'] .mk-nav-toggle {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.9);
}

html[data-bs-theme='dark'] .mk-mobile-drawer__link {
  color: rgba(255, 255, 255, 0.9);
}

html[data-bs-theme='dark'] .mk-mobile-drawer__link:hover,
html[data-bs-theme='dark'] .mk-mobile-drawer__link.router-link-active {
  background: rgba(255, 255, 255, 0.06);
  color: var(--mk-secondary, #f7a829);
}

html[data-bs-theme='dark'] .mk-nav__link {
  color: rgba(255, 255, 255, 0.78);
}

html[data-bs-theme='dark'] .mk-header__user-name,
html[data-bs-theme='dark'] .mk-mobile-drawer__signed-in-name {
  color: rgba(255, 255, 255, 0.9);
}

html[data-bs-theme='dark'] .mk-mobile-drawer__signed-in-label {
  color: rgba(255, 255, 255, 0.55);
}
</style>
