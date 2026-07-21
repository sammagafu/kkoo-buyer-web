<template>
  <aside v-if="visible" class="buyer-onboard-tip buyer-reveal" :class="{ 'is-visible': shown }">
    <span class="buyer-onboard-tip__icon" aria-hidden="true">
      <Icon icon="solar:widget-5-bold" width="20" height="20" />
    </span>
    <div class="buyer-onboard-tip__copy">
      <p class="buyer-onboard-tip__title">{{ t('buyerXp.home.onboardTitle') }}</p>
      <p class="buyer-onboard-tip__text">{{ t('buyerXp.home.onboardText') }}</p>
    </div>
    <button
      type="button"
      class="buyer-onboard-tip__dismiss"
      :aria-label="t('common.close')"
      @click="dismiss"
    >
      <Icon icon="solar:close-circle-linear" width="20" height="20" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'kkoo-buyer-home-onboard-v1'

const { t } = useI18n()
const visible = ref(false)
const shown = ref(false)

onMounted(() => {
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return
  } catch {
    /* ignore */
  }
  visible.value = true
  requestAnimationFrame(() => {
    shown.value = true
  })
})

function dismiss() {
  visible.value = false
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}
</script>
