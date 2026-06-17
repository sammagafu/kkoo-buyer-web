<template>
  <div class="booking-rooms-panel">
    <header class="booking-rooms-panel__head">
      <p class="booking-rooms-panel__kicker">Rooms & services</p>
      <h2 class="booking-rooms-panel__title">{{ title }}</h2>
    </header>

    <p v-if="loading" class="shop-products__status">Loading rooms…</p>
    <p v-if="menuError" class="buyer-xp-toast buyer-xp-toast--err">{{ menuError }}</p>
    <p v-if="!loading && !menuItems.length" class="shop-products__status">Select a hotel to see rooms and services.</p>

    <div v-if="menuItems.length" class="booking-rooms-grid">
      <article v-for="item in menuItems" :key="item.id" class="booking-room-card">
        <div class="booking-room-card__media" :style="{ backgroundImage: mediaGradient(item) }" />
        <h4 class="booking-room-card__title">{{ item.title || 'Room' }}</h4>
        <p class="booking-room-card__desc">{{ item.description || 'Book with KKOO' }}</p>
        <div class="booking-room-card__meta buyer-btn-row">
          <strong>{{ formatPrice(item.price ?? item.base_price) }}</strong>
          <button
            type="button"
            class="buyer-venue__chip buyer-venue__chip--primary"
            :disabled="!item.skus?.length || adding"
            @click="$emit('add-to-cart', item)"
          >
            Add to cart
          </button>
        </div>
      </article>
    </div>

    <p v-if="addMessage" class="buyer-xp-toast buyer-xp-toast--ok">{{ addMessage }}</p>
    <p v-if="addError" class="buyer-xp-toast buyer-xp-toast--err">{{ addError }}</p>
    <div v-if="hotelSlug" class="buyer-btn-row">
      <RouterLink
        :to="{ name: 'store.microsite', params: { slugOrId: hotelSlug } }"
        class="buyer-venue__chip"
      >
        View microsite
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RestaurantMenuItem } from '@/api/superApp'

type MenuItem = RestaurantMenuItem & { description?: string }

defineProps<{
  title: string
  loading: boolean
  menuError: string
  menuItems: MenuItem[]
  adding: boolean
  addMessage: string
  addError: string
  hotelSlug: string
}>()

defineEmits<{ 'add-to-cart': [item: MenuItem] }>()

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function mediaGradient(item: MenuItem) {
  const seed = (item.title || 'item').length
  const colors = [
    ['#fef6e4', '#f3d9fa'],
    ['#e7f5ff', '#d0ebff'],
    ['#e6fcf5', '#d3f9d8'],
    ['#fff5f5', '#ffe8cc'],
  ]
  const pair = colors[seed % colors.length]
  return `radial-gradient(circle at 30% 30%, ${pair[0]}, ${pair[1]})`
}
</script>

<style scoped>
.booking-rooms-panel__head {
  margin-bottom: 0.85rem;
}

.booking-rooms-panel__kicker {
  margin: 0 0 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--kkoo-primary);
}

.booking-rooms-panel__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--buyer-ink);
}

.booking-rooms-grid {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .booking-rooms-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.booking-room-card {
  border: 1px solid var(--buyer-border);
  border-radius: 1rem;
  padding: 0.75rem;
  background: var(--buyer-surface);
}

.booking-room-card__media {
  height: 120px;
  border-radius: 0.85rem;
  margin-bottom: 0.55rem;
}

.booking-room-card__title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 800;
}

.booking-room-card__desc {
  margin: 0 0 0.55rem;
  font-size: 0.8rem;
  color: var(--buyer-muted);
}

.booking-room-card__meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
</style>
