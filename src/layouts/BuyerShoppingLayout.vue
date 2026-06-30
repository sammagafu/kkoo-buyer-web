<template>
  <div class="buyer-shopping-shell" :class="{ 'buyer-shopping-shell--mhome': isMobileHome, 'buyer-shopping-shell--ride': isRidePage, 'buyer-shopping-shell--send': isSendPage }">
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
    <ProductShareEarnSheet />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import BuyerSideNav from '@/components/buyer/BuyerSideNav.vue'
import BuyerCartDrawer from '@/components/buyer/BuyerCartDrawer.vue'
import BuyerNotificationsDrawer from '@/components/buyer/BuyerNotificationsDrawer.vue'
import BuyerCampaignModal from '@/components/buyer/BuyerCampaignModal.vue'
import ProductShareEarnSheet from '@/components/buyer/ProductShareEarnSheet.vue'
import { useWebCart } from '@/composables/useWebCart'
import { useBuyerNotifications } from '@/composables/useBuyerNotifications'
import { useBuyerCampaigns } from '@/composables/useBuyerCampaigns'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const isMobileHome = computed(() => route.name === 'buyer.marketplace')
const isRidePage = computed(() => route.name === 'buyer.ride' || route.name === 'buyer.parcel')
const isSendPage = computed(() => route.name === 'buyer.send')
const { loadCart, itemCount, syncGuestCartToServer, addToCart } = useWebCart()
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

provide('openBuyerNotifications', () => {
  drawerOpen.value = false
  notifyOpen.value = true
})
provide('addToBuyerCart', addToCart)
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
  async (ok) => {
    if (ok) {
      void loadUnreadCount()
      void loadAdvertCampaign()
      await syncGuestCartToServer()
      void loadCart()
    } else {
      notificationUnreadCount.value = 0
      modalCampaign.value = null
      void loadCart()
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
