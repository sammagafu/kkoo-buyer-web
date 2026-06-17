<template>
  <BuyerShoppingLayout v-if="showShoppingLayout" />
  <RouterView v-else />
  <BuyerBottomNav v-if="showShell" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BuyerBottomNav from '@/components/buyer/BuyerBottomNav.vue'
import BuyerShoppingLayout from '@/layouts/BuyerShoppingLayout.vue'
import { useBuyerAppShell } from '@/composables/useBuyerAppShell'

const route = useRoute()
const { showShell } = useBuyerAppShell()

const showShoppingLayout = computed(() =>
  route.matched.some((record) => record.meta.buyerShoppingLayout === true),
)
</script>
