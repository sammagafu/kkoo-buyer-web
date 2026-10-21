<template>
  <div class="kkoo-app-shell" data-kkoo-portal="buyer">
    <div class="kkoo-portal-strip" aria-hidden="true" />
    <BuyerShoppingLayout v-if="showShoppingLayout" />
    <RouterView v-else />
    <BuyerBottomNav v-if="showShell" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useBuyerAppShell } from '@/composables/useBuyerAppShell'

const BuyerBottomNav = defineAsyncComponent(() => import('@/components/buyer/BuyerBottomNav.vue'))
const BuyerShoppingLayout = defineAsyncComponent(() => import('@/layouts/BuyerShoppingLayout.vue'))

const route = useRoute()
const { showShell } = useBuyerAppShell()

const showShoppingLayout = computed(() =>
  route.matched.some((record) => record.meta.buyerShoppingLayout === true),
)

onMounted(() => {
  document.documentElement.setAttribute('data-kkoo-portal', 'buyer')
})
</script>
