<template>
  <aside class="send-total-strip" aria-label="Estimated total">
    <div class="send-total-strip__row">
      <span>Items</span>
      <span>{{ formatPrice(itemsSubtotal) }}</span>
    </div>
    <div class="send-total-strip__row">
      <span>Delivery estimate</span>
      <span>{{ formatPrice(deliveryFee) }}</span>
    </div>
    <div v-if="totalSavings > 0" class="send-total-strip__row send-total-strip__row--save">
      <span>You save</span>
      <span>{{ formatPrice(totalSavings) }}</span>
    </div>
    <div class="send-total-strip__divider" />
    <div class="send-total-strip__row send-total-strip__row--total">
      <span>Estimated total</span>
      <strong>{{ formatPrice(estimatedTotal) }}</strong>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  itemsSubtotal: number
  deliveryFee: number
  totalSavings: number
  estimatedTotal: number
}>()

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}
</script>
