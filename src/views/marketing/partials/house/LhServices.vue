<template>
  <section id="buy" ref="rootRef" class="lh-section lh-services lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--mega">
      <p class="lh-kicker">{{ t('landingHouse.kickers.buy') }}</p>
      <h2 class="lh-section__title">{{ t('landingHouse.buy.title') }}</h2>
      <p class="lh-section__lead">{{ t('landingHouse.buy.lead') }}</p>
    </header>

    <div class="lh-catalog">
      <ul class="lh-catalog__grid" role="list">
        <li v-for="item in services" :key="item.key">
          <router-link :to="item.to" class="lh-catalog__card">
            <img
              :src="item.src"
              :alt="t(`landingHouse.services.${item.key}.title`)"
              width="640"
              height="480"
              loading="lazy"
            />
            <div class="lh-catalog__overlay">
              <h3>{{ t(`landingHouse.services.${item.key}.title`) }}</h3>
              <p>{{ t(`landingHouse.services.${item.key}.action`) }}</p>
            </div>
            <span class="lh-pane-card__action" aria-hidden="true">
              <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="lh-catalog__footer">
      <LhButton
        as="router-link"
        :to="buyerRoutes.marketplace"
        variant="primary"
        with-well
      >
        {{ t('landingHouse.ctaCatalog') }}
      </LhButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { houseServices as services } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'
import { useHouseReveal } from '@/composables/useHouseReveal'
import LhButton from './LhButton.vue'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)
</script>
