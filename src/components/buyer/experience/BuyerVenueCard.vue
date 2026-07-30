<template>
  <article class="buyer-venue" :class="layout === 'grid' ? 'buyer-venue--grid' : 'buyer-venue--row'">
    <component
      :is="detailTo ? RouterLink : 'button'"
      v-bind="detailTo ? { to: detailTo } : { type: 'button' }"
      class="buyer-venue__tap"
      :class="layout === 'grid' ? 'buyer-venue__tap--grid' : 'buyer-venue__tap--row'"
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
        <div class="buyer-venue__copy">
          <strong class="buyer-venue__name">{{ name }}</strong>
          <span v-if="address" class="buyer-venue__addr">{{ address }}</span>
          <span v-if="meta" class="buyer-venue__meta">{{ meta }}</span>
        </div>
      </div>
    </component>
    <div class="buyer-venue__actions" :class="layout === 'grid' ? 'buyer-venue__actions--grid' : 'buyer-venue__actions--row'">
      <component
        :is="detailTo ? RouterLink : 'button'"
        v-bind="detailTo ? { to: detailTo } : { type: 'button' }"
        class="buyer-venue__chip buyer-venue__chip--primary"
        @click="onViewClick"
      >
        {{ t('buyerXp.common.viewStore') }}
      </component>
      <RouterLink v-if="sendTo" :to="sendTo" class="buyer-venue__chip">{{ t('buyerXp.common.sendMe') }}</RouterLink>
      <RouterLink v-if="rideTo" :to="rideTo" class="buyer-venue__chip">{{ t('buyerXp.common.ride') }}</RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

withDefaults(
  defineProps<{
    name: string
    address?: string
    meta?: string
    icon?: string
    imageUrl?: string | null
    kind?: 'restaurant' | 'grocery' | 'store' | 'hotel'
    sendTo?: RouteLocationRaw
    rideTo?: RouteLocationRaw
    detailTo?: RouteLocationRaw
    layout?: 'grid' | 'list'
  }>(),
  {
    icon: 'solar:shop-bold',
    kind: 'store',
    layout: 'grid',
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
