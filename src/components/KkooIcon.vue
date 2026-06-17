<template>
  <Icon :icon="resolvedIcon" :class="iconClass" :aria-hidden="ariaHidden" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { kkooIcon, kkooIconFromLegacy } from '@/utils/kkooIcons'

const props = withDefaults(
  defineProps<{
    /** Solar id, bootstrap slug, or legacy `bi bi-*` class string */
    icon: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    tone?: 'default' | 'primary' | 'muted' | 'accent' | 'inverse'
    legacy?: boolean
    ariaHidden?: boolean
  }>(),
  {
    size: 'md',
    tone: 'default',
    legacy: false,
    ariaHidden: true,
  },
)

const resolvedIcon = computed(() =>
  props.legacy ? kkooIconFromLegacy(props.icon) : kkooIcon(props.icon),
)

const iconClass = computed(() => [
  'kkoo-icon',
  `kkoo-icon--${props.size}`,
  props.tone !== 'default' ? `kkoo-icon--${props.tone}` : '',
])
</script>
