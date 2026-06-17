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
        <span v-if="activeTab === item.tab" class="buyer-bottom-nav__label">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  buyerTabRoutes,
  useBuyerAppShell,
  type BuyerTab,
} from '@/composables/useBuyerAppShell'

const router = useRouter()
const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
const { activeTab } = useBuyerAppShell()

const items = computed(() => [
  { tab: 'home' as BuyerTab, label: 'Home', icon: 'solar:home-2-linear', iconActive: 'solar:home-2-bold', to: buyerTabRoutes.home },
  { tab: 'search' as BuyerTab, label: 'Search', icon: 'solar:magnifer-linear', iconActive: 'solar:magnifer-bold', to: buyerTabRoutes.search },
  { tab: 'cart' as BuyerTab, label: 'Cart', icon: 'solar:cart-large-minimalistic-linear', iconActive: 'solar:cart-large-minimalistic-bold', to: buyerTabRoutes.cart },
  { tab: 'orders' as BuyerTab, label: 'Orders', icon: 'solar:bag-check-linear', iconActive: 'solar:bag-check-bold', to: buyerTabRoutes.orders, auth: true },
  { tab: 'profile' as BuyerTab, label: 'Profile', icon: 'solar:user-circle-linear', iconActive: 'solar:user-circle-bold', to: buyerTabRoutes.profile, auth: true },
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
  padding: 0 1.25rem calc(0.375rem + env(safe-area-inset-bottom, 0px));
}

.buyer-bottom-nav__bar {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 32rem;
  margin: 0 auto;
  padding: 0.5rem 0.375rem;
  background: var(--bs-body-bg);
  border: 1px solid rgba(var(--bs-primary-rgb), 0.12);
  border-radius: 1.75rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
}

.buyer-bottom-nav__item {
  flex: 1;
  min-width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 1.375rem;
  color: var(--bs-secondary-color);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, flex 0.2s ease;
}

.buyer-bottom-nav__item--active {
  flex: 2.5;
  background: var(--bs-secondary);
  color: #fff;
  box-shadow: 0 0.25rem 0.75rem rgba(var(--bs-secondary-rgb), 0.35);
}

.buyer-bottom-nav__icon {
  font-size: 1.375rem;
  flex-shrink: 0;
}

.buyer-bottom-nav__label {
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 992px) {
  .buyer-bottom-nav {
    display: none;
  }
}
</style>

<style>
html.buyer-shell-active {
  scroll-padding-bottom: 5.5rem;
}

html.buyer-shell-active body {
  padding-bottom: 5.5rem;
}

@media (min-width: 992px) {
  html.buyer-shell-active body {
    padding-bottom: 0;
  }
}
</style>
