<template>
  <article class="buyer-venue">
    <component
      :is="detailTo ? RouterLink : 'button'"
      v-bind="detailTo ? { to: detailTo } : { type: 'button' }"
      class="buyer-venue__main"
      @click="onMainClick"
    >
      <span class="buyer-venue__avatar" :class="`buyer-venue__avatar--${kind}`" aria-hidden="true">
        <Icon :icon="icon" />
      </span>
      <span class="buyer-venue__copy">
        <strong class="buyer-venue__name">{{ name }}</strong>
        <span v-if="address" class="buyer-venue__addr">{{ address }}</span>
        <span v-if="meta" class="buyer-venue__meta">{{ meta }}</span>
      </span>
      <Icon icon="solar:alt-arrow-right-linear" class="buyer-venue__chev" aria-hidden="true" />
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
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    name: string
    address?: string
    meta?: string
    icon?: string
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

function onMainClick() {
  emit('view')
}

function onViewClick() {
  emit('view')
}
</script>
