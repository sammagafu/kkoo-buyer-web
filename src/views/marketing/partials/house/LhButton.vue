<template>
  <component
    :is="tag"
    v-bind="bindProps"
    class="lh-btn"
    :class="[
      `lh-btn--${variant}`,
      { 'lh-btn--well': withWell, 'lh-btn--lg': size === 'lg' },
    ]"
    :disabled="as === 'button' ? disabled : undefined"
  >
    <span class="lh-btn__label"><slot /></span>
    <span v-if="withWell" class="lh-btn__well" aria-hidden="true">
      <Icon icon="solar:arrow-right-linear" width="16" height="16" />
    </span>
    <Icon
      v-else-if="withArrow"
      icon="solar:arrow-right-up-linear"
      width="18"
      height="18"
      aria-hidden="true"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    as?: 'button' | 'a' | 'router-link'
    to?: RouteLocationRaw
    href?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost' | 'on-dark'
    withWell?: boolean
    withArrow?: boolean
    size?: 'md' | 'lg'
    disabled?: boolean
  }>(),
  {
    as: 'button',
    type: 'button',
    variant: 'primary',
    withWell: false,
    withArrow: false,
    size: 'md',
    disabled: false,
  },
)

const tag = computed(() => {
  if (props.as === 'router-link') return RouterLink
  if (props.as === 'a') return 'a'
  return 'button'
})

const bindProps = computed(() => {
  if (props.as === 'router-link') return { to: props.to }
  if (props.as === 'a') return { href: props.href }
  return { type: props.type }
})
</script>
