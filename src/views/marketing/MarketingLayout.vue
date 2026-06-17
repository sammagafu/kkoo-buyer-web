<template>
  <div class="landing-page lp-layout" :class="{ 'lp-landing-snap': landingSnap }">
    <!-- Use the same top navbar as Landing page -->
    <LandingHeader />

    <!-- Keep legacy header markup but disable rendering -->
    <header v-if="false" class="lp-header">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <!-- Tablet / phone: hamburger | logo | lang + CTA (avoids cramped nav at md) -->
        <div class="d-flex d-lg-none align-items-center justify-content-between py-3 py-sm-4 gap-2 lp-header-mobile">
          <b-button
            variant="link"
            size="sm"
            class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--sm lp-btn-pill--solo border-0 lp-mobile-menu-btn text-decoration-none shadow-none flex-shrink-0"
            :aria-label="t('landing.a11yMenuOpen')"
            @click="mobileMenuOpen = true"
          >
            <Icon icon="solar:hamburger-menu-broken" class="lp-btn-pill__icon lp-mobile-menu-hamburger-icon" />
          </b-button>
          <router-link
            to="/"
            class="d-flex align-items-center justify-content-center lp-logo-link lp-header-logo-mobile flex-grow-1 min-w-0 mx-1 text-decoration-none"
          >
            <img :src="brandLogoSrc" alt="KKOO" class="lp-header-logo-mark" />
          </router-link>
          <div class="d-flex align-items-center gap-1 gap-sm-2 flex-shrink-0 lp-header-mobile-actions">
            <button
              v-if="showThemeToggle"
              type="button"
              class="lp-theme-switch d-none d-sm-inline-flex"
              :class="{ 'lp-theme-switch--dark': layout.theme === 'dark' }"
              role="switch"
              :aria-checked="layout.theme === 'dark'"
              :aria-label="layout.theme === 'dark' ? t('landing.themeSwitchToLight') : t('landing.themeSwitchToDark')"
              @click="toggleMarketingTheme"
            >
              <span class="lp-theme-switch-track">
                <span class="lp-theme-switch-knob" aria-hidden="true" />
                <Icon icon="solar:sun-2-bold" class="lp-theme-switch-icon lp-theme-switch-icon--sun" aria-hidden="true" />
                <Icon icon="solar:moon-bold" class="lp-theme-switch-icon lp-theme-switch-icon--moon" aria-hidden="true" />
              </span>
            </button>
            <b-dropdown
              variant="link"
              size="sm"
              no-caret
              toggle-class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--sm lp-app-launcher-trigger border-0 p-0 d-inline-flex align-items-center justify-content-center text-decoration-none shadow-none"
              menu-class="dropdown-menu-end lp-app-launcher-menu"
            >
              <template #button-content>
                <Icon icon="solar:widget-4-bold" class="lp-app-launcher-trigger-icon" />
              </template>
              <div class="lp-app-launcher-panel">
                <div class="lp-app-launcher-head">
                  <div>
                    <p class="lp-app-launcher-title mb-0">All apps</p>
                    <p class="lp-app-launcher-copy mb-0">Open any KKOO experience from one menu.</p>
                  </div>
                </div>
                <div v-if="isAuthenticated" class="lp-app-launcher-account">
                  <div class="lp-app-launcher-account-head">
                    <span class="lp-app-launcher-account-avatar">
                      <Icon icon="solar:user-circle-bold-duotone" />
                    </span>
                    <div>
                      <p class="lp-app-launcher-account-label mb-0">Signed in</p>
                      <p class="lp-app-launcher-account-name mb-0">{{ signedInName }}</p>
                    </div>
                  </div>
                  <div class="lp-app-launcher-role-row">
                    <button
                      v-for="roleOption in roleSwitchOptions"
                      :key="roleOption.role"
                      type="button"
                      class="lp-app-launcher-role-chip"
                      :class="{ 'lp-app-launcher-role-chip--active': activeAccountRole === roleOption.role }"
                      @click="switchLauncherRole(roleOption.role)"
                    >
                      <Icon :icon="roleOption.icon" />
                      <span>{{ roleOption.label }}</span>
                    </button>
                  </div>
                </div>
                <div class="lp-app-launcher-grid">
                  <component
                    v-for="item in appLauncherItems"
                    :key="item.label"
                    :is="item.href ? 'a' : 'router-link'"
                    :href="item.href"
                    :to="item.to"
                    class="lp-app-launcher-item"
                    :target="item.href ? '_blank' : undefined"
                    :rel="item.href ? 'noopener noreferrer' : undefined"
                  >
                    <span class="lp-app-launcher-item-icon">
                      <Icon :icon="item.icon" />
                    </span>
                    <span class="lp-app-launcher-item-label">{{ item.label }}</span>
                  </component>
                </div>
              </div>
            </b-dropdown>
            <b-dropdown
              variant="link"
              size="sm"
              no-caret
              :toggle-class="
                showThemeToggle
                  ? 'lp-btn-pill lp-btn-pill--ghost lp-btn-pill--sm border-0 p-0 d-inline-flex align-items-center lp-lang-toggle lp-lang-toggle--compact text-decoration-none shadow-none'
                  : 'lp-btn-pill lp-btn-pill--ghost lp-btn-pill--sm border-0 p-0 d-inline-flex align-items-center lp-lang-toggle text-decoration-none shadow-none'
              "
              menu-class="dropdown-menu-end"
            >
              <template #button-content>
                <span v-if="showThemeToggle" class="lp-lang-label-compact">{{ localeShortLabel }}</span>
                <span v-else class="lp-lang-label lp-btn-pill__label">{{ currentLocaleName }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:alt-arrow-down-linear" class="lp-btn-pill__icon" />
                </span>
              </template>
              <b-dropdown-item
                v-for="loc in supportedLocales"
                :key="loc.code"
                :active="locale === loc.code"
                @click="setLocale(loc.code)"
              >
                {{ loc.name }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>

        <!-- Desktop lg+: brand + full landing nav (same anchors as home /) -->
        <div class="d-none d-lg-flex align-items-center gap-2 gap-xl-3 py-3 w-100 lp-header-inner">
          <router-link to="/" class="d-flex align-items-center gap-2 lp-logo-link lp-header-brand flex-shrink-0 text-decoration-none">
            <img :src="brandLogoSrc" alt="KKOO" class="lp-logo-img" />
          </router-link>
          <nav
            class="d-flex align-items-center justify-content-start flex-wrap gap-1 gap-lg-2 gap-xl-3 lp-nav-links lp-header-nav flex-grow-1 min-w-0"
            aria-label="Primary"
          >
            <router-link
              v-for="item in primaryNavItems"
              :key="item.key"
              :to="item.route"
              class="lp-nav-link"
            >
              {{ t(item.labelKey) }}
            </router-link>
          </nav>
          <div class="d-flex align-items-center gap-2 flex-shrink-0 ms-auto lp-header-actions">
            <button
              v-if="showThemeToggle"
              type="button"
              class="lp-theme-switch"
              :class="{ 'lp-theme-switch--dark': layout.theme === 'dark' }"
              role="switch"
              :aria-checked="layout.theme === 'dark'"
              :aria-label="layout.theme === 'dark' ? t('landing.themeSwitchToLight') : t('landing.themeSwitchToDark')"
              @click="toggleMarketingTheme"
            >
              <span class="lp-theme-switch-track">
                <span class="lp-theme-switch-knob" aria-hidden="true" />
                <Icon icon="solar:sun-2-bold" class="lp-theme-switch-icon lp-theme-switch-icon--sun" aria-hidden="true" />
                <Icon icon="solar:moon-bold" class="lp-theme-switch-icon lp-theme-switch-icon--moon" aria-hidden="true" />
              </span>
            </button>
            <KkooAccountButton v-if="!isAuthenticated" variant="accent" size="sm" />
            <b-button
              v-else
              variant="link"
              size="sm"
              class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm border-0 p-0 d-inline-flex align-items-center text-decoration-none shadow-none"
              :to="accountButtonRoute"
            >
              <span class="lp-btn-pill__label">{{ accountButtonLabel }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </b-button>
            <b-button
              variant="link"
              size="sm"
              class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--sm border-0 p-0 d-inline-flex align-items-center text-decoration-none shadow-none"
              :to="landingAnchors.download"
            >
              <span class="lp-btn-pill__label">{{ t('landing.headerGetApp') }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:smartphone-2-bold" class="lp-btn-pill__icon" />
              </span>
            </b-button>
            <b-dropdown variant="link" size="sm" no-caret toggle-class="lp-btn-pill lp-btn-pill--ghost lp-btn-pill--sm border-0 p-0 d-inline-flex align-items-center lp-lang-toggle text-decoration-none shadow-none" menu-class="dropdown-menu-end">
              <template #button-content>
                <span class="lp-lang-label lp-btn-pill__label">{{ currentLocaleName }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:alt-arrow-down-linear" class="lp-btn-pill__icon" />
                </span>
              </template>
              <b-dropdown-item
                v-for="loc in supportedLocales"
                :key="loc.code"
                :active="locale === loc.code"
                @click="setLocale(loc.code)"
              >
                {{ loc.name }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </b-container>

      <b-offcanvas v-model="mobileMenuOpen" placement="end" title="" class="lp-mobile-offcanvas" @hidden="mobileMenuOpen = false">
        <template #header>
          <div class="d-flex align-items-center justify-content-between w-100 gap-2 lp-mobile-offcanvas-header">
            <img :src="brandLogoSrc" alt="KKOO" class="lp-offcanvas-logo flex-shrink-0" width="120" height="40" />
            <p class="lp-mobile-menu-tagline flex-grow-1 text-center mb-0 px-1 min-w-0">
              {{ t('landing.mobileMenuTagline') }}
            </p>
            <b-button variant="link" size="sm" class="p-0 text-body lp-mobile-offcanvas-close" :aria-label="t('landing.a11yCloseMenu')" @click="mobileMenuOpen = false">
              <Icon icon="solar:close-circle-broken" class="lp-mobile-offcanvas-close-icon" />
            </b-button>
          </div>
        </template>
        <nav class="d-flex flex-column gap-2 mb-4 lp-mobile-drawer-nav" aria-label="Primary">
          <router-link
            v-for="item in primaryNavItems"
            :key="item.key"
            :to="item.route"
            class="lp-nav-link py-3"
            @click="mobileMenuOpen = false"
          >
            {{ t(item.labelKey) }}
          </router-link>
          <router-link :to="landingAnchors.download" class="lp-nav-link py-3" @click="mobileMenuOpen = false">
            {{ t('landing.headerGetApp') }}
          </router-link>
        </nav>
        <div class="mb-4 d-flex flex-column gap-2">
          <KkooAccountButton v-if="!isAuthenticated" variant="accent" size="sm" block @click="mobileMenuOpen = false" />
          <b-button
            v-else
            variant="link"
            class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm w-100 border-0 p-0 d-flex text-decoration-none shadow-none"
            :to="accountButtonRoute"
            @click="mobileMenuOpen = false"
          >
            <span class="lp-btn-pill__label">{{ accountButtonLabel }}</span>
            <span class="lp-btn-pill__well" aria-hidden="true">
              <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
            </span>
          </b-button>
        </div>
        <div v-if="showThemeToggle" class="d-flex align-items-center justify-content-between gap-3 mb-3 px-1">
          <span class="small fw-semibold text-body-secondary mb-0">{{ t('landing.themeModeLabel') }}</span>
          <button
            type="button"
            class="lp-theme-switch"
            :class="{ 'lp-theme-switch--dark': layout.theme === 'dark' }"
            role="switch"
            :aria-checked="layout.theme === 'dark'"
            :aria-label="layout.theme === 'dark' ? t('landing.themeSwitchToLight') : t('landing.themeSwitchToDark')"
            @click="toggleMarketingTheme"
          >
            <span class="lp-theme-switch-track">
              <span class="lp-theme-switch-knob" aria-hidden="true" />
              <Icon icon="solar:sun-2-bold" class="lp-theme-switch-icon lp-theme-switch-icon--sun" aria-hidden="true" />
              <Icon icon="solar:moon-bold" class="lp-theme-switch-icon lp-theme-switch-icon--moon" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div class="mb-3">
          <b-dropdown variant="link" size="sm" no-caret class="w-100" toggle-class="lp-btn-pill lp-btn-pill--ghost lp-btn-pill--sm lp-btn-pill--lang border-0 p-0 d-flex align-items-center w-100 text-decoration-none shadow-none" menu-class="dropdown-menu-end">
            <template #button-content>
              <span class="lp-lang-label lp-btn-pill__label">{{ currentLocaleName }}</span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:alt-arrow-down-linear" class="lp-btn-pill__icon" />
              </span>
            </template>
            <b-dropdown-item v-for="loc in supportedLocales" :key="loc.code" :active="locale === loc.code" @click="setLocale(loc.code)">{{ loc.name }}</b-dropdown-item>
          </b-dropdown>
        </div>
      </b-offcanvas>
    </header>

    <main class="lp-main flex-grow-1">
      <slot />
    </main>

    <!-- Anchor keeps slotted <footer> in column flex (margin-top:auto on inner footer is not enough if slot root is anonymous) -->
    <div class="lp-footer-anchor">
      <slot name="footer">
        <LandingFooter />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { ROLES } from '@/acl'
import { supportedLocales, setLocale } from '@/i18n'
import { appLinks } from '@/config/app-links'
import { useLayoutStore } from '@/stores/layout'
import { BUYER_ACCOUNT_ROLE, useAuthStore, type AccountRole } from '@/stores/auth'
import LandingHeader from '@/views/marketing/partials/LandingHeader.vue'
import LandingFooter from '@/views/marketing/partials/LandingFooter.vue'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { buyerRoutes, landingAnchors, primaryNavItems, bizWebUrl } from '@/config/landing-links'
import logoLight from '@/assets/images/logo-light.svg'
import logoDark from '@/assets/images/logo-dark.svg'

withDefaults(
  defineProps<{
    /** Home page: section scroll-snap */
    landingSnap?: boolean
    /** Home page: light/dark toggle in header + drawer */
    showThemeToggle?: boolean
  }>(),
  { landingSnap: false, showThemeToggle: false }
)

const { t, locale } = useI18n()
const router = useRouter()
const mobileMenuOpen = ref(false)

const layoutStore = useLayoutStore()
const { layout } = storeToRefs(layoutStore)
const auth = useAuthStore()
const { user, isAuthenticated, availableAccountRoles, activeAccountRole } = storeToRefs(auth)

const brandLogoSrc = computed(() => (layout.value.theme === 'dark' ? logoDark : logoLight))

function toggleMarketingTheme() {
  layoutStore.setTheme(layout.value.theme === 'dark' ? 'light' : 'dark')
}

const currentLocaleName = computed(() => supportedLocales.find((l) => l.code === locale.value)?.name ?? 'English')

const localeShortLabel = computed(() => {
  const c = locale.value
  if (c === 'en') return 'EN'
  if (c === 'fr') return 'FR'
  if (c === 'sw') return 'SW'
  return String(c).toUpperCase().slice(0, 2)
})

const accountRoleMeta: Record<AccountRole, { label: string; icon: string }> = {
  [BUYER_ACCOUNT_ROLE]: { label: 'Buyer', icon: 'solar:cart-large-2-bold' },
  [ROLES.SELLER]: { label: 'Seller', icon: 'solar:shop-2-bold' },
  [ROLES.ADMIN]: { label: 'Admin', icon: 'solar:shield-user-bold' },
  [ROLES.STAFF]: { label: 'Staff', icon: 'solar:users-group-rounded-bold' },
  [ROLES.CRM_MEMBER]: { label: 'Business team', icon: 'solar:buildings-3-bold' },
}

function routeForAccountRole(role: AccountRole) {
  switch (role) {
    case BUYER_ACCOUNT_ROLE:
      return buyerRoutes.account
    case ROLES.SELLER:
    case ROLES.CRM_MEMBER:
      return buyerRoutes.business
    case ROLES.ADMIN:
    case ROLES.STAFF:
      return buyerRoutes.landing
  }
}

const signedInName = computed(() => {
  const currentUser = user.value
  return (
    currentUser?.full_name ||
    [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ') ||
    currentUser?.username ||
    currentUser?.phone_number ||
    'Your account'
  )
})

const roleSwitchOptions = computed(() =>
  availableAccountRoles.value.map((role) => ({
    role,
    label: accountRoleMeta[role].label,
    icon: accountRoleMeta[role].icon,
  }))
)

const appLauncherItems = computed(() => {
  const items: Array<{ label: string; icon: string; to?: { name: string }; href?: string }> = [
    { label: 'Buyer account', icon: 'solar:user-circle-bold', to: isAuthenticated.value ? buyerRoutes.account : buyerRoutes.signIn },
    { label: 'Marketplace', icon: 'solar:cart-large-2-bold', to: buyerRoutes.marketplace },
    { label: 'Groceries', icon: 'solar:bag-2-bold', to: buyerRoutes.grocery },
    { label: 'Eats', icon: 'solar:cup-hot-bold', to: buyerRoutes.eats },
    { label: 'Send', icon: 'solar:box-bold', to: buyerRoutes.send },
    { label: 'Hotels', icon: 'solar:bed-bold', to: buyerRoutes.booking },
    { label: 'Rides', icon: 'solar:scooter-bold', to: buyerRoutes.ride },
    { label: 'Checkout', icon: 'solar:bill-list-bold', to: buyerRoutes.checkout },
    { label: 'Favorites', icon: 'solar:heart-pulse-bold', to: buyerRoutes.favorites },
    { label: 'Compare', icon: 'solar:widget-5-bold', to: buyerRoutes.compare },
    { label: 'Community', icon: 'solar:users-group-rounded-bold', to: buyerRoutes.community },
    { label: 'Share & earn', icon: 'solar:gift-bold', to: { name: 'pages.share-earn' } },
    { label: 'Vouchers', icon: 'solar:ticket-bold', to: { name: 'pages.vouchers' } },
    { label: 'Business', icon: 'solar:shop-2-bold', to: buyerRoutes.business },
    { label: 'Merchants', icon: 'solar:bag-5-bold', to: { name: 'pages.merchant' } },
  ]

  if (availableAccountRoles.value.includes(ROLES.SELLER)) {
    items.push({ label: 'Seller portal', icon: 'solar:shop-2-bold', href: bizWebUrl })
  } else {
    items.push({ label: 'Create business', icon: 'solar:add-circle-bold', to: buyerRoutes.sellerRegister })
  }

  return items
})

const accountButtonRoute = computed(() => (isAuthenticated.value ? buyerRoutes.account : buyerRoutes.marketplace))
const accountButtonLabel = computed(() => (isAuthenticated.value ? 'My account' : t('landing.ctaShopOnWeb')))

async function switchLauncherRole(role: AccountRole) {
  auth.setActiveAccountRole(role)
  mobileMenuOpen.value = false
  if (role === ROLES.SELLER || role === ROLES.CRM_MEMBER) {
    window.location.href = bizWebUrl
    return
  }
  await router.push(routeForAccountRole(role))
}
</script>

<style scoped>
.lp-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--lp-landing-paper, var(--bs-body-bg));
  color: var(--bs-body-color);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  /*
   * Golden ratio (φ) — spacing + type rhythm for all marketing routes.
   * Landing.vue adds a fuller KKOO set on the same root via :deep(.landing-page.lp-layout).
   */
  --lp-phi: 1.6180339887;
  --lp-inv-phi: 0.6180339887;
  --lp-heading-lh: calc(var(--lp-phi) * 0.83);
  --lp-rhythm-phi: calc(1rem * var(--lp-phi));
  --lp-rhythm-phi2: calc(1rem * var(--lp-phi) * var(--lp-phi));
  --lp-rhythm-phi3: calc(1rem * var(--lp-phi) * var(--lp-phi) * var(--lp-phi));
  --lp-prose-max: min(65ch, 42rem);
  --lp-prose-lh: var(--lp-phi);
  --lp-section-py: var(--lp-rhythm-phi2);
  --lp-section-py-md: var(--lp-rhythm-phi3);
  --lp-section-py-sm: calc(var(--lp-rhythm-phi) * var(--lp-phi));
  --lp-section-inner-gap: var(--lp-rhythm-phi);
  --lp-content-gap: calc(var(--lp-rhythm-phi) * var(--lp-inv-phi));
  /* 8px grid — shared with landing; use for padding/gaps where precision helps */
  --lp-grid-8: 0.5rem;
  --lp-space-1: 0.25rem;
  --lp-space-2: 0.5rem;
  --lp-space-3: 0.75rem;
  --lp-space-4: 1rem;
  --lp-space-5: 1.25rem;
  --lp-space-6: 1.5rem;
  --lp-space-8: 2rem;
  --lp-space-10: 2.5rem;
  --lp-space-12: 3rem;
  --lp-touch-target: 2.75rem;
  --lp-inline-gap-xs: var(--lp-space-1);
  --lp-inline-gap-sm: var(--lp-space-2);
  /* Shared with landing cards / bento — same squircle + inset rhythm as hero stat tiles */
  --lp-radius-card: clamp(1.35rem, 2vw, 1.75rem);
  --lp-radius-card-inner: clamp(0.85rem, 1.1vw, 1.1rem);
  --lp-stat-tile-padding: 1rem 1rem 1rem 0.875rem;
  --lp-stat-tile-padding-sm: 0.75rem 0.6rem 0.75rem 0.45rem;
  --lp-surface-tile-padding: 1.35rem 1.65rem 1.35rem 1.65rem;
  --lp-surface-tile-padding-lg: 1.6rem 1.9rem 1.6rem 1.9rem;
  --lp-surface-card-bg: linear-gradient(
    180deg,
    var(--bs-body-bg) 0%,
    rgba(var(--bs-primary-rgb, 92, 48, 143), 0.1) 100%
  );
  --lp-surface-card-border: rgba(var(--bs-primary-rgb, 92, 48, 143), 0.28);
  --lp-surface-card-shadow: 0 10px 36px rgba(var(--bs-primary-rgb, 92, 48, 143), 0.12);
  --lp-surface-card-hover-border: rgba(var(--bs-primary-rgb, 92, 48, 143), 0.4);
  /* Main column gutter — matches header `px-3` / `px-sm-4`; lg matches landing `--lp-page-container-px-lg` */
  --lp-page-container-px: var(--lp-space-4);
  --lp-page-container-px-lg: var(--lp-space-8);
}

@media (min-width: 576px) {
  .lp-layout {
    --lp-page-container-px: var(--lp-space-6);
  }
}

/* Vertical rhythm for every marketing band (legal, landing, business, etc.) */
.lp-layout :deep(section.lp-section) {
  box-sizing: border-box;
  padding-top: var(--lp-section-py);
  padding-bottom: var(--lp-section-py);
  padding-left: 0;
  padding-right: 0;
}

@media (min-width: 992px) {
  .lp-layout :deep(section.lp-section) {
    padding-top: var(--lp-section-py-md);
    padding-bottom: var(--lp-section-py-md);
  }
}

@media (max-width: 575.98px) {
  .lp-layout :deep(section.lp-section) {
    padding-top: var(--lp-section-py-sm);
    padding-bottom: var(--lp-section-py-sm);
  }

  .lp-layout {
    --lp-surface-tile-padding: 1.65rem 1.85rem 1.65rem 1.85rem;
    --lp-stat-tile-padding-sm: 0.95rem 0.85rem 0.95rem 0.75rem;
  }
}

.lp-layout :deep(.context-nav) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--lp-space-3);
  padding: 0.85rem 1.1rem;
  margin: 0.5rem var(--lp-page-container-px) 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.18);
  background:
    radial-gradient(circle at 82% 18%, rgba(247, 168, 41, 0.14), transparent 36%),
    linear-gradient(120deg, rgba(92, 48, 143, 0.08), rgba(255, 255, 255, 0.92));
  box-shadow: 0 12px 34px rgba(35, 20, 46, 0.12);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0.75rem;
  z-index: 5;
}

.lp-layout :deep(.context-nav-left),
.lp-layout :deep(.context-nav-right) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--lp-space-2);
}

.lp-layout :deep(.context-nav-link) {
  padding: 0.55rem 0.85rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.14);
  background: rgba(255, 255, 255, 0.72);
  color: var(--bs-body-color);
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.lp-layout :deep(.context-nav-link:hover) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(35, 20, 46, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.lp-layout :deep(.context-nav-pill) {
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(247, 168, 41, 0.3);
  background: linear-gradient(135deg, rgba(247, 168, 41, 0.18), rgba(92, 48, 143, 0.12));
  color: #5c308f;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.lp-layout :deep(.context-nav-pill:hover) {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(35, 20, 46, 0.12);
}

@media (max-width: 767.98px) {
  .lp-layout :deep(.context-nav) {
    flex-direction: column;
    align-items: stretch;
    top: 0.5rem;
  }

  .lp-layout :deep(.context-nav-left),
  .lp-layout :deep(.context-nav-right) {
    width: 100%;
    justify-content: flex-start;
  }
}

/* Horizontal inset for primary content wrappers (investors on /business, etc.; landing uses the same spacing scale when loaded) */
.lp-layout :deep(.lp-page-container) {
  box-sizing: border-box;
  padding-left: var(--lp-page-container-px);
  padding-right: var(--lp-page-container-px);
}

@media (min-width: 992px) {
  .lp-layout :deep(.lp-page-container) {
    padding-left: var(--lp-page-container-px-lg);
    padding-right: var(--lp-page-container-px-lg);
  }
}

/* Light mode: warm beige surfaces + dark purple ink (replaces default white/black) */
html:not([data-bs-theme='dark']) .lp-layout {
  --lp-cream: #faf6f0;
  --lp-cream-rgb: 250, 246, 240;
  --lp-beige: #f0e8df;
  --lp-beige-rgb: 240, 232, 223;
  --lp-beige-muted: #e5dbd0;
  --lp-beige-paper: #ede4d8;
  --lp-ink: #2a1836;
  --lp-ink-rgb: 42, 24, 54;
  --lp-text-on-purple: var(--lp-cream);
  --lp-landing-paper: var(--lp-beige-paper);
  --lp-landing-paper-muted: var(--lp-beige-muted);
  --lp-section-label: color-mix(in srgb, var(--lp-ink) 84%, var(--lp-beige) 16%);
  --lp-section-light-bg: color-mix(in srgb, var(--lp-beige) 82%, var(--lp-cream) 18%);
  --lp-section-white-bg: var(--lp-cream);
  --lp-card-bg: var(--lp-cream);
  --lp-heading-ink: var(--lp-ink);
  --lp-body-ink: color-mix(in srgb, var(--lp-ink) 74%, var(--lp-beige) 26%);
  --lp-text-body: var(--lp-body-ink);
  --lp-accent-on-purple-tint: var(--kkoo-accent-dark, #e8940f);
  --lp-accent-on-gold-tint: var(--kkoo-primary-dark, #3b1a5a);
  --lp-text-soft: color-mix(in srgb, var(--lp-ink) 56%, var(--lp-beige) 44%);
  --lp-text-quote: color-mix(in srgb, var(--lp-ink) 78%, var(--lp-beige) 22%);
  --lp-text-faint: color-mix(in srgb, var(--lp-ink) 44%, var(--lp-beige) 56%);
  --lp-border-color: color-mix(in srgb, var(--lp-ink) 12%, var(--lp-beige) 88%);
  --lp-gold-on-light: #c97c00;
  --bs-body-bg: var(--lp-beige);
  --bs-body-bg-rgb: var(--lp-beige-rgb);
  --bs-body-color: var(--lp-ink);
  --bs-body-color-rgb: var(--lp-ink-rgb);
  --bs-emphasis-color: var(--lp-ink);
  --bs-emphasis-color-rgb: var(--lp-ink-rgb);
  --bs-heading-color: var(--lp-ink);
  --bs-primary: var(--lp-ink);
  --bs-primary-text-emphasis: var(--lp-ink);
  --bs-secondary-color: color-mix(in srgb, var(--lp-ink) 58%, var(--lp-beige) 42%);
  --bs-tertiary-bg: var(--lp-beige-muted);
  --bs-border-color: color-mix(in srgb, var(--lp-ink) 12%, var(--lp-beige) 88%);
  --lp-switch-knob: var(--lp-cream);
}

html:not([data-bs-theme='dark']) .lp-layout .text-white {
  color: var(--lp-cream) !important;
}

html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color: rgb(88, 15, 168)']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color:rgb(88, 15, 168)']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color:#5C308F']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color: #5C308F']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color:#580FA8']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color: #580FA8']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color:#5C308F']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color: #5C308F']) {
  color: var(--lp-ink) !important;
}

html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color: white']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color:white']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color: #fff']),
html:not([data-bs-theme='dark']) .lp-layout :deep([style*='color:#fff']) {
  color: var(--lp-cream) !important;
}

/* Marketing pages without Landing.vue still get readable dark surfaces */
html[data-bs-theme='dark'] .lp-layout {
  --lp-cream: #f5ede3;
  --lp-cream-rgb: 245, 237, 227;
  --lp-beige: #1d1820;
  --lp-beige-rgb: 29, 24, 32;
  --lp-beige-muted: #17121a;
  --lp-beige-paper: #120f16;
  --lp-ink: #f5ede3;
  --lp-ink-rgb: 245, 237, 227;
  --lp-text-on-purple: #fff6ef;
  --lp-landing-paper: #100c14;
  --lp-landing-paper-muted: #17111d;
  --lp-section-label: color-mix(in srgb, var(--lp-cream) 82%, var(--lp-beige) 18%);
  --lp-section-light-bg: color-mix(in srgb, var(--lp-landing-paper-muted) 92%, white 8%);
  --lp-section-white-bg: #1a141d;
  --lp-card-bg: #17121b;
  --lp-heading-ink: var(--lp-cream);
  --lp-body-ink: color-mix(in srgb, var(--lp-cream) 74%, #87798d 26%);
  --lp-text-body: var(--lp-body-ink);
  --lp-accent-on-purple-tint: var(--kkoo-gold-light, #f8b44b);
  --lp-accent-on-gold-tint: var(--kkoo-accent-light, #c9a0e8);
  --lp-text-soft: color-mix(in srgb, var(--lp-cream) 58%, #72677c 42%);
  --lp-text-quote: color-mix(in srgb, var(--lp-cream) 86%, #7b7084 14%);
  --lp-text-faint: color-mix(in srgb, var(--lp-cream) 44%, #655b70 56%);
  --lp-border-color: rgba(255, 255, 255, 0.1);
  --lp-gold-on-light: #f7b343;
  --bs-body-bg: var(--lp-landing-paper);
  --bs-body-bg-rgb: 16, 12, 20;
  --bs-body-color: #eadfd1;
  --bs-body-color-rgb: 234, 223, 209;
  --bs-emphasis-color: #fff4e8;
  --bs-emphasis-color-rgb: 255, 244, 232;
  --bs-heading-color: #fff4e8;
  --bs-secondary-color: color-mix(in srgb, var(--lp-cream) 62%, #72677c 38%);
  --bs-tertiary-bg: #17121b;
  --bs-border-color: rgba(255, 255, 255, 0.09);
  --lp-surface-card-bg: linear-gradient(
    180deg,
    rgba(27, 20, 32, 0.98) 0%,
    rgba(16, 12, 20, 0.96) 100%
  );
  --lp-surface-card-border: rgba(255, 255, 255, 0.08);
  --lp-surface-card-shadow: 0 18px 46px rgba(0, 0, 0, 0.32);
  --lp-surface-card-hover-border: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.34);
  --lp-switch-knob: #f6efe7;
}

.lp-header {
  position: sticky;
  top: 0;
  z-index: 1030;
  background: color-mix(in srgb, var(--lp-landing-paper, var(--bs-body-bg)) 94%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--bs-border-color) 78%, transparent);
  backdrop-filter: blur(18px);
  overflow: visible;
}

.lp-header::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 0%, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.1), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent);
  opacity: 0.9;
}

html[data-bs-theme='dark'] .lp-header {
  background: color-mix(in srgb, var(--lp-landing-paper) 84%, transparent);
  border-bottom-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

html[data-bs-theme='dark'] .lp-header::before {
  background:
    radial-gradient(circle at 12% 0%, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.12), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 46%);
  opacity: 1;
}

.lp-header :deep(.dropdown-menu) {
  z-index: 1035;
}

.lp-logo-link {
  text-decoration: none;
  min-width: 0;
}

.lp-header-mobile {
  /* Room for taller centered mark + py-3 / touch-aligned actions */
  min-height: 4rem;
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  padding-inline: 0;
  border-radius: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.lp-header-mobile-actions {
  min-width: 0;
}

.lp-header-logo-mobile {
  flex: 1 1 0;
  min-width: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-header-logo-mark {
  height: clamp(2.125rem, 5vw + 1.1rem, 2.5rem);
  width: auto;
  max-width: min(168px, 50vw);
  object-fit: contain;
  display: block;
}

@media (min-width: 400px) {
  .lp-header-logo-mark {
    max-width: min(176px, 44vw);
  }
}

@media (min-width: 576px) {
  .lp-header-logo-mark {
    height: 2.5rem;
    max-width: min(184px, 38vw);
  }
}

.lp-mobile-menu-btn {
  min-width: 2.875rem;
  min-height: 2.875rem;
  padding: 0.5rem 0.55rem !important;
  align-items: center;
  justify-content: center;
}

.lp-mobile-menu-hamburger-icon {
  font-size: 1.65rem !important;
  width: 1em !important;
  height: 1em !important;
  color: var(--bs-emphasis-color);
}

@media (min-width: 576px) {
  .lp-mobile-menu-btn {
    min-width: 3rem;
    min-height: 3rem;
  }

  .lp-mobile-menu-hamburger-icon {
    font-size: 1.75rem !important;
  }
}

.lp-mobile-menu-tagline {
  font-size: clamp(0.95rem, 3.8vw, 1.2rem);
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.32;
  color: var(--bs-emphasis-color);
  hyphens: auto;
  overflow-wrap: anywhere;
}

@media (min-width: 400px) {
  .lp-mobile-menu-tagline {
    font-size: clamp(1.02rem, 3.2vw, 1.28rem);
  }
}

.lp-mobile-offcanvas :deep(.offcanvas-header) {
  padding-inline: clamp(1.1rem, 4vw, 1.5rem);
  padding-block: clamp(1.15rem, 3.5vw, 1.65rem);
}

.lp-mobile-offcanvas :deep(.offcanvas-body) {
  padding-inline: clamp(1.1rem, 4vw, 1.5rem);
  padding-block: clamp(1.1rem, 3vw, 1.5rem);
}

.lp-mobile-offcanvas-header {
  align-items: center;
}

.lp-mobile-drawer-nav .lp-nav-link {
  font-size: 1.02rem;
}

@media (min-width: 400px) {
  .lp-mobile-drawer-nav .lp-nav-link {
    font-size: 1.06rem;
  }
}

.lp-mobile-offcanvas-close-icon {
  font-size: 1.65rem;
  width: 1em;
  height: 1em;
  color: var(--bs-emphasis-color);
}

.lp-offcanvas-logo {
  height: 40px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
  display: block;
}

.lp-header-inner > .lp-header-brand.lp-logo-link {
  flex-shrink: 0;
  min-width: auto;
}

.lp-header-inner {
  position: relative;
  min-height: 5rem;
  margin-top: 0;
  margin-bottom: 0;
  padding-inline: 0;
  border-radius: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.lp-logo-img {
  height: 58px;
  width: auto;
  max-width: min(200px, 36vw);
  object-fit: contain;
}

.lp-footer .lp-logo-img {
  height: 56px;
  max-width: 180px;
}

.lp-nav-link {
  font-size: 0.9rem;
  color: var(--bs-body-color);
  text-decoration: none;
}

.lp-header-nav .lp-nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 2.8rem;
  padding: 0.55rem 0;
  position: relative;
  font-size: 0.9rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--bs-body-color) 76%, transparent);
  letter-spacing: 0.01em;
  transition: color 0.18s ease;
}

.lp-header-nav .lp-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.25rem;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(var(--bs-primary-rgb, 92, 48, 143), 1), rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.9));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.18s ease;
}

.lp-header-nav .lp-nav-link:hover,
.lp-header-nav .lp-nav-link.router-link-active {
  color: var(--bs-emphasis-color);
}

.lp-header-nav .lp-nav-link:hover::after,
.lp-header-nav .lp-nav-link.router-link-active::after {
  transform: scaleX(1);
}

.lp-header-cta {
  font-weight: 600;
}

.lp-header-actions {
  padding-left: 1rem;
  margin-left: 0.25rem !important;
  border-left: 1px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.12);
}

html[data-bs-theme='dark'] .lp-header-actions {
  border-left-color: rgba(255, 255, 255, 0.08);
}

.lp-lang-toggle {
  font-size: 0.9rem;
}

.lp-header :deep(.lp-btn-pill--ghost),
.lp-header :deep(.lp-btn-pill--surface) {
  background-image: none !important;
  background-color: transparent !important;
  border-color: rgba(var(--bs-primary-rgb, 92, 48, 143), 0.12) !important;
  box-shadow: none !important;
}

.lp-header :deep(.lp-btn-pill--ghost:hover),
.lp-header :deep(.lp-btn-pill--surface:hover) {
  background-color: rgba(255, 255, 255, 0.58) !important;
  border-color: rgba(var(--bs-primary-rgb, 92, 48, 143), 0.22) !important;
}

html[data-bs-theme='dark'] .lp-header :deep(.lp-btn-pill--ghost),
html[data-bs-theme='dark'] .lp-header :deep(.lp-btn-pill--surface) {
  background-color: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 244, 232, 0.9) !important;
}

html[data-bs-theme='dark'] .lp-header :deep(.lp-btn-pill--ghost:hover),
html[data-bs-theme='dark'] .lp-header :deep(.lp-btn-pill--surface:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.26) !important;
}

.lp-app-launcher-trigger {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50% !important;
  background: transparent !important;
  border: 1px solid rgba(92, 48, 143, 0.16) !important;
  box-shadow: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  padding: 0 !important;
  line-height: 1;
}

.lp-app-launcher-trigger-icon {
  font-size: 1.1rem;
  color: rgb(var(--bs-primary-rgb, 92, 48, 143));
  filter: none;
  display: block;
  line-height: 1;
}
.lp-app-launcher-trigger :deep(svg) {
  display: block;
  width: 1.1em;
  height: 1.1em;
  fill: currentColor;
}

.lp-app-launcher-trigger:hover {
  transform: none;
  border-color: rgba(92, 48, 143, 0.28) !important;
  background: rgba(255, 255, 255, 0.58) !important;
  box-shadow: none;
}

html[data-bs-theme='dark'] .lp-app-launcher-trigger {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

html[data-bs-theme='dark'] .lp-app-launcher-trigger-icon {
  color: rgb(var(--bs-primary-rgb, 92, 48, 143));
}

html[data-bs-theme='dark'] .lp-app-launcher-trigger:hover {
  border-color: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.24) !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

.lp-app-launcher-menu {
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  min-width: min(26rem, calc(100vw - 1.5rem));
}

.lp-app-launcher-menu :deep(.dropdown-item) {
  padding: 0;
}

.lp-app-launcher-panel {
  padding: 0.85rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background:
    radial-gradient(circle at top right, rgba(247, 168, 41, 0.16), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 240, 250, 0.96));
  box-shadow: 0 28px 70px rgba(35, 20, 46, 0.18);
  backdrop-filter: blur(14px);
}

.lp-app-launcher-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.7rem;
  padding-inline: 0.2rem;
}

.lp-app-launcher-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--bs-headings-color);
}

.lp-app-launcher-copy {
  margin-top: 0.18rem;
  font-size: 0.88rem;
  color: var(--bs-secondary-color);
}

.lp-app-launcher-account {
  margin-bottom: 0.75rem;
  padding: 0.8rem;
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(92, 48, 143, 0.08);
}

.lp-app-launcher-account-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lp-app-launcher-account-avatar {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, rgba(92, 48, 143, 0.14), rgba(247, 168, 41, 0.2));
  color: #5c308f;
  flex-shrink: 0;
}

.lp-app-launcher-account-avatar :deep(svg) {
  width: 1.4rem;
  height: 1.4rem;
}

.lp-app-launcher-account-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--bs-secondary-color);
}

.lp-app-launcher-account-name {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--bs-headings-color);
}

.lp-app-launcher-role-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.lp-app-launcher-role-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.42rem 0.72rem;
  border-radius: 999px;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.72);
  color: var(--bs-body-color);
  font-size: 0.74rem;
  font-weight: 700;
}

.lp-app-launcher-role-chip--active {
  border-color: rgba(92, 48, 143, 0.24);
  background: rgba(92, 48, 143, 0.12);
}

.lp-app-launcher-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(5.1rem, 1fr));
  gap: 0.45rem;
  max-height: min(26rem, 60vh);
  overflow: auto;
  padding: 0.15rem;
}

.lp-app-launcher-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.42rem;
  min-height: 5.4rem;
  padding: 0.65rem 0.4rem 0.55rem;
  border-radius: 1rem;
  text-decoration: none;
  color: var(--bs-body-color);
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.lp-app-launcher-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 24px rgba(35, 20, 46, 0.08);
}

.lp-app-launcher-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 0.9rem;
  background:
    radial-gradient(circle at top right, rgba(247, 168, 41, 0.18), transparent 35%),
    linear-gradient(180deg, rgba(92, 48, 143, 0.12), rgba(92, 48, 143, 0.06));
  color: #5c308f;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.lp-app-launcher-item-icon :deep(svg) {
  width: 1.28rem;
  height: 1.28rem;
}

.lp-app-launcher-item-label {
  font-size: 0.76rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  text-wrap: balance;
}

html[data-bs-theme='dark'] .lp-layout :deep(.context-nav) {
  border-color: rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at 84% 18%, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.12), transparent 34%),
    linear-gradient(135deg, rgba(24, 19, 31, 0.94), rgba(15, 12, 20, 0.9));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24);
}

html[data-bs-theme='dark'] .lp-layout :deep(.context-nav-link) {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

html[data-bs-theme='dark'] .lp-layout :deep(.context-nav-link:hover) {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
}

html[data-bs-theme='dark'] .lp-layout :deep(.context-nav-pill) {
  border-color: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.28);
  background: linear-gradient(135deg, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.14), rgba(var(--bs-primary-rgb, 92, 48, 143), 0.18));
  color: rgba(255, 244, 232, 0.94);
}

html[data-bs-theme='dark'] .lp-layout :deep(.context-nav-pill:hover) {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.24);
}

.lp-lang-label {
  min-width: 4rem;
  text-align: left;
}

.lp-lang-label-compact {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  min-width: 1.75rem;
  text-align: center;
}

.lp-lang-toggle--compact {
  padding-inline: 0.35rem !important;
}

.lp-landing-snap {
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  .lp-landing-snap {
    scroll-snap-type: none;
    scroll-behavior: auto;
  }
}

.lp-theme-switch {
  --lp-switch-track: rgba(var(--bs-emphasis-color-rgb, 33, 37, 41), 0.12);
  --lp-switch-border: rgba(var(--bs-emphasis-color-rgb, 33, 37, 41), 0.2);
  --lp-switch-knob: #fff;
  --lp-switch-icon-dim: rgba(var(--bs-emphasis-color-rgb, 33, 37, 41), 0.35);
  --lp-switch-icon-on: rgba(var(--bs-secondary-rgb, 247, 168, 41), 1);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  vertical-align: middle;
  border-radius: 999px;
  flex-shrink: 0;
}

.lp-theme-switch:focus-visible {
  outline: 2px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.55);
  outline-offset: 2px;
}

.lp-theme-switch-track {
  position: relative;
  display: block;
  width: 3rem;
  height: 1.625rem;
  border-radius: 999px;
  background: var(--lp-switch-track);
  border: 1px solid var(--lp-switch-border);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.lp-theme-switch-knob {
  position: absolute;
  top: 50%;
  left: 3px;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: -0.5625rem;
  border-radius: 50%;
  background: var(--lp-switch-knob);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.lp-theme-switch--dark .lp-theme-switch-knob {
  transform: translateX(1.25rem);
}

.lp-theme-switch-icon {
  position: absolute;
  top: 50%;
  margin-top: -0.5rem;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  color: var(--lp-switch-icon-dim);
  transition: color 0.2s ease, opacity 0.2s ease;
}

.lp-theme-switch-icon--sun {
  left: 5px;
}

.lp-theme-switch-icon--moon {
  right: 5px;
}

.lp-theme-switch:not(.lp-theme-switch--dark) .lp-theme-switch-icon--sun {
  color: var(--lp-switch-icon-on);
  opacity: 1;
}

.lp-theme-switch:not(.lp-theme-switch--dark) .lp-theme-switch-icon--moon {
  opacity: 0.45;
}

.lp-theme-switch--dark .lp-theme-switch-icon--moon {
  color: var(--lp-switch-icon-on);
  opacity: 1;
}

.lp-theme-switch--dark .lp-theme-switch-icon--sun {
  opacity: 0.45;
}

[data-bs-theme='dark'] .lp-theme-switch {
  --lp-switch-track: rgba(255, 255, 255, 0.12);
  --lp-switch-border: rgba(255, 255, 255, 0.22);
  --lp-switch-knob: #f8f9fa;
  --lp-switch-icon-dim: rgba(255, 255, 255, 0.38);
}

[data-bs-theme='dark'] .lp-app-launcher-account,
[data-bs-theme='dark'] .lp-app-launcher-role-chip {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

[data-bs-theme='dark'] .lp-app-launcher-panel {
  border-color: rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.16), transparent 24%),
    linear-gradient(180deg, rgba(26, 20, 31, 0.98), rgba(15, 12, 20, 0.98));
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.34);
}

[data-bs-theme='dark'] .lp-app-launcher-account-avatar {
  background: linear-gradient(135deg, rgba(var(--bs-primary-rgb, 92, 48, 143), 0.2), rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.22));
  color: rgba(255, 244, 232, 0.95);
}

[data-bs-theme='dark'] .lp-app-launcher-role-chip--active {
  background: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.12);
  border-color: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.22);
}

[data-bs-theme='dark'] .lp-app-launcher-item:hover {
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.24);
}

[data-bs-theme='dark'] .lp-app-launcher-item-icon {
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.16), transparent 34%),
    linear-gradient(180deg, rgba(var(--bs-primary-rgb, 92, 48, 143), 0.18), rgba(255, 255, 255, 0.04));
  color: rgba(255, 244, 232, 0.92);
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .lp-header-inner .lp-header-brand .lp-logo-img {
    height: 48px;
    max-width: min(150px, 26vw);
  }

  .lp-header-inner .lp-header-nav .lp-nav-link {
    font-size: 0.82rem;
  }
}

@media (max-width: 575.98px) {
  .lp-app-launcher-menu {
    min-width: min(21.5rem, calc(100vw - 1rem));
  }

  .lp-app-launcher-panel {
    padding: 0.75rem;
    border-radius: 1.35rem;
  }

  .lp-app-launcher-account {
    padding: 0.7rem;
  }

  .lp-app-launcher-grid {
    gap: 0.35rem;
  }

  .lp-app-launcher-item {
    min-height: 5rem;
    padding: 0.55rem 0.28rem 0.45rem;
  }

  .lp-app-launcher-item-icon {
    width: 2.45rem;
    height: 2.45rem;
  }

  .lp-app-launcher-item-label {
    font-size: 0.72rem;
  }
}

.lp-main {
  padding: 0;
  position: relative;
  isolation: isolate;
}

.lp-main::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.9;
  background:
    radial-gradient(circle at top left, rgba(92, 48, 143, 0.08), transparent 24%),
    radial-gradient(circle at 88% 12%, rgba(247, 168, 41, 0.11), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 26%);
  z-index: -1;
}

html[data-bs-theme='dark'] .lp-main::before {
  opacity: 1;
  background:
    radial-gradient(circle at top left, rgba(var(--bs-primary-rgb, 92, 48, 143), 0.14), transparent 22%),
    radial-gradient(circle at 88% 12%, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.1), transparent 20%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 22%);
}

.lp-layout :deep(.section-heading) {
  display: grid;
  gap: 0.75rem;
  max-width: 48rem;
  margin-bottom: clamp(1.75rem, 2vw, 2.5rem);
}

.lp-layout :deep(.row.text-center > [class*='col-']) {
  text-align: center;
}

.lp-layout :deep(.row.text-center .lp-section-pill),
.lp-layout :deep(.row.text-center .lp-section-heading),
.lp-layout :deep(.row.text-center .lp-purple-paragraph) {
  margin-inline: auto;
}

.lp-layout :deep(.section-heading.text-center) {
  justify-items: center;
  margin-inline: auto;
  text-align: center;
}

.lp-layout :deep(.section-heading.text-center .section-title),
.lp-layout :deep(.section-heading.text-center .section-copy),
.lp-layout :deep(.section-heading.text-center .lp-section-heading),
.lp-layout :deep(.section-heading.text-center .lp-program-copy) {
  margin-inline: auto;
  text-align: center;
}

.lp-layout :deep(.section-kicker) {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  margin-bottom: 0;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.52);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.lp-layout :deep(.section-kicker)::before {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #f7a829, #5c308f);
  box-shadow: 0 0 0 0.2rem rgba(247, 168, 41, 0.12);
}

.lp-layout :deep(.section-title) {
  max-width: 14ch;
  letter-spacing: -0.03em;
}

.lp-layout :deep(.section-copy) {
  max-width: 62ch;
}

.lp-layout :deep(.benefit-grid),
.lp-layout :deep(.summary-grid),
.lp-layout :deep(.steps-grid),
.lp-layout :deep(.booster-grid),
.lp-layout :deep(.vertical-grid),
.lp-layout :deep(.status-grid) {
  gap: clamp(1rem, 2vw, 1.5rem);
}

.lp-layout :deep(.benefit-card),
.lp-layout :deep(.summary-card),
.lp-layout :deep(.step-card),
.lp-layout :deep(.booster-card),
.lp-layout :deep(.vertical-card),
.lp-layout :deep(.status-card),
.lp-layout :deep(.requirements-card),
.lp-layout :deep(.quote-card),
.lp-layout :deep(.insight-card),
.lp-layout :deep(.composer-card),
.lp-layout :deep(.thread-card),
.lp-layout :deep(.feature-card),
.lp-layout :deep(.faq-item) {
  position: relative;
  border: 1px solid rgba(92, 48, 143, 0.12);
  box-shadow: 0 18px 50px rgba(35, 20, 46, 0.06);
}

.lp-layout :deep(.benefit-card),
.lp-layout :deep(.summary-card),
.lp-layout :deep(.step-card),
.lp-layout :deep(.booster-card),
.lp-layout :deep(.vertical-card),
.lp-layout :deep(.status-card),
.lp-layout :deep(.requirements-card),
.lp-layout :deep(.quote-card),
.lp-layout :deep(.insight-card),
.lp-layout :deep(.composer-card),
.lp-layout :deep(.thread-card),
.lp-layout :deep(.feature-card) {
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(247, 168, 41, 0.08), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(255, 255, 255, 0.7));
}

.lp-layout :deep(.benefit-card::before),
.lp-layout :deep(.summary-card::before),
.lp-layout :deep(.step-card::before),
.lp-layout :deep(.booster-card::before),
.lp-layout :deep(.vertical-card::before),
.lp-layout :deep(.status-card::before),
.lp-layout :deep(.requirements-card::before),
.lp-layout :deep(.quote-card::before),
.lp-layout :deep(.insight-card::before),
.lp-layout :deep(.composer-card::before),
.lp-layout :deep(.thread-card::before),
.lp-layout :deep(.feature-card::before) {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 0.2rem;
  background: linear-gradient(90deg, rgba(92, 48, 143, 0.9), rgba(247, 168, 41, 0.9));
  opacity: 0.75;
}

.lp-layout :deep(.faq-list) {
  display: grid;
  gap: 0.9rem;
}

.lp-layout :deep(.faq-item) {
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.76);
  padding: 0.25rem 1rem;
}

.lp-layout :deep(.faq-item summary) {
  cursor: pointer;
  list-style: none;
  font-weight: 700;
  padding: 1rem 0;
}

.lp-layout :deep(.faq-item summary::-webkit-details-marker) {
  display: none;
}

.lp-layout :deep(.faq-item p) {
  color: var(--bs-secondary-color);
  padding: 0 0 1rem;
}

.lp-layout :deep(.cta-shell) {
  position: relative;
  overflow: hidden;
  border-radius: clamp(1.6rem, 2.5vw, 2.2rem);
  border: 1px solid rgba(92, 48, 143, 0.12);
  background:
    radial-gradient(circle at top right, rgba(247, 168, 41, 0.2), transparent 28%),
    linear-gradient(135deg, rgba(92, 48, 143, 0.1), rgba(255, 255, 255, 0.86));
  box-shadow: 0 24px 60px rgba(35, 20, 46, 0.09);
}

.lp-layout :deep(.cta-shell::after) {
  content: '';
  position: absolute;
  inset: auto -8% -36% auto;
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(92, 48, 143, 0.14), transparent 68%);
  pointer-events: none;
}

.lp-layout :deep(.program-proof),
.lp-layout :deep(.courier-proof) {
  gap: 0.7rem;
}

.lp-layout :deep(.program-proof-chip),
.lp-layout :deep(.courier-proof-chip) {
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 24px rgba(35, 20, 46, 0.04);
}

.lp-layout :deep(.hero-board),
.lp-layout :deep(.hero-visual-card),
.lp-layout :deep(.visual-card--primary) {
  box-shadow: 0 28px 70px rgba(35, 20, 46, 0.14);
}

.lp-layout :deep(.summary-index),
.lp-layout :deep(.step-index) {
  box-shadow: 0 10px 24px rgba(92, 48, 143, 0.14);
}

/* Mobile / tablet: horizontal gutter on footer *content* only (background stays full-bleed on .lp-footer) */
@media (max-width: 991.98px) {
  .lp-footer :deep(.lp-footer-container) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.lp-footer-anchor {
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
}

.lp-footer {
  margin-top: 0;
  padding: var(--lp-section-py) 0 var(--lp-rhythm-phi);
  background:
    radial-gradient(circle at top right, rgba(247, 168, 41, 0.14), transparent 24%),
    radial-gradient(circle at left top, rgba(92, 48, 143, 0.14), transparent 26%),
    linear-gradient(180deg, color-mix(in srgb, var(--bs-tertiary-bg, #0b1725) 92%, black 8%), color-mix(in srgb, var(--bs-tertiary-bg, #0b1725) 74%, white 26%));
  border-top: 1px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.1);
}

html[data-bs-theme='dark'] .lp-footer {
  background:
    radial-gradient(circle at top right, rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.12), transparent 24%),
    radial-gradient(circle at left top, rgba(var(--bs-primary-rgb, 92, 48, 143), 0.12), transparent 26%),
    linear-gradient(180deg, rgba(20, 15, 25, 0.98), rgba(12, 10, 17, 1));
  border-top-color: rgba(255, 255, 255, 0.08);
}

.lp-footer-text {
  font-size: 0.9rem;
  color: var(--bs-secondary-color);
}

.lp-footer-story {
  max-width: 35rem;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.14);
}

html[data-bs-theme='dark'] .lp-footer-story {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.lp-footer-story-label {
  display: inline-block;
  margin-bottom: 0.45rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5c308f;
}

html[data-bs-theme='dark'] .lp-footer-story-label {
  color: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.96);
}

.lp-footer-story p {
  color: var(--bs-body-color);
  line-height: 1.7;
}

.lp-footer-apps .lp-footer-store-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.lp-footer-col h5 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
  color: var(--bs-headings-color);
}

.lp-footer-col {
  min-width: 12rem;
  padding: 0;
}

.lp-footer-link {
  display: block;
  font-size: 0.88rem;
  color: var(--bs-secondary-color);
  text-decoration: none;
  transition: color 0.18s ease, transform 0.18s ease;
}

.lp-footer-link + .lp-footer-link {
  margin-top: 0.2rem;
}

.lp-footer-link:hover {
  color: var(--bs-secondary);
  transform: translateX(2px);
}

html[data-bs-theme='dark'] .lp-footer-link:hover {
  color: rgba(var(--bs-secondary-rgb, 247, 168, 41), 0.96);
}

.lp-footer-border {
  border-color: var(--bs-border-color) !important;
}

</style>
