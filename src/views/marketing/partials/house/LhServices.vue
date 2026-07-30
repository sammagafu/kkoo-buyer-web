<template>
  <section id="buy" ref="rootRef" class="lh-section lh-services lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--premium">
      <p class="lh-kicker">{{ t('landingHouse.kickers.buy') }}</p>
      <h2 class="lh-section__title">{{ t('landingHouse.buy.title') }}</h2>
      <p class="lh-section__lead">{{ t('landingHouse.buy.lead') }}</p>
    </header>

    <ul class="lh-services__grid" role="list">
      <li v-for="item in services" :key="item.key">
        <router-link :to="item.to" class="lh-service-tile">
          <div class="lh-service-tile__media">
            <img
              :src="item.src"
              :alt="t(`landingHouse.services.${item.key}.title`)"
              width="640"
              height="420"
              loading="lazy"
            />
          </div>
          <div class="lh-service-tile__body">
            <h3 class="lh-service-tile__title">
              {{ t(`landingHouse.services.${item.key}.title`) }}
            </h3>
            <p class="lh-service-tile__detail">
              {{ t(`landingHouse.services.${item.key}.detail`) }}
            </p>
            <span class="lh-service-tile__cta">
              {{ t(`landingHouse.services.${item.key}.cta`) }}
              <Icon icon="solar:arrow-right-linear" width="15" height="15" aria-hidden="true" />
            </span>
          </div>
        </router-link>
      </li>
    </ul>

    <div class="lh-services__footer">
      <LhButton
        as="router-link"
        :to="buyerRoutes.marketplace"
        variant="primary"
        with-arrow
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
