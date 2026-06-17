<template>
  <component
    :is="readonly ? 'button' : 'label'"
    class="buyer-search-bar"
    :type="readonly ? 'button' : undefined"
    @click="readonly ? $emit('tap') : undefined"
  >
    <KkooIcon icon="magnifer" size="md" tone="muted" class="buyer-search-bar__icon" />
    <input
      v-if="!readonly"
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
      @input="onInput"
      @keydown.enter="$emit('submit')"
    />
    <span v-else class="buyer-search-bar__placeholder">{{ placeholder }}</span>
  </component>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    readonly?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: 'Search products, stores, restaurants…',
    readonly: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
  tap: []
}>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>
