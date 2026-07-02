<template>
  <div class="booking-rooms-panel">
    <header v-if="showHeader" class="booking-rooms-panel__head">
      <p class="booking-rooms-panel__kicker">{{ t('buyerXp.booking.roomsServices') }}</p>
      <h2 class="booking-rooms-panel__title">{{ title }}</h2>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.booking.loadingRooms') }}</p>
    <p v-if="menuError" class="buyer-xp-toast buyer-xp-toast--warn">{{ menuError }}</p>
    <p v-if="!loading && !menuItems.length" class="booking-rooms-panel__empty">{{ t('buyerXp.booking.selectHotelPrompt') }}</p>

    <ul v-if="menuItems.length" class="booking-rooms-list">
      <li v-for="item in menuItems" :key="item.id" class="booking-room-row">
        <div class="booking-room-row__copy">
          <h3 class="booking-room-row__title">{{ item.title || 'Room' }}</h3>
          <p class="booking-room-row__desc">{{ item.description || t('buyerXp.booking.hospitality') }}</p>
        </div>
        <div class="booking-room-row__side">
          <strong class="booking-room-row__price">{{ formatPrice(item.price ?? item.base_price) }}</strong>
          <button
            type="button"
            class="booking-room-row__book"
            :disabled="!item.skus?.length || adding"
            @click="$emit('add-to-cart', item)"
          >
            {{ t('buyerXp.booking.bookRoom') }}
          </button>
        </div>
      </li>
    </ul>

    <p v-if="addMessage" class="buyer-xp-toast buyer-xp-toast--ok">{{ addMessage }}</p>
    <p v-if="addError" class="buyer-xp-toast buyer-xp-toast--err">{{ addError }}</p>
    <div v-if="hotelSlug" class="booking-rooms-panel__footer">
      <RouterLink :to="{ name: 'store.microsite', params: { slugOrId: hotelSlug } }" class="booking-rooms-panel__microsite">
        {{ t('buyerXp.booking.viewMicrosite') }}
        <Icon icon="solar:arrow-right-up-linear" aria-hidden="true" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import type { RestaurantMenuItem } from '@/api/superApp'

type MenuItem = RestaurantMenuItem & { description?: string }

withDefaults(
  defineProps<{
    title: string
    loading: boolean
    menuError: string
    menuItems: MenuItem[]
    adding: boolean
    addMessage: string
    addError: string
    hotelSlug: string
    showHeader?: boolean
  }>(),
  {
    showHeader: true,
  },
)

defineEmits<{ 'add-to-cart': [item: MenuItem] }>()

const { t } = useI18n()

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}
</script>
