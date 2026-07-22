<template>
  <section id="top" ref="rootRef" class="lh-hero lh-page lh-reveal is-visible">
    <div class="lh-hero__shell">
      <div class="lh-hero__grid">
        <div class="lh-hero__copy">
          <p class="lh-hero__kicker">{{ t('landingHouse.hero.brand') }}</p>
          <h1>{{ t('landingHouse.hero.title') }}</h1>
          <p class="lh-hero__lead">{{ t('landingHouse.hero.lead') }}</p>

          <div class="lh-hero__cta">
            <LhButton
              as="router-link"
              :to="buyerRoutes.marketplace"
              variant="primary"
              size="lg"
              with-well
            >
              {{ t('landingHouse.ctaPrimary') }}
            </LhButton>
            <LhButton
              as="router-link"
              :to="buyerRoutes.signUp"
              variant="ghost"
              size="lg"
            >
              {{ t('landingHouse.ctaSecondary') }}
            </LhButton>
          </div>

          <ul class="lh-hero__stats" role="list">
            <li v-for="(stat, index) in stats" :key="index" class="lh-stat-chip">
              <span class="lh-stat-chip__icon" aria-hidden="true">
                <Icon :icon="statIcons[index]" width="18" height="18" />
              </span>
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </li>
          </ul>
        </div>

        <div class="lh-hero__visual">
          <img
            :src="heroImage"
            :alt="t('landingHouse.hero.imageAlt')"
            width="960"
            height="1200"
            fetchpriority="high"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { houseHeroImage as heroImage } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'
import LhButton from './LhButton.vue'

const { t, tm } = useI18n()
const stats = computed(
  () => tm('landingHouse.heroStats') as Array<{ value: string; label: string }>,
)

const statIcons = ['solar:shield-check-bold', 'solar:map-point-wave-bold', 'solar:smartphone-bold']

const rootRef = ref<HTMLElement | null>(null)
</script>
