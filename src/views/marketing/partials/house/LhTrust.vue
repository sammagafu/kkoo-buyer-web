<template>
  <section id="trust" ref="rootRef" class="lh-section lh-trust lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--mega">
      <p class="lh-kicker">{{ kicker }}</p>
      <h2 class="lh-section__title">{{ copy.trust.title }}</h2>
      <p class="lh-section__lead">{{ copy.trust.lead }}</p>
    </header>

    <ul class="lh-trust__list" role="list">
      <li
        v-for="(item, index) in trust"
        :key="item.title"
        class="lh-process-card"
        :style="{ '--lh-trust-delay': `${index * 90}ms` }"
      >
        <span class="lh-process-card__num" aria-hidden="true">{{ pad(index + 1) }}</span>
        <span class="lh-process-card__icon" aria-hidden="true">
          <Icon :icon="item.icon" width="22" height="22" />
        </span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { houseCopy as copy, houseTrust as trust } from '@/config/landing-house'
import { useHouseReveal } from '@/composables/useHouseReveal'

const { locale } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const kicker = computed(() => (locale.value === 'sw' ? 'Uaminifu' : 'Trust'))

function pad(n: number) {
  return String(n).padStart(2, '0')
}
</script>
