<template>
  <button
    type="button"
    class="text-decoration-none d-inline-flex align-items-center border-0 bg-transparent p-0"
    :class="buttonClass"
    @click="onClick"
  >
    <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
      <Icon :icon="iconName" class="kkoo-account-btn__lead-icon" aria-hidden="true" />
      <span>{{ label }}</span>
    </span>
    <span class="lp-btn-pill__well" aria-hidden="true">
      <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useKkooAccountAuth } from '@/composables/useKkooAccountAuth'

const props = withDefaults(
  defineProps<{
    /** primary | surface | accent */
    variant?: 'primary' | 'surface' | 'accent'
    size?: 'sm' | 'lg'
    /** Override redirect after sign-in */
    redirectFrom?: string
    /** Force sign-in label even when session exists */
    forceSignIn?: boolean
    block?: boolean
  }>(),
  {
    variant: 'accent',
    size: 'lg',
    forceSignIn: false,
    block: false,
  },
)

const { t } = useI18n()
const router = useRouter()
const { isAuthenticated, signInWithKkooAccount, dashboardRoute } = useKkooAccountAuth()

function onClick() {
  if (isAuthenticated.value && !props.forceSignIn) {
    void router.push(dashboardRoute.value)
    return
  }
  signInWithKkooAccount(props.redirectFrom)
}

const label = computed(() => {
  if (isAuthenticated.value && !props.forceSignIn) {
    return t('auth.continueWithKkooAccount')
  }
  return t('auth.signInWithKkooAccount')
})

const iconName = computed(() =>
  isAuthenticated.value && !props.forceSignIn
    ? 'solar:user-check-rounded-bold'
    : 'solar:user-circle-bold',
)

const buttonClass = computed(() => [
  'lp-btn-pill',
  'kkoo-account-btn',
  `lp-btn-pill--${props.variant}`,
  props.size === 'lg' ? 'lp-btn-pill--lg' : 'lp-btn-pill--sm',
  props.block ? 'w-100' : '',
])
</script>

<style scoped>
.kkoo-account-btn__lead-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}
</style>
