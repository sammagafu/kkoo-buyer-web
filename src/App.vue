<template>
  <RouterView />
  <BuyerBottomNav v-if="showShell" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { onMounted } from 'vue'
import BuyerBottomNav from '@/components/buyer/BuyerBottomNav.vue'
import { useBuyerAppShell } from '@/composables/useBuyerAppShell'

const { showShell } = useBuyerAppShell()

onMounted(() => {
  useLayoutStore().init()
})
</script>