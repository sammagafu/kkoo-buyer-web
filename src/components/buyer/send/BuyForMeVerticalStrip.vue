<template>
  <div class="send-vertical-strip" role="group" aria-label="Shopping category">
    <label
      v-for="cat in BUY_FOR_ME_CATEGORIES"
      :key="cat.id"
      class="send-vertical-strip__chip"
      :class="{ 'send-vertical-strip__chip--active': modelValue === cat.id }"
    >
      <input
        type="radio"
        name="send-category"
        class="send-vertical-strip__radio"
        :value="cat.id"
        :checked="modelValue === cat.id"
        @change="emit('update:modelValue', cat.id)"
      />
      <span class="send-vertical-strip__chip-content">
        <Icon :icon="cat.icon" aria-hidden="true" />
        <span>{{ cat.label }}</span>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { BUY_FOR_ME_CATEGORIES, type BuyForMeCategoryId } from '@/constants/buyForMeCategories'

defineProps<{
  modelValue: BuyForMeCategoryId
}>()

const emit = defineEmits<{
  'update:modelValue': [value: BuyForMeCategoryId]
}>()
</script>
