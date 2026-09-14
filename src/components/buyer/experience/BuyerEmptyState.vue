<template>
  <div
    class="buyer-empty"
    :class="[
      `buyer-empty--${size}`,
      `buyer-empty--tone-${tone}`,
      { 'buyer-empty--flush': flush },
    ]"
    role="status"
  >
    <p v-if="eyebrow" class="buyer-empty__eyebrow">{{ eyebrow }}</p>

    <div class="buyer-empty__visual" aria-hidden="true">
      <span class="buyer-empty__ring buyer-empty__ring--outer" />
      <span class="buyer-empty__ring buyer-empty__ring--inner" />
      <span class="buyer-empty__icon">
        <Icon :icon="icon" :width="iconSize" :height="iconSize" />
      </span>
    </div>

    <div class="buyer-empty__copy">
      <h2 class="buyer-empty__title">{{ title }}</h2>
      <p v-if="message" class="buyer-empty__message">{{ message }}</p>
    </div>

    <div v-if="$slots.action" class="buyer-btn-row buyer-empty__action">
      <slot name="action" />
    </div>

    <ul v-if="hints?.length" class="buyer-empty__hints" aria-label="Suggestions">
      <li v-for="hint in hints" :key="hint">{{ hint }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = withDefaults(
  defineProps<{
    title: string
    message?: string
    icon?: string
    /** Small label above the icon, e.g. “Not available yet” */
    eyebrow?: string
    /** Short tip bullets under the CTAs */
    hints?: string[]
    /** compact = home sections; page = full vertical directory; default = mid */
    size?: 'default' | 'compact' | 'page'
    /** Color accent by vertical */
    tone?: 'default' | 'grocery' | 'eats' | 'pharmacy' | 'search' | 'cart'
    flush?: boolean
  }>(),
  {
    icon: 'solar:box-minimalistic-bold',
    size: 'default',
    tone: 'default',
    flush: false,
  },
)

const iconSize = computed(() => {
  if (props.size === 'page') return 34
  if (props.size === 'compact') return 24
  return 28
})
</script>
