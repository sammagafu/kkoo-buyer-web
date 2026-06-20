<template>
  <article class="buyer-venue">
    <component
      :is="detailTo ? RouterLink : 'button'"
      v-bind="detailTo ? { to: detailTo } : { type: 'button' }"
      class="buyer-venue__tap"
      @click="onMainClick"
    >
      <div class="buyer-venue__hero" :class="`buyer-venue__hero--${kind}`">
        <img
          v-if="imageUrl && !imageError"
          :src="imageUrl"
          :alt="name"
          class="buyer-venue__cover"
          loading="lazy"
          @error="imageError = true"
        />
        <div v-else class="buyer-venue__cover buyer-venue__cover--placeholder" aria-hidden="true">
          <Icon :icon="icon" class="buyer-venue__cover-icon" />
        </div>
      </div>
      <div class="buyer-venue__body">
        <strong class="buyer-venue__name">{{ name }}</strong>
        <span v-if="address" class="buyer-venue__addr">{{ address }}</span>
        <span v-if="meta" class="buyer-venue__meta">{{ meta }}</span>
      </div>
    </component>
    <div class="buyer-venue__actions">
      <component
        :is="detailTo ? RouterLink : 'button'"
        v-bind="detailTo ? { to: detailTo } : { type: 'button' }"
        class="buyer-venue__chip buyer-venue__chip--primary"
        @click="onViewClick"
      >
        View
      </component>
      <RouterLink v-if="sendTo" :to="sendTo" class="buyer-venue__chip">Send me</RouterLink>
      <RouterLink v-if="rideTo" :to="rideTo" class="buyer-venue__chip">Ride</RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    name: string
    address?: string
    meta?: string
    icon?: string
    imageUrl?: string | null
    kind?: 'restaurant' | 'grocery' | 'store'
    sendTo?: RouteLocationRaw
    rideTo?: RouteLocationRaw
    detailTo?: RouteLocationRaw
  }>(),
  {
    icon: 'solar:shop-bold',
    kind: 'store',
  },
)

const emit = defineEmits<{ view: [] }>()
const imageError = ref(false)

function onMainClick() {
  emit('view')
}

function onViewClick() {
  emit('view')
}
</script>
