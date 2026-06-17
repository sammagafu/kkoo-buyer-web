<template>
  <div class="fulfillment-bar">
    <p class="fulfillment-bar__label">{{ label }}</p>
    <div class="fulfillment-bar__modes" role="tablist" :aria-label="label">
      <button
        v-for="mode in modes"
        :key="mode.id"
        type="button"
        class="fulfillment-bar__mode"
        :class="{ 'fulfillment-bar__mode--active': modelValue === mode.id }"
        role="tab"
        :aria-selected="modelValue === mode.id"
        @click="$emit('update:modelValue', mode.id)"
      >
        <Icon v-if="mode.icon" :icon="mode.icon" class="fulfillment-bar__icon" aria-hidden="true" />
        <span>{{ mode.label }}</span>
      </button>
    </div>
    <p v-if="hint" class="fulfillment-bar__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

export type FulfillmentModeId = 'pickup' | 'delivery' | 'dine_in'

export type FulfillmentModeOption = {
  id: FulfillmentModeId
  label: string
  icon?: string
}

defineProps<{
  modelValue: FulfillmentModeId
  modes: FulfillmentModeOption[]
  label?: string
  hint?: string
}>()

defineEmits<{
  'update:modelValue': [value: FulfillmentModeId]
}>()
</script>
