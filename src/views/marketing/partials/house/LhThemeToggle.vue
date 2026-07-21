<template>
  <button
    type="button"
    class="lh-theme-switch"
    :class="{ 'lh-theme-switch--dark': isDark }"
    :aria-label="isDark ? t('landing.themeSwitchToLight') : t('landing.themeSwitchToDark')"
    @click="toggle"
  >
    <span class="lh-theme-switch__track">
      <span class="lh-theme-switch__knob" aria-hidden="true" />
      <Icon icon="solar:sun-2-bold" class="lh-theme-switch__icon lh-theme-switch__icon--sun" aria-hidden="true" />
      <Icon icon="solar:moon-bold" class="lh-theme-switch__icon lh-theme-switch__icon--moon" aria-hidden="true" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useLayoutStore } from '@/stores/layout'

const { t } = useI18n()
const layoutStore = useLayoutStore()
const { layout } = storeToRefs(layoutStore)

const isDark = computed(() => layout.value.theme === 'dark')

function toggle() {
  layoutStore.setTheme(isDark.value ? 'light' : 'dark')
}
</script>
