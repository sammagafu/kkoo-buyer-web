<template>
  <article class="send-item-editor">
    <header class="send-item-editor__head">
      <span class="send-item-editor__index">{{ index + 1 }}</span>
      <h3 class="send-item-editor__title">Item</h3>
      <button
        v-if="canRemove"
        type="button"
        class="send-item-editor__remove"
        aria-label="Remove item"
        @click="$emit('remove')"
      >
        <Icon icon="solar:close-circle-bold" />
      </button>
    </header>

    <button
      type="button"
      class="send-item-editor__pick"
      :class="{ 'send-item-editor__pick--emphasize': emphasizePick }"
      @click="$emit('pick')"
    >
      <Icon icon="solar:shop-bold" aria-hidden="true" />
      {{ item.selection ? 'Change product' : 'Pick product from stores' }}
    </button>

    <div v-if="item.selection" class="send-item-editor__selection">
      <p class="send-item-editor__selection-title">{{ item.selection.productTitle }}</p>
      <p class="send-item-editor__selection-meta">
        {{ item.selection.storeName }} · {{ item.selection.distanceLabel }}
      </p>
      <p class="send-item-editor__selection-price">
        <span>{{ formatPrice(item.selection.productPrice) }}</span>
        <span v-if="item.selection.distanceSurcharge > 0" class="send-item-editor__surcharge">
          +{{ formatPrice(item.selection.distanceSurcharge) }} distance
        </span>
        <strong>{{ formatPrice(item.selection.lineTotal) }}</strong>
      </p>
    </div>

    <template v-else>
      <label class="send-form__field send-form__field--full">
        <span>Product name (manual)</span>
        <input
          :value="item.name"
          type="text"
          placeholder="Or pick from catalog above"
          @input="onName(($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="send-form__field send-form__field--full">
        <span>Max price (TZS)</span>
        <input
          :value="item.price || ''"
          type="number"
          min="0"
          step="500"
          placeholder="15000"
          @input="onPrice(Number(($event.target as HTMLInputElement).value))"
        />
      </label>
    </template>

    <div class="send-item-editor__qty">
      <span>Qty</span>
      <div class="send-qty-stepper">
        <button type="button" :disabled="item.quantity <= 1" @click="$emit('quantity', item.quantity - 1)">−</button>
        <span>{{ item.quantity }}</span>
        <button type="button" @click="$emit('quantity', item.quantity + 1)">+</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { BuyForMeItemDraft } from '@/types/buyForMe'

defineProps<{
  index: number
  item: BuyForMeItemDraft
  canRemove: boolean
  emphasizePick?: boolean
}>()

const emit = defineEmits<{
  remove: []
  pick: []
  quantity: [value: number]
  updateName: [value: string]
  updatePrice: [value: number]
}>()

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function onName(val: string) {
  emit('updateName', val)
}

function onPrice(val: number) {
  emit('updatePrice', Number.isFinite(val) ? val : 0)
}
</script>
