<template>
  <div class="booking-rooms-panel">
    <header v-if="showHeader" class="booking-rooms-panel__head">
      <p class="booking-rooms-panel__kicker">{{ t('buyerXp.booking.roomsServices') }}</p>
      <h2 class="booking-rooms-panel__title">{{ title }}</h2>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.booking.loadingRooms') }}</p>
    <p v-if="menuError" class="buyer-xp-toast buyer-xp-toast--warn">{{ menuError }}</p>
    <BuyerEmptyState
      v-if="!loading && !menuItems.length"
      size="compact"
      flush
      :title="t('buyerXp.booking.selectHotelPrompt')"
      :message="t('buyerXp.booking.emptyRoomsMessage')"
      icon="solar:bed-bold"
    />

    <ul v-if="menuItems.length" class="booking-rooms-list">
      <li v-for="item in menuItems" :key="`${item.id}-${item.title}`" class="booking-room-row">
        <div class="booking-room-row__copy">
          <h3 class="booking-room-row__title">{{ item.title || 'Room' }}</h3>
          <p class="booking-room-row__desc">{{ item.description || t('buyerXp.booking.hospitality') }}</p>
          <SeatCountPicker
            v-if="paxCap(item)"
            class="booking-room-row__pax"
            :model-value="paxFor(item)"
            :max-seats="paxCap(item) || 1"
            :label="t('buyerXp.booking.pax')"
            @update:model-value="setPax(item, $event)"
          />
          <p v-if="paxCap(item)" class="booking-room-row__pax-note">
            {{ t('buyerXp.booking.paxMax', { n: paxCap(item) }) }}
          </p>
        </div>
        <div class="booking-room-row__side">
          <div class="booking-room-row__prices">
            <strong class="booking-room-row__price">{{ formatPrice(displayPrice(item)) }}</strong>
            <span v-if="compareAt(item)" class="booking-room-row__was">{{ formatPrice(compareAt(item)) }}</span>
          </div>
          <button
            v-if="item.skus?.length"
            type="button"
            class="booking-room-row__book"
            :disabled="adding"
            @click="$emit('add-to-cart', { item, pax: paxCap(item) ? paxFor(item) : undefined })"
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
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import type { RestaurantMenuItem } from '@/api/superApp'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import SeatCountPicker from '@/components/buyer/SeatCountPicker.vue'

type MenuItem = RestaurantMenuItem & { description?: string; max_guests?: number }

const paxByItem = reactive<Record<string, number>>({})

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

defineEmits<{ 'add-to-cart': [payload: { item: MenuItem; pax?: number }] }>()

function itemKey(item: MenuItem) {
  return String(item.id ?? item.title ?? '')
}

function paxCap(item: MenuItem): number | null {
  if (typeof item.max_guests === 'number' && item.max_guests >= 1) return item.max_guests
  const match = String(item.description || '').match(/(?:sleeps|pax|guests)\s*(\d+)/i)
  if (match) return Math.max(1, Number(match[1]))
  return null
}

function paxFor(item: MenuItem) {
  const cap = paxCap(item) || 1
  const saved = paxByItem[itemKey(item)]
  if (!saved) return Math.min(2, cap)
  return Math.min(cap, Math.max(1, saved))
}

function setPax(item: MenuItem, n: number) {
  const cap = paxCap(item) || 1
  paxByItem[itemKey(item)] = Math.min(cap, Math.max(1, n))
}

const { t } = useI18n()

function displayPrice(item: MenuItem) {
  const row = item as MenuItem & { discount_price?: number }
  return row.discount_price ?? item.price ?? item.base_price
}

function compareAt(item: MenuItem) {
  const row = item as MenuItem & { discount_price?: number }
  if (row.discount_price == null) return null
  const anchor = item.base_price ?? item.price
  if (anchor == null || Number(anchor) <= Number(row.discount_price)) return null
  return Number(anchor)
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}
</script>
