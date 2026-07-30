<template>
  <section id="solutions" ref="rootRef" class="lh-section lh-solutions lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--premium">
      <p class="lh-kicker">{{ t('landingHouse.kickers.solutions') }}</p>
      <h2 class="lh-section__title">{{ t('landingHouse.rolesIntro.title') }}</h2>
      <p class="lh-section__lead">{{ t('landingHouse.rolesIntro.lead') }}</p>
    </header>

    <ul class="lh-solutions__list" role="list">
      <li
        v-for="(role, index) in roles"
        :id="role.id"
        :key="role.key"
        :ref="(el) => bindRow(role.key, el)"
        class="lh-solutions__row"
        :style="{ '--lh-row-delay': `${index * 70}ms` }"
      >
        <span class="lh-solutions__index" aria-hidden="true">{{ pad(index + 1) }}</span>

        <div class="lh-solutions__copy">
          <p class="lh-solutions__name">{{ t(`landingHouse.roles.${role.key}.name`) }}</p>
          <h3>{{ t(`landingHouse.roles.${role.key}.title`) }}</h3>
          <p class="lh-solutions__lead">{{ t(`landingHouse.roles.${role.key}.lead`) }}</p>

          <RouterLink
            v-if="role.link.kind === 'route'"
            :to="role.link.to"
            class="lh-solutions__action"
          >
            {{ t(`landingHouse.roles.${role.key}.cta`) }}
            <Icon icon="solar:arrow-right-linear" width="16" height="16" aria-hidden="true" />
          </RouterLink>
          <a
            v-else
            :href="role.link.href"
            class="lh-solutions__action"
            rel="noopener"
          >
            {{ t(`landingHouse.roles.${role.key}.cta`) }}
            <Icon icon="solar:arrow-right-linear" width="16" height="16" aria-hidden="true" />
          </a>
        </div>

        <div class="lh-solutions__media" aria-hidden="true">
          <img
            :src="role.image"
            :alt="t(`landingHouse.roles.${role.key}.imageAlt`)"
            width="480"
            height="480"
            loading="lazy"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { houseRoles as roles } from '@/config/landing-house'
import { useHouseReveal } from '@/composables/useHouseReveal'

const { t } = useI18n()

const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const rowNodes = new Map<string, HTMLElement>()
let observer: IntersectionObserver | null = null

function pad(n: number) {
  return String(n).padStart(2, '0')
}

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
    { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
  )

  rowNodes.forEach((node) => observer?.observe(node))
})

onUnmounted(() => observer?.disconnect())
</script>
