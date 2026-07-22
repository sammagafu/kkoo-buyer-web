<template>
  <section id="features" ref="rootRef" class="lh-section lh-features lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--mega">
      <p class="lh-features__eyebrow">{{ eyebrow }}</p>
      <h2 class="lh-section__title">{{ t('landingHouse.features.title') }}</h2>
      <p class="lh-section__lead">{{ t('landingHouse.features.lead') }}</p>
    </header>

    <div class="lh-features__showcase">
      <div class="lh-features__visual" aria-hidden="true">
        <img :src="houseLogoLight" class="lh-features__visual-logo" alt="" width="192" height="192" />
      </div>

      <ul class="lh-features__stack" role="list">
        <li
          v-for="(item, index) in stackItems"
          :key="item.key"
          :ref="(el) => bindCard(item.key, el)"
          class="lh-dark-card"
          :style="{ '--lh-feature-delay': `${index * 80}ms` }"
        >
          <span class="lh-dark-card__icon">
            <Icon :icon="item.icon" width="22" height="22" />
          </span>
          <div class="lh-dark-card__body">
            <h3>{{ t(`landingHouse.features.items.${item.key}.title`) }}</h3>
            <p>{{ t(`landingHouse.features.items.${item.key}.text`) }}</p>
          </div>
        </li>
      </ul>
    </div>

    <ul class="lh-features__grid" role="list">
      <li
        v-for="(item, index) in gridItems"
        :key="item.key"
        :ref="(el) => bindCard(`grid-${item.key}`, el)"
        class="lh-pane-card"
        :class="{ 'lh-pane-card--dark': index % 2 === 1 }"
        :style="{ '--lh-feature-delay': `${(index + 3) * 70}ms` }"
      >
        <span class="lh-pane-card__icon" aria-hidden="true">
          <Icon :icon="item.icon" width="22" height="22" />
        </span>
        <h3 class="lh-pane-card__title">
          {{ t(`landingHouse.features.items.${item.key}.title`) }}
        </h3>
        <p class="lh-pane-card__text">
          {{ t(`landingHouse.features.items.${item.key}.text`) }}
        </p>
        <span class="lh-pane-card__action" aria-hidden="true">
          <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import {
  houseFeatureStack as stackItems,
  houseFeatureGrid as gridItems,
} from '@/config/landing-house-features'
import { houseLogoLight } from '@/config/landing-house'
import { useHouseReveal } from '@/composables/useHouseReveal'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const eyebrow = computed(() => t('landingHouse.kickers.features'))

const cardNodes = new Map<string, HTMLElement>()
let observer: IntersectionObserver | null = null

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
