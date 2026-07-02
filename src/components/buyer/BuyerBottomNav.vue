<template>
  <nav class="buyer-bottom-nav" aria-label="Main navigation">
    <div class="buyer-bottom-nav__bar">
      <RouterLink
        v-for="item in items"
        :key="item.tab"
        :to="item.to"
        class="buyer-bottom-nav__item"
        :class="{ 'buyer-bottom-nav__item--active': activeTab === item.tab }"
        @click="onTabClick($event, item)"
      >
        <Icon :icon="activeTab === item.tab ? item.iconActive : item.icon" class="buyer-bottom-nav__icon" />
        <span class="buyer-bottom-nav__label">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  buyerTabRoutes,
  useBuyerAppShell,
  type BuyerTab,
} from '@/composables/useBuyerAppShell'

const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
const { activeTab } = useBuyerAppShell()

const items = computed(() => [
  { tab: 'home' as BuyerTab, label: t('buyerXp.nav.home'), icon: 'solar:home-2-linear', iconActive: 'solar:home-2-bold', to: buyerTabRoutes.home },
  { tab: 'shop' as BuyerTab, label: t('buyerXp.nav.shop'), icon: 'solar:bag-3-linear', iconActive: 'solar:bag-3-bold', to: buyerTabRoutes.shop },
  { tab: 'orders' as BuyerTab, label: t('buyerXp.nav.orders'), icon: 'solar:box-linear', iconActive: 'solar:box-bold', to: buyerTabRoutes.orders, auth: true },
  { tab: 'profile' as BuyerTab, label: t('buyerXp.nav.me'), icon: 'solar:user-circle-linear', iconActive: 'solar:user-circle-bold', to: buyerTabRoutes.profile, auth: true },
])

function onTabClick(event: MouseEvent, item: (typeof items.value)[number]) {
  if (!item.auth || isAuthenticated.value) return
  event.preventDefault()
  void router.push({
    name: 'auth.sign-in',
    query: { redirectedFrom: router.resolve(item.to).fullPath },
  })
}
</script>

<style scoped>
.buyer-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1040;
  pointer-events: none;
  padding: 0 calc(0.5rem + env(safe-area-inset-left, 0px)) calc(0.25rem + env(safe-area-inset-bottom, 0px))
    calc(0.5rem + env(safe-area-inset-right, 0px));
}

.buyer-bottom-nav__bar {
  pointer-events: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: stretch;
  max-width: 28rem;
  margin: 0 auto;
  padding: 0.35rem 0.25rem;
  background: var(--buyer-surface, var(--bs-body-bg));
  border: 1px solid var(--buyer-border-strong, rgba(var(--bs-primary-rgb), 0.12));
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 -0.35rem 1.25rem var(--buyer-shadow-color, rgba(0, 0, 0, 0.08));
}

.buyer-bottom-nav__item {
  min-height: 3.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.35rem 0.25rem;
  border-radius: 0.75rem;
  color: var(--buyer-muted, var(--bs-secondary-color));
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
}

.buyer-bottom-nav__item--active {
  color: var(--kkoo-primary, var(--bs-primary));
  background: color-mix(in srgb, var(--kkoo-primary, #5d318e) 10%, transparent);
}

.buyer-bottom-nav__icon {
  font-size: 1.35rem;
  flex-shrink: 0;
}

.buyer-bottom-nav__label {
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.1;
}

@media (min-width: 992px) {
  .buyer-bottom-nav {
    display: none;
  }
}
</style>

<style>
html.buyer-shell-active {
  scroll-padding-bottom: 4.75rem;
}

html.buyer-shell-active body {
  padding-bottom: 4.75rem;
}

@media (min-width: 992px) {
  html.buyer-shell-active body {
    padding-bottom: 0;
  }
}
</style>
