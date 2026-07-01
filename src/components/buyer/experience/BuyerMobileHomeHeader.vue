<template>
  <header class="buyer-mhome-header">
    <router-link :to="BUYER_DASHBOARD_ROUTE" class="buyer-mhome-header__brand" aria-label="KKOO Home">
      <img :src="logoSrc" alt="" class="buyer-mhome-header__logo" />
    </router-link>

    <button type="button" class="buyer-mhome-header__location" @click="$emit('location')">
      <Icon icon="solar:map-point-bold" aria-hidden="true" />
      <span>{{ areaLabel }}</span>
    </button>

    <button
      type="button"
      class="buyer-mhome-header__notify"
      :aria-label="t('buyerXp.home.openNotifications')"
      @click="$emit('notifications')"
    >
      <Icon icon="solar:bell-bold" aria-hidden="true" />
      <span v-if="unreadBadge" class="buyer-mhome-header__badge">{{ unreadBadge }}</span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useLayoutStore } from '@/stores/layout'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'
import logoLight from '@/assets/images/logo-light.svg'
import logoDark from '@/assets/images/logo-dark.svg'

const props = defineProps<{
  areaLabel: string
  unreadCount?: number
}>()

defineEmits<{
  location: []
  notifications: []
}>()

const { t } = useI18n()
const layoutStore = useLayoutStore()

const logoSrc = computed(() => (layoutStore.layout.theme === 'dark' ? logoDark : logoLight))

const unreadBadge = computed(() => {
  const n = props.unreadCount ?? 0
  if (n <= 0) return ''
  return n > 99 ? '99+' : String(n)
})
</script>
