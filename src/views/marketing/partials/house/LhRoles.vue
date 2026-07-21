<template>
  <section id="solutions" ref="rootRef" class="lh-section lh-solutions lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--mega lh-section-head--center">
      <p class="lh-kicker">{{ kicker }}</p>
      <h2 class="lh-section__title">{{ copy.rolesIntro.title }}</h2>
      <p class="lh-section__lead">{{ copy.rolesIntro.lead }}</p>
    </header>

    <div class="lh-catalog lh-catalog--solutions">
      <ul class="lh-solutions__list" role="list">
      <li
        v-for="(role, index) in roles"
        :id="role.id"
        :key="role.key"
        :ref="(el) => bindRow(role.key, el)"
        class="lh-solutions__row lh-pane-card lh-pane-card--rail"
        :class="{
          'lh-pane-card--dark': index % 2 === 1,
          'lh-solutions__row--flip': index % 2 === 1,
        }"
        :style="{ '--lh-row-delay': `${index * 90}ms` }"
      >
        <div class="lh-solutions__media">
          <img :src="role.image" :alt="role.imageAlt" width="960" height="720" loading="lazy" />
        </div>
        <div class="lh-solutions__copy">
          <p class="lh-solutions__name">{{ role.name }}</p>
          <h3>{{ role.title }}</h3>
          <p class="lh-solutions__lead">{{ role.lead }}</p>
          <div class="lh-solutions__cta">
            <LhButton
              v-if="role.link.kind === 'route'"
              as="router-link"
              :to="role.link.to"
              :variant="index % 2 === 0 ? 'primary' : 'secondary'"
              with-well
            >
              {{ role.cta }}
            </LhButton>
            <LhButton
              v-else
              as="a"
              :href="role.link.href"
              :variant="index % 2 === 0 ? 'primary' : 'secondary'"
              with-well
            >
              {{ role.cta }}
            </LhButton>
          </div>
        </div>
        <span class="lh-pane-card__action" aria-hidden="true">
          <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
        </span>
      </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { houseCopy as copy, houseRoles as roles } from '@/config/landing-house'
import { useHouseReveal } from '@/composables/useHouseReveal'
import LhButton from './LhButton.vue'

const { locale } = useI18n()
const kicker = computed(() => (locale.value === 'sw' ? 'Suluhisho' : 'Solutions'))

const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const rowNodes = new Map<string, HTMLElement>()
let observer: IntersectionObserver | null = null

function bindRow(key: string, el: unknown) {
  if (!el) {
    rowNodes.delete(key)
    return
  }
  rowNodes.set(key, el as HTMLElement)
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    rowNodes.forEach((node) => node.classList.add('is-in'))
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
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  )

  rowNodes.forEach((node) => observer?.observe(node))
})

onUnmounted(() => observer?.disconnect())
</script>
