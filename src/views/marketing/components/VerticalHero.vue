<template>
  <section class="vx-hero lp-section">
    <b-container class="px-3 px-sm-4 px-lg-4">
      <div class="vx-hero__grid">
        <div class="vx-hero__copy">
          <p v-if="eyebrow" class="vx-eyebrow">{{ eyebrow }}</p>
          <h1 class="vx-title">
            {{ title }}
            <span v-if="titleAccent" class="vx-title-accent">{{ titleAccent }}</span>
          </h1>
          <p v-if="lead" class="vx-lead">{{ lead }}</p>
          <div v-if="$slots.actions" class="vx-actions">
            <slot name="actions" />
          </div>
          <div v-if="chips?.length" class="vx-chips">
            <span v-for="chip in chips" :key="chip" class="vx-chip">{{ chip }}</span>
          </div>
        </div>

        <div class="vx-hero__visual">
          <div class="vx-media">
            <img v-if="image" :src="image" :alt="imageAlt || ''" class="vx-media__img" loading="lazy" />
            <div v-else class="vx-media__placeholder" aria-hidden="true">
              <Icon icon="solar:gallery-bold-duotone" class="vx-media__placeholder-icon" />
            </div>
          </div>
          <div v-if="badgeLabel || badgeTitle" class="vx-badge">
            <span v-if="badgeLabel">{{ badgeLabel }}</span>
            <strong v-if="badgeTitle">{{ badgeTitle }}</strong>
          </div>
        </div>
      </div>
    </b-container>
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
