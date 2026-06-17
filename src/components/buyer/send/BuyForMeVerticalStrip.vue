<template>
  <div class="send-vertical-strip" role="tablist" aria-label="Shopping category">
    <button
      v-for="cat in BUY_FOR_ME_CATEGORIES"
      :key="cat.id"
      type="button"
      class="send-vertical-strip__chip"
      :class="{ 'send-vertical-strip__chip--active': modelValue === cat.id }"
      role="tab"
      :aria-selected="modelValue === cat.id"
      @click="$emit('update:modelValue', cat.id)"
    >
      <Icon :icon="cat.icon" aria-hidden="true" />
      <span>{{ cat.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { BUY_FOR_ME_CATEGORIES, type BuyForMeCategoryId } from '@/constants/buyForMeCategories'

defineProps<{ modelValue: BuyForMeCategoryId }>()
defineEmits<{ 'update:modelValue': [value: BuyForMeCategoryId] }>()
</script>
