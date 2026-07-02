<template>
  <aside class="buyer-side-nav" aria-label="Shop navigation">
    <router-link :to="BUYER_DASHBOARD_ROUTE" class="buyer-side-nav__brand">
      <img :src="logoSrc" alt="" />
    </router-link>

    <router-link
      :to="userLink"
      class="buyer-side-nav__user"
    >
      <span class="buyer-side-nav__user-avatar" aria-hidden="true">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" />
        <span v-else class="buyer-side-nav__user-initials">{{ initials }}</span>
      </span>
      <span class="buyer-side-nav__user-copy">
        <span class="buyer-side-nav__user-greeting">{{ greeting }}</span>
        <span class="buyer-side-nav__user-name">{{ userLabel }}</span>
      </span>
    </router-link>

    <nav class="buyer-side-nav__group">
      <p class="buyer-side-nav__label">{{ t('buyerXp.nav.shop') }}</p>
      <router-link
        v-for="item in shopLinks"
        :key="item.name"
        :to="item.to"
        class="buyer-side-nav__link"
        :class="{ 'buyer-side-nav__link--active': isActive(item) }"
      >
        <Icon :icon="item.icon" class="buyer-side-nav__icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <nav class="buyer-side-nav__group">
      <p class="buyer-side-nav__label">{{ t('buyerXp.nav.yourAccount') }}</p>
      <router-link
        v-for="item in accountLinks"
        :key="item.name"
        :to="item.to"
        class="buyer-side-nav__link"
        :class="{ 'buyer-side-nav__link--active': isActive(item) }"
      >
        <Icon :icon="item.icon" class="buyer-side-nav__icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="buyer-side-nav__footer">
      <label class="buyer-side-nav__locale" :aria-label="t('buyerXp.nav.language')">
        <span class="buyer-side-nav__locale-icon" aria-hidden="true">
          <Icon icon="solar:global-bold" />
        </span>
        <select
          :value="locale"
          class="buyer-side-nav__locale-select"
          :aria-label="t('buyerXp.nav.language')"
          @change="onLocaleChange"
        >
          <option v-for="loc in supportedLocales" :key="loc.code" :value="loc.code">{{ loc.name }}</option>
        </select>
      </label>
      <button
        type="button"
        class="buyer-side-nav__theme"
        :aria-label="layout.theme === 'dark' ? t('buyerXp.nav.themeLight') : t('buyerXp.nav.themeDark')"
        @click="toggleTheme"
      >
        <Icon :icon="layout.theme === 'dark' ? 'solar:sun-2-bold' : 'solar:moon-bold'" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { useBuyerGreeting } from '@/composables/useBuyerGreeting'
import { resolveAssetUrl } from '@/utils/assetUrl'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'
import { supportedLocales, setLocale, type LocaleCode } from '@/i18n'
import logoLight from '@/assets/images/logo-light.svg'
import logoDark from '@/assets/images/logo-dark.svg'

type NavItemBase = { name: string; labelKey: string; icon: string; to: RouteLocationRaw; match?: string[] }
type NavItem = NavItemBase & { label: string }

const route = useRoute()
const layoutStore = useLayoutStore()
const auth = useAuthStore()
const { layout } = storeToRefs(layoutStore)
const { isAuthenticated, displayName } = useAuthDisplay()
const { user } = storeToRefs(auth)
const { t, locale } = useI18n()
const { greeting } = useBuyerGreeting()

const logoSrc = computed(() => (layout.value.theme === 'dark' ? logoDark : logoLight))

const userLabel = computed(() => {
  if (!isAuthenticated.value) return t('buyerXp.nav.signIn')
  const name = displayName.value.trim()
  if (!name || name.toLowerCase() === 'guest') {
    const phone = user.value?.phone_number
    return phone || t('buyerXp.nav.yourAccountLabel')
  }
  return name
})

const userLink = computed<RouteLocationRaw>(() =>
  isAuthenticated.value ? { name: 'buyer.profile' } : { name: 'auth.sign-in' },
)

const avatarUrl = computed(() => {
  const u = user.value as { avatar_url?: string; avatar?: string } | null
  return resolveAssetUrl(u?.avatar_url ?? u?.avatar) ?? ''
})

const initials = computed(() => {
  const label = userLabel.value
  const signIn = t('buyerXp.nav.signIn')
  const account = t('buyerXp.nav.yourAccountLabel')
  if (label === signIn || label === account) return '?'
  const parts = label.split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] ?? ''
  const b = parts[1]?.[0] ?? ''
  return `${a}${b}`.toUpperCase() || '?'
})

const shopLinks = computed((): NavItem[] => {
  // Make labels reactive to language switch.
  // `t()` alone isn't always tracked in computed chains depending on usage.
  void locale.value
  return [
  { name: 'home', labelKey: 'buyerXp.nav.home', icon: 'solar:home-2-bold', to: BUYER_DASHBOARD_ROUTE, match: ['buyer.marketplace', 'buyer.dashboard', 'buyer.market'] },
  { name: 'eats', labelKey: 'buyerXp.nav.eats', icon: 'solar:cup-hot-bold', to: { name: 'buyer.eats' }, match: ['buyer.eats', 'buyer.eats.store'] },
  { name: 'grocery', labelKey: 'buyerXp.nav.groceries', icon: 'solar:bag-2-bold', to: { name: 'buyer.grocery' }, match: ['buyer.grocery', 'buyer.grocery.store'] },
  { name: 'pharmacy', labelKey: 'buyerXp.nav.pharmacy', icon: 'solar:health-bold', to: { name: 'buyer.pharmacy' }, match: ['buyer.pharmacy', 'buyer.pharmacy.reminders', 'buyer.pharmacy.store'] },
  { name: 'send', labelKey: 'buyerXp.nav.send', icon: 'solar:cart-large-2-bold', to: { name: 'buyer.send' }, match: ['buyer.send'] },
  { name: 'parcel', labelKey: 'buyerXp.nav.parcel', icon: 'solar:box-bold', to: { name: 'buyer.parcel' }, match: ['buyer.parcel'] },
  { name: 'search', labelKey: 'buyerXp.nav.search', icon: 'solar:magnifer-bold', to: { name: 'buyer.search' }, match: ['buyer.search'] },
  { name: 'ride', labelKey: 'buyerXp.nav.ride', icon: 'solar:scooter-bold', to: { name: 'buyer.ride' }, match: ['buyer.ride', 'buyer.rides', 'buyer.ride.detail'] },
  { name: 'services', labelKey: 'buyerXp.nav.services', icon: 'solar:widget-5-bold', to: { name: 'buyer.services' }, match: ['buyer.services', 'buyer.nearby', 'buyer.flash-sales', 'buyer.wholesale'] },
].map((item) => ({ ...item, label: t(item.labelKey) }))
})

const accountLinks = computed((): NavItem[] => {
  void locale.value
  return [
  { name: 'orders', labelKey: 'buyerXp.nav.orders', icon: 'solar:bag-check-bold', to: { name: 'buyer.orders' }, match: ['buyer.orders', 'buyer.order'] },
  { name: 'wallet', labelKey: 'buyerXp.nav.wallet', icon: 'solar:wallet-bold', to: { name: 'buyer.wallet' }, match: ['buyer.wallet'] },
  { name: 'rewards', labelKey: 'buyerXp.nav.rewards', icon: 'solar:gift-bold', to: { name: 'buyer.rewards' }, match: ['buyer.rewards', 'buyer.referral', 'buyer.share-earn', 'buyer.gamification', 'buyer.weekly-pass'] },
  { name: 'favorites', labelKey: 'buyerXp.nav.saved', icon: 'solar:heart-bold', to: { name: 'buyer.favorites' }, match: ['buyer.favorites'] },
  { name: 'messages', labelKey: 'buyerXp.nav.messages', icon: 'solar:chat-round-bold', to: { name: 'buyer.messages' }, match: ['buyer.messages', 'buyer.messages.thread'] },
  { name: 'profile', labelKey: 'buyerXp.nav.account', icon: 'solar:user-circle-bold', to: { name: 'buyer.profile' }, match: ['buyer.profile', 'buyer.settings', 'account.profile', 'account.notifications', 'account.backup-codes', 'buyer.reservations', 'buyer.returns', 'buyer.disputes', 'buyer.premium'] },
].map((item) => ({ ...item, label: t(item.labelKey) }))
})

function isActive(item: NavItem) {
  const name = String(route.name ?? '')
  if (item.match?.includes(name)) return true
  return name === item.name
}

function toggleTheme() {
  layoutStore.setTheme(layout.value.theme === 'dark' ? 'light' : 'dark')
}

function onLocaleChange(e: Event) {
  const code = (e.target as HTMLSelectElement).value as LocaleCode
  setLocale(code)
}
</script>

<style scoped>
.buyer-side-nav__locale {
  position: relative;
  flex: 1;
  min-width: 0;
}

.buyer-side-nav__locale-icon {
  display: none;
}

.buyer-side-nav__locale-select {
  width: 100%;
  margin: 0;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.15);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  font-size: 0.72rem;
  background: rgba(var(--bs-primary-rgb), 0.06);
  color: inherit;
}
</style>
