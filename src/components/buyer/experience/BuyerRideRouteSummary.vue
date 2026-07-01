<template>
  <div
    class="buyer-ride-route-summary"
    :class="{
      'buyer-ride-route-summary--compact': compact,
      'buyer-ride-route-summary--flat': flat,
    }"
    :aria-label="ariaLabel"
  >
    <div class="buyer-ride-route-summary__row">
      <div class="buyer-ride-route-summary__track">
        <span class="buyer-ride-field__dot buyer-ride-field__dot--pickup" aria-hidden="true" />
        <span class="buyer-ride-route-summary__stem" aria-hidden="true" />
      </div>
      <div class="buyer-ride-route-summary__copy">
        <p class="buyer-ride-route-summary__label">{{ pickupTitle }}</p>
        <p class="buyer-ride-route-summary__value">{{ pickupAddress || '—' }}</p>
      </div>
    </div>
    <div class="buyer-ride-route-summary__row">
      <div class="buyer-ride-route-summary__track">
        <span class="buyer-ride-field__dot buyer-ride-field__dot--dropoff" aria-hidden="true" />
      </div>
      <div class="buyer-ride-route-summary__copy">
        <p class="buyer-ride-route-summary__label">{{ dropoffTitle }}</p>
        <p class="buyer-ride-route-summary__value">{{ dropoffAddress || '—' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    pickupTitle: string
    dropoffTitle: string
    pickupAddress?: string
    dropoffAddress?: string
    compact?: boolean
    flat?: boolean
    ariaLabel?: string
  }>(),
  {
    pickupAddress: '',
    dropoffAddress: '',
    compact: false,
    flat: false,
    ariaLabel: undefined,
  },
)
</script>
