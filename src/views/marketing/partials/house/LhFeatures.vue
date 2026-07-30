<template>
  <section id="features" ref="rootRef" class="lh-section lh-features lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--premium">
      <p class="lh-kicker">{{ t('landingHouse.kickers.features') }}</p>
      <h2 class="lh-section__title">{{ t('landingHouse.features.title') }}</h2>
      <p class="lh-section__lead">{{ t('landingHouse.features.lead') }}</p>
    </header>

    <ul class="lh-features__rail" role="list">
      <li
        v-for="(item, index) in items"
        :key="item.key"
        :ref="(el) => bindCard(item.key, el)"
        class="lh-feature-row"
        :style="{ '--lh-feature-delay': `${index * 70}ms` }"
      >
        <span class="lh-feature-row__index" aria-hidden="true">{{ pad(index + 1) }}</span>
        <span class="lh-feature-row__icon" aria-hidden="true">
          <Icon :icon="item.icon" width="22" height="22" />
        </span>
        <div class="lh-feature-row__copy">
          <h3>{{ t(`landingHouse.features.items.${item.key}.title`) }}</h3>
          <p>{{ t(`landingHouse.features.items.${item.key}.text`) }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { houseFeatureItems as items } from '@/config/landing-house-features'
import { useHouseReveal } from '@/composables/useHouseReveal'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const cardNodes = new Map<string, HTMLElement>()
let observer: IntersectionObserver | null = null

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function bindCard(key: string, el: unknown) {
  if (!el) {
    cardNodes.delete(key)
    return
  }
  cardNodes.set(key, el as HTMLElement)
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    cardNodes.forEach((node) => node.classList.add('is-in'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer?.unobserve(entry.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  cardNodes.forEach((node) => observer?.observe(node))
})

onUnmounted(() => observer?.disconnect())
</script>
