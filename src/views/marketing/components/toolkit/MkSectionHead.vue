<template>
  <header v-if="kicker || title || lead" class="lh-section-head" :class="{ 'lh-section-head--center': centered, 'lh-section-head--mega': mega }">
    <p v-if="kicker" class="lh-kicker">{{ kicker }}</p>
    <h2 v-if="title" class="lh-section__title">{{ title }}</h2>
    <p v-if="lead" class="lh-section__lead">{{ lead }}</p>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    lead?: string
    centered?: boolean
    mega?: boolean
  }>(),
  { centered: false, mega: false },
)</script>
