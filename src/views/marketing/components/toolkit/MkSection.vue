<template>
  <section
    :id="id"
    ref="rootRef"
    class="lh-section lh-page lp-section lh-reveal"
    :class="sectionClass"
  >
    <MkSectionHead
      v-if="kicker || title || lead"
      :kicker="kicker"
      :title="title"
      :lead="lead"
      :centered="headCentered"
      :mega="headMega"
    />
    <slot />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHouseReveal } from '@/composables/useHouseReveal'
import MkSectionHead from './MkSectionHead.vue'

withDefaults(
  defineProps<{
    id?: string
    kicker?: string
    title?: string
    lead?: string
    sectionClass?: string
    headCentered?: boolean
    headMega?: boolean
  }>(),
  { sectionClass: '', headCentered: false, headMega: false },
)

const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)
</script>
