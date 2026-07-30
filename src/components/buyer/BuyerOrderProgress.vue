<template>
  <ol class="buyer-order-progress" :aria-label="ariaLabel">
    <li
      v-for="step in steps"
      :key="step.key"
      class="buyer-order-progress__step"
      :class="{
        'buyer-order-progress__step--done': step.state === 'done',
        'buyer-order-progress__step--active': step.state === 'active',
      }"
    >
      <span class="buyer-order-progress__dot" aria-hidden="true" />
      <span class="buyer-order-progress__label">{{ step.label }}</span>
    </li>
  </ol>
</template>

<script setup lang="ts">
export type ProgressStepState = 'todo' | 'active' | 'done'

export type ProgressStep = {
  key: string
  label: string
  state: ProgressStepState
}

defineProps<{
  steps: ProgressStep[]
  ariaLabel?: string
}>()
</script>
