<template>
  <div class="buyer-shopping-shell">
    <header class="buyer-shopping-topbar">
      <router-link :to="BUYER_DASHBOARD_ROUTE" class="buyer-shopping-topbar__brand d-flex align-items-center gap-2 text-decoration-none">
        <img :src="topbarMarkSrc" alt="" class="buyer-shopping-topbar__mark" />
        <span class="buyer-shopping-topbar__title">KKOO</span>
      </router-link>
      <PortalBadge portal="buyer" />
    </header>
    <BuyerSideNav class="buyer-shopping-shell__nav" />
    <main class="buyer-shopping-shell__main">
      <RouterView />
    </main>

    <div class="buyer-float-actions" aria-label="Quick actions">
      <button
        type="button"
        class="buyer-float-action buyer-float-action--notify"
        :class="{ 'buyer-float-action--open': notifyOpen }"
        :aria-expanded="notifyOpen"
        :aria-label="notifyOpen ? 'Close notifications' : 'Open notifications'"
        @click="toggleNotifications"
      >
        <span class="buyer-float-action__icon" aria-hidden="true">
          <Icon :icon="notifyOpen ? 'solar:close-circle-bold' : 'solar:bell-bold'" />
        </span>
        <span
          v-if="notificationUnreadSafe && !notifyOpen"
          class="buyer-float-action__badge"
          aria-label="Unread notifications"
        >{{ notificationUnreadSafe }}</span>
      </button>

      <button
        type="button"
        class="buyer-float-action buyer-float-action--cart"
        :class="{ 'buyer-float-action--open': drawerOpen }"
        :aria-expanded="drawerOpen"
        :aria-label="drawerOpen ? 'Close cart' : 'Open cart'"
        @click="toggleCart"
      >
        <span class="buyer-float-action__icon" aria-hidden="true">
          <Icon :icon="drawerOpen ? 'solar:close-circle-bold' : 'solar:cart-large-minimalistic-bold'" />
        </span>
        <span
          v-if="itemCountSafe && !drawerOpen"
          class="buyer-float-action__badge"
          aria-label="Items in cart"
        >{{ itemCountSafe }}</span>
      </button>
    </div>

    <BuyerCartDrawer v-model="drawerOpen" />
    <BuyerNotificationsDrawer v-model="notifyOpen" />
    <BuyerCampaignModal :campaign="modalCampaign" @dismiss="dismissModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { Icon } from '@iconify/vue'
import BuyerSideNav from '@/components/buyer/BuyerSideNav.vue'
import PortalBadge from '@/components/PortalBadge.vue'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'
import { useLayoutStore } from '@/stores/layout'
import logoMarkLight from '@/assets/images/logo-mark-light.svg'
import logoMarkDark from '@/assets/images/logo-mark-dark.svg'
import BuyerCartDrawer from '@/components/buyer/BuyerCartDrawer.vue'
import BuyerNotificationsDrawer from '@/components/buyer/BuyerNotificationsDrawer.vue'
import BuyerCampaignModal from '@/components/buyer/BuyerCampaignModal.vue'
import { useWebCart } from '@/composables/useWebCart'
import { useBuyerNotifications } from '@/composables/useBuyerNotifications'
import { useBuyerCampaigns } from '@/composables/useBuyerCampaigns'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const layoutStore = useLayoutStore()
const topbarMarkSrc = computed(() => (layoutStore.layout.theme === 'dark' ? logoMarkDark : logoMarkLight))
const { loadCart, itemCount } = useWebCart()
const { loadUnreadCount, unreadCount: notificationUnreadCount } = useBuyerNotifications()
const { modalCampaign, loadAdvertCampaign, dismissModal } = useBuyerCampaigns()

const drawerOpen = ref(false)
const notifyOpen = ref(false)

const itemCountSafe = computed(() => (itemCount.value > 99 ? '99+' : itemCount.value > 0 ? String(itemCount.value) : ''))
const notificationUnreadSafe = computed(() =>
  notificationUnreadCount.value > 99 ? '99+' : notificationUnreadCount.value > 0 ? String(notificationUnreadCount.value) : '',
)

function toggleCart() {
  drawerOpen.value = !drawerOpen.value
  if (drawerOpen.value) {
    notifyOpen.value = false
    void loadCart()
  }
}

function toggleNotifications() {
  notifyOpen.value = !notifyOpen.value
  if (notifyOpen.value) drawerOpen.value = false
}

provide('refreshBuyerCart', loadCart)
provide('openBuyerCart', () => {
  notifyOpen.value = false
  if (!drawerOpen.value) {
    drawerOpen.value = true
    void loadCart()
  }
})
provide('toggleBuyerCart', toggleCart)
provide('refreshBuyerNotifications', loadUnreadCount)

watch(
  () => auth.isAuthenticated,
  (ok) => {
    if (ok) {
      void loadUnreadCount()
      void loadAdvertCampaign()
    } else {
      notificationUnreadCount.value = 0
      modalCampaign.value = null
    }
  },
)

onMounted(() => {
  void loadCart()
  if (auth.isAuthenticated) {
    void loadUnreadCount()
    void loadAdvertCampaign()
  }
})
</script>
