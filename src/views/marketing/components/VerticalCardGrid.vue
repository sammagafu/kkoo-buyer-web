<template>
  <section class="vx-section lp-section" :class="surfaceClass">
    <b-container class="px-3 px-sm-4 px-lg-4">
      <header v-if="title || kicker" class="vx-section__head">
        <p v-if="kicker" class="vx-kicker">{{ kicker }}</p>
        <h2 v-if="title" class="vx-section__title">{{ title }}</h2>
      </header>

      <div class="vx-card-grid" :class="`vx-card-grid--${columns}`">
        <article v-for="card in cards" :key="card.key" class="vx-card">
          <div class="vx-card__media">
            <img v-if="card.image" :src="card.image" :alt="card.imageAlt || card.title" loading="lazy" />
            <div v-else class="vx-card__placeholder" aria-hidden="true">
              <Icon :icon="card.icon || 'solar:gallery-bold-duotone'" />
            </div>
          </div>
          <div class="vx-card__body">
            <span v-if="card.tag" class="vx-card__tag">{{ card.tag }}</span>
            <h3 class="vx-card__title">{{ card.title }}</h3>
            <p v-if="card.copy" class="vx-card__copy">{{ card.copy }}</p>
            <component
              v-if="card.ctaTo"
              :is="card.ctaExternal ? 'a' : 'router-link'"
              :to="card.ctaExternal ? undefined : card.ctaTo"
              :href="card.ctaExternal ? String(card.ctaTo) : undefined"
              class="vx-card__cta"
            >
              {{ card.ctaLabel || 'Open' }}
            </component>
          </div>
        </article>
      </div>

      <slot />
    </b-container>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

export type VerticalCard = {
  key: string
  title: string
  copy?: string
  tag?: string
  image?: string
  imageAlt?: string
  icon?: string
  ctaTo?: string | { name: string }
  ctaLabel?: string
  ctaExternal?: boolean
}

withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    cards: VerticalCard[]
    columns?: 2 | 3 | 4
    surfaceClass?: string
  }>(),
  { columns: 3, surfaceClass: '' },
)
</script>
