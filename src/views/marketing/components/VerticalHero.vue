<template>
  <section class="lh-hero lh-page lp-section vx-hero">
    <div class="lh-hero__shell">
      <div class="lh-hero__grid">
        <div class="lh-hero__copy">
          <p v-if="eyebrow" class="lh-hero__kicker">{{ eyebrow }}</p>
          <h1>
            {{ title }}
            <span v-if="titleAccent">{{ titleAccent }}</span>
          </h1>
          <p v-if="lead" class="lh-hero__lead">{{ lead }}</p>
          <div v-if="$slots.actions" class="lh-hero__cta">
            <slot name="actions" />
          </div>
          <p v-if="badgeLabel || badgeTitle" class="vx-proof">
            <span v-if="badgeLabel" class="vx-proof__label">{{ badgeLabel }}</span>
            <strong v-if="badgeTitle">{{ badgeTitle }}</strong>
          </p>
          <div v-if="chips?.length" class="vx-chips">
            <span v-for="chip in chips" :key="chip" class="vx-chip">{{ chip }}</span>
          </div>
        </div>

        <div class="lh-hero__visual">
          <img
            v-if="image"
            :src="image"
            :alt="imageAlt || ''"
            width="960"
            height="1200"
            loading="lazy"
          />
          <div v-else class="vx-media__placeholder" aria-hidden="true">
            <Icon icon="solar:gallery-bold-duotone" class="vx-media__placeholder-icon" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  eyebrow?: string
  title: string
  titleAccent?: string
  lead?: string
  image?: string
  imageAlt?: string
  badgeLabel?: string
  badgeTitle?: string
  chips?: string[]
}>()
</script>
