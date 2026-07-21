<template>
  <section class="lh-section lh-page lp-section vx-section" :class="surfaceClass">
    <header v-if="title || kicker" class="lh-section-head vx-section__head">
      <p v-if="kicker" class="lh-kicker vx-kicker">{{ kicker }}</p>
      <h2 v-if="title" class="lh-section__title vx-section__title">{{ title }}</h2>
    </header>

    <div class="vx-card-grid" :class="`vx-card-grid--${columns}`">
      <article v-for="card in cards" :key="card.key" class="lh-pane-card vx-card">
        <div class="vx-card__media">
          <img v-if="card.image" :src="card.image" :alt="card.imageAlt || card.title" loading="lazy" />
          <div v-else class="vx-card__placeholder" aria-hidden="true">
            <Icon :icon="card.icon || 'solar:gallery-bold-duotone'" />
          </div>
        </div>
        <div class="vx-card__body">
          <span v-if="card.tag" class="vx-card__tag">{{ card.tag }}</span>
          <h3 class="lh-pane-card__title vx-card__title">{{ card.title }}</h3>
          <p v-if="card.copy" class="lh-pane-card__text vx-card__copy">{{ card.copy }}</p>
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

<style scoped>
.vx-card-grid {
  display: grid;
  gap: var(--lh-space-4, 1rem);
}

.vx-card-grid--2 {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.vx-card-grid--3 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.vx-card-grid--4 {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.vx-card {
  min-height: auto;
  padding: 0;
}

.vx-card__media {
  aspect-ratio: 16 / 10;
  background: var(--lh-media-fallback, #e8e8e8);
}

.vx-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.vx-card__placeholder {
  width: 100%;
  height: 100%;
  min-height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--lh-text-muted);
  font-size: 1.75rem;
}

.vx-card__body {
  padding: var(--lh-space-5, 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.vx-card__tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--lh-accent-dark, #e8940f);
}

.vx-card__cta {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--lh-primary, #5c308f);
}
</style>
